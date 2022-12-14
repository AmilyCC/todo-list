const express = require('express')
const router = express.Router()

const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')

router.get('/login',(req, res) => {
  res.render('login')

})

router.post('/login',
  passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const {name, email, password, confirmPassword} = req.body
  const errors = []
  if(!name || !email || !password || !confirmPassword){
    errors.push({message: '請檢查所有欄位是否皆填寫!'})
  }
  if(password.length < 6|| confirmPassword.length < 6){
    errors.push({message: '密碼最少6個字！'})
  }
  if(password !== confirmPassword){
    errors.push({message: '兩次密碼不相符！'})
  }
  if(errors.length){
    return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
    })
  }
  User.findOne({email}).then((user) => {
    if(user){
      errors.push({message: '這個Email已經註冊.'})
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash =>  User.create({
      name,
      email,
      password: hash
    }))
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err))
  })

})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg','你已經成功登出!')
  res.redirect('/users/login')
})

module.exports = router