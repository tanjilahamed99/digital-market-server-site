const getProductByIdCon = require('../../../api/Products/getProductById/controller')

const router = require('express').Router()

router.get('/productDetail/:id',getProductByIdCon)


module.exports = router 