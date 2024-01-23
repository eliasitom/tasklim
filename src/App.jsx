import "./App.css";

import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import HomeRoute from "./routes/home_route/HomeRoute";
import NotesRoute from "./routes/notes_route/NotesRoute";
import TasksRoute from "./routes/tasks_route/my_tasks/TasksRoute";
import AuthenticationRoute from "./routes/authentication_route/AuthenticationRoute";
import SharedTasksRoute from "./routes/tasks_route/shared_tasks/SharedTasksRoute"




const App = () => {
  const navigate = useNavigate()



  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user")) === null) {
      navigate("/auth")
    } else {
      const authToken = localStorage.getItem("authToken")
      fetch(`http://localhost:8000/api/verify_user/${authToken}`, {
        method: "GET"
      })
        .then(response => response.json())
        .then(res => {
          if (res.message === "invalid token" || res.message === "expired token") {
            navigate("/auth")
          }
        })
        .catch(error => console.log(error))
    }
  }, [])

  const handleTitleClick = () => {
    if (window.location.pathname === "/") {
      window.location.reload()
    } else {
      navigate("/")
    }
  }


  const handleTitle = () => {
    if (window.location.pathname === "/auth") {
      return (
        <header>
          <h1>Mini note</h1>
        </header>
      )
    }
    else {
      return (
        <header>
          <h1 onClick={handleTitleClick} style={{ cursor: "pointer" }}>tasklim</h1>

          <div>
            <button
              className={`${window.location.pathname == "/notes" ? "nav-bar-button-active" : null}`}
              onClick={() => navigate("/notes")}>
              my notes
            </button>
            <button
              className={`${window.location.pathname == "/tasks" ? "nav-bar-button-active" : null}`}
              onClick={() => navigate("/tasks")}>
              my tasks
            </button>
          </div>
        </header>
      )
    }
  }

  return (
    <>
      {
        handleTitle()
      }
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/notes" element={<NotesRoute />} />
        <Route path="/tasks" element={<TasksRoute />} />
        <Route path="/shared_kanban/:kanbanName" element={<SharedTasksRoute />} />
        <Route path="/auth" element={<AuthenticationRoute />} />
      </Routes>
    </>
  );
};

export default App;
