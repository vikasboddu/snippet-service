let User = require('../models/user.model.js')
let utils = require('../utils.js')

module.exports = function (app) {
  app.get('/register', function (req, res) {
    let auth = req.headers['authorization']
    if (!auth) {
      res.status(401)
      res.header('WWW-Authenticate', 'Basic realm="Secure Area"')
      res.send('<html><body>Enter username and password.</body></html>')
    } else {
      // handle if email or password is empty
      let email = utils.getEmailFromReq(req)
      User.findOne({ email: email }, function (err, user) {
        if (err) throw err
        if (user === null) {
          user = new User({
            email: email,
            password: utils.getPasswordFromReq(req)
          })
          user.save(function (err) {
            if (err) throw err
            res.send(email + ' registered.')
          })
        } else {
          res.send(email + ' already exists.')
        }
      })
    }
  })
}
