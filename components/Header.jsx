import { useContext } from "react";
import { UserContext } from "./servers/context/userContext";

const Header = ({ title }) => {
  const [token, setToken] = useContext(UserContext);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="flex text-center m-6">
      <h1 className="font-bold text-3xl text-blue-600">{title}</h1>
      {token && (
        <button
          className="rounded bg-slate-600 capitalize shadow-blue300"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Header;