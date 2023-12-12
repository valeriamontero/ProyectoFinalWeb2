import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inicio from "./components/Inicio";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Error404 from "./components/Error404";
import AddProduct from "./components/AddProduct";
import Carrito from "./components/Carrito";



function App() {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path ="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route component = {Error404}/>
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/carrito" element={<Carrito />} />
            </Routes>
        </BrowserRouter>
    </div>

    );
  }

  export default App;