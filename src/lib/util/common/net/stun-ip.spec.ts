import {StunIpLookup} from "./stun-ip";
describe('util.common.net.stun-ip', () => {

  it("Looks up ip addresses", (done) => {
    let x = StunIpLookup.getIPs(5000, false).then((result)=>{
      expect(result).toBeTruthy('Should have  result')
      expect(Object.keys(result).length).toBeGreaterThan(1, 'Should find at least 2 ip addresses - local and remote.')
      done()
    })
  })
})
