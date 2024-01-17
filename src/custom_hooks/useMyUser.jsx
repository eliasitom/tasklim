import { useEffect, useState } from "react"


const useMyUser = () => {
  const userId = JSON.parse(localStorage.getItem("user"))

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);


  useEffect(() => {
    getMyUser()
  }, [])

  const getMyUser = () => {
    // Devolvemos la promesa resultante de fetch
    return fetch(`http://localhost:8000/api/get_user_by_id/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(res => {
        // Actualizamos el estado (asumiendo que setUser está definido en el ámbito externo)
        setUser(res.user);
        setLoading(false);
        // Devolvemos res.user para que esté disponible en la cadena de promesas
        return res.user;
      })
      .catch(err => {
        console.log(err);
        setError(err);
        // También puedes lanzar el error nuevamente para que esté disponible en la cadena de promesas
        throw err;
      });
  };

  return { getMyUser, myUser: user, loading, error }
}

export default useMyUser