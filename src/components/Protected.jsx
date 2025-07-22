
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../loader/Loader";
import { API } from "../http";

const Protect = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await API.get("/verify");
        if (res.data.success) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (err) {
        setIsValid(false);
      }
    };

    verifyToken();
  }, []);

  if (isValid === null) return <Loader />;
  if (!isValid) return <Navigate to="/login" />;

  return <>{children}</>;
};

export default Protect;
