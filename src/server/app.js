let bodyParser = require('body-parser')

let express = require('express')
let app = express()

let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/textio')

app.use(bodyParser.json())

let registerService = require('./services/register.service.js')(app)
let snippetService = require('./services/snippets.service.js')(app)
let achievementService = require('./services/achievement.service.js')(app)

app.listen(3000)
