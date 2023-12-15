const express = require('express')
const app = express()
const connectDB = require('./db/cannectDB')
// const Products = require('./modals/products/products')
const useMiddleWere = require('./middleWers/middlewers')
const port = process.env.PORT || 5000
const getFeaturedProductsCon = require('./Routes/Products/getFeaturedProducts')
const postNewsLatterCon = require('./Routes/NewsLatter/newsLatter')


useMiddleWere(app)
app.use(getFeaturedProductsCon)
app.use(postNewsLatterCon)




app.get('/health', (req, res) => {
    res.send('welcome to my styleByte server ')
})

app.all('*', (req, res, next) => {
    const error = new Error(`${req.url} is not a valid url`)
    error.status = 404
    next(error)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message
    })
})

const main = async () => {
    await connectDB()
    app.listen(port, () => {
        console.log(`server is on in port ${port}`)
    })
}

main()