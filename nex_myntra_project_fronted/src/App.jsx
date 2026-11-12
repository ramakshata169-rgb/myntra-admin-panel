
import {BrowserRouter,Routes,Route, Navigate,} from "react-router-dom";
import Login from "./assets/pages/Login";
import ForgotPassword from "./assets/pages/ForgotPassword";
import Dashboard from "./assets/pages/dashboard";
import "./App.css";
import './index.css'
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        /> 

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
