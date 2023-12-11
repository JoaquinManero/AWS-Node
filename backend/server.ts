const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

app.get("/", (req, res) => {
  console.log("Solicitud recibida en /");
  res.json("Hello from the backend!");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend en ejecución escuchando en el puerto ${PORT}`);
});
