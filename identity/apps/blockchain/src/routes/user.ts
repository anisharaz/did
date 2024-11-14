import { Router } from "express";

export const user = Router();

user.get("/", (req, res) => {
  res.send("User route");
});
