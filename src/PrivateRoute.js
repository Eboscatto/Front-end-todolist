import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuth(false);
      return;
    }

    fetch("http://localhost:8080/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 200) setIsAuth(true);
        else setIsAuth(false);
      })
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <p>Carregando...</p>;

  return isAuth ? children : <Navigate to="/" />;
}

export default PrivateRoute;