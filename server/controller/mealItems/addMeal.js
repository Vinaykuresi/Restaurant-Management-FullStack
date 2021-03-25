/**
 * @description Controller used to delete the meal item.
 * @author Vinay Kuresi
 */

 const meals = require("../../DatabaseSchema/mealModel"),
       passport = require("passport"),
       path = require("path"),
       uniqueIdGenerator = require("../../helpers/generateId"),
       multer = require('multer'),
       AWS = require("aws-sdk"),
       photoDestination = "../../public/images",
       fs = require("fs");

const storage = multer.diskStorage({
    destination: "images",
    filename: function(req, file, cb){
        cb(null, "IMAGE"+ "-" +uniqueIdGenerator.generateUniqueId() + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
}).single('photo');

exports.addMeal = (req, res, next) => {
    try{
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                res.status(403).json('API key not provided');
            }
            if (info != undefined) {
                res.status(403).json({message:"Token not valid"});
            } else {
                if(user[1] === 2){
                    upload(req,res,()=>{
                        const photo = req.file;
                        const s3FileURL = process.env['S3FILEURL'];
                        let s3bucket = new AWS.S3({
                            accessKeyId: process.env['ACCESS_ID'],
                            secretAccessKey: process.env['SECRETACCESSKEY'],
                            region:process.env['REGION']
                        });
                        
                        var params = {
                            Bucket: process.env['BUCKET'],
                            Body:fs.readFileSync(photo.path),
                            Key: photo.filename,
                            ContentType: photo.mimetype,
                            ACL: "public-read"
                        };
                        console.log(params)
                        s3bucket.upload(params, function(err, data) {
                            if (err) {
                                res.status(500).json({ error: true, Message: err });
                            } else {
                                console.log(data)
                                req.body.photo = s3FileURL + photo.filename
                                meals.create(req.body,(error, meal)=> {
                                    if(error) {
                                        res.status(400).json({error:true,message:"Error while updating the form"})
                                    } else {
                                        res.status(200).json({status:true,message:"Meal added"});
                                    }
                                })
                            }
                        });
                    })
                }else res.status(403).json('Token not valid');
            }
        })(req, res, next);
    }catch(error){
        res.status(400).json('error occured while adding');
    }
}