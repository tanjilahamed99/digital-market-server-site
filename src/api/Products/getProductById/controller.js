const { ObjectId } = require("mongodb")
const Products = require("../../../modals/products/products")

const getProductByIdCon = async (req, res) => {
    const id = req.params.id
    const query = { _id: new ObjectId(id) }
    const result = await Products.findOne(query)
    res.send(result)
}

module.exports = getProductByIdCon
