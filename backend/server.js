const express = require("express");
const app = express();
const PORT = 8000;

require("./database");

const TaskSchema = require("./schemas/TaskSchema");
const NoteSchema = require("./schemas/NoteSchema");
const UserSchema = require("./schemas/UserSchema");

const cors = require("cors");

const jwt = require('jsonwebtoken');
const SECRET_KEY = require("./privateKeys")
const bodyParser = require('body-parser');

// Middleware

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint

//#region AUTHENTICATION & USER_OPTIONS

app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body

    if (password && username) {
      const newUser = new UserSchema({
        username,
        password
      })

      const savedUser = await newUser.save()
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });

      res.status(200).json({ token, user: savedUser })
    } else {
      res.status(400).send("Bad request")
    }
  } catch (error) {
    res.status(500).send("internal error has ocurred");
    console.log(error);
  }
})
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await UserSchema.findOne({ username })

    if (user.password === password) {
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });

      res.status(200).json({ user, token })
    }
  } catch (error) {
    res.status(500).send("internal error has ocurred");
    console.log(error);
  }
})

app.get("/api/verify_user/:token", async (req, res) => {
  try {
    const token = req.params.token

    const decoded = jwt.verify(token, SECRET_KEY);

    res.status(200).json({ message: "valid token" })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.json({ message: "expired token" })
    } else {
      res.json({ message: "invalid token" })
    }
  }
})

app.patch("/api/edit_user", async (req, res) => {
  try {
    const { newUsername, newProfilePicture, userId } = req.body

    const user = await UserSchema.findOne({ _id: userId })

    user.username = newUsername
    user.profilePicture = newProfilePicture

    const savedUser = await user.save()

    res.status(200).json({ user: savedUser })
  } catch (error) {
    res.status(500).send("internal error has ocurred");
    console.log(error);
  }
})


app.get("/api/get_users_by_username/:username", async (req, res) => {
  try {
    const username = req.params.username

    // Expresion regular con la variable username
    const regex = new RegExp(username, 'i'); // La 'i' hace que la búsqueda sea insensible a mayúsculas y minúsculas

    const usersFound = await UserSchema.find({ username: regex })

    res.status(200).json({users: usersFound})
  } catch (error) {
    res.status(500).send("internal error has ocurred");
    console.log(error);
  }
})

//#endregion

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

    const newTaskSchema = new TaskSchema({ body: task });

    const newTask = await newTaskSchema.save();

    res.status(200).json({ newTask });
  } catch (error) {
    res.status(500).send("internal error has ocurred");
    console.log(error);
  }
});

app.get("/api/get_task/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId
    const task = await TaskSchema.findById({ _id: taskId });
    res.status(200).json({ task });
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
})

app.patch("/api/change_task_state", async (req, res) => {
  try {
    const { newTasks, oldTasks } = req.body

    //Comprobar toDo
    newTasks.toDo.forEach(async newTask => {
      if (oldTasks.running.includes(newTask) || oldTasks.completed.includes(newTask)) {
        //El estado de la tarea era diferente a "to-do"
        await TaskSchema.findOneAndUpdate({ _id: newTask }, { $set: { state: "to-do" } })
      }
    })

    //Comprobar running
    newTasks.running.forEach(async newTask => {
      if (oldTasks.toDo.includes(newTask) || oldTasks.completed.includes(newTask)) {
        //El estado de la tarea era diferente a "running"
        await TaskSchema.updateOne({ _id: newTask }, { $set: { state: "running" } })
      }
    })

    //Comprobar completed
    newTasks.completed.forEach(async newTask => {
      if (oldTasks.toDo.includes(newTask) || oldTasks.running.includes(newTask)) {
        //El estado de la tarea era diferente a "completed"
        await TaskSchema.findOneAndUpdate({ _id: newTask }, { $set: { state: "completed" } })
      }
    })

    res.status(200).send("request received")
  } catch (error) {
    res.status(500).send("internal error has ocurred");
    console.log(error);
  }
})

app.delete("/api/delete_task/:id", async (req, res) => {
  try {
    const id = req.params.id

    await TaskSchema.deleteOne({ _id: id })

    res.status(200).send("request received")
  } catch (error) {
    res.status(500).send("internal error has ocurred");
    console.log(error);
  }
})

app.post("/api/edit_task", async (req, res) => {
  try {
    const { newBody, newColor, taskId } = req.body

    const task = await TaskSchema.findOne({ _id: taskId })
    task.color = newColor
    task.body = newBody
    await task.save()

    res.status(200).send("request received")

  } catch (error) {
    res.status(500).send("internal error has ocurred");
    console.log(error);
  }
})

//#endregion

app.listen(PORT, () => {
  console.log(`server on port ${PORT}...`);
});
