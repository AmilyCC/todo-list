const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy(
    {usernameField: 'email', passReqToCallback: true}, 
    (req, email, password, done) =>{
      User.findOne({email})
        .then(user => {
          if(!user){
            return done(null, false, req.flash('warning_msg', '請先註冊帳號密碼！'))
          }
          return bcrypt.compare(password,user.password).then(isMatch => {
            if(!isMatch){
              return done(null, false, req.flash('warning_msg', '請輸入正確的帳號或密碼！'))
            }
            return done(null, user)
          })
          
        })
        .catch(err => done(err, null))
    }
  ))
  passport.serializeUser((user,done)=>{
    done(null,user.id)
  })
  passport.deserializeUser((id, done)=>{
    User.findById(id)
    .lean()
    .then(user => done(null, user))
    .catch(err => done(err, null))
  })
}