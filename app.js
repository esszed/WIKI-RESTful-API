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

//all articles
app
  .route('/articles')
  .get((req, res) => {
    Article.find({}, (err, articles) => {
      err ? res.send(err) : res.send(articles)
    })
  })
  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    })
    article.save(err => {
      err ? res.send(err) : res.send('Article added')
    })
  })
  .delete((req, res) => {
    Article.deleteMany({}, err => {
      err ? console.log(err) : res.send('All articles deleted')
    })
  })

//specific article
app
  .route('/articles/:articleTitle')
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, article) => {
      err
        ? res.send(err)
        : article
        ? res.send(article)
        : res.send(JSON.stringify({ error: '404 article not found' }))
    })
  })
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.articleTitle },
      {
        title: req.body.title,
        content: req.body.content
      },
      (err, article) => {
        err
          ? res.send(err)
          : article.n > 0
          ? res.send('Succesfuly updated')
          : res.send('Could not update, no such article')
      }
    )
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err, article) => {
        err
          ? res.send(err)
          : article.n > 0
          ? res.send('Succesfuly updated')
          : res.send('No such article or nothing to update with')
      }
    )
  })
  .delete((req,res)=>{
    Article.deleteOne({title:req.params.articleTitle}, err=>{
      err ? res.send(err) : res.send('Succesfuly deleted')
    })
  })

app.listen(port, () => {
  console.log(`App is running on port:${port}`)
})
