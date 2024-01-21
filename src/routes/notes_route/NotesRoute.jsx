import "../../stylesheets/routes/note_route/NotesRoute.css";

import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";

import Note from "./Note";
import NoteForm from "./NoteForm";

const NotesRoute = () => {
  const navigate = useNavigate()
  const { notes, setNotes } = useContext(UserContext)


  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem("user")))
    if (JSON.parse(localStorage.getItem("user")) === null) {
      navigate("/auth")
    }
  }, [])


  const pullNote = (noteId) => {
    const newNotes = [...notes].filter((current) => current._id !== noteId);
    setNotes(newNotes);
  };
  const pushNote = (noteData) => {
    const newNotes = [...notes, { title: noteData.title, body: noteData.body, _id: noteData._id, color: noteData.color }]

    setNotes(newNotes)
  }



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
