const Todo = require('../models/Todo');

exports.getNotes = async (req, res) => {
  try {
    const notes = await Todo.find();
    res.status(200).json({ notes });
  } catch (error) {
    res.status(400).json({ message: `${error}` });
  }
};

exports.getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Todo.findById(id);
    res.status(200).json({ note });
  } catch (error) {
    res.status(400).json({ message: `${error}` });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { title, content, author, date } = req.body;
    const note = await Todo.create({ title, content, author, date });
    res.status(201).json({ note });
  } catch (error) {
    res.status(400).json({ message: `${error}` });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.status(200).json({ message: 'Deleted note' });
  } catch (error) {
    res.status(400).json({ message: `${error}` });
  }
};
