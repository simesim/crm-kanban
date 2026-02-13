import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes";
import { selectIsAuth } from "./store/auth/selectors";
import { refreshThunk } from "./store/auth/thunks";

export default function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    dispatch(refreshThunk());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes isAuth={isAuth} />
    </BrowserRouter>
  );
}
