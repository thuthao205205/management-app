import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Expenses from "../pages/Expenses";
import Income from "../pages/Income";
import Categories from "../pages/Categories";
import Statistics from "../pages/Statistics";
import Budget from "../pages/Budget";
import Profile from "../pages/Profile";

import { useAuth } from "../context/AuthContext";

export default function AppRouter() {
  const { user } = useAuth();



  const RequireAuth = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  const PublicOnly = ({ children }) => {
    if (user) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnly>
              <Register />
            </PublicOnly>
          }
        />

        {/* Main */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        {/*Expenses */}
        <Route
          path="/expenses"
          element={
            <RequireAuth>
              <Expenses />
            </RequireAuth>
          }
        />
        <Route
          path="/income"
          element={
            <RequireAuth>
              <Income />
            </RequireAuth>
          }
        />
        <Route
          path="/categories"
          element={
            <RequireAuth>
              <Categories />
            </RequireAuth>
          }
        />
        <Route
          path="/statistics"
          element={
            <RequireAuth>
              <Statistics />
            </RequireAuth>
          }
        />
        <Route
          path="/budget"
          element={
            <RequireAuth>
              <Budget />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

