import { useState } from "react"
import "../../stylesheets/routes/home_route/FriendsPanel.css"

//#region IMAGES

import ProfilePicture0 from "../../images/239813940_4230888500367933_3877022374063402884_n.jpg"
import ProfilePicture1 from "../../images/241251431_4230888380367945_1348050220600686703_n.jpg"
import ProfilePicture2 from "../../images/241278413_4230888623701254_1041618554313096870_n.jpg"
import ProfilePicture3 from "../../images/241304241_4230888403701276_390456860279564516_n.jpg"
import ProfilePicture4 from "../../images/241331907_4230888460367937_1791198082846251953_n.jpg"
import ProfilePicture5 from "../../images/241372609_4230888523701264_4686595043853418143_n.jpg"
import ProfilePicture6 from "../../images/241407360_4230888517034598_3246805530277447428_n.jpg"

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


const UserItem = ({user}) => {
  return (
    <div className="user-item">
      <img src={profilePictures[user.profilePicture]}/>
      <p>{user.username}</p>
    </div>
  )
}

const FriendsPanel = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)

  const [usersFound, setUsersFound] = useState([])

  const handleChangeQuery = (e) => {
    setSearchQuery(e.target.value)

    if(!e.target.value) {
      setSearching(false)
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

  return (
    <div className="friends-panel">
      <form className="friends-panel-form">
        <input placeholder="Search friends..." value={searchQuery} onChange={handleChangeQuery}/>
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
                <UserItem key={index} user={current}/>
              ))
            }
          </div> : searching ? <p>No user found</p> :
          undefined
        }
      </div>
    </div>
  )
}


export default FriendsPanel