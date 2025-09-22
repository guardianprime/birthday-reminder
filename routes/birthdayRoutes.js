const birthdayRoutes = require("express").Router();

birthdayRoutes.get("/add", (req, res) => {
  console.log("working!!");
  res.render("add");
});

birthdayRoutes.post("/add", (req, res) => {
  const { name, date, email } = req.body;
  if (!name || !date) {
    return res.status(400).send("Name and date are required");
  }
  const list = readBirthdays();
  list.push({ id: Date.now(), name, date, email: email || null });
  writeBirthdays(list);
  res.redirect("/");
});

birthdayRoutes.post("/delete/:id", (req, res) => {
  const id = Number(req.params.id);
  let list = readBirthdays();
  list = list.filter((b) => b.id !== id);
  writeBirthdays(list);
  res.redirect("/");
});

module.exports = birthdayRoutes;
