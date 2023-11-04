const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const port = process.env.PORT || 5000
const jwt = require('jsonwebtoken')

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())



const verifyToken = async (req, res, next) => {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).send({ message: 'unauthorized' })
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'forbidden' })
        }
        req.user = decoded
        next()
    })

}




app.get('/', (req, res) => {
    res.send('this is home page')
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@cluster0.8mn4lkn.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8mn4lkn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db("digitalDB");
        const shirtCollection = database.collection("shirt");
        const clothCollection = database.collection("cloth");
        const customerProductsCollection = database.collection("customerProducts");


        // token related
        app.post('/login', async (req, res) => {
            const user = req.body
            const token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1h' });
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: false
                })
                .send({ success: true })
        })


        app.post('/logout', async (req, res) => {

            res.clearCookie('token', { maxAge: 0 }).send({ logout: true })
        })


        // cloth related
        app.get('/cloth', async (req, res) => {

            const page = Number(req.query.page)
            const limit = Number(req.query.limit)

            const result = await clothCollection.find().skip(page * limit).limit(limit).toArray()
            res.send(result)
        })

        app.get('/clothData', async (req, res) => {
            const clothData = await clothCollection.estimatedDocumentCount()
            res.send({ count: clothData })
        })


        app.post('/shirt', async (req, res) => {
            const newProduct = req.body
            const result = await shirtCollection.insertOne(newProduct)
            res.send(result)
        })

        app.get('/shirt', async (req, res) => {
            const query = shirtCollection.find()
            const result = await query.toArray()
            res.send(result)
        })

        app.get('/shirt/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await shirtCollection.findOne(query)
            res.send(result)
        })

        app.put('/shirt/:id', async (req, res) => {
            const id = req.params.idP
            const update = req.body
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    name: update.name,
                    brand: update.brand,
                    price: update.price,
                    quality: update.quality,
                    photo: update.photo
                }
            }
            const result = await shirtCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        app.delete('/shirt/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await shirtCollection.deleteOne(query)
            res.send(result)
        })


        // customer products
        app.post('/myproducts', async (req, res) => {
            const newProducts = req.body
            const result = await customerProductsCollection.insertOne(newProducts)
            res.send(result)
        })

        app.get('/myproducts', verifyToken, async (req, res) => {

            const user = req.user
            const userEmail = req.query.email
            if (user.email !== userEmail) {
                return res.send({ message: 'unauthorized' })
            }
            const query = { email: userEmail }
            const result = await customerProductsCollection.find(query).toArray()
            res.send(result)
        })

        app.delete('/myproducts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await customerProductsCollection.deleteOne(query)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log(`app running on port ${port}`)
})