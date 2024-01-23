import "../../stylesheets/routes/home_route/ProfilePanel.css"

import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom"
import { MdEdit } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

import { NotificationsPanel } from "./NotificationsPanel"

import { ProfilePictures, genericProfilePicture } from "../../images/images";

const ProfilePanel = () => {
  const navigate = useNavigate()

  const { myUser, setMyUser } = useContext(UserContext)

  const [newProfilePicture, setNewProfilePicture] = useState(null)

  const [editMode, setEditMode] = useState(false)
  const [newUsername, setNewUsername] = useState("")

  const [section, setSection] = useState(false) // false => profile, true => notifications



  const handleLogOut = () => {
    setMyUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    navigate("/auth")
  }

  const handleProfilePicture = () => {
    setNewProfilePicture((prev) => {
      return prev < 10 ? prev + 1 : 0
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
        newProfilePicture !== null ? newProfilePicture : myUser.profilePicture
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
          localStorage.setItem("user", JSON.stringify(res.user._id))
          setMyUser(res.user)
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
  }


  if (!myUser) return (
    <div className="profile-panel">
      <div className="profile-info">
        <div className="profile-sections">
          <FaUser />
          <IoNotifications />
        </div>
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

  if (!editMode && myUser && !section) { /* PROFILE MODE */
    return (
      <div className="profile-panel">
        <div className="profile-info">
          <div className="profile-sections">
            <FaUser onClick={() => setSection(false)} className={!section ? "active-section" : ""} />
            <IoNotifications onClick={() => setSection(true)} className={section ? "active-section" : ""} />
            {myUser.notifications.length > 0 ? <div className="notification-icon"/> : undefined}
          </div>
          <img
            className="profile-picture"
            src={ProfilePictures[myUser.profilePicture]}
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
  } else if (myUser && section) {
    return (
      <div className="profile-panel">
        <div className="profile-sections">
          <FaUser onClick={() => setSection(false)} className={!section ? "active-section" : ""} />
          <IoNotifications onClick={() => setSection(true)} className={section ? "active-section" : ""} />
        </div>
        <NotificationsPanel />
      </div>
    )
  } else if (myUser) { /* EDIT MODE */
    return (
      <div className="profile-panel">
        <div className="profile-info">
          <img
            className="profile-picture edit-profile-picture"
            style={{ cursor: "pointer" }}
            src={ProfilePictures[newProfilePicture !== null ? newProfilePicture : myUser.profilePicture]}
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