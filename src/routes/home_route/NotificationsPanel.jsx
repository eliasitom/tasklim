import { useEffect, useState } from "react"
import "../../stylesheets/routes/home_route/NotificationsPanel.css"

import useMyUser from "../../custom_hooks/useMyUser";






const NotificationItem = ({ notification, notificationDeleted }) => {


  const handleDenyFriendRequest = () => {
    fetch(`http://localhost:8000/api/deny_friend_request/${notification.to}/${notification.from}/${notification._id}`, {
      method: "DELETE"
    })
      .then(() => {
        notificationDeleted(notification._id)
      })
      .cath(err => console.log(err))
  }
  const handleAcceptFriendRequest = () => {
    fetch(`http://localhost:8000/api/accept_friend_request/${notification.to}/${notification.from}/${notification._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(res => {
        notificationDeleted(notification._id)
      })
  }

  return (
    <div className="notification-item">
      <p className="notification-item-body">
        <b>{notification.notificationType === "friend request" ? notification.from : ""}</b>
        {notification.notificationType === "friend request" ? " wants to be your friend" : ""}
      </p>

      <div className="notification-item-options">
        <button onClick={handleDenyFriendRequest}>deny</button>
        <button onClick={handleAcceptFriendRequest}>accept</button>
      </div>
    </div>
  )
}

export const NotificationsPanel = () => {
  const { myUser, loading, error } = useMyUser()

  const [notifications, setNotifications] = useState([])


  useEffect(() => {
    if (loading || error) {
      return
    }

    fetch(`http://localhost:8000/api/get_notifications/${myUser._id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(res => {
        if (res.notifications.length > 0) {
          setNotifications(res.notifications)
        }
      })
      .catch(err => console.log(err))
  }, [myUser, loading, error])

  const handleNotificationDelete = (notificationId) => {
    setNotifications(prev => {
      return prev.filter(elem => elem._id !== notificationId)
    })
  }




  return (
    <div className="notifications-panel">
      <div className="notifications-container">
        {
          loading ? <p className="notification-alert">loading...</p> :
            notifications.length > 0 ?
              notifications.map((current, index) => (
                <NotificationItem key={index} notification={current} notificationDeleted={handleNotificationDelete} />
              )) :
              <p className="notification-alert">Nothing new :/</p>
        }
      </div>
    </div>
  )
}