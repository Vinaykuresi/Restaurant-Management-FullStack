/**
 * @fileoverview Password based validations
 */

const bcrypt = require('bcrypt');
const saltRounds = 10;
 
 /**
 * @exports generatePasswordHash
 * @desc Generates password hash using bcrypt
 * @returns {String}
 */
 exports.generatePasswordHash = password => {
     var salt = bcrypt.genSaltSync(saltRounds);
     var hash = bcrypt.hashSync(password, salt);
     return hash;
 };
 
 /**
 * @exports comparePasswordHash
 * @desc Compares Password hashes using bcrypt
 * @returns {bool}
 */
 exports.comparePassword = (password, passwordHash) => {
     var isEqual = bcrypt.compareSync(password, passwordHash);
     return isEqual;
 };