const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json("Hello from the backend!");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend en ejecución escuchando en el puerto ${PORT}`);
});
