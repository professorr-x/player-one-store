import React, { useState, useEffect } from 'react'
import { Product } from '../../models';
import { Link } from "react-router-dom";

interface IProps {
    product: Product;
}

function ProductCard({ product }: IProps) {
    const [image, setImage] = useState<string>("")
    const {
        id,
        title,
        variants,
        images,
        selectable_colors
    } = product;

    useEffect(() => {
        const imageList: string[] = []
        for (let i = 0; i < images.length; i++) {
            if (images[i].is_default) {
                imageList.push(images[i].src)
            }
        }
        setImage(imageList[Math.floor(Math.random() * imageList.length)])
    }, [])

    const renderColors = () => {
        return selectable_colors?.map((color) => (
            <div
                key={color.id}
                id={color.id.toString()}
                style={{ backgroundColor: color.colors![0] }}
                className={`w-6 h-6 rounded-full bg-[${color.colors![0]}] mr-2 border border-gray-500`}
            ></div>
        ));
    };

    return (
        <Link to={{
            pathname: `/products/${id}`,
        }}>
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow mx-auto my-8">
                <img className="p-8 rounded-t-lg" src={image} alt="product image" />
                <div className="px-5 pb-5">
                    <div className="grid grid-cols-10 gap-y-4 mb-4">
                        {renderColors()}
                    </div>
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
