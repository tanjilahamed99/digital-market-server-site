const NewsLatter = require("../../modals/newsLatter/newsLatter")

const postNewsLatterCon = async (req, res) => {
    const email = req.body.email
    const result = await NewsLatter.create({ email })
    res.send(result)

}

module.exports = postNewsLatterCon
