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
            && size
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
                && size !== '4XL'
                && size !== '30R'
                && size !== '34A') {
              sizes.push(size)
            }
          }
        })
      }
    })
    const weights = {
      'OS':0,
      'XXXS':1,
      'XXS':2,
      'XS':3,
      'S':4,
      'S/M':5,
      'M':6,
      'M/L':7,
      'L':8,
      'XL':9,
      'XXL':10,
      'XXXL':11,
      'XXXXL':12,
      '75D':13,
      '75C':14,
      '80C':15,
      '80D':16,
      '6Y':17,
      '8Y':18,
      '10Y':19,
      '12Y':20,
      '34R':21,
      '38R':22
    }
    total.sizes = sizes.sort((a, b) => {
      if (!isNaN(a) && !isNaN(b)) return a - b
    })
    total.sizes = [ ...total.sizes.filter(el => isNaN(el)).sort((a, b) => {
      if (isNaN(a) && isNaN(b)) return weights[a] - weights[b]
    }), ...total.sizes.filter(el => !isNaN(el)).sort( (a, b) => a.localeCompare(b, undefined, { numeric:true }) ) ]

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
