import "../../../stylesheets/routes/tasks_route/my_tasks/Task.css";

import TaskModal from "./TaskModal";

import React, { useEffect, useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import moment from "moment";

import { FaTrash, FaPalette, FaEdit } from "react-icons/fa";
import { TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";

import useDimensions from "../../../custom_hooks/useDimensions";


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


export function Item({ id, activeId }) {
  const [taskData, setTaskData] = useState({});

  useEffect(() => {
    fetch(`http://localhost:8000/api/get_task/${id}`, {
      method: "GET",
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
        });
      })
      .catch((err) => console.log(err));
  }, []);

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
          <FaTrash onClick={() => console.log("delete")} />
          <FaPalette />
          <FaEdit />
        </div>
        <p>{taskData.createdAt}</p>
      </div>
    </div>
  );
}







export default function SortableItem({ activeId, id, pullTask }) {
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

  const { windowWidth } = useDimensions()

  const [taskData, setTaskData] = useState({});
  const [body, setBody] = useState("")
  const [color, setColor] = useState(0)
  const [animationMode, setAnimationMode] = useState(false)

  const [editMode, setEditMode] = useState(false)



  const handleColor = () => {
    setAnimationMode(true)
    setTimeout(() => {
      setAnimationMode(false)
    }, 200);

    const newColor = (color + 1) % mainColors.length
    setColor(newColor)
    setTaskData(prev => {
      return { ...prev, color: newColor }
    })

    fetch("http://localhost:8000/api/edit_task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newBody: body,
        newColor,
        taskId: id,
      }),
    })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    fetch(`http://localhost:8000/api/get_task/${id}`, {
      method: "GET",
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
        });
        setColor(res.task.color)
        setBody(res.task.body)
      })
      .catch((err) => console.log(err));
  }, []);

  const handleTaskChanged = (newBody) => {
    setBody(newBody)

    let changedTask = taskData
    changedTask.body = newBody
    setTaskData(changedTask)

    setEditMode(false)
  }



  return (
    <div ref={windowWidth > 1150 ? setNodeRef : undefined} style={style}>
      {editMode ?
        <TaskModal
          task={taskData}
          closeModal={() => setEditMode(false)}
          taskChanged={handleTaskChanged}
        />
        : undefined}
      <div
        className={`task ${animationMode ? "note-shake" : ""}`}
        style={{
          backgroundColor:
            activeId && id === activeId ? secondaryColors[color] : mainColors[color],
        }}
      >
        <div
          ref={windowWidth > 1150 ? handleRef : undefined}
          className="task-header"
          {...(windowWidth > 1150 ? attributes : undefined)}
          {...(windowWidth > 1150 ? listeners : undefined)}
          style={{ backgroundColor: secondaryColors[color] }}
        >
        </div>
        <p className="task-body">{body}</p>
        <div className="task-footer">
          <div className="task-options">
            <FaTrash onClick={() => pullTask(id)} />
            <FaPalette onClick={handleColor} />
            <FaEdit onClick={() => setEditMode(true)} />
            {
            windowWidth <= 1150 ?
              <>
                <TiArrowDownThick />
                <TiArrowUpThick />
              </>
              : undefined
          }
          </div>
          {
            windowWidth > 1150 ?
            <p className="task-footer-date">{taskData.createdAt}</p>
            : undefined
          }
        </div>
      </div>
    </div>
  );
}
