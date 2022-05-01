const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cav0o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});
async function run() {
    try {
        await client.connect();
        const fruitsCollection = client
            .db("dbFruits")
            .collection("fruitsNinja");

        // get request
        // http://localhost:4000/fruits
        app.get("/fruits", async (req, res) => {
            const query = req.query;
            const cursor = fruitsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // post request
        // http://localhost:4000/fruit
        app.post("/fruit", async (req, res) => {
            const data = req.body;
            const result = await fruitsCollection.insertOne(data);
            res.send(result);
        });

        // update operation
        // http://localhost:4000/fruit/626ef3f9868ff954c0e3c9d3
        app.put("/fruit/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ...data,
                },
            };
            const result = await fruitsCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.send(result);
        });

        // delete operation
        app.delete("/fruit/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await fruitsCollection.deleteOne(query);
            res.send(result);
        });
    } finally {
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server running");
});

app.listen(port, () => {
    console.log("port kaj kortese", port);
});
