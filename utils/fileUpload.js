const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();


const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
const publicS3 = new aws.S3({
    endpoint: spacesEndpoint,
    credentials: {
        accessKeyId: process.env.AWS_PUBLIC_ACCESS_KEY,
        secretAccessKey: process.env.AWS_PUBLIC_SECRET_ACCESS_KEY
    }
});
const privateS3 = new aws.S3({
    endpoint: spacesEndpoint,
    credentials: {
        accessKeyId: process.env.AWS_PRIVATE_ACCESS_KEY,
        secretAccessKey: process.env.AWS_PRIVATE_SECRET_ACCESS_KEY
    },
    signatureVersion: 'v4'
});

const publicSpace = "";
const privateSpace = "";


// Public Space/Bucket file upload

const publicFileUpload = multer({
    storage: multerS3({
        s3: publicS3,
        bucket: publicSpace,
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, Date.now() + file.originalname);
        },
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        }
    })
});


// Private Space/Bucket file upload

const privateFileUpload = multer({
    storage: multerS3({
        s3: privateS3,
        bucket: privateSpace,
        key: (req, file, cb) => {
            cb(null, Date.now() + file.originalname);
        },
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        }
    })
});


/**
 *  Delete file from public Space/Bucket
 */

function deleteFileFromPublicSpace(fileName) {
    var params = {
        Bucket: publicSpace,
        Key: fileName
    }
    return new Promise((resolve, reject) => {
        publicS3.deleteObject(params, (err, data) => {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(data);
            }
        });
    });
}


/**
 *  Delete file from private Space/Bucket
 */

function deleteFileFromPrivateSpace(fileName) {
    var params = {
        Bucket: privateSpace,
        Key: fileName
    }
    return new Promise((resolve, reject) => {
        privateS3.deleteObject(params, (err, data) => {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(data);
            }
        });
    });
}


/**
 *  Read file from private Space/Bucket
 */


function readFileFromPrivateSpace(fileName) {
    var params = {
        Bucket: privateSpace,
        Key: fileName
    }
    return new Promise((resolve, reject) => {
        privateS3.getObject(params, (err, data) => {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(data);
            }
        });
    });
}


/**
 *  Create signed url for private images
 */

function createSignedURL(fileName) {
    let signedUrlExpireSeconds = 60 * 10;
    var params = {
        Bucket: privateSpace,
        Key: fileName,
        Expires: signedUrlExpireSeconds
    }
    return new Promise((resolve, reject) => {
        privateS3.getSignedUrl('getObject', params, (err, url) => {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(url);
            }
        });
    });
}






module.exports = {
    publicFileUpload,
    privateFileUpload,
    deleteFileFromPublicSpace,
    deleteFileFromPrivateSpace,
    readFileFromPrivateSpace,
    createSignedURL
}

