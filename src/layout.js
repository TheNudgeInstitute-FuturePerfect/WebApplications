import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div
        className="p-1"
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
    </>
  );
};

export default Layout;
