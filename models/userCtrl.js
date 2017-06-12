const bcrypt = require('bcryptjs');

module.exports = {
    hashPassword: function(password) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        return hash;

    },
    comparePassword: function(password, hash, callback) {
        bcrypt.compare(password, hash, (err, isMatch) => {
            if (err) {
                throw err;
            }
            callback(null, isMatch);
        })
    }
}