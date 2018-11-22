let User = require('../models/user.model.js')
let utils = require('../utils.js')

module.exports = function (app) {
  app.get('/achievements', function (req, res) {
    utils.authenticate(req, res, User, function (err, verified) {
      if (err) throw err
      if (verified) {
        User.findOne({ email: utils.getEmailFromReq(req) }, function (err, user) {
          if (err) throw err
          res.send(user.achievements)
        })
      } else {
        res.send('Password is incorrect.')
      }
    })
  })
}
