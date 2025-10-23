import {Outlet} from "react-router-dom";
import AppNavbar from "./AppNavbar";
import AppFooter from "./AppFooter";
import "../css/Layout.css";

function Layout() {
  return (
    <>
      <div className="layout-container">
        <AppNavbar></AppNavbar>
        <Outlet></Outlet>
        <AppFooter></AppFooter>
      </div>
    </>
  );
}

export default Layout;
