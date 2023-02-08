import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useGlobalContext } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedPages = () => {
  const path = window.location.pathname;
  const navigateTo = useNavigate();
  const { success, setSuccess } = useGlobalContext();
  const getData = () => {
    if (!window.localStorage.getItem("token")) return;
    fetch("http://localhost:8000", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ token: window.localStorage.getItem("token") }),
    })
      .then((data) => data.json())
      .then((res) => {
        setSuccess(res?.success);
        if (res.success) navigateTo(path);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return success ? <Outlet /> : <Navigate to="login" />;
};

export default ProtectedPages;
