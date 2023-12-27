import "../../stylesheets/routes/tasks_route/Task.css"

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function Item(props) {
  const { id, activeId } = props;

  return <div className="task" style={{backgroundColor: activeId && id === activeId ? "var(--color-2-hover)" : ""}}>{id}</div>;
}

export default function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alingItems: "center"
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item id={props.id} activeId={props.activeId}/>
    </div>
  );
}
