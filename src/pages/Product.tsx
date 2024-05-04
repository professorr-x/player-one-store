import React from 'react'
import { IProduct } from '../models';

interface IProps {
    product: IProduct;
  }

function Product({ product }: IProps) {
    const {
        sku,
        title,
        price,
        installments,
        currencyId,
        currencyFormat,
        isFreeShipping,
      } = product;
    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow mx-auto my-8">
            <img className="p-8 rounded-t-lg" src="https://i.ebayimg.com/images/g/qA4AAOSwYO9gtRog/s-l1600.jpg" alt="product image" />
            <div className="px-5 pb-5">
                <a href="#">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h5>
                </a>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900e">{price}</span>
                    <a href="#" className="bg-yellow-300 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Add to cart</a>
                </div>
            </div>
        </div>

    )
}

export default Product
