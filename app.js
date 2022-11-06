const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

const routes = require('./routes')
const usePassport = require('./config/passport')
require('./config/mongoose')

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('hbs',exphbs({defaultLayout:'main', extname:'.hbs'}))
app.use(session({
  secret: "ThisIsMySerect",
  resave: false,
  saveUninitialized: true
}))
app.set('view engine','hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
usePassport(app)

app.use((req, res, next)=>{
  res.locals.isAuthenticated = req.isAuthenticated
  res.locals.user = req.user
  next()
})
app.use(routes)

app.listen(PORT,() =>{
  console.log(`App is running on port http://localhost:${PORT}`)
})