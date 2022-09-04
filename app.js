const express = require('express');
const app = express();
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') // 載入 mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })// 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})
app.engine('hbs',exphbs({defaultLayout:'main', extname:'.hbs'}))
app.set('view engine','hbs')

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(3000,() =>{
  console.log('App is running on port http://localhost:3000')
})