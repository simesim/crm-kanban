import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Layout from "./components/Layout/Layout";
import Login from "./pages/Login/Login";
import Boards from "./pages/Boards/Boards";
import Board from "./pages/Board/Board";
import NotFound from "./pages/NotFound/NotFound";
import ToastHost from "./components/UI/ToastHost";

import { refreshThunk } from "./store/auth/slice";
import { selectAuthReady, selectIsAuthed } from "./store/auth/selectors";
import Spinner from "./components/UI/Spinner";

function Protected({ children }) {
  const authed = useSelector(selectIsAuthed);
  const ready = useSelector(selectAuthReady);

  if (!ready) {
    return (
      <div style={{ padding: 18 }}>
        <Spinner label="Loading session..." />
      </div>
    );
  }

  if (!authed) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const dispatch = useDispatch();
  const ready = useSelector(selectAuthReady);

  useEffect(() => {
    dispatch(refreshThunk());
  }, [dispatch]);

  // keep first paint stable
  if (!ready) {
    return (
      <div style={{ padding: 18 }}>
        <Spinner label="Starting..." />
        <ToastHost />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <Protected>
              <Layout />
            </Protected>
          }
        >
          <Route path="/" element={<Navigate to="/boards" replace />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/boards/:boardId" element={<Board />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastHost />
    </BrowserRouter>
  );
}
