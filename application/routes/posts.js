var express = require('express');
var router = express.Router();

const { Successprint, errorPrint } = require('../helpers/debug/debugprinters');
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostModel = require('../models/Posts');
var PostError = require('../helpers/error/PostError');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/upload");
    },
    filename: function (req, file, cb) {
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
});

var uploader = multer({ storage: storage });

router.post('/createPost', uploader.single("uploadImage"), (req, res, next) => {
    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let fk_userid = req.session.userid;

    //server side validation needed here

    sharp(fileUploaded)
        .resize(200)
        .toFile(destinationOfThumbnail)
        .then(() => {
            return PostModel.create(title, description, fileUploaded, destinationOfThumbnail, fk_userid);


            /*let baseSQL = 'INSERT INTO posts (title, description, photopath, thumbnail, created, fk_userid) VALUE (?,?,?,?, now(),?);';
            return db.execute(baseSQL,[title, description, fileUploaded, destinationOfThumbnail, fk_userid]);
           // console.log(title, description, fileUploaded, destinationOfThumbnail, fk_userId);*/

        })
        .then((postWasCreated) => {
            if (postWasCreated) {
                req.flash('success', "Your post was created!");
                //req.session.save(function(){
                res.redirect('/');
                //});

            } else {
                throw new PostError('Post could not be created!', '/postimage', 200);
            }
        })
        .catch((err) => {
            if (err instanceof PostError) {
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            } else {
                next(err);
            }
        })



});

router.get('/search', async (req, res, next) => {
    try {
        let searchTerm = req.query.search;
        if (!searchTerm) {
            res.send({

                message: "No search term given",
                results: []
            });
        }
        else {
            let results = await PostModel.search(searchTerm);
            if (results.length) {
                res.send({

                    message: `${results.length} results found`,
                    results: results,

                });

            } else {
                let results = await PostModel.getNRecentPosts(8);
                res.send({

                    message: "No results found but here are the 8 recent posts!",
                    results: results,
                });
            }

        }
    } catch (err) {


        next(err);



    }
});


module.exports = router;