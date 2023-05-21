import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="container-fluid">
      <div
        className="row p-1"
        style={{
          "background-color": "#693d30",
        }}
      >
        <Link
          to="/"
          className="text-white fw-bold text-decoration-none"
          style={{ fontSize: 24 }}
        >
          Future Perfect
        </Link>
      </div>

      <Outlet />
    </div>
  );
};

export default Layout;
