import "../../../stylesheets/routes/tasks_route/my_tasks/Container.css";

import React, { useState, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./Task";

export default function Container({ id, items, pushTask, activeId, pullTask, moveDown, moveUp }) {
  const { myUser } = useContext(UserContext)
  const [newTask, setNewTask] = useState("")

  const { setNodeRef } = useDroppable({
    id,
  });


  const submitTask = (e) => {
    e.preventDefault()

    if (newTask) {
      fetch("https://tasklim-server.onrender.com/api/post_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: newTask,
          createdBy: {
            username: myUser.username,
            profilePicture: myUser.profilePicture
          }
        })
      })
        .then(response => response.json())
        .then(res => {
          pushTask(res.newTask._id)
          setNewTask("")
        })
        .catch(err => console.log(err))
    } else {
      alert("you must add a task");
    }
  }


  if(!items) {
    return (
      <section className="tasks-route-container">
        <p className="tasks-route-container-title">{id}</p>
        <div className="tasks-route-container-tasks-cont" />
      </section>
    )
  }

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <section ref={setNodeRef} className="tasks-route-container">
        <p className="tasks-route-container-title">{id}</p>
        <div className="tasks-route-container-tasks-cont">
          {items.map((id) => (
            <SortableItem 
            key={id} 
            id={id} 
            activeId={activeId} 
            pullTask={pullTask} 
            moveDown={moveDown}
            moveUp={moveUp}
            />
          ))}
        </div>
        {id === "to-do" ? (
          <div className="tasks-route-container-footer">
            <p>New task</p>
            <form onSubmit={submitTask}>
              <input placeholder="Learn JavaScript..." maxLength={621} onChange={e => setNewTask(e.target.value)} value={newTask} />
              <button>submit</button>
            </form>
          </div>
        ) : undefined}
      </section>
    </SortableContext>
  );
}
