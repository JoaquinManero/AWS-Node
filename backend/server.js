import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import { getFiles, uploadFile, getFileURL, downloadFile } from "./s3.js";

const app = express();

app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

app.get("/", (req, res) => {
  console.log("Solicitud recibida en /");
  res.json("Hello from the backend!!");
});

app.post("/files", async (req, res) => {
  const result = await uploadFile(req.files.file);
  console.log(
    "Solicitud de POST recibida en /files. Archivo almacenado correctamente en AWS S3!",
    result
  );
});

app.get("/files", async (req, res) => {
  const result = await getFiles();
  res.json({ result });

  console.log(
    "Solicitud de GET recibida de datos almacenados en AWS S3 en /files",
    result
  );
});

app.get("/files/:fileName", async (req, res) => {
  const result = await getFileURL(req.params.fileName);
  res.json({
    url: result,
  });
  console.log(
    "Solicitud de GET recibida de datos almacenados en AWS S3 en /files/:fileName"
  );
});

app.get("/download/:fileName", async (req, res) => {
  await downloadFile(req.params.fileName);
  res.json({ message: "Archivo descargado correctamente." });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend en ejecución escuchando en el puerto ${PORT}`);
});
