import "./App.css";

import { Route, Routes, useNavigate } from "react-router-dom";
import HomeRoute from "./routes/HomeRoute";
import NotesRoute from "./routes/notes_route/NotesRoute";
import TasksRoute from "./routes/tasks_route/TasksRoute";

const App = () => {
  const navigate = useNavigate()
  
  return (
    <>
      <header>
        <h1>Mini note</h1>

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

        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/notes" element={<NotesRoute />} />
          <Route path="/tasks" element={<TasksRoute />} />
        </Routes>
    </>
  );
};

export default App;
