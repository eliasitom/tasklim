import "../../../stylesheets/routes/tasks_route/my_tasks/TaskModal.css"

import { ImCross } from "react-icons/im";
import { IoSend } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";

import { ProfilePictures } from "../../../images/images";

import { useContext, useState } from "react"
import { UserContext } from "../../../contexts/UserContext";
import useDimensions from "../../../custom_hooks/useDimensions"


const mainColors = [
  "rgb(225, 179, 88)",
  "rgb(225, 88, 88)",
  "rgb(145, 225, 88)",
  "rgb(225, 88, 182)",
];
const secondaryColors = [
  "rgb(207, 148, 81)",
  "rgb(193, 76, 76)",
  "rgb(141, 194, 76)",
  "rgb(196, 76, 158)",
];


const CommentItem = ({ comment, newColor, myUser, kanbanName, taskId, pullComment }) => {

  const handleDelete = () => {
    fetch(`https://tasklim-server.onrender.com/api/delete_shared_task_comment/${kanbanName}/${taskId}/${comment._id}`, {
      method: "DELETE"
    })
      .then(() => {
        pullComment(comment._id)
      })
  }

  return (
    <div
      className="comment-item"
      style={{ backgroundColor: secondaryColors[newColor] }}
    >
      <div className="comment-item-header">
        <img src={ProfilePictures[comment.createdBy.profilePicture]} />
        <p>{comment.createdBy.username}</p>
        {
          myUser.username === comment.createdBy.username ?
            <FaTrash onClick={handleDelete} /> : undefined
        }
      </div>
      <p className="comment-item-body">{comment.body}</p>
    </div>
  )
}

const TaskModal = ({ task, closeModal, taskChanged, kanbanName, pullTask, pushComment, pullComment }) => {
  const { myUser } = useContext(UserContext)
  const { windowWidth } = useDimensions()

  const [newBody, setNewBody] = useState(task.body)
  const [newColor, setNewColor] = useState(task.color)

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmTimer, setConfirmTimer] = useState(3)

  const [currentSection, setCurrentSection] = useState(false) // false => information, true => comments

  const [comment, setComment] = useState("")



  const handleColor = (colorIndex) => {
    setNewColor(colorIndex)
  };

  const handleCloseModal = (e) => {
    e.stopPropagation()
    closeModal()
  }

  const handleSubmit = () => {
    fetch("https://tasklim-server.onrender.com/api/edit_shared_task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newBody,
        newColor,
        taskId: task._id,
        kanbanName
      })
    })
      .then(() => {
        taskChanged(newBody, newColor)
      })
      .catch(err => console.log(err))
  }

  const confirmInterval = () => {
    setConfirmDelete(true)
    let timer = 3
    const intervalRef = setInterval(() => {
      timer--
      setConfirmTimer(timer)
      if (timer === 0) {
        setConfirmDelete(false)
        setConfirmTimer(3)
        clearInterval(intervalRef)
      }
    }, 1000);
  }

  const handleComment = (e) => {
    e.preventDefault()

    if (!comment) return alert("you can't send empty comments")

    fetch("https://tasklim-server.onrender.com/api/post_shared_task_comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: comment,
        createdBy: { username: myUser.username, profilePicture: myUser.profilePicture },
        kanbanName,
        taskId: task._id
      })
    })
      .then(response => response.json())
      .then(res => {
        pushComment(res.savedComment)
        setComment("")
      })
  }


  const responsiveStyles = {
    height: windowWidth < 1250 ? "100%" : "auto"
  }

  const informationSection = () => {
    return (
      <div className="task-modal-information" style={responsiveStyles}>
        <div className="task-modal-navbar">
          <p onClick={() => setCurrentSection(false)}
            className={!currentSection ? "task-modal-section-selected" : ""}
            style={{ backgroundColor: !currentSection ? secondaryColors[newColor] : mainColors[newColor] }}
          >
            information
          </p>
          <p
            onClick={() => setCurrentSection(true)}
            className={currentSection ? "task-modal-section-selected" : ""}
            style={{ backgroundColor: currentSection ? secondaryColors[newColor] : mainColors[newColor] }}

          >
            comments
          </p>
        </div>
        {
          !currentSection ?
            <>
              <div className="task-modal-user-information" style={{ marginTop: "10px" }}>
                <img src={ProfilePictures[task.createdBy.profilePicture]} />
                <p>{task.createdBy.username}</p>
              </div>
              <p className="task-modal-secondary-information"><b>state:</b> {task.state}</p>
              <p className="task-modal-secondary-information"><b>created at:</b> {task.createdAt}</p>
              {
                task.createdBy.username === myUser.username ?
                  <>
                    {
                      !confirmDelete ?
                        <button className="task-modal-delete-task" onClick={confirmInterval}>delete task</button>
                        :
                        <button className="task-modal-delete-task" onClick={() => pullTask(task._id)}>confirm {confirmTimer}</button>
                    }
                  </>
                  : undefined
              }
            </>
            :
            <div className="task-modal-comments-section">
              <div className="task-modal-comments-container">
                {
                  task.comments.map((current) => (
                    <CommentItem
                      key={current._id}
                      comment={current}
                      newColor={newColor}
                      myUser={myUser}
                      kanbanName={kanbanName}
                      taskId={task._id}
                      pullComment={pullComment}
                    />
                  ))
                }
              </div>
              <form className="task-modal-comments-form" onSubmit={handleComment}>
                <input
                  placeholder="send a comment..."
                  style={{ backgroundColor: secondaryColors[newColor] }}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
                <IoSend type="submit" onClick={handleComment} />
              </form>
            </div>
        }
      </div>
    )
  }


  if (!myUser) return (
    <div className="task-modal-background">
      <div className="task-modal">
        <p>loading...</p>
      </div>
    </div>
  )

  return (
    <div className="task-modal-background" onClick={handleCloseModal}>
      <div className="task-modal" onClick={e => e.stopPropagation()} style={{ backgroundColor: mainColors[newColor] }}>
        <header style={{ backgroundColor: secondaryColors[newColor] }}>
          <ImCross onClick={handleCloseModal} />
        </header>
        <body>
          {informationSection()}
          {
            (!currentSection && windowWidth < 1250) || (windowWidth > 1250) && myUser.username === task.createdBy.username ?
              <div className="task-modal-body-container">
                <div>
                  <p>edit body</p>
                </div>
                <textarea
                  className="task-modal-body-input"
                  maxLength={621}
                  placeholder="The new body of your task here..."
                  value={newBody}
                  onChange={e => setNewBody(e.target.value)}
                  style={{ backgroundColor: secondaryColors[newColor] }}
                />
                <div className="shared-task-modal-options">
                  <div className="shared-task-modal-colors-container">
                    <button className="shared-task-modal-color" onClick={() => handleColor(0)} />
                    <button className="shared-task-modal-color" onClick={() => handleColor(1)} />
                    <button className="shared-task-modal-color" onClick={() => handleColor(2)} />
                    <button className="shared-task-modal-color" onClick={() => handleColor(3)} />
                  </div>
                  <button onClick={handleSubmit}>submit</button>
                </div>
              </div>
              : (currentSection && windowWidth > 1250) ?
                <div className="task-modal-body-container">
                  <div>
                    <p>body</p>
                  </div>
                  <p
                    className="task-modal-body"
                    style={{ backgroundColor: secondaryColors[newColor] }}
                  >
                    {task.body}
                  </p>
                </div> : undefined
          }
        </body>
      </div>
    </div>
  )
}

export default TaskModal