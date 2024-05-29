import React, { FC, useState } from "react";
import { SolanaWalletContext } from "../src/contexts/solana-wallet-context";
import Navbar from "./components/NavBar/index";
import Store from "./pages/Store";
import ProductPage from "./pages/Product";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProductVariants } from "./models";
import CheckoutPage from "./pages/Checkout";

require("./App.css");

const App: FC = () => {
  const [cartItems, setCartItems] = useState<ProductVariants[]>([]);
  return (
    <SolanaWalletContext>
      <Navbar cartItems={cartItems} setCartItems={setCartItems} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Store />} />
          <Route
            path="/products/:id"
            element={
              <ProductPage setCartItems={setCartItems} cartItems={cartItems} />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage  />
            }
          />
        </Routes>
      </BrowserRouter>
    </SolanaWalletContext>
  );
};

export default App;
