import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inicio from "./components/Inicio";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Error404 from "./components/Error404";
import AddProduct from "./components/AddProduct";
import Carrito from "./components/Carrito";
import Perfil from "./components/Perfil";
import PanelVendedor from "./components/PanelVendedor";
import ModificarProductoIndiv from "./components/ModificarProductoIndiv";
import PerfilPublico from "./components/PerfilPublico";
import Calificacion from "./components/Calificacion";
import Orden from "./components/Orden";
import VerOrden from "./components/VerOrden";



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
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/panel-vendedor" element={<PanelVendedor />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/modificar/:productId" element={<ModificarProductoIndiv/>} />
                <Route path="/perfil-publico/:userId" element={<PerfilPublico />} />
                <Route path="/calificacion/:userId" element={<Calificacion />} />
                <Route path="/orden" element={<Orden/>} />
                <Route path="/ver-orden" element={<VerOrden/>} />

            </Routes>
        </BrowserRouter>
    </div>

    );
  }

  export default App;