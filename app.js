//modules
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const { stringify } = require('querystring')

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

//schemas

const articlesSchema = {
  title: String,
  content: String
}

const Article = mongoose.model('Article', articlesSchema)

//app

app.route('/articles')
  .get((req, res) => {
    Article.find({}, (err, articles) => {
      if (!err) {
        res.send(articles)
      } else {
        res.send(err)
      }
    })
  })
  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    })
    article.save(err => {
      if (err) {
        res.send(err)
      } else {
        res.send('Article added')
      }
    })
  })
  .delete((req, res) => {
    Article.deleteMany({}, err => {
      if (err) {
        console.log(err)
      } else {
        res.send('All articles deleted')
      }
    })
  })

app.listen(port, () => {
  console.log(`App is running on port:${port}`)
})
