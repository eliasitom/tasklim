import { useContext, useEffect, useState } from "react"
import "../../stylesheets/routes/home_route/NotificationsPanel.css"

import { UserContext } from "../../contexts/userContext.jsx";



const NotificationItem = ({ notification, notificationDeleted }) => {
  const { myUser, setMyUser } = useContext(UserContext)

  const handleDenyFriendRequest = () => {
    fetch(`http://localhost:8000/api/deny_friend_request/${notification.to}/${notification.from}/${notification._id}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(res => {
        setMyUser(res.user)
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
        setMyUser(res.user)
        notificationDeleted(notification._id)
      })
      .catch(err => console.log(err))
  }

  const handleAcceptKanbanNotification = () => {
    fetch(`http://localhost:8000/api/delete_notification/${myUser._id}/${notification._id}`, {
      method: "DELETE",
    })
      .then(response => response.json())
      .then((res) => {
        setMyUser(res.user)
        notificationDeleted(notification._id)
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="notification-item">
      <p className="notification-item-body">
        <b>{notification.from}</b>
        {notification.notificationType === "friend request" ? " wants to be your friend" :
          notification.notificationType === "new kanban" ? " has created a new shared kanban: " : ""}
        {
          notification.notificationType === "new kanban" ?
            <b>{notification.kanbanName}</b> : undefined
        }
      </p>

      <div className="notification-item-options">
        {
          notification.notificationType === "friend request" ?
            <>
              <button onClick={handleDenyFriendRequest}>deny</button>
              <button onClick={handleAcceptFriendRequest}>accept</button>
            </> :
            <button onClick={handleAcceptKanbanNotification}>accept</button>
        }
      </div>
    </div>
  )
}

export const NotificationsPanel = () => {
  const { myUser } = useContext(UserContext)

  const [notifications, setNotifications] = useState([])


  useEffect(() => {
    if (!myUser) {
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
  }, [myUser])

  const handleNotificationDelete = (notificationId) => {
    setNotifications(prev => {
      return prev.filter(elem => elem._id !== notificationId)
    })
  }




  return (
    <div className="notifications-panel">
      <div className="notifications-container">
        {
          !myUser ? <p className="notification-alert">loading...</p> :
            notifications.length > 0 ?
              notifications.map((current, index) => (
                <NotificationItem key={current._id} notification={current} notificationDeleted={handleNotificationDelete} />
              )) :
              <p className="notification-alert">Nothing new :/</p>
        }
      </div>
    </div>
  )
}