const crypto =require('crypto')

const db = require('../database/datalogin')

module.exports={
    authorization: (login, cb) => {
        const user = db.get('user').value()

        if (!user) {
            return cb(new Error('Не верный логин/пароль'), null)
        }

        crypto.pbkdf2(login.password, user.salt, 1000, 512, 'sha512', (err, hash) => {
            if (err) {
                return cb(new Error('Возникла ошибка, попробуйте еще!'), null)
            }

            cb(null, {
                email: user.email,
                password: hash.toString('hex') === user.hash
            })
        })

    },

    registration(login, cb) {
        const salt = crypto.randomBytes(16).toString('hex')

        crypto.pbkdf2(login.password, salt, 1000, 512, 'sha512', (err, hash) => {
            if (err) {
               return cb(new Error('Возникла ошибка при регистрации'))
            } 

            db.set('user', {
                email: login.email,
                salt,
                hash: hash.toString('hex')
            }).write()

            cb(null, {
                message: 'Вы успешно зарегистрированы!!!'
            })
        })

    }
}
