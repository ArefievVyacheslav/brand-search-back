const cors = require('cors')

const getProduct = require('./db/getProduct')
const getProducts = require('./db/getProducts')
const getSelects = require('./db/getSelects')
const getSitemap = require('./db/getSitemap')
const getMainData = require('./db/getMainData')

const express = require('express')
const axios = require("axios");
const fs = require("fs");
const translite = require("../helpers/translite");
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
  if (products && Object.keys(req.query).length === 0) res.send(products)
  else {
    const freshProducts = await getProducts(req.query, req)
    res.send(freshProducts)
  }
})


// Получение стартовых данных
app.get('/api/get-started', async (req, res) => {
  // получаю селекты и пишу их в переменную, чтоб потом отдавать
  selects = await getSelects()
  // запускаю заготовки
  setTimeout(async () => {
    // получаю товары для главной
    await axios.get('https://api.sales-search.ru/api/main')
    // записываю файлы карт сайта
    // await axios.get('http://localhost:3001/api/sitemap/123456789')         // перед пушем комменчу
    // const { data } = await axios.get('http://localhost:3001/api/products') // перед пушем комменчу
    const { data } = await axios.get('https://api.sales-search.ru/api/products')                   // локально комменчу
    products = data
  }, 5000)
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
    // получение товаров для главной
    main = await getMainData()
    res.send(main)
    // если уже есть - отправляю заготовленные
  } else res.send(main)
})

// Получение нужного товара ДЛЯ ВК
app.get('/api/vk-product/:id', async (req, res) => {
  const idArr = req.params.id.split('-')
  const products = []
  for (let id of idArr) {
    let product = await getProduct(id)
    if (!product) continue
    products.push({
      'img': `${ product.pictureServer ? product.pictureServer : product.picture }`,
      'desc': `${ product.name }
SALE ${ product.sale }%
SIZE ${ product.params.size ? product.params.size.reduce((acc, size, idx) => acc += product.params.size.length === 1
        ? `${ size }` : `${ product.params.size.length - 1 !== idx
          ? `${ size }, ` : `${ size }` }`, '') : ''}
old price ${ product.oldprice } rub.
NEW PRICE ${ product.price } rub.
link https://sales-search.ru/product/${ translite((product.name)) }-${ product.shop === 'brandshop' || product.shop === 'cdek' || product.shop === 'stockmann' ? product.idd : product.id }
`
    })
  }
  res.send(products)
})

app.listen(3001)
