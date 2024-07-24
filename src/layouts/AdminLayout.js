import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      <nav className="w-64 bg-gray-800 text-white h-screen p-5">
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <ul className="mt-5">
          <li>
            <Link to="/admin/dashboard" className="block py-2">
              News
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="block py-2">
              News List
            </Link>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-5">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
