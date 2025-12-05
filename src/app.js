const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
// at top with other requires
const path = require('path');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// routes
app.use("/api", routes);

// health check
app.get("/health", (req, res) => res.json({ ok: true }));

// 404 + error handler
app.use(notFound);
app.use(errorHandler);
// below app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

module.exports = app;





