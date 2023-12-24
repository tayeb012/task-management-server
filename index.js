const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 12002;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.jh2preg.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });

    const database = client.db("taskManagement");
    const allTask = database.collection("allTask");
    const benefitedUser = database.collection("benefitedUser");

    app.post("/addTask", async (req, res) => {
      const newTask = req.body;
      console.log("new task", newTask);
      const result = await allTask.insertOne(newTask);
      console.log(result);
      res.send(result);
    });

    app.get("/getAllTask", async (req, res) => {
      const cursor = allTask.find();
      const result = await cursor.toArray();
      //   console.log(result);
      res.send(result);
    });

    app.get("/benefitedUser", async (req, res) => {
      const cursor = benefitedUser.find();
      const result = await cursor.toArray();
      //   console.log(result);
      res.send(result);
    });

    app.delete("/deleteTask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allTask.deleteOne(query);
      res.send(result);
    });

    app.put("/updateTask/id/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      // const options = { upsert: true };
      const updatedTask = req.body;
      console.log(updatedTask);
      const task = {
        $set: {
          status: updatedTask.status,
        },
      };
      const result = await allTask.updateOne(filter, task);
      res.send(result);
    });

    app.put("/totalUpdateTask/id/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      // const options = { upsert: true };
      const updatedTask = req.body;
      console.log(updatedTask);
      const task = {
        $set: {
          taskName: updatedTask.taskName,
          taskType: updatedTask.taskType,
          status: updatedTask.status,
          taskDeadline: updatedTask.taskDeadline,
          taskDescription: updatedTask.taskDescription,
        },
      };
      console.log(task);
      const result = await allTask.updateOne(filter, task);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Management server server data");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
