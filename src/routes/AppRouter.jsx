import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Expenses from "../pages/Expenses";
import Categories from "../pages/Categories";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main */}
        <Route path="/" element={<Dashboard />} />
        {/*Expenses */}
        <Route path="/expenses" element={<Expenses />} />
        
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </BrowserRouter>
  );
}