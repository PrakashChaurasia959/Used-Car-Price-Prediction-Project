import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Login      from "./pages/Login";
import Register   from "./pages/Register";
import Dashboard  from "./pages/Dashboard";
import Predict    from "./pages/Predict";
import History    from "./pages/History";
import Profile    from "./pages/Profile";
import EMI        from "./pages/EMI";
import About      from "./pages/About";
import Compare    from "./pages/Compare";

function P({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<Navigate to="/login" replace />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/dashboard" element={<P><Dashboard /></P>} />
          <Route path="/predict"   element={<P><Predict /></P>} />
          <Route path="/history"   element={<P><History /></P>} />
          <Route path="/profile"   element={<P><Profile /></P>} />
          <Route path="/emi"       element={<P><EMI /></P>} />
          <Route path="/about"     element={<P><About /></P>} />
          <Route path="/compare"   element={<P><Compare /></P>} />
          <Route path="*"          element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
