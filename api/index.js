const cors = require('cors')

const getProduct = require('./db/getProduct')
const getProducts = require('./db/getProducts')
const getSelects = require('./db/getSelects')
const getSitemap = require('./db/getSitemap')

const express = require('express')
const app = express();

app.use(express.json())
app.use(cors())
app.use(express.static('prepareImages'))

// Получение нужного товара
app.get('/api/product/:id', async (req, res) => {
  const id = req.params.id
  const product = await getProduct(id)
  res.send(product)
})


// Получение нужных товаров
app.get('/api/products', async (req, res) => {
  const products = await getProducts(req.query)
  res.send(products)
})


// Получение селектов для каталога
app.get('/api/selects', async (req, res) => {
  const selects = await getSelects()
  res.send(selects)
})


// Получение карт сайта
app.get('/api/sitemap/:id', async (req, res) => {
  const id = req.params.id
  const sitemap = await getSitemap(id)
  res.send(sitemap)
})

app.listen(3001)
