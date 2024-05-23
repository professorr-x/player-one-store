import React from 'react'
import { Product } from '../../models';
import { useLocation, Link } from "react-router-dom";

interface IProps {
    product: Product;
}

function ProductCard({ product }: IProps) {
    const {
        id,
        title,
        variants,
        images
    } = product;
    return (
        <Link to={{
            pathname: `/products/${id}`,
          }}>
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow mx-auto my-8">
                <img className="p-8 rounded-t-lg" src={images[0].src} alt="product image" />
                <div className="px-5 pb-5">
                    <a href="#">
                        <h5 className="text-xl tracking-tight text-gray-600">{title}</h5>
                    </a>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-purple-600">{variants[0].sol_price.toFixed(2)} SOL</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard
