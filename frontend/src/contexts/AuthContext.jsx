import React, { useState, useContext } from "react";
import AppContext from "./Context";

const AuthContext = ({ children }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [success, setSuccess] = useState(false);
  // const [gender, setGender] = useState("");

  return (
    <AppContext.Provider
      value={{
        email,
        password,
        setEmail,
        setPassword,
        registerEmail,
        registerPassword,
        firstName,
        lastName,
        // gender,
        setRegisterEmail,
        setRegisterPassword,
        setFirstName,
        setLastName,
        // setGender,
        success,
        setSuccess,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AuthContext, useGlobalContext };
