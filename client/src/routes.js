import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import Layout from "./components/Layout/Layout";

const Login = lazy(() => import("./pages/Login/Login"));
const Boards = lazy(() => import("./pages/Boards/Boards"));
const Board = lazy(() => import("./pages/Board/Board"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

function PrivateRoute({ isAuth, children }) {
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes({ isAuth }) {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute isAuth={isAuth}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/boards" replace />} />
          <Route path="boards" element={<Boards />} />
          <Route path="boards/:id" element={<Board />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
