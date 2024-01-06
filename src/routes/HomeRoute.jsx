



const HomeRoute = () => {
  return (
    <div className="home-route">
      <button onClick={() => {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
      }}>remove token</button>
    </div>);
};

export default HomeRoute;
