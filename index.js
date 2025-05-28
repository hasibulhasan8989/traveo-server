const express = require('express')
const app = express()
const cors= require('cors')
const port = process.env.port || 5000;

app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tourMaster:umDPtb6D9LPdHjyF@cluster0.zsgh3ij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    
    await client.connect();

    const touristSpotCollection=client.db('travelo').collection('touristSpotCollection')

    app.post('/touristSpot',async(req,res)=>{
        console.log(`post is hitting`)
        const newTouristSpot=req.body
        const result= await touristSpotCollection.insertOne(newTouristSpot)
        res.send(result)
    })

    app.get('/touristSpot',async(req,res)=>{
        const query=touristSpotCollection.find()
        const result=await query.toArray()
        res.send(result)
    })
   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})