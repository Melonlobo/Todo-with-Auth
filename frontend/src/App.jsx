import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Register from "./Register";
import PageNotFound from "./PageNotFound";
import ProtectedPages from "./ProtectedPages";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedPages />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="signin" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="signup" element={<Register />} />
      </Routes>
    </Router>
  );
}
