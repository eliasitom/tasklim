import { useEffect, useState } from "react";


const MagicNote = () => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")


  const [titles, setTitles] = useState(["Mini Notes", "Shopping list", "Call reminder", "Tasks of the day", "List of movies"])
  const [bodies, setBodies] = useState(["An excellent option for creating notes and managing your tasks. All in a simple, elegant, and free way :)", "Milk, bread, eggs.", "Call mom at 6 PM.", "Respond to emails, meeting at 11 AM.", "Watch Inception tonight."])
  const [typingSpeed, setTypingSpeed] = useState(70)
  const [titleIndex, setTitleIndex] = useState(0)

  const [animationMode, setAnimationMode] = useState(false)


  useEffect(() => {
    titleTyping()

    setAnimationMode(true)
    setTimeout(() => {
      setAnimationMode(false)
    }, 200);
  }, [titleIndex]);


  //Typing 

  const titleTyping = () => {
    let currentTitle = ""
    setTitle("")

    const titleInterval = setInterval(() => {
      const titleLength = titles[titleIndex].length

      if (currentTitle.length < titleLength) {
        currentTitle = titles[titleIndex].substring(0, currentTitle.length + 1)
        setTitle(currentTitle)
      } else {
        bodyTyping(titleIndex)
        clearInterval(titleInterval)
      }
    }, typingSpeed);
  }

  const bodyTyping = (index) => {
    let currentBody = ""
    setBody("")

    const bodyInterval = setInterval(() => {
      const bodyLength = bodies[index].length
      if (currentBody.length < bodyLength) {
        currentBody = bodies[index].substring(0, currentBody.length + 1)
        setBody(currentBody)
      } else {
        clearInterval(bodyInterval)
        setTimeout(() => {
          setTitle("")
          setBody("")
          setTitleIndex(prev => {
            if (prev === titles.length - 1) {
              return 0
            } else {
              return prev + 1
            }
          })
        }, titleIndex == 0 ? 3500 : 2000);
      }
    }, typingSpeed);
  }

  // Color and animation




  return (
    <div className={`note ${animationMode ? "note-shake" : ""}`} style={{backgroundColor: "var(--color-2)"}}>
      <p
        className="note-title"
        style={{backgroundColor: "var(--color-2-hover)"}}
      >
        {title}
      </p>
      <p
        className="note-body"
        style={{backgroundColor: "var(--color-2-hover)"}}
      >
        {body}
      </p>

    </div>
  )
}

export default MagicNote