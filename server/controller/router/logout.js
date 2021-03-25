const blacklistedModel = require("../../DatabaseSchema/blackListedTokenModel"),
      router = require('express').Router(),
      passport = require('passport');

router.get("/",(req, res, next)=>{
    try{
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                res.status(403).json('API key not provided');
            }
            if (info != undefined) {
                res.status(403).json('Token not valid');
            } else {
              blacklistedModel.create(
                {
                    invalidToken: req.headers['authorization'].split(' ')[1],
                },
                (err, expire) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        req.logout();
                        res.status(200).json({message:'logout successful'});
                    }
                }
            )
            }
          })(req, res, next);
    }catch(err){
        res.status(400).json(err)
    }
});

module.exports = router;