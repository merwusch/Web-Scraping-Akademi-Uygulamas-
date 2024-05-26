const express = require('express')
const router = express.Router()
const articleController = require('../controllers/articleController')

router.delete('/deleteAll', articleController.article_deleteAll)
router.get('/', articleController.article_index)
router.get('/:id', articleController.article_content)


module.exports = router