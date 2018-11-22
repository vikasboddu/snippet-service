let expect = require('chai').expect

let User = require('./src/server/models/user.model.js')
let Snippet = require('./src/server/models/snippet.model.js')

describe('User Model (user.model.js)', function () {
  it('should be invalid if email is empty', function (done) {
    let user = new User()
    user.validate(function (err) {
      expect(err.errors.email).to.exist
      done()
    })
  })

  it('should be invalid if password is empty', function (done) {
    let user = new User()
    user.validate(function (err) {
      expect(err.errors.password).to.exist
      done()
    })
  })

  it('should be invalid if password is stored as plaintext', function (done) {
    let user = new User({ email: 'email@gmail.com', password: 'password123' })
    user.validate(function (err) {
      expect(user.password).to.not.equal('password123')
      done()
    })
  })

  it('should be invalid if achievements is empty', function (done) {
    let user = new User()
    expect(user.achievements).to.exist
    done()
  })

  it('should be invalid if created achievements is not 0', function (done) {
    let user = new User()
    expect(user.achievements.created).to.equal(0)
    done()
  })

  it('should be invalid if shared achievements is not 0', function (done) {
    let user = new User()
    expect(user.achievements.shared).to.equal(0)
    done()
  })

  it('should be invalid if liked achievements is not 0', function (done) {
    let user = new User()
    expect(user.achievements.liked).to.equal(0)
    done()
  })

  it('should be invalid if counts is empty', function (done) {
    let user = new User()
    expect(user.counts).to.exist
    done()
  })

  it('should be invalid if created counts is not 0', function (done) {
    let user = new User()
    expect(user.counts.created).to.equal(0)
    done()
  })

  it('should be invalid if shared counts is not 0', function (done) {
    let user = new User()
    expect(user.counts.shared).to.equal(0)
    done()
  })

  it('should be invalid if liked counts is not 0', function (done) {
    let user = new User()
    expect(user.counts.liked).to.equal(0)
    done()
  })

  it('should increase liked count', function (done) {
    let user = new User({ counts: { liked: 3 } })
    user.incrementCount('liked')
    expect(user.counts.liked).to.equal(4)
    done()
  })

  it('increases liked count and it should increase liked achievement', function (done) {
    let user = new User({ counts: { liked: 9 } })
    user.incrementCount('liked')
    expect(user.achievements.liked).to.equal(1)
    done()
  })

  it('should decrease liked count', function (done) {
    let user = new User({ counts: { liked: 3 } })
    user.decrementCount('liked')
    expect(user.counts.liked).to.equal(2)
    done()
  })

  it('decreases liked count but should not decrease liked achievement', function (done) {
    let user = new User({ counts: { liked: 20 }, achievements: { liked: 2 } })
    user.decrementCount('liked')
    expect(user.achievements.liked).to.equal(2)
    done()
  })

  it('should increase shared count', function (done) {
    let user = new User({ counts: { shared: 3 } })
    user.incrementCount('shared')
    expect(user.counts.shared).to.equal(4)
    done()
  })

  it('increases shared count and it should increase shared achievement', function (done) {
    let user = new User({ counts: { shared: 9 } })
    user.incrementCount('shared')
    expect(user.achievements.shared).to.equal(1)
    done()
  })

  it('should decrease shared count', function (done) {
    let user = new User({ counts: { shared: 3 } })
    user.decrementCount('shared')
    expect(user.counts.shared).to.equal(2)
    done()
  })

  it('decreases shared count but should not decrease shared achievement', function (done) {
    let user = new User({ counts: { shared: 20 }, achievements: { shared: 2 } })
    user.decrementCount('shared')
    expect(user.achievements.shared).to.equal(2)
    done()
  })

  it('should increase created count', function (done) {
    let user = new User({ counts: { created: 3 } })
    user.incrementCount('created')
    expect(user.counts.created).to.equal(4)
    done()
  })

  it('increases created count and it should increase created achievement', function (done) {
    let user = new User({ counts: { created: 9 } })
    user.incrementCount('created')
    expect(user.achievements.created).to.equal(1)
    done()
  })

  it('should decrease created count', function (done) {
    let user = new User({ counts: { created: 3 } })
    user.decrementCount('created')
    expect(user.counts.created).to.equal(2)
    done()
  })

  it('decreases created count but should not decrease created achievement', function (done) {
    let user = new User({ counts: { created: 20 }, achievements: { created: 2 } })
    user.decrementCount('created')
    expect(user.achievements.created).to.equal(2)
    done()
  })
})

describe('Snippet Model (snippet.model.js)', function () {
  it('should be invalid if text is empty', function (done) {
    let snippet = new Snippet()
    snippet.validate(function (err) {
      expect(err.errors.text).to.exist
      done()
    })
  })

  it('should be invalid if owner is empty', function (done) {
    let snippet = new Snippet()
    snippet.validate(function (err) {
      expect(err.errors.owner).to.exist
      done()
    })
  })

  it('should be invalid if shared is true', function (done) {
    let snippet = new Snippet()
    expect(snippet.shared).to.equal(false)
    done()
  })

  it('should be invalid if liked is not an empty array', function (done) {
    let snippet = new Snippet()
    expect(snippet.likes).to.deep.equal([])
    done()
  })

  it('should be invalid if it does not share and increase share count for user', function (done) {
    let snippet = new Snippet()
    expect(snippet.likes).to.deep.equal([])
    done()
  })
})
