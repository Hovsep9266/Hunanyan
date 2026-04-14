import React from "react";

export const ModalContext = React.createContext({
  login: "login",
  signUp: "sign Up",
  success: "success",
  sendCode: "sendCode",
});
