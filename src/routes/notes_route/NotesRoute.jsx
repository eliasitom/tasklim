import "../../stylesheets/routes/note_route/NotesRoute.css";

import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

import Note from "./Note";
import NoteForm from "./NoteForm";
import useDimensions from "../../custom_hooks/useDimensions";

const NotesRoute = () => {
  const navigate = useNavigate()
  const { notes, setNotes } = useContext(UserContext)

  const { windowWidth } = useDimensions()
  const [currentNote, setCurrentNote] = useState(0)


  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem("user")))
    if (JSON.parse(localStorage.getItem("user")) === null) {
      navigate("/auth")
    }
  }, [])


  const pullNote = (noteId) => {
    const noteIndex = notes.findIndex(elem => elem._id === noteId)
    if (currentNote === noteIndex) {
      setCurrentNote(prev => {
        if (prev === 0) return prev
        else return prev - 1
      })
    }

    const newNotes = [...notes].filter((current) => current._id !== noteId);
    setNotes(newNotes);
  };
  const pushNote = (noteData) => {
    const newNotes = [...notes, { title: noteData.title, body: noteData.body, _id: noteData._id, color: noteData.color }]

    setNotes(newNotes)
  }

  const nextNote = () => {
    setCurrentNote(prev => {
      if (prev === notes.length - 1) return prev
      else return prev + 1
    })
  }
  const prevNote = () => {
    setCurrentNote(prev => {
      if (prev === 0) return prev
      else return prev - 1
    })
  }



  return (
    <main className="notes-route-main">
      <div className="notes-route">
        {
          windowWidth > 660 ?
            <p className="notes-route-title">My notes:</p>
            : undefined
        }
        <section className="notes-container">
          <NoteForm pushNote={pushNote} />
          {
            notes.length > 0 ?
              <>
                {
                  windowWidth > 1150 ?
                    notes.map((current, index) => (
                      <Note
                        key={current._id}
                        data={current}
                        pullNote={pullNote}
                      />
                    ))
                    :
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                      <Note
                        key={notes[currentNote]._id}
                        data={notes[currentNote]}
                        pullNote={pullNote}
                      />
                      <div className="notes-nav-bar">
                        <button onClick={prevNote}>&lt;</button>
                        <p>{currentNote + 1}</p>
                        <p> / </p>
                        <p>{notes.length}</p>
                        <button onClick={nextNote}>&gt;</button>
                      </div>
                    </div>
                }
              </>
              : undefined
          }
        </section>
      </div>
    </main>
  );
};

export default NotesRoute;
