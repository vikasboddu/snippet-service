let mongoose = require('mongoose')
let Schema = mongoose.Schema

let bcrypt = require('bcrypt')
let saltRounds = 10

let UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  achievements: {
    created: { type: Number, required: true, default: 0 },
    shared: { type: Number, required: true, default: 0 },
    liked: { type: Number, required: true, default: 0 }
  },
  counts: {
    created: { type: Number, required: true, default: 0 },
    shared: { type: Number, required: true, default: 0 },
    liked: { type: Number, required: true, default: 0 }
  },
  snippets: { type: Array, required: false, default: [] }
})

// Encrypts a user's password before being saved into the database
UserSchema.pre('save', function (next) {
  let user = this

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(saltRounds, function (error, salt) {
    if (error) return next(error)

    bcrypt.hash(user.password, salt, function (error, hash) {
      if (error) return next(error)
      user.password = hash
      next()
    })
  })
})

// Compares a plaintext password with the user's encrypted password
UserSchema.methods.comparePassword = function (plaintextPassword, callback) {
  bcrypt.compare(plaintextPassword, this.password, function (error, verified) {
    if (error) return callback(error)
    callback(null, verified)
  })
}

// Increments an achievement
UserSchema.methods.incrementAchievement = function (achievement) {
  this.achievements[achievement] += 1
  return this.achievements[achievement]
}

// Increments a count and achievement based on thresholds
UserSchema.methods.incrementCount = function (count) {
  this.counts[count] += 1
  if ((this.counts[count] % 10 === 0) && (this.achievements[count] * 10 < this.counts[count])) {
    this.incrementAchievement(count)
  }
  return this.counts[count]
}

// Decrements a count
UserSchema.methods.decrementCount = function (count) {
  this.counts[count] -= 1
  return this.counts[count]
}

let User = mongoose.model('User', UserSchema)
module.exports = User
