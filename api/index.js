const cors = require('cors')

const getProduct = require('./db/getProduct')
const getProducts = require('./db/getProducts')
const getSelects = require('./db/getSelects')
const getSitemap = require('./db/getSitemap')
const getMainData = require('./db/getMainData')

const express = require('express')
const axios = require("axios");
const app = express();

app.use(express.json())
app.use(cors())
app.use(express.static('prepareImages'))

let selects,
    main,
    products

// Получение нужного товара
app.get('/api/product/:id', async (req, res) => {
  const id = req.params.id
  const product = await getProduct(id)
  res.send(product)
})


// Получение нужных товаров
app.get('/api/products', async (req, res) => {
  if (products && Object.keys(req.query).length === 0) {
    res.send(products)
  }
  else {
    const freshProducts = await getProducts(req.query)
    res.send(freshProducts)
  }
})


// Получение стартовых данных
app.get('/api/get-started', async (req, res) => {
  selects = await getSelects()
  await axios.get('https://api.sales-search.ru/api/main')
  // await axios.get('http://localhost:3001/api/sitemap/123456789')
  const { data } = await axios.get('https://api.sales-search.ru/api/products')
  // const { data } = await axios.get('http://localhost:3001/api/products')
  products = data
  res.send('OK!!!')
})


// Получение селектов для каталога
app.get('/api/selects', async (req, res) => {
  res.send(selects)
})


// Получение карт сайта
app.get('/api/sitemap/:id', async (req, res) => {
  const id = req.params.id
  const sitemap = await getSitemap(id)
  res.send(sitemap)
})

// Отдача данных для главной
app.get('/api/main', async (req, res) => {
  if (!main) {
    main = await getMainData()
    res.send(main)
  } else res.send(main)
})

app.listen(3001)
