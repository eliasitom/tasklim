import "../../stylesheets/routes/tasks_route/TaskModal.css"

import { ImCross  } from "react-icons/im";

import avatar from "../../images/241251431_4230888380367945_1348050220600686703_n.jpg"

import { useState } from "react"

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

      fetch("http://localhost:8000/api/edit_task", {
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
      <div className="task-modal" onClick={e => e.stopPropagation()}>
        <header>
          <p>edit task</p>
          <ImCross onClick={handleCloseModal}/>
        </header>
        <body>
          <div className="task-modal-information">
            <div className="task-modal-user-information">
              <img src={avatar} />
              <p>Elias</p>
            </div>
            <p className="task-modal-secondary-information"><b>state:</b> {task.state}</p>
            <p className="task-modal-secondary-information"><b>created at:</b> {task.createdAt}</p>
          </div>
          <div className="task-modal-body">
            <div>
              <p>edit body</p>
            </div>
            <textarea 
            className="task-modal-body-input" 
            maxLength={621}
            placeholder="The new body of your task here..."
            value={newBody}
            onChange={e => setNewBody(e.target.value)}
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