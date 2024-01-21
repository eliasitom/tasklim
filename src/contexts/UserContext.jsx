import { createContext, useState, useEffect } from "react";
import useMyUser from "../custom_hooks/useMyUser";

export const UserContext = createContext()


export const UserProvider = ({ children }) => {
  const [myUser, setMyUser] = useState(null)
  const myUserObject = useMyUser()

  const [notes, setNotes] = useState([]);

  const [items, setItems] = useState({
    toDo: [],
    running: [],
    completed: [],
  });

  //#region USER

  useEffect(() => {
    const updateUser = async () => {
      try {
        const user = await myUserObject.getMyUser();
        setMyUser(user);
      } catch (error) {
        // Manejar el error si es necesario
        console.error("Error al obtener el usuario:", error);
      }
    };

    if (myUserObject.loading) return;

    // Si myUserObject.myUser es diferente de myUser, actualiza el estado
    if (myUserObject.myUser && myUserObject.myUser !== myUser) {
      updateUser();
    }
  }, [myUser, myUserObject]);

  //#endregion

  //#region NOTES

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

  //#endregion

  //#region TASKS

  useEffect(() => {
    fetch("http://localhost:8000/api/get_tasks", {
      method: "GET"
    })
      .then(response => response.json())
      .then(res => {
        const tasksToDo = res.tasks.filter(current => current.state === "to-do")
        const tasksRunning = res.tasks.filter(current => current.state === "running")
        const tasksCompleted = res.tasks.filter(current => current.state === "completed")

        setItems({
          toDo: tasksToDo.map(task => task._id),
          running: tasksRunning.map(task => task._id),
          completed: tasksCompleted.map(task => task._id)
        });
      })
      .catch(err => console.log(err))
  }, [])

  //#endregion


  return (
    <UserContext.Provider value={{ myUser, setMyUser, notes, setNotes, items, setItems }}>
      {children}
    </UserContext.Provider>
  )
}