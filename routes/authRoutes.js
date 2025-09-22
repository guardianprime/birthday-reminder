const authRoutes = require("express").Router();

authRoutes.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Dummy authentication logic (replace with real logic)
  if (username === "admin" && password === "password") {
    req.session.user = { username };
    return res.render("index");
  }
  res.status(401).send("Unauthorized");
});

authRoutes.post("/signup", (req, res) => {
  const { username, password } = req.body;
  // TODO: Implement signup logic
  res.render("/login");
});
module.exports = authRoutes;
