

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors')({origin: true});
const validateFirebaseIdToken = require('./util/id-token-auth')
const router = new express.Router();

router.use(cors);
router.use(validateFirebaseIdToken);

router.get('*', (req, res) => {
  res.send(JSON.stringify(req.headers));
});

const visitorInfoEndpoint = functions.https.onRequest((req, res) => {
  req.url = req.path ? req.url : `/${req.url}`;
  return router(req, res)
});

module.exports = visitorInfoEndpoint
