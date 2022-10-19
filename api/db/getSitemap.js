const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')
const axios = require('axios')
const fs = require("fs")
const translite = require('../../helpers/translite')

module.exports = async function getSitemap(id) {
  try {
    if (id === '123456789') {
      // CONNECT DATABASE
      await client.connect()
      const db = await client.db('ss')
      const collection = await db.collection('all')
      const allP = await collection.find({}).toArray()
      const allProductsNamesIdsArr = allP.map(product => {
        if (product && product.name) return ['product/' + translite(`${product.name.toLowerCase().replaceAll(' ', '-')}-${product.shop === 'brandshop' || product.shop === 'cdek' || product.shop === 'stockmann' ? product.idd : product.id}`)]
      })
      // const allAuxiliaryLinks = [ '/news', '/delivery', '/payment', '/warranty', '/reviews', '/about', '/jobs', '/contacts' ]

      // СЛОВАРЬ КАТЕГОРИЙ
      const dict = { clothes: 'Одежда', shoes: 'Обувь', accessories: 'Аксессуары', 't-shirts': 'Футболки', 'polo-shirts': 'Футболки Поло', hoodies: 'Толстовки', trousers: 'Штаны и брюки', 'dresses-and-skirts': 'Платья и юбки',
        jackets: 'Куртки', sweaters: 'Свитеры', shirts: 'Рубашки', 'underwear-and-shorts': 'Нижнее белье и шорты', 'new-clothes': 'Новинки', 'blouses-and-shirts': 'Блузы и рубашки',
        'gym-shoes': 'Кеды', 'sneakers': 'Кроссовки', 'new-shoes': 'Новые поступления', boots: 'Ботинки', 'bags-backpacks-purses': 'Сумки, Рюкзаки и Кошельки',
        belts: 'Ремни', perfumery: 'Парфюмерия', caps: 'Кепки'
      }
      // ПОЛУЧАЮ СЕЛЕКТЫ ТЕКУЩИЕ
      const { data } = await axios.get('https://api.sales-search.ru/api/selects')
      const selects = data

      // ПРИВОЖУ ЗНАЧЕНИЯ В СЛОВАРЕ И ЗНАЧЕНИЯ СЕЛЕКТОВ К НИЖНЕМУ РЕГИСТРУ
      Object.keys(dict).forEach(key => dict[key] = dict[key].toLowerCase())
      const _catArr = [ ...selects._type.accessories, ...selects._type.clothes, ...selects._type.shoes ]
          .map(value => value = value.toString().toLowerCase())


      // БУДУЩИЙ МАССИВ КАРТЫ САЙТА И ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ БУДУЩИХ МАССИВОВ РАЗДЕЛОВ
      let sitemapArr = []
      const sexArr = [ '1-men', '1-women', '1-unisex', '1-child' ]
      const catArr = [ '2-clothes', '2-shoes', '2-accessories' ]
      const priceArr = [ '4-price-0-3000', '4-price-3000-5000', '4-price-5000-7000', '4-price-7000-10000', '4-price-10000-9999999' ]
      const brandsArr = selects.brands.map(brand => {
        if (brand) return `6-brand-${brand.replaceAll(' ', '-').toLowerCase()}`
      })
      const sizesArr = selects.sizes.map(size => `7-sizes-${size.toLowerCase()}`)
      const colorArr = [ '91-color-black', '91-color-white', '91-color-red', '91-color-orange', '91-color-yellow', '91-color-pink',
        '91-color-purple', '91-color-blue', '91-color-green', '91-color-brown' ]

      // ДОПОЛНЯЮ МАССИВ КАТЕГОРИЙ catArr
      _catArr.forEach(category => {
        // для каждой категории прохожу по каждому ключу из словаря
        Object.keys(dict).forEach(key => {
          if (category === dict[key]) catArr.push(`2-${key}`)
        })
      })
      // дополняю массив карты сайта ссылками на пол
      sexArr.forEach(sex => sitemapArr.push(`category/${sex}`))
      // дополняю массив карты сайта ссылками на категории
      catArr.forEach(cat => sexArr.forEach(sex => catArr.push(`${sex}/${cat}`)))
      catArr.forEach(cat => sitemapArr.push(`category/${cat}`))
      // // дополняю массив карты сайта ссылками на ценовой диапазон
      // priceArr.forEach(price => sitemapArr.forEach(link => {
      //   if (!link.includes('/4-')) sitemapArr.push(`${link}/${price}`)
      // }))
      // priceArr.forEach(price => sitemapArr.push(`category/${price}`))
      // // дополняю массив карты сайта ссылками с рассрочкой
      // sitemapArr.forEach(link => {
      //   if (!link.includes('/5-')) sitemapArr.push(`${link}/5-instalments-yes`)
      // })
      // sitemapArr.push(`category/5-instalments-yes`)
      // дополняю массив карты сайта ссылками на brands
      brandsArr.forEach(brand => sitemapArr.forEach(link => {
        if (!link.includes('/6-brand-')) sitemapArr.push(`${link}/${brand}`)
      }))
      brandsArr.forEach(brand => sitemapArr.push(`category/${brand}`))
      // дополняю массив карты сайта ссылками на sizes
      sizesArr.forEach(size => sitemapArr.forEach(link => {
        if (!link.includes('/7-sizes-')) sitemapArr.push(`${link}/${size}-`)
      }))
      sizesArr.forEach(size => sitemapArr.push(`category/${size}-`))
      // // дополняю массив карты сайта ссылками на цвета
      // colorArr.forEach(color => sitemapArr.forEach(link => {
      //   if (!link.includes('/91-')) sitemapArr.push(`${link}/${color}`)
      // }))
      // colorArr.forEach(color => sitemapArr.push(`category/${color}`))
      sitemapArr.push(...allProductsNamesIdsArr)
      // sitemapArr.push(...allAuxiliaryLinks)

      for (let s = 0, e = 45000; s < sitemapArr.length; s += 45000, e += 45000)
        fs.writeFileSync(`./sitemaps/sitemapUrlArr${s / 45000}.txt`, `${sitemapArr.slice(s, +e)}`)

      // fs.writeFileSync('../../brand-search/sitemapLength.txt', `${result.length}`)
      fs.writeFileSync('./sitemaps/sitemapLength.txt', `${(sitemapArr.length / 45000).toFixed()}`)

    } else return JSON.stringify(fs.readFileSync(`./sitemaps/sitemapUrlArr${id}.txt`, 'utf8').split(','))
  } catch (e) {
    console.log(e);
  }
}
