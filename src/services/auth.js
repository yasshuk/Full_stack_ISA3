export const logout = () => {

  // Remove authentication data
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");

  // Go to login page
  window.location.href = "/login";
};