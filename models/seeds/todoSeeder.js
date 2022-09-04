const mongoose = require('mongoose')// 取得資料庫連線狀態
const Todo = require('../todo')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
  for(let i = 0; i < 10 ; i++){
    Todo.create({name: `name-${i}`})
  }
  console.log('done.')
})