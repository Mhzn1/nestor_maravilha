import React from "react";
import { Routes, Route } from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import theme from "./ui/theme";
import Header from "./components/Header/page";
import Home from "./pages/HomePage";
import Clientes from "./pages/Clientes/page";
import Produtos from "./pages/Produtos/page";
import Pedidos from "./pages/Pedidos/page";
import EditClient from "./pages/Clientes/EditCliente/EditClientPage";
import CreateClient from "./pages/Clientes/CreateCliente/CreateClient";
import CreateProduto from "./pages/Produtos/CreateProduto/CreateProduto";
import EditProduct from "./pages/Produtos/EditProduto/EditProduto";
import CreatePedido from "./pages/Pedidos/CreatePedido/CreatePedido";
import PedidoPage from "./pages/Pedidos/EditPedido/EditPedido";

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Header />
        <Box as="main" py={10} px={10} bg="background">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/editclient/:id" element={<EditClient />} />
            <Route path="/editproduct/:id" element={<EditProduct />} />
            <Route path="/createclient" element={<CreateClient />} />
            <Route path="/createproduct" element={<CreateProduto />} />
            <Route path="/createorder" element={<CreatePedido/>} />
            <Route path="/editorder/:id" element={<PedidoPage/>} />
          </Routes>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default App;
