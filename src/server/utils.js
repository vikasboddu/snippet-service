exports.authenticate = authenticate
exports.getEmailFromReq = getEmailFromReq
exports.getPasswordFromReq = getPasswordFromReq

function authenticate (req, res, User, callback) {
  let auth = req.headers['authorization']
  if (!auth) {
    res.status(401)
    res.header('WWW-Authenticate', 'Basic realm="Secure Area"')
    res.send('<html><body>Enter username and password.</body></html>')
  } else {
    User.findOne({ email: getEmailFromReq(req) }, function (err, user) {
      if (err) throw err
      if (user === null) {
        res.send('Email ID is not registered.')
      } else {
        user.comparePassword(getPasswordFromReq(req), function (err, verified) {
          if (err) throw err
          callback(null, verified)
        })
      }
    })
  }
}

function getEmailFromReq (req) {
  let auth = req.headers['authorization']
  let basicAuth = auth.split(' ') // Basic dmlrYXNib2RkdUBnbWFpbC5jb206
  let plainAuth = Buffer.from(basicAuth[1], 'base64').toString()
  let credentials = plainAuth.split(':') // username:password
  return credentials[0]
}

function getPasswordFromReq (req) {
  let auth = req.headers['authorization']
  let basicAuth = auth.split(' ') // Basic dmlrYXNib2RkdUBnbWFpbC5jb206
  let plainAuth = Buffer.from(basicAuth[1], 'base64').toString()
  let credentials = plainAuth.split(':') // username:password
  return credentials[1]
}
