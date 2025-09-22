// ...existing code...
const authRoutes = require("express").Router();

authRoutes.post("/login", (req, res) => {
  // accept several possible field names from different forms
  const email = req.body.email || req.body.loginEmail || req.body.username;
  const password = req.body.password || req.body.loginPassword;
  console.log(email, password);
  // render the homepage (or use res.redirect("/") if you don't need to pass data)
  res.render("index");
});

authRoutes.post("/signup", (req, res) => {
  const name = req.body.signupName || req.body.username || req.body.name;
  const email = req.body.signupEmail || req.body.email;
  const password = req.body.signupPassword || req.body.password;
  console.log(name, email, password);
  // TODO: implement signup (persist user), then render or redirect
  res.render("index");
});
module.exports = authRoutes;
// ...existing code...
