const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('this is home page')
})

// digitalShop
// 9lj0VvwweYHh418T



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
            const id = req.params.id
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