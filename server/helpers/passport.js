const options = require("../config/JWTSecretConfig"),
      bcrypt = require("bcrypt");

const BCRYPT_SALT_ROUNDS = 12;

const passport = require('passport'),
  localStrategy = require('passport-local').Strategy,
  JWTstrategy = require('passport-jwt').Strategy,
  ExtractJWT = require('passport-jwt').ExtractJwt,
  adminModal = require('../DatabaseSchema/adminModel'),
  customerModal = require('../DatabaseSchema/customerModel'),
  passwordValidator = require('./passwordValidator'),
  uniqueIdGenerator = require('./generateId'),
  blacklistedJWTModel = require('../DatabaseSchema/blackListedTokenModel'),
  fs = require('fs');

const publicCertFile = fs.readFileSync(__root + 'config/public.key', 'utf-8');

passport.use(
  'register',
  new localStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true,
      session: false,
    },
    (req, email, password, done) => {
      try {
        if(req.body.role === 1){
            customerModal.findOne({email:email.toLowerCase().trim() }).then(user => {
                if (user != null) {
                      return done(null, false, { message: 'email already taken' });
                } else {
                    customerModal.create({
                          customerId: uniqueIdGenerator.generateUniqueId(),
                          name: req.body.username.toLowerCase().trim(),
                          email: email.toLowerCase().trim(),
                          password: passwordValidator.generatePasswordHash(password.trim()),
                          role: 1
                      },(error, users)=> {
                          if(error) {
                              return done(error, false, { message: 'error occured' });
                          } else {
                              return done(null, users);
                          }
                      })
                }
              })
              .catch(error => {
                  return done(error, false, { message: 'error occured' });
              })

        }else{
            adminModal.findOne({email:email.toLowerCase().trim() }).then(user => {
                if (user != null) {
                      return done(null, false, { message: 'email already taken' });
                } else {
                      adminModal.create({
                          adminId: uniqueIdGenerator.generateUniqueId(),
                          name: req.body.username.toLowerCase().trim(),
                          email: email.toLowerCase().trim(),
                          password: passwordValidator.generatePasswordHash(password.trim()),
                          role: 2
                      },(error, users)=> {
                          if(error) {
                              return done(error, false, { message: 'error occured' });
                          } else {
                              return done(null, users);
                          }
                      })
                }
              })
              .catch(error => {
                  return done(error, false, { message: 'error occured' });
              })
        }
      } catch (err) {
        done(err);
      }
    },
  ),
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true,
      session: false,
    },
    (req, email, password, done) => {
      try {
        if(req.body.role === 1){
            customerModal.findOne({email:email.toLowerCase().trim()}).then(user => {
                if(user===null){
                    return done(null, false, { message: 'bad username' });
                } else {
                    if(passwordValidator.comparePassword(
                        password,
                        user.password
                    ) === false) {
                        return done(null, false, { message: 'password failed' });;
                    } else {
                        return done(null, user);
                    }
                }
            })
        }else{
            adminModal.findOne({email:email.toLowerCase().trim()}).then(user => {
                if(user===null){
                    return done(null, false, { message: 'bad username' });
                } else {
                    if(passwordValidator.comparePassword(
                        password,
                        user.password
                    ) === false) {
                        return done(null, false, { message: 'password failed' });
                    } else {
                        return done(null, user);
                    }
                }
            })
        }
      } catch (err) {
        done(err);
      }
    },
  ),
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: publicCertFile,
};

passport.use(
  'jwt',
  new JWTstrategy(opts, (jwt_payload, done) => {
    try {
        if(jwt_payload.userRole === 1){
            blacklistedJWTModel.findOne({ where: {token: opts.jwtFromRequest }}).then((blackToken)=> {
                if(blackToken) {
                    return done(null, false, {message:"Invalid token"})
                } else {
                    customerModal.findOne({email:jwt_payload.userid}).then(user => {
                        if(user){
                           return done(null, user) 
                        }else{
                            return done(null, false, {message:"Invalid token"})
                        }
                    })
                    .catch(error => {
                        return done(null, false, {message:"Token Expired"})
                    })
                }
        })
    }else{
        blacklistedJWTModel.findOne({ where: {token: opts.jwtFromRequest }}).then((blackToken)=> {
            if(blackToken) {
                return done(null, false, {message:"Invalid token"})
            } else {
                adminModal.findOne({email:jwt_payload.userid}).then(user => {
                    if(user){
                       return done(null, [user,jwt_payload.userRole]) 
                    }else{
                        return done(null, false, {message:"Invalid token"})
                    }
                })
                .catch(error => {
                    return done(null, false, {message:"Token Expired"})
                })
            }
    })
    }
    } catch (err) {
      done(err);
    }
  }),
);