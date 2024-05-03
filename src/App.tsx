
import React, { FC, useEffect } from 'react';
import { SolanaWalletContext } from '../src/contexts/solana-wallet-context'
import Navbar from './components/NavBar/index'
import { useProducts } from './contexts/products-context';

require('./App.css');

const App: FC = () => {
    // const { isFetching, products, fetchProducts } = useProducts();

    // useEffect(() => {
    //     fetchProducts();
    //   }, [fetchProducts]);

    // console.log(products)
    return (
        <SolanaWalletContext>
            <div>
                <Navbar />
            </div>
            {/* <p>{products?.length} Product(s) found</p> */}

        </SolanaWalletContext>
    );
};


export default App;
