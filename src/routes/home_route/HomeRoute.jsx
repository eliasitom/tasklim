import { useEffect } from "react";
import "../../stylesheets/routes/home_route/HomeRoute.css"

import ProfilePanel from "./ProfilePanel";
import FriendsPanel from "./FriendsPanel";

import { useNavigate } from "react-router-dom";


const HomeRoute = () => {
  const navigate = useNavigate()

  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem("user")))
    if (JSON.parse(localStorage.getItem("user")) === null) {
      navigate("/auth")
    }
  }, [])

  return (
    <div className="home-route">
      <ProfilePanel />
      <FriendsPanel />
    </div>);
};

export default HomeRoute;
