import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("your-database-name");
  if (req.method === "POST") {
    const newClient = req.body;
    await db.collection("clients").insertOne(newClient);
    res.status(201).json({ message: "Client added successfully!" });
  } else if (req.method === "GET") {
    const clients = await db.collection("clients").find({}).toArray();
    res.status(200).json(clients);
  }
}
