const service = require("../services/program.service");

exports.createProgram = async (req, res, next) => {
  try {
    const program = await service.create(req.body);
    res.status(201).json(program);
  } catch (err) {
    next(err);
  }
};

exports.getPrograms = async (req, res, next) => {
  try {
    const programs = await service.getAll();
    res.json(programs);
  } catch (err) {
    next(err);
  }
};

exports.getProgram = async (req, res, next) => {
  try {
    const program = await service.getById(req.params.id);
    if (!program) return res.status(404).json({ error: "Program not found" });

    res.json(program);
  } catch (err) {
    next(err);
  }
};

exports.updateProgram = async (req, res, next) => {
  try {
    const program = await service.update(req.params.id, req.body);
    if (!program) return res.status(404).json({ error: "Program not found" });

    res.json(program);
  } catch (err) {
    next(err);
  }
};

exports.deleteProgram = async (req, res, next) => {
  try {
    const program = await service.delete(req.params.id);
    if (!program) return res.status(404).json({ error: "Program not found" });

    res.json({ message: "Program deleted successfully" });
  } catch (err) {
    next(err);
  }
};
