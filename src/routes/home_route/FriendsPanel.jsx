import { useEffect, useState } from "react"
import "../../stylesheets/routes/home_route/FriendsPanel.css"

import useMyUser from "../../custom_hooks/useMyUser"

//#region IMAGES

import ProfilePicture0 from "../../images/239813940_4230888500367933_3877022374063402884_n.jpg"
import ProfilePicture1 from "../../images/241251431_4230888380367945_1348050220600686703_n.jpg"
import ProfilePicture2 from "../../images/241278413_4230888623701254_1041618554313096870_n.jpg"
import ProfilePicture3 from "../../images/241304241_4230888403701276_390456860279564516_n.jpg"
import ProfilePicture4 from "../../images/241331907_4230888460367937_1791198082846251953_n.jpg"
import ProfilePicture5 from "../../images/241372609_4230888523701264_4686595043853418143_n.jpg"
import ProfilePicture6 from "../../images/241407360_4230888517034598_3246805530277447428_n.jpg"
import genericProfilePicture from "../../images/Generic-Profile-Image.png"
//#endregion

const profilePictures = [
  ProfilePicture0,
  ProfilePicture1,
  ProfilePicture2,
  ProfilePicture3,
  ProfilePicture4,
  ProfilePicture5,
  ProfilePicture6
]



const UserItem = ({ user, userSelected }) => {
  const { myUser, loading, error } = useMyUser()


  if (loading) return (
    <div className="user-item no-friend">
      <img src={genericProfilePicture} />
      <p>loading...</p>
    </div>
  )

  return (
    <div className={
      `user-item 
      ${myUser.friends.filter(elem => elem.username === user.username).length === 0
        ? "no-friend" : ""}`}
      onClick={userSelected}
    >
      <img src={profilePictures[user.profilePicture]} />
      <p>{user.username}</p>
    </div>
  )
}

const FriendsPanel = () => {
  const myUserObject = useMyUser();
  const [myUser, setMyUser] = useState(null);

  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)

  const [usersFound, setUsersFound] = useState([])

  const [userSelected, setUserSelected] = useState(null)



  useEffect(() => {
    if(myUserObject.loading) return

    setMyUser(myUserObject.myUser)
  }, [myUserObject])

  const handleChangeQuery = (e) => {
    setSearchQuery(e.target.value)

    if (!e.target.value) {
      setSearching(false)
      setUserSelected(null)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearching(true)

    fetch(`http://localhost:8000/api/get_users_by_username/${searchQuery}`, {
      method: "GET"
    })
      .then(response => response.json())
      .then(res => {
        setUsersFound(res.users)
      })
      .catch(err => console.log(err))
  }

  const handleUserSelect = (user) => {
    if (user) {
      setUserSelected(user)
    } else {
      setUserSelected(null)
    }
  }

  // Enviar solicitud de amistar
  const handleAddFriend = () => {
    // las notificaciones de tipo "friend request" agregan inmediatamente al usuario como amigo, pero el estado es "pendiente",
    // por lo que no se muestra como amigo. Luego de que el otro usuario confirme la solicitud el estado pasa a ser "activo"
    const notification = { from: myUser.username, to: userSelected.username, notificationType: "friend request" }

    fetch("http://localhost:8000/api/post_notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification)
    })
      .catch(err => console.log(err))
  }

  const handleDeleteFriend = () => {
    fetch(`http://localhost:8000/api/deny_friend_request/${myUser.username}/${userSelected.username}/undefined_notification_id`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(res => {
        setMyUser(res.user)
      })
      .catch(err => console.log(err))
  }



  return (
    <div className="friends-panel">
      <form className="friends-panel-form">
        <input placeholder="Search friends..." value={searchQuery} onChange={handleChangeQuery} />
        <button onClick={handleSearch}>search</button>
      </form>
      <div className="friends-panel-body">
        <h4>
          {
            !searching ?
              "My friends:"
              : "Search results:"
          }
        </h4>
        {
          usersFound.length > 0 && searching ?
            <div className="friends-panel-users-container">
              {
                usersFound.map((current, index) => (
                  <UserItem key={index} user={current} userSelected={() => handleUserSelect(current)} />
                ))
              }
            </div> : searching ? <p>No user found</p> :
              undefined
        }
        {
          userSelected ?
            <div className="user-selected">
              <div>
                <img src={profilePictures[userSelected.profilePicture]} />
                <p>{userSelected.username}</p>
              </div>
              <div>
                {
                  myUser.friends.filter(elem => elem.username === userSelected.username && elem.state === "pending").length > 0 ?
                    <div className="user-selected-friend-request-resolution">
                      <p>friend request</p>
                      <div>
                        <button onClick={handleDeleteFriend}>deny</button>
                        <button onClick={handleAddFriend}>accept</button>
                      </div>
                    </div>
                    : myUser.friends.filter(elem => elem.username === userSelected.username && elem.state === "waiting").length > 0 ?
                      <div className="user-selected-friend-request-resolution">
                        <p>friend request sent</p>
                      </div>
                      :
                      <>
                        <button onClick={() => handleUserSelect(null)}>cancel</button>
                        <button onClick={handleAddFriend}>add friend</button>
                      </>
                }
              </div>
            </div>
            : undefined
        }
      </div>
    </div>
  )
}


export default FriendsPanel