
import React, { FC } from 'react';
import { SolanaWalletContext } from '../src/contexts/solana-wallet-context'
import Navbar from './components/NavBar/index'
import Store from './pages/Store';
import ProductPage from './pages/Product';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

require('./App.css');

const App: FC = () => {

    return (
        <SolanaWalletContext>
            <Navbar />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Store/>} />
                    <Route path="/products/:id" element={<ProductPage/>} />
                </Routes>
            </BrowserRouter>
        </SolanaWalletContext>
    );
};


export default App;
