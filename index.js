import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import "dotenv/config";
import TodoRoute from "./routes/TodoRoute.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(TodoRoute);

const port = process.env.PORT || 5000;
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server listening on port ${port}`);
});
