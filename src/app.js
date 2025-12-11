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

///// home page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Pulse</title></head>
      <body style="font-family:system-ui;text-align:center;padding:3rem">
        <h1>Pulse API</h1>
        <p>Server is running ✅</p>
        <p><a href="/health">/health</a></p>
      </body>
    </html>
  `);
});


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





