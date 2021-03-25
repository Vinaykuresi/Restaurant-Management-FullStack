/**
 * @fileoverview This file generates a new JWT for new user, if authenticated
 * and verifies an existing JWT.
 * @author Vinay Kuresi
 */

 let fs = require('fs'),
 jwt = require('jsonwebtoken'),
 options = require('../config/JWTSecretConfig'),
 blacklistedJWTModel = require('../DatabaseSchema/blackListedTokenModel');

const privateCertFile = fs.readFileSync(__root + 'config/private.key', 'utf-8'),
  publicCertFile = fs.readFileSync(__root + 'config/public.key', 'utf-8');

/**
* @exports generateJWT
* @desc generates a JWT token
* @param {email} email of the user
* @param {role} role of the current user
* @returns {String}
*/
exports.generateJWT = (user) => {
    var payload = {
    userid: user.email,
    userRole: user.role
    }
    const token = jwt.sign(payload, privateCertFile, options.signOptions);
    return token;
}