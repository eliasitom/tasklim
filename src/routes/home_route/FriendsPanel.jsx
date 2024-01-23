import { useState, useContext } from "react"
import "../../stylesheets/routes/home_route/FriendsPanel.css"

import { UserContext } from "../../contexts/UserContext.jsx"

import NewKanbanModal from "../tasks_route/my_tasks/NewKanbanModal.jsx"

import { ProfilePictures, genericProfilePicture } from "../../images/images.jsx"






const isActiveFriend = (myUser, user) => {
  const userIndex = myUser.friends.findIndex(elem => elem.username === user.username)
  if (myUser.friends[userIndex].state === "pending" || myUser.friends[userIndex].state === "waiting") {
    return false
  } else {
    return true
  }
}
const isFriend = (myUser, user) => {
  if (myUser.friends.filter(elem => elem.username === user.username).length === 0) {
    return false
  } else {
    return true
  }
}

const UserItem = ({ user, userSelected }) => {
  const { myUser } = useContext(UserContext)

  if (!myUser) return (
    <div className="user-item no-friend">
      <img src={genericProfilePicture} />
      <p>loading...</p>
    </div>
  )

  return (
    <div className={
      `user-item 
      ${!isFriend(myUser, user) || (isFriend(myUser, user) && !isActiveFriend(myUser, user)) ? "no-friend" : ""}`}
      onClick={userSelected}
    >
      {isFriend(myUser, user) && !isActiveFriend(myUser, user) ? <div className="notification-sphere" /> : undefined}
      <img src={ProfilePictures[user.profilePicture]} />
      <p>{user.username}</p>
    </div>
  )
}
const UserSelectedPanel = ({
  myUser,
  userSelected,
  deniedUsers,
  requestsSent,
  handleAcceptFriend,
  handleAddFriend,
  handleDenyFriend,
  handleUserSelect,
  handleDeleteFriend }) => {

  const [newKanban, setNewKanban] = useState(false)

  const [deleteFriendConfirm, setDeleteFriendConfirm] = useState(false)
  const [confirmTimer, setConfirmTimer] = useState(3)


  const confirmInterval = () => {
    setDeleteFriendConfirm(true)
    let timer = 3

    const intervalRef = setInterval(() => {
     timer--
     setConfirmTimer(timer)
     
     if(timer < 1) {
      setDeleteFriendConfirm(false)
      setConfirmTimer(3)
      clearInterval(intervalRef)
     }
    }, 1000);
  }

  return (
    <div className="user-selected">
      <div>
        <img src={ProfilePictures[userSelected.profilePicture]} />
        <p>{userSelected.username}</p>
      </div>
      <div>
        {
          myUser.friends.filter(elem => elem.username === userSelected.username && elem.state === "pending").length > 0 ?
            <div className="user-selected-friend-request-resolution">
              {
                deniedUsers.includes(userSelected.username) ?
                  <p>friend request denied</p> :
                  <>
                    <p>friend request</p>
                    <div>
                      <button onClick={handleDenyFriend}>deny</button>
                      <button onClick={handleAcceptFriend}>accept</button>
                    </div>
                  </>
              }
            </div>
            : myUser.friends.filter(elem => elem.username === userSelected.username && elem.state === "waiting").length > 0 ?
              <div className="user-selected-friend-request-resolution">
                <p>friend request sent</p>
              </div>
              //Esta condicion es igual a la anterior, pero una es en tiempo real y la otra para cuando se actualiza la pagina
              : requestsSent.includes(userSelected.username) ?
                <div className="user-selected-friend-request-resolution">
                  <p>friend request sent</p>
                </div> :
                isFriend(myUser, userSelected) && isActiveFriend(myUser, userSelected) ?
                  <>
                    {
                      !deleteFriendConfirm ? 
                      <button
                      className="user-selected-delete-friend-button"
                      onClick={confirmInterval}
                    >
                      delete friend
                    </button>
                      : 
                      <button
                      className="user-selected-delete-friend-button"
                      onClick={handleDeleteFriend}
                    >
                      confirm {confirmTimer}
                    </button>
                    }
                    <button
                      className="user-selected-create-kanban-button"
                      onClick={() => setNewKanban(true)}>
                      new shared kanban
                    </button>
                  </> :
                  <>
                    <button onClick={() => handleUserSelect(null)}>cancel</button>
                    <button onClick={handleAddFriend}>add friend</button>
                  </>
        }
        {
          newKanban ?
            <NewKanbanModal
              user1={myUser}
              user2={userSelected}
              close={() => setNewKanban(false)}
            />
            : undefined}
      </div>
    </div>
  )
}
const FriendsPanel = () => {
  const { myUser, setMyUser } = useContext(UserContext)

  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)

  const [usersFound, setUsersFound] = useState([])

  const [userSelected, setUserSelected] = useState(null)
  const [deniedUsers, setDeniedUsers] = useState([]) // Denied friend requests
  const [requestsSent, setRequestsSent] = useState([]) // Friend requests sent




  const handleChangeQuery = (e) => {
    setSearchQuery(e.target.value)

    if (!e.target.value) {
      setSearching(false)
      setUserSelected(null)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()

    if (searchQuery) {
      setSearching(true)

      fetch(`http://localhost:8000/api/get_users_by_username/${searchQuery}`, {
        method: "GET"
      })
        .then(response => response.json())
        .then(res => {
          const usersFound_ = res.users.filter(elem => elem.username !== myUser.username)
          setUsersFound(usersFound_)
        })
        .catch(err => console.log(err))
    }
  }

  const handleUserSelect = (user) => {
    if (user) {
      setUserSelected(user)
    } else {
      setUserSelected(null)
    }
  }

  const handleAddFriend = () => {
    // las notificaciones de tipo "friend request" agregan inmediatamente al usuario como amigo, pero el estado es "pendiente",
    // o "esperando" dependiendo de quien mande y quien reciba la solicitud, por lo que no se muestra como amigo. Luego de que 
    // el otro usuario confirme la solicitud el estado pasa a ser "activo"
    const notification = { from: myUser.username, to: userSelected.username, notificationType: "friend request" }

    fetch("http://localhost:8000/api/post_notification/friend_request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification)
    })
      .then(() => {
        setRequestsSent(prev => [...prev, userSelected.username])
      })
      .catch(err => console.log(err))
  }

  const handleDenyFriend = () => {
    fetch(`http://localhost:8000/api/deny_friend_request/${myUser.username}/${userSelected.username}/undefined_notification_id`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(res => {
        setMyUser(res.user)
        setDeniedUsers(prev => [...prev, userSelected.username])
      })
      .catch(err => console.log(err))
  }
  const handleAcceptFriend = () => {
    fetch(`http://localhost:8000/api/accept_friend_request/${myUser._id}/${userSelected._id}/undefined_notification_id`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(res => {
        setMyUser(res.user)
      })
  }

  const handleDeleteFriend = () => {
    fetch(`http://localhost:8000/api/delete_friend/${myUser.username}/${userSelected.username}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(res => {
        setMyUser(res.user)
      })
  }

  if (myUser) {
    return (
      <div className="friends-panel">
        <form className="friends-panel-form">
          <input placeholder="Search friends..." value={searchQuery} onChange={handleChangeQuery} />
          <button onClick={handleSearch}>search</button>
        </form>
        <div className="friends-panel-body">
          {
            !searching ?
              <h4>My friends:</h4>
              : <h4>Search results:</h4>
          }
          {
            !searching ?
              <div className="friends-panel-users-container">
                {
                  myUser.friends.map((current, index) => (
                    <div key={index}>
                      {
                        isActiveFriend(myUser, current) ?
                          <UserItem user={current} userSelected={() => handleUserSelect(current)} />
                          : undefined
                      }
                    </div>
                  ))
                }
              </div>
              :
              usersFound.length > 0 && searching ?
                <div className="friends-panel-users-container">
                  {
                    usersFound.map((current, index) => (
                      <UserItem key={index} user={current} userSelected={() => handleUserSelect(current)} />
                    ))
                  }
                </div> : searching ? <p className="search-alert">No user found :/</p> :
                  undefined
          }
          {
            userSelected ?
              <UserSelectedPanel
                myUser={myUser}
                userSelected={userSelected}
                deniedUsers={deniedUsers}
                requestsSent={requestsSent}
                handleAcceptFriend={handleAcceptFriend}
                handleAddFriend={handleAddFriend}
                handleDenyFriend={handleDenyFriend}
                handleUserSelect={handleUserSelect}
                handleDeleteFriend={handleDeleteFriend}
              />
              : undefined
          }
        </div>
      </div>
    )
  } else {
    return (
      <div className="friends-panel">
        <form className="friends-panel-form">
          <input placeholder="Search friends..." />
          <button >search</button>
        </form>
        <div className="friends-panel-body">
          <h4>Loading...</h4>
        </div>
      </div>
    )
  }


}


export default FriendsPanel