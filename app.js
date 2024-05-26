const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const { spawn } = require('child_process');
const Article = require('./models/articles')
const articleRoutes = require('./routes/articleRoutes')
const app = express()
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const { title } = require('process');
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }));

const dbUrl = 'mongodb+srv://ylmzmerwusch:12345@dbdepot.or5bvxu.mongodb.net/node-academic?retryWrites=true&w=majority&appName=DbDepot'
mongoose.connect(dbUrl)
    .then((result) => app.listen(3000), console.log('Bağlantı kuruldu'))
    .catch((err) => console.log(err))

app.get('/', async (req, res) => {
    res.redirect('/article')
})

app.get('/add', (req, res) => {
    const article = new Article({
        yayin_id: '12345',
        yayin_adi: 'deneme',
        yazarlar: 'deneme',
        yayin_turu: 'deneme',
        yayimlanma_tarihi: new Date(),
        yayinci_adi: 'deneme',
        anahtar_kelimeler: 'deneme',
        keywords: 'deneme',
        ozet: 'deneme',
        referanslar: 'deneme',
        alinti_sayisi: 'deneme',
        doi_numarasi: 'deneme',
        url_adresi: 'deneme'
    })

    article.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

app.use('/article', articleRoutes)

app.use('/search', async (req, res) => {
    const searchQuery = req.body.search;
   const childPython = spawn('python', ['scrape.py', searchQuery]);
   
   childPython.stdout.on('data', async(data) => {
    console.log('Raw data:', data.toString());
    try {
        const tezDataArray = JSON.parse(data.toString());
        tezDataArray.forEach(async tezDataStr => {
            const tezData = JSON.parse(tezDataStr);
            const tez = new Article({
                yayin_id: tezData.yayin_id,
                yayin_adi: tezData.yayin_adi,
                yazarlar: tezData.yazarlar,
                yayin_turu: tezData.yayin_turu,
                yayimlanma_tarihi: tezData.tarih,
                keywords: tezData.keyword,
                url_adresi: tezData.url
            });
            console.log(tez);
            await tez.save();
        });
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
    });
    childPython.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    childPython.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
})

class Tez {
    constructor(yayin_id, yayin_adi, yazarlar, yayin_turu, tarih, keyword, url) {
        this.yayin_id = yayin_id;
        this.yayin_adi = yayin_adi;
        this.yazarlar = yazarlar;
        this.yayin_turu = yayin_turu;
        this.tarih = tarih;
        this.keyword = keyword;
        this.url = url;
    }
}

app.get('/filter', async (req, res) => {
    let filters = {};
    for (let key in req.query) {
        filters[key] = Array.isArray(req.query[key]) ? { $in: req.query[key] } : { $in: [req.query[key]] };
    }
    const filteredArticles = await Article.find(filters);
    res.render('index', { title: 'Filtreli', articles: filteredArticles });
});



//404 kontrolu her zaman en sonda olmalıdır yoksa diğer routelar çalışmaz
app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
})