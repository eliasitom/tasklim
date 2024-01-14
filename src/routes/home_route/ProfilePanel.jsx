import "../../stylesheets/routes/home_route/ProfilePanel.css"

import { useState, useEffect } from "react";
import useMyUser from "../../custom_hooks/useMyUser";
import { useNavigate } from "react-router-dom"
import { MdEdit } from "react-icons/md";

import ProfilePicture0 from "../../images/239813940_4230888500367933_3877022374063402884_n.jpg"
import ProfilePicture1 from "../../images/241251431_4230888380367945_1348050220600686703_n.jpg"
import ProfilePicture2 from "../../images/241278413_4230888623701254_1041618554313096870_n.jpg"
import ProfilePicture3 from "../../images/241304241_4230888403701276_390456860279564516_n.jpg"
import ProfilePicture4 from "../../images/241331907_4230888460367937_1791198082846251953_n.jpg"
import ProfilePicture5 from "../../images/241372609_4230888523701264_4686595043853418143_n.jpg"
import ProfilePicture6 from "../../images/241407360_4230888517034598_3246805530277447428_n.jpg"
import genericProfilePicture from "../../images/Generic-Profile-Image.png"
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

  const { myUser, loading, error } = useMyUser()

  const [newProfilePicture, setNewProfilePicture] = useState(null)

  const [editMode, setEditMode] = useState(false)
  const [newUsername, setNewUsername] = useState("")




  const handleLogOut = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    navigate("/auth")
  }

  const handleProfilePicture = () => {
    setNewProfilePicture((prev) => {
      return prev < 6 ? prev + 1 : 0
    })
  }

  const handleSubmitChanges = async () => {
    if (!newUsername) {
      alert("You need to add a username");
      return;
    }

    try {
      const resultado = await submitChanges(
        myUser._id,
        newUsername,
        newProfilePicture ? newProfilePicture : myUser.profilePicture
      );

      if (resultado) {
        handleCancelEditMode()
      } else {
        console.log("There was a problem with submitChanges");
      }
    } catch (error) {
      console.error("Error calling submitChanges:", error);
    }
  };




  const submitChanges = (userId, newUsername_, newImage_) => {
    return new Promise((resolve, reject) => {
      fetch("http://localhost:8000/api/edit_user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          newUsername: newUsername_,
          newProfilePicture: newImage_
        })
      })
        .then(response => response.json())
        .then(res => {
          localStorage.setItem("user", JSON.stringify(res.user))
          resolve(true)
        })
        .catch(err => {
          console.log(err)
          reject(false)
        })
    })
  }


  const handleEnterEditMode = () => {
    setEditMode(true)

    setNewUsername(myUser.username)
  }
  const handleCancelEditMode = () => {
    setEditMode(false)

    setNewProfilePicture(null)
    setNewUsername("")
    setNewPassword("")
    setConfirmPassword("")
  }

  if (loading) return (
    <div className="profile-panel">
      <div className="profile-info">
        <img className="profile-picture" src={genericProfilePicture} />
        <h3 className="profile-username">Loading...</h3>
      </div>
      <div className="profile-options">
        <button disabled={true} className="profile-logout">
          log out
        </button>
        <button disabled={true} className="profile-enter-edit">
          <MdEdit />
        </button>
      </div>
    </div>
  )

  if (!editMode) { /* PROFILE MODE */
    return (
      <div className="profile-panel">
        <div className="profile-info">
          <img
            className="profile-picture"
            src={profilePictures[myUser.profilePicture]}
          />
          <h3
            className="profile-username">
            {myUser ? myUser.username : undefined}
          </h3>
        </div>
        <div className="profile-options">
          <button
            className="profile-logout"
            onClick={handleLogOut}>
            log out
          </button>
          <button
            className="profile-enter-edit"
            onClick={handleEnterEditMode}>
            <MdEdit />
          </button>
        </div>
      </div>
    )
  } else { /* EDIT MODE */
    return (
      <div className="profile-panel">
        <div className="profile-info">
          <img
            className="profile-picture"
            style={{ cursor: "pointer" }}
            src={profilePictures[newProfilePicture !== null ? newProfilePicture : myUser.profilePicture]}
            onClick={handleProfilePicture}
          />
          <input
            placeholder="New username..."
            maxLength={11}
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
          />
        </div>
        <div className="profile-edit-results">
          <button
            className="profile-edit-result"
            onClick={handleCancelEditMode}>
            cancel
          </button>
          <button
            className="profile-edit-result"
            onClick={handleSubmitChanges}>
            submit
          </button>
        </div>
      </div>
    )

  }
}

export default ProfilePanel