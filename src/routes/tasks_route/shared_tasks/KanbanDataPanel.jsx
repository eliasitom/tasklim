import "../../../stylesheets/routes/tasks_route/my_tasks/KanbanDataPanel.css"

import { KanbanImages, ProfilePictures } from "../../../images/images"
import { ImCross } from "react-icons/im";

import { useContext, useEffect, useState } from "react"

import moment from "moment"
import { UserContext } from "../../../contexts/UserContext"


const UserItem = ({ user, myUser, handleClick }) => {
  const [isOver, setIsOver] = useState(false)


  return (
    <div
      className={`kanban-data-user-item ${myUser ? "kanban-data-my-user" : ""}`}
      onMouseOver={() => setIsOver(true)}
      onMouseLeave={() => setIsOver(false)}
      onClick={!myUser ? handleClick : undefined}
    >
      <img src={ProfilePictures[user.profilePicture]} className={isOver && !myUser ? "kanban-data-member-over-icon" : ""} />
      <p>{myUser ? "you" : user.username}</p>
    </div>
  )
}


const KanbanDataPanel = ({ kanban, closeModal, addMember, deleteMember, deleteKanban }) => {
  const { myUser } = useContext(UserContext)

  const [createdAt, setCreatedAt] = useState()

  const [userSelected, setUserSelected] = useState(null)

  const [deleteKanbanTimer, setDeleteKanbanTimer] = useState(3)
  const [confirmDeleteKanban, setConfirmDeleteKanban] = useState(false)



  const handleUserSelected = (newSelect) => {
    setUserSelected(prev => {
      if (!prev || prev.user.username !== newSelect.user.username) return newSelect
      if (prev.user.username === newSelect.user.username) return null
      else return prev
    })
  }

  const handleAddMember = () => {
    addMember(userSelected.user.username)
    setUserSelected(null)
  }
  const handleDeleteMember = (user) => {
    deleteMember(user)
    setUserSelected(null)
  }

  const handleDeleteKanban = () => {
    setConfirmDeleteKanban(true)
    let timer = 3

    const intervalRef = setInterval(() => {
      timer--
      setDeleteKanbanTimer(timer)
      if (timer < 1) {
        setDeleteKanbanTimer(3)
        setConfirmDeleteKanban(false)
        clearInterval(intervalRef)
      }
    }, 1000);
  }



  useEffect(() => {
    if (!kanban) return

    // Convertir la cadena de fecha a un objeto de Moment
    const dateMoment = moment(kanban.createdAt);

    // Formatear la fecha en el formato deseado
    const formatedDate = dateMoment.format("MM/DD/YYYY");

    setCreatedAt(formatedDate)
  }, [kanban])




  if (!kanban || !myUser) return <p>loading...</p>
  return (
    <div className="kanban-data-background" onClick={closeModal}>
      <main className="kanban-data-main" onClick={e => e.stopPropagation()}>
        <header className="kanban-data-header">
          <h3 className="kanban-data-header-title">Admin panel</h3>
          <ImCross onClick={closeModal} />
        </header>
        <section className="kanban-data-body">
          <article className="kanban-data-information">
            <img src={KanbanImages[kanban.kanbanImage]} />
            <h3>{kanban.kanbanName}</h3>
            <h4>{kanban.kanbanDescription}</h4>
            <p><b>created by:</b> {kanban.createdBy}</p>
            <p><b>created at:</b> {createdAt}</p>

            {
              kanban.createdBy === myUser.username ?
                <>
                  {
                    !confirmDeleteKanban ?
                      <button
                        className="kanban-data-information-delete"
                        onClick={handleDeleteKanban}
                      >
                        delete kanban
                      </button>
                      :
                      <button
                        className="kanban-data-information-delete"
                        onClick={deleteKanban}
                      >
                        confirm {deleteKanbanTimer}
                      </button>
                  }
                </>
                :
                <button
                  className="kanban-data-information-delete"
                  onClick={() => handleDeleteMember(myUser.username)}
                >
                  exit kanban
                </button>
            }
          </article>
          <article className="kanban-data-members">
            <div className="kanban-data-members-body">
              <h4 className="">Current members:</h4>
              <div className="kanban-data-members-container">
                {
                  kanban.members.map((current) => (
                    current.activeMember ?
                      <UserItem
                        user={current}
                        key={current._id}
                        myUser={myUser.username === current.username ? myUser : undefined}
                        handleClick={() => handleUserSelected({ user: current, isMember: true })}
                      /> : undefined
                  ))
                }
              </div>
              {
                kanban.createdBy === myUser.username ?
                  <>
                    <h4 className="">Add members:</h4>
                    <div className="kanban-data-members-container">
                      {
                        myUser.friends.map((current) => (
                          kanban.members.filter(elem => elem.username === current.username).length === 0 ?
                            <UserItem
                              user={current}
                              key={current._id}
                              handleClick={() => handleUserSelected({ user: current, isMember: false })}
                            /> : undefined
                        ))
                      }
                      {
                        kanban.members.map((current) => (
                          !current.activeMember ?
                            <UserItem
                              user={current}
                              key={current._id}
                              handleClick={() => handleUserSelected({ user: current, isMember: true, nonActiveMember: true })}
                            /> : undefined
                        ))
                      }
                    </div>
                  </> : undefined
              }
            </div>
            {
              kanban.createdBy === myUser.username ?
                <div className="kanban-data-members-footer">
                  {
                    userSelected ?
                      <div className="kanban-data-user-selected-panel">
                        <div>
                          <img src={ProfilePictures[userSelected.user.profilePicture]} />
                          <p>{userSelected.user.username}</p>
                        </div>
                        {
                          userSelected.isMember && !userSelected.nonActiveMember ?
                            <button className="kanban-data-member-delete" onClick={() => handleDeleteMember(userSelected.user.username)}>remove member</button> :
                            userSelected.isMember && userSelected.nonActiveMember ?
                              <p>Invitation sent</p> :
                              <button className="kanban-data-member-delete" onClick={handleAddMember}>add member</button>
                        }
                      </div>
                      : undefined
                  }
                  {
                    userSelected && userSelected.isMember ?
                      <p className="kanban-data-members-alert">IMPORTANT: Deleting a member will delete all their tasks and comments.</p>
                      : undefined
                  }
                </div>
                : undefined
            }
          </article>
        </section>
      </main>
    </div>
  )
}

export default KanbanDataPanel