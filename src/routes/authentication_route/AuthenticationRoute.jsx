import { useContext, useEffect, useState } from "react"
import "../../stylesheets/routes/authentication_route/AuthenticationRoute.css"
import MagicNote from "./MagicNote"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../contexts/UserContext"

const AuthenticationRoute = () => {
  const navigate = useNavigate()
  const { setMyUser } = useContext(UserContext)

  const [authMethod, setAuthMethod] = useState(false) // false => login, true => signup

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [authAlert, setAuthAlert] = useState("")


  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user")) !== null) {
      const authToken = localStorage.getItem("authToken")
      fetch(`https://tasklim-server.onrender.com/api/verify_user/${authToken}`, {
        method: "GET"
      })
        .then(response => response.json())
        .then(res => {
          console.log(res)
          if (res.message === "valid token") {
            navigate("/")
          }
        })
        .catch(error => console.log(error))
    }
  }, [])

  const handleSignUp = (e) => {
    e.preventDefault()

    if (username && password && confirmPassword) {
      if (username.length < 3) return alert("Your username must contain more than three characters")
      if (password.length < 7) return alert("The password is too short! Someone could steal your account D:")

      if (password === confirmPassword) {
        fetch("https://tasklim-server.onrender.com/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        })
          .then(response => response.json())
          .then(res => {
            console.log(res)
            localStorage.setItem("authToken", res.token)
            localStorage.setItem("user", JSON.stringify(res.user._id))
            setMyUser(res.user)
            navigate("/")
          })
          .catch(error => console.log(error))
      } else {
        alert("Passwords do not match")
      }
    } else {
      alert("You need to include all credentials")
    }
  }

  const handleLogIn = (e) => {
    e.preventDefault()

    if (username && password) {
      setLoading(true)
      fetch("https://tasklim-server.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
        .then(response => response.json())
        .then(res => {
          if (res.message === "session logged in successfully") {
            localStorage.setItem("authToken", res.token)
            localStorage.setItem("user", JSON.stringify(res.user._id))
            setMyUser(res.user)
            navigate("/")
          } else if (res.message === "user not found") {
            setAuthAlert("User not found")
          } else if (res.message === "incorrect password") {
            setAuthAlert("Incorrect password")
          }
          setLoading(false)
        })
        .catch(error => {
          console.log(error)
          setLoading(false)
          setAuthAlert("Internal error has ocurred, please try again")
        })
    } else {
      alert("You need to include all credentials")
    }
  }

  const handleSwitch = () => {
    setAuthMethod(!authMethod)
  }

  useEffect(() => {
    setTimeout(() => {
      setAuthAlert("")
    }, 10000);
  }, [authAlert])

  return (
    <div className="auth-main">
      <div className="auth-form-main">
        <div className="auth-form-header">
          <p className="auth-method-title">{authMethod ? "sign up" : "log in"}</p>
          <p className="auth-method-switch" onClick={handleSwitch}>{!authMethod ? "sign up" : "log in"}</p>
        </div>
        {
          !authMethod ?
            <form className="auth-form" onSubmit={handleLogIn}>
              <input
                placeholder="Username..."
                onChange={e => setUsername(e.target.value)}
                value={username} />
              <input
                type="password"
                placeholder="Password..."
                onChange={e => setPassword(e.target.value)}
                value={password} />
              <button className={loading ? "disabled" : ""} disabled={loading}>log in</button>
              <p className="auth-alert">{authAlert ? "*" + authAlert : ""}</p>
            </form> :
            <form className="auth-form" onSubmit={handleSignUp}>
              <input
                placeholder="Username..."
                maxLength={11}
                onChange={e => setUsername(e.target.value)}
                value={username} />
              <input
                type="password"
                placeholder="Password..."
                onChange={e => setPassword(e.target.value)}
                value={password} />
              <input
                type="password"
                placeholder="Confirm password..."
                onChange={e => setConfirmPassword(e.target.value)}
                value={confirmPassword} />
              <button>sign up</button>
            </form>
        }
      </div>
      <MagicNote />
    </div>
  )
}

export default AuthenticationRoute