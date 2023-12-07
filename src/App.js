import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inicio from "./components/Inicio";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Error404 from "./components/Error404";



function App() {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path ="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route component = {Error404}/>
            </Routes>
        </BrowserRouter>
    </div>

    );
  }

  export default App;