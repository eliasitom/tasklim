import "../../../stylesheets/routes/tasks_route/my_tasks/Task.css"

import TaskModal from "./SharedTaskModal";

import React, { useContext, useEffect, useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import moment from "moment";

import { UserContext } from "../../../contexts/userContext";
import { ProfilePictures, genericProfilePicture } from "../../../images/images";


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


export function Item({ id, activeId, kanbanName }) {
  const [taskData, setTaskData] = useState({});

  const { myUser } = useContext(UserContext)

  useEffect(() => {
    if (!id || !kanbanName) return

    fetch(`http://localhost:8000/api/get_shared_task/${id}/${kanbanName}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }

    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res)
        // Convertir la cadena de fecha a un objeto de Moment
        const dateMoment = moment(res.task.createdAt);

        // Formatear la fecha en el formato deseado
        const formatedDate = dateMoment.format("MM/DD/YYYY");
        setTaskData({
          ...res.task,
          createdAt: formatedDate,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  if (!myUser || !taskData) return (
    <div
      className="task"
      style={{
        backgroundColor:
          activeId && id === activeId ? "var(--color-2-hover)" : mainColors[taskData.color],
      }}
    >
      <div className="task-header" style={{ cursor: "grabbing", backgroundColor: secondaryColors[taskData.color] }}>
      </div>
      <div className="task-footer">
        <div className="task-options" />
      </div>
    </div>
  );

  return (
    <div
      className="task"
      style={{
        backgroundColor:
          activeId && id === activeId ? "var(--color-2-hover)" : mainColors[taskData.color],
      }}
    >
      <div className="task-header" style={{ cursor: "grabbing", backgroundColor: secondaryColors[taskData.color] }}>
      </div>
      <p className="task-body">{taskData.body}</p>
      <div className="task-footer">
        <div className="task-options">
        </div>
      </div>
    </div>
  );
}







export default function SortableItem({ activeId, id, pullTask, kanbanName }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const handleRef = React.useRef(null);

  const [taskData, setTaskData] = useState(null);
  const [body, setBody] = useState("")
  const [color, setColor] = useState(0)

  const [modalOpen, setModalOpen] = useState(false)

  const { myUser } = useContext(UserContext)


  useEffect(() => {
    if (!id || !kanbanName) return

    fetch(`http://localhost:8000/api/get_shared_task/${id}/${kanbanName}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => response.json())
      .then((res) => {
        // Convertir la cadena de fecha a un objeto de Moment
        const dateMoment = moment(res.task.createdAt);

        // Formatear la fecha en el formato deseado
        const formatedDate = dateMoment.format("MM/DD/YYYY");
        setTaskData({
          ...res.task,
          createdAt: formatedDate,
          comments: res.task.comments.reverse()
        });
        setColor(res.task.color)
        setBody(res.task.body)
      })
      .catch((err) => console.log(err));
  }, [id, kanbanName]);

  const handleTaskChanged = (newBody, newColor) => {
    setBody(newBody)
    setColor(newColor)

    let changedTask = taskData
    changedTask.body = newBody
    changedTask.color = newColor

    setTaskData(changedTask)

    setModalOpen(false)
  }

  const handlePushComment = (newComment) => {
    let changedTask = {...taskData}
    changedTask.comments = [newComment, ...changedTask.comments]
    setTaskData(changedTask)
  }
  
  const handlePullComent = (commentId) => {
    let changedTask = {...taskData}
    changedTask.comments = changedTask.comments.filter(elem => elem._id !== commentId)
    setTaskData(changedTask)

  }


  if (!taskData || !myUser) return (
    <div ref={setNodeRef} style={style}>
      <div
        className="task"
        style={{
          backgroundColor:
            activeId && id === activeId ? secondaryColors[color] : mainColors[color],
        }}
      >
        <div
          ref={handleRef}
          className="task-header"
          {...attributes} {...listeners}
          style={{ backgroundColor: secondaryColors[color] }}
        >
        </div>
        <div className="task-footer">
          <div className="task-options">
            <img src={genericProfilePicture} className="task-footer-img" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div ref={setNodeRef} style={style}>
      {modalOpen ?
        <TaskModal
          task={taskData}
          closeModal={() => setModalOpen(false)}
          kanbanName={kanbanName}
          taskChanged={handleTaskChanged}
          pullTask={pullTask}
          pushComment={handlePushComment}
          pullComment={handlePullComent}
        />
        : undefined}
      <div
        className="task"
        style={{
          backgroundColor:
            activeId && id === activeId ? secondaryColors[color] : mainColors[color],
        }}
      >
        <div
          ref={handleRef}
          className="task-header"
          {...attributes} {...listeners}
          style={{ backgroundColor: secondaryColors[color] }}
        >
        </div>
        <p className="task-body">{body}</p>
        <div className="task-footer">
          <div className="task-options" onClick={() => setModalOpen(true)}>
            <img src={ProfilePictures[taskData.createdBy.profilePicture]} className="task-footer-img" />
            <p className="task-footer-username">{taskData.createdBy.username}</p>
          </div>
          <p className="task-footer-date">{taskData.createdAt}</p>
        </div>
      </div>
    </div>
  );
}
