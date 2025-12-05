function notFound(req, res) {
  res.status(404).json({ error: "Not found" });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: err.message || "Server error" });
}

module.exports = { notFound, errorHandler };
