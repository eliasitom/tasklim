import "../../stylesheets/routes/tasks_route/Container.css";

import React, {useState} from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./Task";

export default function Container({ id, items, pushTask, activeId, pullTask }) {
  const [newTask, setNewTask] = useState("")

  const { setNodeRef } = useDroppable({
    id,
  });


  const submitTask = (e) => {
    e.preventDefault()

    if(newTask) {
      fetch("http://localhost:8000/api/post_task", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({task: newTask})
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
            <SortableItem key={id} id={id} activeId={activeId} pullTask={pullTask}/>
          ))}
        </div>
        {id === "to-do" ? (
          <div className="tasks-route-container-footer">
            <p>New task</p>
            <form onSubmit={submitTask}>
              <input placeholder="Learn JavaScript..." onChange={e => setNewTask(e.target.value)} value={newTask}/>
              <button>submit</button>
            </form>
          </div>
        ) : undefined}
      </section>
    </SortableContext>
  );
}
