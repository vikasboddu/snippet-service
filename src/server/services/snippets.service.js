let User = require('../models/user.model.js')
let Snippet = require('../models/snippet.model.js')
let utils = require('../utils.js')

module.exports = function (app) {
  app.get('/snippets', function (req, res) {
    Snippet.find({ shared: true }, function (err, snippets) {
      if (err) throw err
      res.send(snippets)
    })
  })

  app.get('/snippets/:id', function (req, res) {
    Snippet.findById({ _id: req.params.id }, function (err, snippet) {
      if (err) throw err
      if (snippet.shared) res.send(snippet)
    })
  })

  app.post('/snippets', function (req, res) {
    utils.authenticate(req, res, User, function (err, verified) {
      if (err) throw err
      if (verified) {
        let snippet = new Snippet({
          text: req.body.text,
          owner: utils.getEmailFromReq(req),
          shared: req.body.shared
        })
        snippet.save(function (err) {
          if (err) throw err
          User.findOne({ email: utils.getEmailFromReq(req) }, function (err, user) {
            if (err) throw err
            user.incrementCount('created')
            if (req.body.shared) {
              user.incrementCount('shared')
            }
            user.save(function (err) {
              if (err) throw err
              res.send(snippet)
            })
          })
        })
      } else {
        res.send('Password is incorrect.')
      }
    })
  })

  app.put('/snippets/:id', function (req, res) {
    utils.authenticate(req, res, User, function (err, verified) {
      if (err) throw err
      if (verified) {
        Snippet.findById({ _id: req.params.id }, function (err, snippet) {
          if (err) throw err
          let email = utils.getEmailFromReq(req)

          if (req.body.shared === true) {
            snippet.share(email)
          }

          if (req.body.shared === false) {
            snippet.unshare(email)
          }

          if (req.body.liked === true) {
            snippet.like(email)
          }

          if (req.body.liked === false) {
            snippet.unlike(email)
          }

          snippet.save(function (err) {
            if (err) throw err
            res.send(snippet)
          })
        })
      } else {
        res.send('Password is incorrect.')
      }
    })
  })
}
