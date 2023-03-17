const express = require("express");
const cors = require("cors");

const app = express();

//config resposta em json
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//config para CORS

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

//pasta pública de imgs
app.use(express.static("public"));

const conn = require("./db/conn");

//routes
const UserRoutes = require("./routes/UserRoutes");
app.use("/users", UserRoutes);

app.listen(5000);
