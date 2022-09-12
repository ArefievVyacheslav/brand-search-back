const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')
const axios = require("axios")

module.exports = async function getMainData() {
    try {
        // CONNECT DATABASE
        await client.connect()
        const db = await client.db('ss')
        const collection = await db.collection('all')
        const resultObj = {}
        const getData = async (route, type) => {
            let urlArr = route.split('/')
            urlArr.splice(0, 2)
            const apiUrl = urlArr.reduce((total, value) => {
                if (Array.isArray(value)) value.forEach(item => total += `${item}=true&`)
                else total += `${value}=true&`
                return total
            }, 'https://api.sales-search.ru/api/products?')
            const { data } = await axios.get(apiUrl)
            if (type === 'sale') resultObj.bigSaleProducts = data.products.slice(0, 5)
            if (type === 'new') resultObj.newProducts = [ data.products[0], data.products[3], data.products[6], data.products[9], data.products[12] ]
            if (type === 'rating') resultObj.ratingProducts = data.products.slice(0, 5)
        }
        await getData('/category/sort-sale', 'sale')
        await getData('/category', 'new')
        await getData('/category/sort-rating', 'rating')
        return resultObj
    } catch (e) {
        console.log(e);
    }
}
