import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./dashboard/sidebar";
import Navbar from "./dashboard/navbar";
import { HelmetProvider, Helmet } from "react-helmet-async";
import "../../style/sidebar.css";
import "../../style/sb-admin-2.css";

export default function Dashboard() {
  const { user, loggedIn } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  if (!loggedIn && !token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return null; // Yuklanish jarayoni
  }

  return (
    <div id="page-top">
      <HelmetProvider>
        <Helmet>
          <title>Admin Panel</title>
        </Helmet>
      </HelmetProvider>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Navbar />

            <div className="container-fluid">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
