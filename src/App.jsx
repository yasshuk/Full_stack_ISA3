import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";

import Components from "./pages/Components";
import AddComponent from "./pages/AddComponent";
import EditComponent from "./pages/EditComponent";
import ScanQR from "./pages/ScanQR";
import ComponentDetails from "./pages/ComponentDetails";
import Tutorial from "./pages/Tutorial";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ==========================================
            PUBLIC ROUTES
            ========================================== */}

        <Route
          path="/"
          element={<Splash />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />


        {/* ==========================================
            ADMIN DASHBOARD
            ADMIN ONLY
            ========================================== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            ADD COMPONENT
            ADMIN ONLY
            ========================================== */}

        <Route
          path="/add-component"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <AddComponent />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            EDIT COMPONENT
            ADMIN ONLY
            ========================================== */}

        <Route
          path="/edit-component"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <EditComponent />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            STUDENT DASHBOARD
            STUDENT ONLY
            ========================================== */}

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["student"]}
            >
              <StudentDashboard />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            COMPONENTS
            STUDENT + ADMIN
            ========================================== */}

        <Route
          path="/components"
          element={
            <ProtectedRoute
              allowedRoles={[
                "student",
                "admin"
              ]}
            >
              <Components />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            SCAN QR
            STUDENT ONLY
            ========================================== */}

        <Route
          path="/scan-qr"
          element={
            <ProtectedRoute
              allowedRoles={["student"]}
            >
              <ScanQR />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            COMPONENT DETAILS
            STUDENT + ADMIN
            ========================================== */}

        <Route
          path="/component-details"
          element={
            <ProtectedRoute
              allowedRoles={[
                "student",
                "admin"
              ]}
            >
              <ComponentDetails />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            TUTORIAL
            STUDENT + ADMIN
            ========================================== */}

        <Route
          path="/tutorial/:id"
          element={
            <ProtectedRoute
              allowedRoles={[
                "student",
                "admin"
              ]}
            >
              <Tutorial />
            </ProtectedRoute>
          }
        />


      </Routes>

    </BrowserRouter>

  );

}


export default App;