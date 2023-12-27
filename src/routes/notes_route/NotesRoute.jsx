import "../../stylesheets/routes/note_route/NotesRoute.css";

import { useEffect, useState } from "react";

import Note from "./Note";
import NoteForm from "./NoteForm";

const NotesRoute = () => {
  const [notes, setNotes] = useState([]);

  const pullNote = (noteId) => {
    const newNotes = [...notes].filter((current) => current._id !== noteId);
    setNotes(newNotes);
  };
  const pushNote = (noteData) => {
    const newNotes = [...notes, {title: noteData.title, body: noteData.body, _id: noteData._id, color: noteData.color}]

    setNotes(newNotes)
  }

  const getNotes = () => {
    fetch("http://localhost:8000/api/get_notes", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((res) => setNotes(res.notes))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <main className="notes-route-main">
      <div className="notes-route">
      <p className="notes-route-title">My notes:</p>
      <section className="notes-container">
        <NoteForm pushNote={pushNote} />
        {notes.map((current, index) => (
          <Note
            key={current._id}
            data={current}
            pullNote={() => pullNote(current._id)}
          />
        ))}
      </section>
      </div>
    </main>
  );
};

export default NotesRoute;
