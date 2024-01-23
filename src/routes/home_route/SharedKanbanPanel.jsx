import { useContext } from "react"
import useMyUser from "../../custom_hooks/useMyUser"
import { UserContext } from "../../contexts/UserContext"

import { KanbanImages } from "../../images/images"

import "../../stylesheets/routes/home_route/SharedKanbanPanel.css"
import { useNavigate } from "react-router-dom"

const SharedKanbanPanel = () => {
  const navigate = useNavigate()
  const {myUser} = useContext(UserContext)

  const handleClick = (kanbanName) => {
    navigate(`/shared_kanban/${kanbanName}`)
  }


  if(!myUser) return <div className="shared-kanban-panel"></div>

  return (
    <div className="shared-kanban-panel">
      <h4>Shared kanban:</h4>
      <div className="shared-kanban-panel-items-container">
      {
        myUser.sharedKanban.length > 0 ?
        myUser.sharedKanban.map((current, index) => (
          <div className="shared-kanban-item" key={index} onClick={() => handleClick(current.kanbanName)}>
            <img src={KanbanImages[current.kanbanImage]} />
            <p>{current.kanbanName}</p>
          </div>
        )) :
        <p className="shared-kanban-no-items">You don't have any shared kanban :(</p>
      }
      </div>
    </div>
  )
}

export default SharedKanbanPanel