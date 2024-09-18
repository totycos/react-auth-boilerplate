import { Link } from "react-router-dom";
import reactLogo from "../assets/react.svg";
import { useAuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const { logout, isAuthenticated } = useAuthContext();
  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <Link to={"/"}>
        <img src={reactLogo} alt="logo" />
      </Link>
      <Link to={"/"}>Home</Link>
      {isAuthenticated ? (
        <a onClick={handleLogout}>Logout</a>
      ) : (
        <>
          <Link to={"/register"}>Register</Link>
          <Link to={"/login"}>Login</Link>
        </>
      )}
    </div>
  );
};

export default Navbar;
