import "../../stylesheets/routes/tasks_route/Container.css"

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import SortableItem from "./Task";

export default function Container(props) {
  const { id, items } = props;

  const { setNodeRef } = useDroppable({
    id
  });

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <section ref={setNodeRef} className="tasks-route-container">
        <p className="tasks-route-container-title">{id}</p>
        {items.map((id) => (
          <SortableItem key={id} id={id} activeId={props.activeId}/>
        ))}
      </section>
    </SortableContext>
  );
}
