import "../../../stylesheets/routes/tasks_route/my_tasks/TasksRoute.css"

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

import Container from "./SharedContainer";
import { Item } from "./SharedTask";
import KanbanPanel from "./KanbanPanel";
import KanbanDataPanel from "./KanbanDataPanel";
import { UserContext } from "../../../contexts/userContext";
import useMyUser from "../../../custom_hooks/useMyUser";



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
  const { myUser, setMyUser } = useContext(UserContext)
  const { getMyUser } = useMyUser()

  const { kanbanName } = useParams()
  const [kanban, setKanban] = useState()
  const [adminPanel, setAdminPanel] = useState(false)
  const [items, setItems] = useState({
    toDo: [],
    running: [],
    completed: [],
  });

  const [activeId, setActiveId] = useState();




  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user")) === null) {
      navigate("/auth")
    }
  }, [])

  useEffect(() => {
    if (!myUser) return
    if (myUser.sharedKanban.filter(elem => elem.kanbanName === kanbanName).length === 0) {
      navigate("/")
    }
  }, [kanbanName, myUser])

  useEffect(() => {
    fetch(`http://localhost:8000/api/get_shared_kanban/${kanbanName}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(response => response.json())
      .then(res => {
        const kanban = res.kanban

        setKanban(res.kanban)

        const tasksToDo = kanban.tasks.filter(current => current.state === "to-do")
        const tasksRunning = kanban.tasks.filter(current => current.state === "running")
        const tasksCompleted = kanban.tasks.filter(current => current.state === "completed")

        setItems({
          toDo: tasksToDo.map(task => task._id),
          running: tasksRunning.map(task => task._id),
          completed: tasksCompleted.map(task => task._id)
        });
      })
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
    fetch(`http://localhost:8000/api/delete_shared_task/${id}/${kanbanName}`, {
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

  const handleAddMember = (user) => {
    fetch(`http://localhost:8000/api/post_notification/add_kanban_member`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kanbanName, newMember: user })
    })
      .then(response => response.json())
      .then(res => {
        console.log(res.kanbanSaved)
        setKanban(res.kanbanSaved)
      })
      .catch(err => console.log(err))
  }
  const handleDeleteMember = (user) => {
    fetch(`http://localhost:8000/api/delete_kanban_member/${user}/${kanbanName}`, {
      method: "DELETE",
    })
      .then(response => response.json())
      .then(async (res) => {
        if (user === myUser.username) {
          navigate("/")
          const newUser = await getMyUser()
          setMyUser(newUser)
        } else {
          setKanban(res.kanbanSaved)
        }
      })
      .catch(err => console.log(err))
  }

  const handleDeleteKanban = () => {
    fetch(`http://localhost:8000/api/delete_kanban/${kanbanName}`, {
      method: "DELETE",
    })
      .then(async () => {
        navigate("/")
        const newUser = await getMyUser()
        setMyUser(newUser)
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="tasks-route-main">
      <div className="tasks-route">
        {
          adminPanel ?
            <KanbanDataPanel
              kanban={kanban}
              closeModal={() => setAdminPanel(false)}
              addMember={handleAddMember}
              deleteMember={handleDeleteMember}
              deleteKanban={handleDeleteKanban}
            />
            : undefined
        }
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
            kanban={kanban}
          />
          <Container
            id="running"
            items={items.running}
            activeId={activeId}
            pullTask={id => handlePullTask(id, "running")}
            kanban={kanban}
          />
          <Container
            id="completed"
            items={items.completed}
            activeId={activeId}
            pullTask={id => handlePullTask(id, "completed")}
            kanban={kanban}
          />
          <KanbanPanel
            kanban={kanban}
            openAdminPanel={() => setAdminPanel(true)}
          />
          <DragOverlay>{activeId ? <Item id={activeId} kanbanName={kanban.kanbanName} /> : null}</DragOverlay>
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

    // Change task state with fetching
    fetch("http://localhost:8000/api/change_shared_task_state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: activeId, newState: overContainer, kanbanName: kanban.kanbanName })
    })
      .catch(err => console.log(err))


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
