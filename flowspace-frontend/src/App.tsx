import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { BrowserRouter,Route, Routes } from "react-router-dom";
import Dashboard from "./components/dashboard/dashboard";
import Projects from "./components/projects/projects";

function App() {
  return (

      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/projects" element={<Projects/>}/>

      </Routes>
      </BrowserRouter>

  );
}

export default App;
