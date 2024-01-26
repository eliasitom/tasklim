import "../../../stylesheets/routes/tasks_route/my_tasks/TaskModal.css";

import { ImCross  } from "react-icons/im";

import { ProfilePictures } from "../../../images/images";

import { useState } from "react"

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

const TaskModal = ({ task, closeModal, taskChanged }) => {

  const [newBody, setNewBody] = useState(task.body)

  const handleCloseModal = (e) => {
    e.stopPropagation()
    closeModal()
  }

  const handleSubmit = () => {
    if(newBody) {
      const newTask = {
        newBody: newBody,
        newColor: task.color,
        taskId: task._id
      }

      fetch("https://tasklim-server.onrender.com/api/edit_task", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newTask)
      })
      .then(() => {
        taskChanged(newBody)
      })
    } else {
      alert("You need to add a body to the task")
    }
  }

  return (
    <div className="task-modal-background" onClick={handleCloseModal}>
      <div className="task-modal" onClick={e => e.stopPropagation()} style={{backgroundColor: mainColors[task.color]}}>
        <header style={{backgroundColor: secondaryColors[task.color]}}>
          <ImCross onClick={handleCloseModal}/>
        </header>
        <body>
          <div className="task-modal-information">
            <div className="task-modal-user-information">
              <img src={ProfilePictures[task.createdBy.profilePicture]} />
              <p>{task.createdBy.username}</p>
            </div>
            <p className="task-modal-secondary-information"><b>state:</b> {task.state}</p>
            <p className="task-modal-secondary-information"><b>created at:</b> {task.createdAt}</p>
          </div>
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
            style={{backgroundColor: secondaryColors[task.color]}}
            />
            <div>
              <button onClick={handleSubmit}>submit</button>
            </div>
          </div>
        </body>
      </div>
    </div>
  )
}

export default TaskModal