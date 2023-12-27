const express = require("express");
const app = express();
const PORT = 8000;

require("./database");

const TaskSchema = require("./schemas/TaskSchema");
const NoteSchema = require("./schemas/NoteSchema");

const cors = require("cors");

// Middleware

app.use(cors());
app.use(express.json());

// Endpoint

//#region NOTES
app.post("/api/post_note", async (req, res) => {
  try {
    const { title, body } = req.body;

    const note = new NoteSchema({
      title,
      body,
    });

    const savedNote = await note.save();

    res.status(200).json({ note: savedNote });
  } catch (error) {
    res.status(500).send("internal error has ocurred");
    console.log(error);
  }
});

app.get("/api/get_notes", async (req, res) => {
  try {
    const notes = await NoteSchema.find({});

    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).send("internal error has ocurred");
    console.log(error);
  }
});

app.post("/api/edit_note", async (req, res) => {
  try {
    const { newTitle, newBody, newColor, noteId } = req.body;

    let note = await NoteSchema.findOne({ _id: noteId });

    note.title = newTitle;
    note.body = newBody;
    note.color = newColor;

    await note.save();

    res.status(200).json({ note });
  } catch (error) {
    res.status(500).send("internal error has ocurred");
    console.log(error);
  }
});

app.delete("/api/delete_note/:note_id", async (req, res) => {
  try {
    const noteId = req.params.note_id;
    await NoteSchema.deleteOne({ _id: noteId });
    const notes = await NoteSchema.find({});

    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).send("internal error has ocurred");
    console.log(error);
  }
});
//#endregion

//#region TASKS

app.post("/api/post_task", async (req, res) => {
  try {
    const { task } = req.body;

    const newTask = new TaskSchema({ body: task });

    await newTask.save();

    res.status(200).json({ newTask });
  } catch (error) {
    res.status(500).send("internal error has ocurred");
    console.log(error);
  }
});

app.get("/api/get_tasks", async (req, res) => {
  try {
    const tasks = await TaskSchema.find({});
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).send("internal error has ocurred");
    console.log(error);
  }
});

//#endregion

app.listen(PORT, () => {
  console.log(`server on port ${PORT}...`);
});
