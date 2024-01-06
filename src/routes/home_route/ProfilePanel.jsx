import "../../stylesheets/routes/home_route/ProfilePanel.css"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import ProfilePicture0 from "../../images/239813940_4230888500367933_3877022374063402884_n.jpg"
import ProfilePicture1 from "../../images/241251431_4230888380367945_1348050220600686703_n.jpg"
import ProfilePicture2 from "../../images/241278413_4230888623701254_1041618554313096870_n.jpg"
import ProfilePicture3 from "../../images/241304241_4230888403701276_390456860279564516_n.jpg"
import ProfilePicture4 from "../../images/241331907_4230888460367937_1791198082846251953_n.jpg"
import ProfilePicture5 from "../../images/241372609_4230888523701264_4686595043853418143_n.jpg"
import ProfilePicture6 from "../../images/241407360_4230888517034598_3246805530277447428_n.jpg"

const profilePictures = [
  ProfilePicture0,
  ProfilePicture1,
  ProfilePicture2,
  ProfilePicture3,
  ProfilePicture4,
  ProfilePicture5,
  ProfilePicture6
]

const ProfilePanel = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))

  const [profilePictureIndex, setProfilePictureIndex] = useState(0)
  const [profilePicture, setProfilePicture] = useState(ProfilePicture0)

  const handleLogOut = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    navigate("/auth")
  }

  const handleProfilePicture = () => {
    setProfilePictureIndex(prev => {
      if (prev < 6) {
        setProfilePicture(profilePictures[prev + 1])
        return prev + 1
      } else {
        setProfilePicture(profilePictures[0])
        return 0
      }
    })
  }

  return (
    <div className="profile-panel">
      <div className="profile-info">
        <img className="profile-picture" src={profilePicture} onClick={handleProfilePicture} />
        <h3 className="profile-username">{user.username}</h3>
      </div>
      <button className="profile-logout" onClick={handleLogOut}>log out</button>
    </div>
  )
}

export default ProfilePanel