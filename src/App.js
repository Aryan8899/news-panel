//

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./components/News";
import UserManagementPage from "./pages/NewsList";
import Signup from "./signup/Signup";
import SignIn from "./signup/SignIn";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
