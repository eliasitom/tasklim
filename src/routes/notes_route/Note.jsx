import "../../stylesheets/routes/note_route/Note.css";
import { useState, useContext } from "react";

import { FaTrash, FaPalette, FaEdit } from "react-icons/fa";
import { UserContext } from "../../contexts/userContext";

const Note = ({ data, pullNote }) => {
  const { setNotes } = useContext(UserContext)

  const [title, setTitle] = useState(data.title)
  const [body, setBody] = useState(data.body)
  const [color, setColor] = useState(data.color)

  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(data.title);
  const [newBody, setNewBody] = useState(data.body);


  const mainColors = [
    "rgb(225, 179, 88)",
    "rgb(225, 88, 88)",
    "rgb(145, 225, 88)",
    "rgb(225, 88, 182)",
  ];
  const secondaryColors = [
    "rgb(207, 148, 81)",
    "rgb(193, 76, 76)",
    "rgb(141, 194, 76)",
    "rgb(196, 76, 158)",
  ];
  const [animationMode, setAnimationMode] = useState(false)

  const handleColor = () => {
    setAnimationMode(false)
    setAnimationMode(true)
    setTimeout(() => {
      setAnimationMode(false)
    }, 200);


    const newColor = (color + 1) % mainColors.length
    setColor(newColor)

    setNotes(prev => {
      return prev.map(elem => {
        if (elem._id === data._id) {
          elem.color = newColor
        }
        return elem
      })
    })

    fetch("https://tasklim-server.onrender.com/api/edit_note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newTitle: title,
        newBody: body,
        newColor,
        noteId: data._id,
      }),
    })
      .catch((err) => console.log(err));
  };

  const handleChanges = (e) => {
    e.preventDefault()

    if (newTitle) {
      if (newBody) {
        fetch("https://tasklim-server.onrender.com/api/edit_note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newTitle,
            newBody,
            newColor: color,
            noteId: data._id,
          }),
        })
          .then(response => response.json())
          .then(res => {
            setTitle(newTitle)
            setBody(newBody)
            setColor(color)

            handleCancel()

            setNotes(prev => {
              return prev.map(elem => {
                if (elem._id === data._id) {
                  elem.title = newTitle
                  elem.body = newBody
                  elem.color = color
                }
                return elem
              })
            })
          })
          .catch((err) => console.log(err));
      } else {
        alert("you must add a body");
      }
    } else {
      alert("you must add a title");
    }
  };

  const handleEditMode = () => {
    setEditMode(true)
    setNewTitle(title)
    setNewBody(body)
  }

  const handleCancel = () => {
    setNewBody("")
    setNewTitle("")
    setEditMode(false)
  }

  const handleDelete = () => {
    fetch(`https://tasklim-server.onrender.com/api/delete_note/${data._id}`, {
      method: "DELETE"
    })
      .then(() => pullNote(data._id))
      .catch(err => console.log(err))
  }


  if (!editMode) {
    return (
      <div className={`note ${animationMode ? "note-shake" : ""}`} style={{ backgroundColor: mainColors[color] }}>
        <p
          className="note-title"
          style={{ backgroundColor: secondaryColors[color] }}
        >
          {title}
        </p>
        <p
          className="note-body"
          style={{ backgroundColor: secondaryColors[color] }}
        >
          {body}
        </p>
        <div className="note-options">
          <FaTrash onClick={handleDelete} />
          <FaPalette onClick={handleColor} />
          <FaEdit onClick={handleEditMode} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="note" style={{ backgroundColor: mainColors[color] }}>
        <form onSubmit={handleChanges}>
          <input
            placeholder="something here..."
            maxLength={24}
            onChange={(e) => setNewTitle(e.target.value)}
            value={newTitle}
            style={{ backgroundColor: secondaryColors[color] }}
          />
          <textarea
            placeholder="something here..."
            maxLength={531}
            onChange={(e) => setNewBody(e.target.value)}
            value={newBody}
            style={{ backgroundColor: secondaryColors[color] }}
          />
          <div className="note-edit-endpoints">
            <button onClick={handleCancel}>cancel</button>
            <button type="submit">save</button>
          </div>
        </form>
      </div>
    );
  }
};

export default Note;
