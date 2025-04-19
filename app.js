const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const exhbs = require("express-handlebars");
const dbo = require("./db");
const { MongoClient, ObjectId } = require("mongodb"); // Correct import

app.engine(
  "hbs",
  exhbs.engine({ layoutsDir: "views/", defaultLayout: "main", extname: "hbs" })
);
app.set("view engine", "hbs");
app.set("views", "views"); // ✅ Fixed typo (was: "views engine")

app.use(bodyparser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  let database = await dbo.getDatabase();
  const collection = database.collection("books");
  const cursor = collection.find({});
  let books = await cursor.toArray();

  let message = "Inserted Successfully";
  let edit_id = null;
  let edit_book = null;

  if (req.query.edit_id) {
    edit_id = req.query.edit_id; // ✅ Fixed: use req.query, not req.edit_id
    try {
      edit_book = await collection.findOne({ _id: new ObjectId(edit_id) });
    } catch (err) {
      console.error("Invalid ObjectId:", err);
    }
  }

  switch (req.query.status) {
    case "1":
      message = "Inserted Successfully";
      break;
    case "2":
      message = "Updated Successfully";
      break;
    default:
      message = null;
      break;
  }

  res.render("main", { message, books, edit_id, edit_book });
});

app.post("/store_book", async (req, res) => {
  let database = await dbo.getDatabase();
  const collection = database.collection("books");

  let book = {
    title: req.body.title,
    author: req.body.author
  };

  if (req.body.edit_id) {
    // 🔁 Perform update
    await collection.updateOne(
      { _id: new ObjectId(req.body.edit_id) },
      { $set: book }
    );
    return res.redirect("/?status=2");
  } else {
    // ➕ Insert new
    await collection.insertOne(book);
    return res.redirect("/?status=1");
  }
});

app.listen(8000, () => {
  console.log("Listening to 8000 Port");
});
