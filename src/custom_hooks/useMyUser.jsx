import { useEffect, useState } from "react"


const useMyUser = () => {
  const userId = JSON.parse(localStorage.getItem("user"))

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);


  useEffect(() => {
    fetch(`http://localhost:8000/api/get_user_by_id/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(res => {
        setUser(res.user)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setError(err)
      })
  }, [])

  return {myUser: user, loading, error}
}

export default useMyUser