import express from "express";
import { user } from "./routes/user";

const app = express();
const PORT = 8080;

// To access the request body as json
app.use(express.json());

// Routes
app.use("/user", user);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
