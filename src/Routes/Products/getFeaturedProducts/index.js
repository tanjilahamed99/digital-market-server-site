const getFeaturedProductsCon = require('../../../api/Products/GetFeaturedProducts/controller')

const router = require('express').Router()

router.get('/feature',getFeaturedProductsCon)

module.exports = router