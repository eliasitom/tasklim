import "../../stylesheets/routes/home_route/ProfilePanel.css"

import { useState, useEffect } from "react";
import useMyUser from "../../custom_hooks/useMyUser";
import { useNavigate } from "react-router-dom"

import { MdEdit } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

import { NotificationsPanel } from "./NotificationsPanel"

import ProfilePicture0 from "../../images/ProfilePicture0.png"
import ProfilePicture1 from "../../images/ProfilePicture1.png"
import ProfilePicture2 from "../../images/ProfilePicture2.png"
import ProfilePicture3 from "../../images/ProfilePicture3.png"
import ProfilePicture4 from "../../images/ProfilePicture4.png"
import ProfilePicture5 from "../../images/ProfilePicture5.png"
import ProfilePicture6 from "../../images/ProfilePicture6.png"
import ProfilePicture7 from "../../images/ProfilePicture7.png"
import ProfilePicture8 from "../../images/ProfilePicture8.png"
import ProfilePicture9 from "../../images/ProfilePicture9.png"
import ProfilePicture10 from "../../images/ProfilePicture10.png"
import genericProfilePicture from "../../images/ProfilePictureDefault.png"

const profilePictures = [
  ProfilePicture0,
  ProfilePicture1,
  ProfilePicture2,
  ProfilePicture3,
  ProfilePicture4,
  ProfilePicture5,
  ProfilePicture6,
  ProfilePicture7,
  ProfilePicture8,
  ProfilePicture9,
  ProfilePicture10,
  genericProfilePicture
]

const ProfilePanel = () => {
  const navigate = useNavigate()

  const myUserObject = useMyUser();
  const [myUser, setMyUser] = useState(null);

  const [newProfilePicture, setNewProfilePicture] = useState(null)

  const [editMode, setEditMode] = useState(false)
  const [newUsername, setNewUsername] = useState("")

  const [section, setSection] = useState(false) // false => profile, true => notifications



  useEffect(() => {
    if (myUserObject.loading) return

    if (!myUser) setMyUser(myUserObject.myUser)
  }, [myUserObject])


  const handleLogOut = () => {
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


  if (myUserObject.loading) return (
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
          </div>
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