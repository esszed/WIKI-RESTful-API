//modules
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')

const port = 3000

const app = express()

//paths
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')

//view  engine
app.set('view engine', 'ejs')
app.set('views', viewsPath)

//express settings
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(publicDirectoryPath))

//database coonnect
mongoose.connect('mongodb://localhost:27017/wikiDB', { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})





app.listen(port, () => {
    console.log(`App is running on port:${port}`)
  })
