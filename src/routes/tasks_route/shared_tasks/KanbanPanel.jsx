import "../../../stylesheets/routes/tasks_route/KanbanPanel.css"

import { RiVipCrown2Fill } from "react-icons/ri";

import { KanbanImages, ProfilePictures } from "../../../images/images"

const KanbanPanel = ({ kanban, openAdminPanel }) => {

  if (!kanban) return (
    <div className="kanban-panel" />
  )

  return (
    <div className="kanban-panel">
      <div className="kanban-panel-header" onClick={openAdminPanel}>
        <img src={KanbanImages[kanban.kanbanImage]} />
        <h1>{kanban.kanbanName}</h1>
      </div>
      <div className="kanban-panel-body">
        {
          kanban.members.map((current, index) => (
              current.activeMember ?
                <div key={index} className="kanban-panel-member">
                  <img src={ProfilePictures[current.profilePicture]} />
                  <p>
                    {current.username}
                    {
                      kanban.createdBy === current.username ?
                        <RiVipCrown2Fill className="kanban-panel-member-owner" />
                        : undefined
                    }
                  </p>
                </div>
                : undefined
          ))
        }
      </div>
    </div>
  )
}

export default KanbanPanel