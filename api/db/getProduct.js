const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')

module.exports = async function getProduct(id) {
  try {
    await client.connect()
    const db = await client.db('ss')
    const collection = await db.collection('all')
    return await collection.findOne({id: id})
  } catch (e) {
    console.log(e);
  }
}
