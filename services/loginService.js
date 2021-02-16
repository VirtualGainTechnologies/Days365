const argon2 = require('argon2');

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



module.exports = { encryptPassword, verifyPassword }

