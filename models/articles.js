const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articleSchema = new Schema({
    yayin_id: {
        type: String,
        required: true
    },
    yayin_adi: {
        type: String,
        required: true
    },
    yazarlar: {
        type: String,
        required: true
    },
    yayin_turu: {
        type: String,
        required: true
    },
    yayimlanma_tarihi: {
        type: Date,
        required: true
    },
    yayinci_adi: {
        type: String,
    },
    anahtar_kelimeler: {
        type: String,
    },
    keywords: {
        type: String,
    },
    ozet: {
        type: String,
    },
    referanslar: {
        type: String,
    },
    alinti_sayisi: {
        type: String,
    },
    doi_numarasi: {
        type: String,
    },
    url_adresi: {
        type: String,
        required: true
    }
}, { timestamps: false })

const Article = mongoose.model('Article', articleSchema)
module.exports = Article