const NewsLatter = require("../../modals/newsLatter/newsLatter")

const postNewsLatterCon = async (req, res) => {
    const email = req.body.email
    const query = { email: email }
    const isExist = await NewsLatter.findOne(query)
    if (!isExist) {
        const result = await NewsLatter.create({ email })
        return res.send(result)
    }
    return res.send({ exist: true })

}

module.exports = postNewsLatterCon
