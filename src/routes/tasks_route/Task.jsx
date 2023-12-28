import "../../stylesheets/routes/tasks_route/Task.css";

import React, { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import moment from "moment";

import { FaTrash, FaPalette, FaEdit } from "react-icons/fa";

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
          activeId && id === activeId ? "var(--color-2-hover)" : "",
      }}
    >
      <div className="task-header" style={{cursor: "grabbing"}}>
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
export default function SortableItem({ activeId, id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const handleRef = React.useRef(null);

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className="task"
        style={{
          backgroundColor:
            activeId && id === activeId ? "var(--color-2-hover)" : "",
        }}
      >
        <div ref={handleRef} className="task-header" {...attributes} {...listeners}>
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
    </div>
  );
}
