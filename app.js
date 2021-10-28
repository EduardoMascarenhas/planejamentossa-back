const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
require("dotenv").config();
// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const logRoutes = require("./routes/log");
const emailRoutes = require("./routes/email");
const categoryRoutes = require("./routes/category");
const blogRoutes = require("./routes/blog");
const eixoRoutes = require("./routes/eixo");
const projetoRoutes = require("./routes/projeto");
const cartaRoutes = require("./routes/carta");
const sliderRoutes = require("./routes/slider");
const bannerRoutes = require("./routes/banner");

// app
const app = express();

// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB Connected"));

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", logRoutes);
app.use("/api", emailRoutes);
app.use("/api", categoryRoutes);
app.use("/api", blogRoutes);
app.use("/api", eixoRoutes);
app.use("/api", projetoRoutes);
app.use("/api", cartaRoutes);
app.use("/api", sliderRoutes);
app.use("/api", bannerRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
