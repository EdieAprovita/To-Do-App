const express = require('express');
const router = express.Router();

const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/todo');

//CRUD TODOS

router.get('/todo', getNotes);
router.get('/todo/:id', getNote);
router.post('/todo/create', createNote);
router.put('/todo/edit/:id', updateNote);
router.delete('/todo/delete/:id', deleteNote);

module.exports = router;
