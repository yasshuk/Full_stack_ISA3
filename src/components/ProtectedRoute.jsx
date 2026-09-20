import { Navigate } from "react-router-dom";


function ProtectedRoute({
  children,
  allowedRoles = []
}) {

  // ==========================================
  // GET TOKEN
  // ==========================================

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");


  // ==========================================
  // GET USER
  // ==========================================

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");


  let user = null;


  try {

    if (storedUser) {

      user = JSON.parse(storedUser);

    }

  } catch (error) {

    console.error(
      "Invalid stored user data:",
      error
    );

    // Remove corrupted user data
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

  }


  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!token || !user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // ==========================================
  // ROLE CHECK
  // ==========================================

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {

    // Student trying to access admin page
    if (user.role === "student") {

      return (
        <Navigate
          to="/student/dashboard"
          replace
        />
      );

    }


    // Admin trying to access student page
    if (user.role === "admin") {

      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );

    }


    // Unknown role
    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // ==========================================
  // ACCESS GRANTED
  // ==========================================

  return children;

}


export default ProtectedRoute;