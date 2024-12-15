import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/authentication/Login";
import { Signup } from "./pages/authentication/Signup";
import { AuthProvider } from "./context/AuthProvider";
import { Dashboard } from "./pages/Dashboard";

import { useAuth } from '@/context/AuthProvider';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return element;
};


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;