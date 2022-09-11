const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')

module.exports = async function getProduct(id) {
  try {
    await client.connect()
    const db = await client.db('ss')
    const collection = await db.collection('all')
    return id.includes('1111111') ? await collection.findOne({idd: +id}) : await collection.findOne({id: id})
  } catch (e) {
    console.log(e);
  }
}
