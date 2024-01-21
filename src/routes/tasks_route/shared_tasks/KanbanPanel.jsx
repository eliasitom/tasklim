import "../../../stylesheets/routes/tasks_route/KanbanPanel.css"

import { useState } from "react"
import { UserContext } from "../../../contexts/userContext"

import { KanbanImages, ProfilePictures } from "../../../images/images"

const KanbanPanel = ({ kanban }) => {

  if (!kanban) return (
    <div className="kanban-panel" />
  )

  return (
    <div className="kanban-panel">
      <div className="kanban-panel-header">
        <img src={KanbanImages[kanban.kanbanImage]} />
        <h1>{kanban.kanbanName}</h1>
      </div>
      <div className="kanban-panel-body">
        {
          kanban.members.map((current, index) => (
            <div key={index} className="kanban-panel-member">
              <img src={ProfilePictures[current.profilePicture]}/>
              <p>{current.username}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default KanbanPanel