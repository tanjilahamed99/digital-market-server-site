const Products = require("../../../modals/products/products")

const getFeaturedProductsCon = async (req, res) => {
    const result = await Products.find().sort({ publishDate: -1 })
    res.send(result)
}

module.exports = getFeaturedProductsCon
