const Article = require('../models/articles')

const article_index = (req, res) => {
    Article.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'Anasayfa', articles: result })
        })
        .catch((err) => {
            console.log(err)
        })
}

const article_content = (req, res) => {
    const id = req.params.id
    Article.findById(id)
        .then((result) => {
            res.render('article',  {title: 'Makale Detay', article: result})
        })
        .catch((err) => {
            res.status(404).render('404', { title: 'Article bulunamadı' })
            console.log(err)
        })
}

const article_deleteAll = (req, res) => {
    Article.deleteMany({})
        .then((result) => {
            res.json({ redirect: '/article' })
            res.redirect('/article')
        })
        .catch((err) => {
            console.log(err)
        })
}

module.exports = {
    article_index,
    article_content,
    article_deleteAll
}