import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ProductsProvider } from './contexts/products-context';
import { CartProvider } from './contexts/cart-context';

ReactDOM.render(
    <React.StrictMode>
        <ProductsProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </ProductsProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
