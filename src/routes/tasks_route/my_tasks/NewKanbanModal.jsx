import "../../../stylesheets/routes/tasks_route/my_tasks/NewKanbanModal.css";

import { ImCross } from "react-icons/im";

import { UserContext } from "../../../contexts/userContext";
import { useState, useContext } from "react";

import { ProfilePictures, KanbanImages } from "../../../images/images";

import useMyUser from "../../../custom_hooks/useMyUser";






const MemberItem = ({ user, myUser, noMember, addMember, removeMember }) => {

  const handleClick = () => {
    if (myUser) return

    if (noMember) {
      addMember()
    } else {
      removeMember()
    }
  }

  return (
    <div className="kanban-modal-member-item" onClick={handleClick} >
      <img src={ProfilePictures[user.profilePicture]} />
      <p>{myUser ? "you" : user.username}</p>
    </div>
  )
}



const NewKanbanModal = ({ user2, close }) => {
  const { myUser, setMyUser } = useContext(UserContext)
  const myUserObject = useMyUser()

  const [kanbanName, setKanbanName] = useState("")
  const [kanbanDescription, setKanbanDescription] = useState("")
  const [members, setMembers] = useState([myUser, user2])
  const [imageSelected, setImageSelected] = useState(0)


  const isImageSelected = (index) => {
    if (imageSelected === index) return true
    else return false
  }

  const handleAddMember = (member) => {
    setMembers(prev => [...prev, member])
  }
  const handleRemoveMember = (member) => {
    setMembers(prev => {
      return prev.filter(current => current.username !== member.username)
    })
  }

  const handleSubmitKanban = () => {
    if (!kanbanName || !kanbanDescription) return alert("You need a kanban name and description")
    if (members.length === 1) return alert("You need two or more users to create a kanban")

    const fetchData = {
      sender: myUser.username,
      targets: members.filter(elem => elem.username !== myUser.username).map(elem => elem.username),
      kanbanData: {
        kanbanName,
        kanbanDescription,
        kanbanImage: imageSelected,
        createdBy: myUser.username,
        members: members.map(elem => {
          return { username: elem.username, profilePicture: elem.profilePicture }
        }),
      }
    }

    fetch("http://localhost:8000/api/post_notification/new_kanban", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fetchData)
    })
      .then(async () => {
        try {
          const user = await myUserObject.getMyUser();
          setMyUser(user);
        } catch (error) {
          console.error("Error al obtener el usuario:", error);
        }
        close()
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="new-kanban-modal-background">
      <main className="new-kanban-modal-main">
        <header className="new-kanban-modal-header">
          <h4>New shared kanban</h4>
          <ImCross onClick={close} />
        </header>
        <div className="new-kanban-modal-body">
          <form className="new-kanban-modal-form">
            <label>
              Kanban name:
              <input
                placeholder="Ex: Our new home..."
                onChange={e => setKanbanName(e.target.value)}
                value={kanbanName}
              />
            </label>
            <label>
              Project description:
              <textarea
                placeholder="Ex: Task list for the construction of our new home..."
                onChange={e => setKanbanDescription(e.target.value)}
                value={kanbanDescription}
              />
            </label>
          </form>
          <div className="new-kanban-members">
            <div className="new-kanban-members-section">
              <h4>Members:</h4>
              <div className="new-kanban-members-container">
                <MemberItem user={myUser} myUser={true} />
                {
                  members.map((current, index) => (
                    index > 0 ?
                      <MemberItem
                        user={current}
                        key={index}
                        removeMember={() => handleRemoveMember(current)}
                      /> : undefined
                  ))
                }
              </div>
            </div>
            <div className="new-kanban-members-section">
              <h4>Add members:</h4>
              <div className="new-kanban-members-container">
                {myUser.friends.map((current, index) => (
                  members.filter(elem => elem.username === current.username).length > 0 ?
                    undefined :
                    <MemberItem
                      user={current}
                      key={index}
                      noMember={true}
                      addMember={() => handleAddMember(current)}
                    />
                ))}
              </div>
            </div>
          </div>
          <div className="new-kanban-image-section">
            <h4>Kanban image:</h4>
            <div>
              {
                KanbanImages.map((current, index) => (
                  <img
                    src={current}
                    key={index}
                    className={isImageSelected(index) ? "new-kanban-selected-image" : "new-kanban-secondary-image"}
                    onClick={() => setImageSelected(index)}
                  />
                ))
              }
            </div>
          </div>
        </div>
        <div className="new-kanban-footer">
          <button onClick={handleSubmitKanban}>create kanban</button>
        </div>
      </main>
    </div>
  )
}

export default NewKanbanModal