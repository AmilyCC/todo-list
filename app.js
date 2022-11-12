const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')   // 引用套件


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


const routes = require('./routes')

const usePassport = require('./config/passport')
require('./config/mongoose')

const app = express();
const PORT = process.env.PORT

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
app.use(flash())  // 掛載套件

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
  next()
})
app.use(routes)

app.listen(PORT,() =>{
  console.log(`App is running on port http://localhost:${PORT}`)
})