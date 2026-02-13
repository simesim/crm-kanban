import React from "react";
import { BrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import AppRoutes from "./routes";

export default function App() {
  const isAuth = useSelector((s) => s.auth.isAuth);

  return (
    <BrowserRouter>
      <AppRoutes isAuth={isAuth} />
    </BrowserRouter>
  );
}
