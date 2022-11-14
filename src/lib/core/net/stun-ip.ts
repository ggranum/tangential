import {ObjMap} from '../lang/obj-map'
/**
 * Modified version of https://github.com/diafygi/webrtc-ips
 * Copyright (c) 2015 Daniel Roesler
 * Released under standard MIT license: https://github.com/diafygi/webrtc-ips/blob/master/LICENSE
 */
export class StunIpLookup {

  static stunServers() {
    return [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
      'stun:stun.services.mozilla.com',
    ]
  }

// get the IP addresses associated with an account
  static getIPs(maxWaitTime: number = 10000, useIFrameHack: boolean = false): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const ipAddressRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
      const ipAddresses: ObjMap<string> = {};

      // compatibility for firefox and chrome
      let RTCPeerConnection = window['RTCPeerConnection' as keyof Window]
        || window['mozRTCPeerConnection' as keyof Window]
        || window['webkitRTCPeerConnection' as keyof Window];
      let useWebKit = !!window['webkitRTCPeerConnection' as keyof Window];

      // bypass naive webrtc blocking using an iframe
      if (!RTCPeerConnection && useIFrameHack) {
        // NOTE: you need to have an iframe in the page right above the script tag
        //
        // <iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
        // <script>...getIPs called in here...
        //
        const win = window['iframe' as keyof Window].contentWindow;
        RTCPeerConnection = win.RTCPeerConnection
          || win.mozRTCPeerConnection
          || win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
      }

      // minimal requirements for data connection
      const mediaConstraints = {
        optional: [{RtpDataChannels: true}]
      };

      const servers = {iceServers: [{urls: StunIpLookup.stunServers()[0]}]};

      // construct a new RTCPeerConnection
      const typescriptExpectsOneArgument = RTCPeerConnection as any
      const pc:RTCPeerConnection = (new typescriptExpectsOneArgument(servers, mediaConstraints)) as RTCPeerConnection

      const startTime = Date.now()
      let resolved = false
      const checkForNewIps = () => {
        if (!resolved) {
          // read candidate info from local description
          const lines = pc.localDescription?.sdp?.split('\n') || []
          lines.forEach(function (line) {
            if (line.indexOf('a=candidate:') === 0) {
              const match = ipAddressRegex.exec(line)
              if (match && match.length) {
                const address = match[1];
                ipAddresses[address] = address
              }
            }
          })
          const accumulatedTimeout = Date.now() - startTime
          // expect at LEAST one IP address (the local one), but kill attempts after max wait time regardless.
          if (Object.keys(ipAddresses).length > 1 || accumulatedTimeout >= maxWaitTime) {
            resolved = true
            try {
              pc.close()
            } catch (e) {
              console.error('There was an error attempting to read IP addresses', e)
            }
            resolve(Object.keys(ipAddresses))
          }
        }
      }

      // create a bogus data channel
      pc.createDataChannel('');

      // create an offer sdp [updated to use promise signature]
      pc.createOffer().then((result) => pc.setLocalDescription(result)).then(() => {
        checkForNewIps()
      }).catch(reject)

      // wait for a while to let everything done
      setTimeout(() => {
        checkForNewIps()
      }, 500);
    })
  }
}
