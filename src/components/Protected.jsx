import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { API } from "../http";
import Loader from "../loader/Loader";

const Protect = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const res = await API.get("/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
