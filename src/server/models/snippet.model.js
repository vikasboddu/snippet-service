let mongoose = require('mongoose')
let Schema = mongoose.Schema
let User = require('./user.model.js')

let SnippetSchema = new Schema({
  text: { type: String, required: true },
  owner: { type: String, required: true },
  shared: { type: Boolean, required: true, default: false },
  likes: { type: Array, required: true, default: [] }
})

// Share a snippet and increments shared count of the user
SnippetSchema.methods.share = function (email) {
  if (this.owner === email) {
    this.shared = true
    User.findOne({ email: email }, function (err, user) {
      if (err) throw err
      user.incrementCount('shared')
      user.save(function (err) {
        if (err) throw err
      })
    })
  }
  return this.shared
}

// Unshare a snippet and decrements shared count of the user
SnippetSchema.methods.unshare = function (email) {
  if (this.owner === email) {
    this.shared = false
    User.findOne({ email: email }, function (err, user) {
      if (err) throw err
      user.decrementCount('shared')
      user.save(function (err) {
        if (err) throw err
      })
    })
  }
  return this.shared
}

// Likes a snippet and increments liked count of the owner
SnippetSchema.methods.like = function (email) {
  if ((this.owner !== email) && !(this.likes.includes(email))) {
    this.likes.push(email)
    User.findOne({ email: this.owner }, function (err, user) {
      if (err) throw err
      user.incrementCount('liked')
      user.save(function (err) {
        if (err) throw err
      })
    })
  }
  return this.likes
}

// Unlikes a snippet and decrements liked count of the owner
SnippetSchema.methods.unlike = function (email) {
  if (this.owner !== email) {
    this.likes = this.likes.filter(function (liker) {
      return liker !== email
    })
    User.findOne({ email: this.owner }, function (err, user) {
      if (err) throw err
      user.decrementCount('liked')
      user.save(function (err) {
        if (err) throw err
      })
    })
  }
  return this.likes
}

let Snippet = mongoose.model('Snippet', SnippetSchema)
module.exports = Snippet
