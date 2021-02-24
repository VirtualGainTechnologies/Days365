const argon2 = require('argon2');



/** 
 * Encrypt Password
 */

async function encryptPassword(password, callback) {
    return new Promise(async (resolve, reject) => {
        try {
            const hash = await argon2.hash(password);
            return callback ? callback(null, hash) : resolve(hash);
        }
        catch (err) {
            return callback ? callback(err, null) : reject(err);
        }
    });
}


/** 
 * Verify Password
 */

async function verifyPassword(hash, password, callback) {
    return new Promise(async (resolve, reject) => {
        try {
            var verified = false;
            if (await argon2.verify(hash, password)) {
                verified = true;
            }
            return callback ? callback(null, verified) : resolve(verified);
        }
        catch (err) {
            return callback ? callback(err, false) : reject(err);
        }
    });
}


/** 
 * Validate Email
 */

async function verifyEmail(email) {
    const regEx = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return await regEx.test(email);
}


/** 
 * Validate Mobile number (indian)
 */

async function verifyMobile(mobile) {
    const regEx = /^[6-9]{1}[0-9]{9}$/;
    return await regEx.test(mobile);
}


/**
 * Verify user login
 */

async function isMobileOrEmail(loginCredential, callback) {
    return new Promise(async (resolve, reject) => {
        try {
            loginCredential = loginCredential.trim();
            var field = {
                isValid: false,
                type: "",
                value: ""
            };
            if (await verifyEmail(loginCredential)) {
                field.isValid = true;
                field.type = "EMAIL";
                field.value = loginCredential;
            }
            else {
                //transform data to a valid mobile number
                let number = loginCredential.slice(-10);
                if (await verifyMobile(number)) {
                    field.isValid = true;
                    field.type = "MOBILE";
                    field.value = loginCredential;
                }
            }
            return callback ? callback(null, field) : resolve(field);
        }
        catch (err) {
            return callback ? callback(err) : reject(err);
        }
    });
}



module.exports = { encryptPassword, verifyPassword, verifyEmail, verifyMobile, isMobileOrEmail }

