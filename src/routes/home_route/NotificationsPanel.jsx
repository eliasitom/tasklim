import { useContext, useEffect, useState } from "react"
import "../../stylesheets/routes/home_route/NotificationsPanel.css"

import { UserContext } from "../../contexts/userContext.jsx";



const NotificationItem = ({ notification, notificationDeleted }) => {
  const { myUser, setMyUser } = useContext(UserContext)

  const [loading, setLoaging] = useState(false)

  const handleDenyFriendRequest = () => {
    fetch(`https://tasklim-server.onrender.com/api/deny_friend_request/${notification.to}/${notification.from}/${notification._id}`, {
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
    setLoaging(true)

    fetch(`https://tasklim-server.onrender.com/api/accept_friend_request/${notification.to}/${notification.from}/${notification._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(res => {
        setMyUser(res.user)
        notificationDeleted(notification._id)
        setLoaging(false)
      })
      .catch(err => console.log(err))
  }

  const handleAcceptKanbanNotification = () => {
    fetch(`https://tasklim-server.onrender.com/api/delete_notification/${myUser._id}/${notification._id}`, {
      method: "DELETE",
    })
      .then(response => response.json())
      .then((res) => {
        setMyUser(res.user)
        notificationDeleted(notification._id)
      })
      .catch(err => console.log(err))
  }

  const handleAcceptKanbanInvitation = () => {
    setLoaging(true)

    fetch(`https://tasklim-server.onrender.com/api/accept_kanban_invitation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kanbanName: notification.kanbanName,
        newMember: myUser.username,
        notificationId: notification._id
      })
    })
      .then(response => response.json())
      .then((res) => {
        setMyUser(res.user)
        setLoaging(false)
      })
      .catch(err => console.log(err))
  }

  const handleDenyKanbanInvitation = () => {
    fetch(`https://tasklim-server.onrender.com/api/deny_kanban_invitation/${notification.kanbanName}/${myUser.username}/${notification._id}`, {
      method: "DELETE",
    })
      .then(() => {
        notificationDeleted(notification._id)
      })
      .catch(err => console.log(err))
  }

  const notificationMessage = () => {
    const type = notification.notificationType

    switch (type) {
      case "friend request":
        return " wants to be your friend"
        break;
      case "new kanban":
        return " has created a new shared kanban: "
        break;
      case "new shared task":
        return " posted a new task in "
        break;
      case "new task comment":
        return " commented on a task in "
        break;
      case "kanban invitation request":
        return " has invited you to be part of a shared kanban: "
        break;
    }
  }
  const notificationLastWord = () => {
    const type = notification.notificationType

    if (
      type === "new kanban" ||
      type === "new shared task" ||
      type === "new task comment" ||
      type === "kanban invitation request") {

      return <b>{notification.kanbanName}</b>
    }

  }
  const notificationOptions = () => {
    const type = notification.notificationType

    if (type === "friend request") {
      return (
        <>
          <button onClick={handleDenyFriendRequest} >deny</button>
          <button onClick={handleAcceptFriendRequest} disabled={loading} className={loading ? "disabled" : ""}>accept</button>
        </>
      )
    } else if (
      type === "new kanban" ||
      type === "new shared task" ||
      type === "new task comment") {
      return <button onClick={handleAcceptKanbanNotification}>accept</button>
    } else if (type === "kanban invitation request") {
      return (
        <>
          <button onClick={handleDenyKanbanInvitation} >deny</button>
          <button onClick={handleAcceptKanbanInvitation} disabled={loading} className={loading ? "disabled" : ""}>accept</button>
        </>
      )
    }
  }

  return (
    <div className="notification-item">
      <p className="notification-item-body">
        <b>{notification.from}</b>
        {
          notificationMessage()
        }
        {
          notificationLastWord()
        }
      </p>

      <div className="notification-item-options">
        {
          notificationOptions()
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

    fetch(`https://tasklim-server.onrender.com/api/get_notifications/${myUser._id}`, {
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