import "./App.css";

import { Route, Routes, useNavigate } from "react-router-dom";
import HomeRoute from "./routes/HomeRoute";
import NotesRoute from "./routes/notes_route/NotesRoute";
import TasksRoute from "./routes/tasks_route/TasksRoute";
import AuthenticationRoute from "./routes/authentication_route/AuthenticationRoute";
import { useEffect } from "react";

const App = () => {
  const navigate = useNavigate()


  useEffect(() => {
    const authToken = localStorage.getItem("authToken")
    fetch(`http://localhost:8000/api/verify_user/${authToken}`, {
      method: "GET"
    })
    .then(response => response.json())
    .then(res => {
      console.log(res)
      if(res.message === "invalid token" || res.message === "expired token") {
        navigate("/auth")
      }
    })
    .catch(error => console.log(error))
  }, [])

  return (
    <>
      {
        window.location.pathname === "/auth" ?
          <header>
            <h1>Mini note</h1>
          </header> :
          <header>
            <h1 onClick={() => navigate("/")} style={{cursor: "pointer"}}>Mini note</h1>

            <div>
              <button
                className={`${window.location.pathname == "/notes" ? "nav-bar-button-active" : null}`}
                onClick={() => navigate("/notes")}>
                notes
              </button>
              <button
                className={`${window.location.pathname == "/tasks" ? "nav-bar-button-active" : null}`}
                onClick={() => navigate("/tasks")}>
                tasks
              </button>
            </div>
          </header>
      }
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/notes" element={<NotesRoute />} />
        <Route path="/tasks" element={<TasksRoute />} />
        <Route path="/auth" element={<AuthenticationRoute />} />
      </Routes>
    </>
  );
};

export default App;
