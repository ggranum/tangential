const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.assignDefaultRoleWatch = require('./auth/assign-default-role-watch')
exports.visitorInfoEndpoint = require('./visitor-info-endpoint')
