const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

const { Notebook, Note } = require('./models');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/notebookdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.set('debug', true);

// Create a new notebook
app.post('/api/notebooks', ({ body }, res) => {
  Notebook.create(body)
    .then(dbNotebookData => {
      res.json(dbNotebookData);
    })
    .catch(err => {
      res.json(err);
    });
});

// Retrieve all notebooks
app.get('/api/notebooks', (req, res) => {
  Notebook.find()
    .then(dbNotebookData => {
      res.json(dbNotebookData);
    })
    .catch(err => {
      res.json(err);
    });
});

// Create a new note for a notebook
// Using the 'notebookId' in the params, find the notebook from the collection
// Add the 'req.body' to the 'notes' subdocument array in the notebook
//
// YOUR CODE HERE
app.post('/api/notebooks/:notebookId/notes', (req, res) => {
  Notebook.findOneAndUpdate(
              { _id: req.params.notebookId },
              { $addToSet: { notes: req.body } },
              { runValidors: true, new: true }
            )
          .then(notebookData => {
            if (!notebookData) {
              return res.status(404).json({ message: 'No notebook found with this id!' });
              
            }
            res.json(notebookData);
          })
          .catch(err => res.json(err));
});

// Delete a note from a notebook
// Using the 'notebookId' and 'noteId' in the params, find the notebook that contains the note
// Remove the note from the 'notes' subdocument array in the notebook
//
// YOUR CODE HERE
//
app.delete('/api/notebooks/:notebookId/notes/:noteId', (req, res) => {
  Notebook.findOneAndUpdate(
    { _id: req.params.notebookId },
    { $pull: { notes: req.body } },
    { runValidors: true, new: true }
  )
.then(notebookData => {
  if (!notebookData) {
    return res.status(404).json({ message: 'No notebook found with this id!' });
    
  }
  res.json(notebookData);
})
.catch(err => res.json(err));
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
