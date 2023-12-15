const postNewsLatterCon = require('../../api/NewsLatter/newsLatter')

const router = require('express').Router()

router.post('/newsLatter',postNewsLatterCon)

module.exports = router