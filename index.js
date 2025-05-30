const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.port || 5000;

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://tourMaster:umDPtb6D9LPdHjyF@cluster0.zsgh3ij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const touristSpotCollection = client
      .db("travelo")
      .collection("touristSpotCollection");

      const countries=client.db("travelo").collection('countries')

    app.post("/touristSpot", async (req, res) => {
      console.log(`post is hitting`);
      const newTouristSpot = req.body;
      const result = await touristSpotCollection.insertOne(newTouristSpot);
      res.send(result);
    });

    app.get("/touristSpot", async (req, res) => {
      const query = touristSpotCollection.find();
      const result = await query.toArray();
      res.send(result);
    });
    app.get(`/viewDetails/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    });

    app.get(`/myList/:email`, async (req, res) => {
      const userEmail = req.params.email;
      const query = { email: userEmail };
      const result = await touristSpotCollection.find(query).toArray();
      res.send(result);
    });

    app.delete(`/touristSpot/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.deleteOne(query);
      res.send(result);
    });

    app.put(`/update/:id`, async (req, res) => {
      const newSpotData = req.body;
      const id = req.params.id;
      const query={_id : new ObjectId(id)}

      console.log(newSpotData, id);

      const updatedSpot = {
        $set: {
          tourists_spot_name: newSpotData.tourists_spot_name,

          image: newSpotData.image,

          country_Name: newSpotData.country_Name,
          location: newSpotData.location,
          average_cost: newSpotData.average_cost,
          seasonality: newSpotData.seasonality,
          travel_time: newSpotData.travel_time,
          totalVisitorsPerYear: newSpotData.totalVisitorsPerYear,
          description: newSpotData.description,
        },
      };

      const option ={upsert : true}

      const result= await touristSpotCollection.updateOne(query,updatedSpot,option)

      res.send(result)
    


    });

    app.post('/country',async(req,res)=>{
      const country=req.body;
      const result=await  countries.insertOne(country)
      res.send(result)
    })

    app.get('/country',async(req,res)=>{
      const result=await countries.find().toArray();
      res.send(result)
    })

    app.get('/tourPlaces/:cname',async (req,res)=>{
      const countryName=req.params.cname;
      const query={country_Name:countryName}
      const result=await touristSpotCollection.find(query).toArray();
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
