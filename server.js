const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const { ObjectId } = require("mongodb");
const app = express();
// -------------
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* =========== */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.izfe9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    client.connect();
    const userCollection = client.db("todo").collection("users");
    //  store database
    app.post("/todo", async (req, res) => {
      const result = await userCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/todo", async (req, res) => {
      const data = await userCollection.find({}).toArray();
      res.send(data);
    });

    //   deleted single data
    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    //  update data
    app.put("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const { text, newText } = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: { text: newText },
      };
      console.log(updateDoc);
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

// ------------------
app.get("/", (req, res) => {
  res.send("Todo List app is Running **** ___ **** ");
});

app.listen(port, () => {
  console.log("todo app running port --> ", port);
});
