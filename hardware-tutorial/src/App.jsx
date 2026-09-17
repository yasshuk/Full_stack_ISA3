import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";

import Components from "./pages/Components";
import AddComponent from "./pages/AddComponent";
import ScanQR from "./pages/ScanQR";
import ComponentDetails from "./pages/ComponentDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin Pages */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/add-component" element={<AddComponent />} />

        {/* Student Pages */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/scan-qr" element={<ScanQR />} />

        {/* Common Pages */}
        <Route path="/components" element={<Components />} />
        <Route path="/component-details" element={<ComponentDetails />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;