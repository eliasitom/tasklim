import { useContext, useState } from "react";
import "../../stylesheets/routes/note_route/NoteForm.css";
import { UserContext } from "../../contexts/userContext";

const NoteForm = ({ pushNote }) => {
  const { myUser } = useContext(UserContext)

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const submitNote = (e) => {
    e.preventDefault();

    if (title) {
      if (body) {

        fetch("http://localhost:8000/api/post_note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            body,
            createdBy: {
              username: myUser.username,
              profilePicture: myUser.profilePicture
            }
          }),
        })
          .then(response => response.json())
          .then(res => {
            setTitle("")
            setBody("")
            pushNote(res.note)
          })
          .catch((err) => console.log(err));
      } else {
        alert("you must add a body");
      }
    } else {
      alert("you must add a title");
    }
  };

  return (
    <div className="note-form">
      <form onSubmit={submitNote}>
        <input
          placeholder="your note title here..."
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          maxLength={24}
        />
        <textarea
          placeholder="write your note here..."
          maxLength={531}
          onChange={(e) => setBody(e.target.value)}
          value={body}
        />
        <button>submit</button>
      </form>
    </div>
  );
};

export default NoteForm;
