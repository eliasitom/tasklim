import "../../../stylesheets/routes/tasks_route/my_tasks/TasksRoute.css";

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/userContext";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Container from "./Container";
import { Item } from "./Task";



const defaultAnnouncements = {
  onDragStart(id) {
    console.log(`Picked up draggable item ${id}.`);
  },
  onDragOver(id, overId) {
    if (overId) {
      console.log(
        `Draggable item ${id} was moved over droppable area ${overId}.`
      );
      return;
    }

    console.log(`Draggable item ${id} is no longer over a droppable area.`);
  },
  onDragEnd(id, overId) {
    if (overId) {
      console.log(
        `Draggable item ${id} was dropped over droppable area ${overId}`
      );
      return;
    }

    console.log(`Draggable item ${id} was dropped.`);
  },
  onDragCancel(id) {
    console.log(`Dragging was cancelled. Draggable item ${id} was dropped.`);
  }
};

export default function TasksRoute() {
  const navigate = useNavigate()

  const { items, setItems } = useContext(UserContext)
  const [newItems, setNewItems] = useState(null)
  const [activeId, setActiveId] = useState();




  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user")) === null) {
      navigate("/auth")
    }
  }, [])



  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );


  const pushTask = (newTask) => {
    const newTasks = {
      toDo: [...items.toDo, newTask],
      running: items.running,
      completed: items.completed
    }
    setItems(newTasks)
  }

  const handlePullTask = (id, state) => {
    fetch(`https://tasklim-server.onrender.com/api/delete_task/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setItems(prev => {
          const newItems = {
            toDo: state === "to-do" ? prev.toDo.filter(elem => elem !== id) : prev.toDo,
            running: state === "running" ? prev.running.filter(elem => elem !== id) : prev.running,
            completed: state === "completed" ? prev.completed.filter(elem => elem !== id) : prev.completed
          }
          return newItems
        })
      })
  }

  // {
  //   toDo: [],
  //   running: [],
  //   completed: [],
  // }

  const handleMoveUp = (taskId, currentState) => {
    const newItems_ = {
      toDo: currentState === "running" ? [...items.toDo, taskId] : items.toDo,

      running: currentState === "running" ?
        { ...items }.running.filter(elem => elem !== taskId) :
        currentState === "completed" ? [...items.running, taskId] : items.running,

      completed: currentState === "completed" ?
        { ...items }.completed.filter(elem => elem !== taskId) :
        items.completed
    }

    setNewItems(newItems_)
  }

  const handleMoveDown = (taskId, currentState) => {
    const newItems_ = {
      toDo: currentState === "to-do" ? { ...items }.running.filter(elem => elem !== taskId) : items.toDo,

      running: currentState === "running" ?
        { ...items }.running.filter(elem => elem !== taskId) : currentState === "to-do" ?
          [...items.running, taskId] :
          items.running,

      completed: currentState === "running" ? [...items.completed, taskId] : items.completed
    }

    setNewItems(newItems_)
  }

  useEffect(() => {
    if (!newItems || !items) return

    fetch("https://tasklim-server.onrender.com/api/change_task_state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldTasks: items, newTasks: newItems })
    })
      .then(() => setItems(newItems))
      .catch(err => console.log(err))
  }, [newItems])



  return (
    <div className="tasks-route-main">
      <div className="tasks-route">
        <DndContext
          announcements={defaultAnnouncements}
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Container
            id="to-do"
            items={items.toDo}
            activeId={activeId}
            pushTask={pushTask}
            pullTask={id => handlePullTask(id, "to-do")}
            moveDown={handleMoveDown}
            moveUp={handleMoveUp}
          />
          <Container
            id="running"
            items={items.running}
            activeId={activeId}
            pullTask={id => handlePullTask(id, "running")}
            moveDown={handleMoveDown}
            moveUp={handleMoveUp}
          />
          <Container
            id="completed"
            items={items.completed}
            activeId={activeId}
            pullTask={id => handlePullTask(id, "completed")}
            moveDown={handleMoveDown}
            moveUp={handleMoveUp}
          />
          <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
        </DndContext>
      </div>
    </div>
  );

  function findContainer(id) {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(id));
  }

  function handleDragStart(event) {
    const { active } = event;
    const { id } = active;

    setActiveId(id);
  }

  function handleDragOver(event) {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    const draggingRect = active.rect

    // Find the containers
    const activeContainer = findContainer(id);
    let overContainer = findContainer(overId);

    if (overContainer === undefined) overContainer = "toDo"

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.indexOf(id);
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&

          draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      const newTasks = {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item !== active.id)
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length)
        ]
      }

      fetch("https://tasklim-server.onrender.com/api/change_task_state", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldTasks: prev, newTasks })
      })
        .catch(err => console.log(err))

      return newTasks
    });
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].indexOf(active.id);
    const overIndex = items[overContainer].indexOf(overId);

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex)
      }));
    }

    setActiveId(null);
  }
}
