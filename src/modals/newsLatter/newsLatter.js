const { model, Schema } = require("mongoose");
const NewsLatterSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
})


const NewsLatter = model("NewsLatter", NewsLatterSchema, "newsLatter")

module.exports = NewsLatter