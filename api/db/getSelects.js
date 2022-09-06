const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')


module.exports = async function getSelects() {
  try {
    await client.connect()
    const db = await client.db('ss')
    const collection = await db.collection('all')
    const results = await collection.find({}).toArray()

    const total = {}

    const brands = []
    results.forEach(item => {
      const brand = item.brand
      if (!brands.includes(brand)) brands.push(brand)
    })
    total.brands = brands.sort()

    const sizes = []
    results.forEach(item => {
      const exceptions = [ '.', 'A', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ]
      if (item && item.params && Array.isArray(item.params.size)) {
        item.params.size.forEach(size => {
          if (!sizes.includes(size)
            && !exceptions.includes(size)
            && !size.includes(',')
            && !size.includes('-')
            && !(size === 'X')
            && !(size === 'U')
            && size.length < 5) {
            if (size === '2XS' && !sizes.includes('XXS')) sizes.push('XXS')
            if (size === '2XL' && !sizes.includes('XXL')) sizes.push('XXL')
            if (size === '3XL' && !sizes.includes('XXXL')) sizes.push('XXXL')
            if (size === '4XL' && !sizes.includes('XXXXL')) sizes.push('XXXXL')
            if (size !== '00'
                && size !== '2XS'
                && size !== '2XL'
                && size !== '3XL'
                && size !== '4XL') {
              sizes.push(size)
            }
          }
        })
      }
    })
    const weights = {
      'XXXS':1,
      'XXS':2,
      'XS':3,
      'S':4,
      'M':5,
      'L':6,
      'XL':7,
      'XXL':8,
      'XXXL':9
    }
    total.sizes = sizes.sort((a, b) => {
      if (!isNaN(a) && !isNaN(b)) return a - b
    })
    total.sizes = sizes.sort((a, b) => {
      if (isNaN(a) && isNaN(b)) return weights[a] - weights[b]
    })
    total.sizes = [ ...total.sizes.filter(el => isNaN(el)), ...total.sizes.filter(el => !isNaN(el)).sort( (a, b) => a.localeCompare(b, undefined, { numeric:true }) ) ]

    const _type = { clothes: [], shoes: [], accessories: [] }
    results.forEach(item => {
      const options = { clothes: 'Одежда', shoes: 'Обувь', accessories: 'Аксессуары' }
      const arrKeys = Object.keys(options)
      arrKeys.forEach(key => {
        if (item.category === options[key]
          && !_type[key].includes(item.categoryId)
          && item.categoryId !== undefined) _type[key].push(item.categoryId)
      })
    })
    total._type = { clothes: _type.clothes.sort(), shoes: _type.shoes.sort(), accessories: _type.accessories.sort() }



    total.shops = results.reduce((ttlArr,item) => {
      if (!ttlArr.includes(item.shop)) ttlArr.push(item.shop)
      return ttlArr
    }, [])


    return total
  } catch (e) {
    console.log(e);
  }
}
