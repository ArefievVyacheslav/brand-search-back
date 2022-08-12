const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')
const axios = require('axios')


module.exports = async function getProducts(paramsObj) {
  try {
    const result = []
    let products = null
    const paramsArrKeys = Object.keys(paramsObj)

    const { data } = await axios.get('http://localhost:3001/selects')
    if (data.brands.includes('Все')) data.brands.splice(data.brands.indexOf('Все'), 1)
    if (data.sizes.includes('Все')) data.sizes.splice(data.sizes.indexOf('Все'), 1)

    const gender = { '-men': 'Мужской', '-women': 'Женский', '-unisex': 'unisex', '-child': 'Детский' }
    const category = { clothes: 'Одежда', '2-shoes': 'Обувь', accessories: 'Аксессуары'  }
    const subCategory = { 't-shirts': 'Футболки', 'polo-shirts': 'Футболки поло', hoodies: 'Толстовки', trousers: 'Штаны и брюки', 'dresses-and-skirts': 'Платья и юбки', jackets: 'Куртки', sweaters: 'Свитеры', shirts: 'Рубашки', 'underwear-and-shorts': 'Нижнее белье и шорты', 'new-clothes': 'Новинки', 'blouses-and-shirts': 'Блузы и рубашки', 'gym-shoes': 'Кеды', 'sneakers': 'Кроссовки', 'new-shoes': 'Новые поступления', boots: 'Ботинки', 'bags-backpacks-purses': 'Сумки, рюкзаки и кошельки', belts: 'Ремни', perfumery: 'Парфюмерия', caps: 'Кепки' }
    const sale = { '-sale-80': 80, '-sale-60': 60, '-sale-50': 50, '-sale-30': 30 }
    const price = { '0-3000': [...Array.from(Array(3000).keys(),x=>x+1)], '3000-5000': [...Array.from(Array(2000).keys(),x=>x+3000)], '5000-7000': [...Array.from(Array(2000).keys(),x=>x+5000)], '7000-10000': [...Array.from(Array(3000).keys(),x=>x+7000)], '10000-9999999': [...Array.from(Array(999999).keys(),x=>x+10000)] }
    const brands = data.brands.reduce((ttlObj, brand) => {
        brand && brand.includes(' ')
          ? ttlObj[`-${brand.replaceAll(' ', '-')}`.toLowerCase()] = brand
          : ttlObj[`-${brand}`.toLowerCase()] = brand
      return ttlObj
      }, {})
    const sizes = data.sizes.reduce((ttlObj, size) => {
      size.includes(' ')
        ? ttlObj[`-${size.replaceAll(' ', '-')}-`.toLowerCase()] = size
        : ttlObj[`-${size}-`.toLowerCase()] = size
      return ttlObj
    }, {})
    const color = { black: 'Чёрный', white: 'Белый', red: 'Красный', orange: 'Оранжевый', yellow: 'Желтый', pink: 'Розовый', purple: 'Фиолетовый', blue: 'Синий', green: 'Зелёный', brown: 'Коричневый' }


    const params = paramsArrKeys.reduce((ttlObj,keyParam) => {

      Object.keys(gender).forEach(keyGender => {
        if (keyParam.includes(keyGender)) keyGender === '-child'
          ? ttlObj['params.age'] = gender[keyGender] : ttlObj['params.gender'] = gender[keyGender]
      })

      Object.keys(category).forEach(keyCategory => {
        if (keyParam.includes(keyCategory)) ttlObj.category = category[keyCategory]
      })

      Object.keys(subCategory).forEach(keySubCategory => {
        if (keyParam.includes(keySubCategory)) ttlObj.categoryId = subCategory[keySubCategory]
      })

      Object.keys(sale).forEach(keySale => {
        if (keyParam.includes(keySale)) ttlObj.sale = { $gt: sale[keySale] - 1 }
      })

      Object.keys(sale).forEach(keySale => {
        if (keyParam.includes(keySale)) ttlObj.sale = { $gt: sale[keySale] - 1 }
      })

      Object.keys(price).forEach(keyPrice => {
        if (keyParam.includes(keyPrice)) ttlObj.price = { $in: price[keyPrice] }
      })

      if (keyParam.includes('-instalments-yes')) ttlObj.instalments = true

      const brandsArr = Object.keys(brands).reduce((ttlArr, keyBrand) => {
        if (keyParam.includes(keyBrand)) ttlArr.push(brands[keyBrand])
        return ttlArr
      }, [])
      if (brandsArr.length !== 0) ttlObj.brand = { $in: brandsArr }

      const sizesArr = Object.keys(sizes).reduce((ttlArr, keySize) => {
        if (keyParam.includes(keySize)) ttlArr.push(sizes[keySize])
        return ttlArr
      }, [])
      if (sizesArr.length !== 0) ttlObj['params.size'] = { $in: sizesArr }

      if (keyParam.includes('-delivery-rus')) ttlObj.delivery = 'Россия'

      Object.keys(color).forEach(keyColor => {
        if (keyParam.includes(keyColor)) ttlObj['params.color'] = color[keyColor]
      })

      // СЕЛЕКТ "ОТКУДА"
      // if (keyParam.includes('-from-russia')) ttlObj.delivery = 'Россия'
      // if (keyParam.includes('-from-no-russia')) ttlObj.delivery = 'Зарубеж'


      return ttlObj
    }, {})


    const sort = paramsArrKeys.reduce((ttlObj,sortParam) => {

      if (sortParam.includes('expensive')) ttlObj = { price: -1 }
      if (sortParam.includes('cheaper')) ttlObj = { price: 1 }
      if (sortParam.includes('sort-sale')) ttlObj = { sale: -1 }
      if (sortParam.includes('-free-delivery')) ttlObj = { deliveryPrice: 1 }

      return ttlObj
    }, { 'params.rating': -1 })


    // CONNECT DATABASE
    await client.connect()
    const db = await client.db('ss')
    const collection = await db.collection('all')
    products = Object.keys(paramsObj).length === Object.keys({}).length
      ? await collection.find({}).sort({ "params.rating": -1 }).toArray()
      : await collection.find(params).sort(sort).toArray()
    const quantity = products.length


    // PAGINATION LOGIC
    const pageParams = paramsArrKeys.reduce((pageParamsObj, param) => {
      if (param.includes('page')) {
        const pageArr = param.split('-')
        pageParamsObj.page = pageArr[1]
      }
      if (param.includes('show')) {
        const showArr = param.split('-')
        pageParamsObj.show = showArr[1]
      }
      return pageParamsObj
    }, {})
    const count = +pageParams.show || 60
    for (let s = 0, e = count; s < products.length; s += count, e += count)
      result.push(products.slice(s, +e))

    return {
      products: result[pageParams.page - 1 || 0],
      quantity
    }
  } catch (e) {
    console.log(e);
  }
}
