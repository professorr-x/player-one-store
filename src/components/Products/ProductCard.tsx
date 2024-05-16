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
                        <h5 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h5>
                    </a>
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-gray-900e">$ {(variants[0].price) / 100}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard
