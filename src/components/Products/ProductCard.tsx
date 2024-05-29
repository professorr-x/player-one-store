import React, {useState} from 'react'
import { Product, ProductVariantImage } from '../../models';
import { Link } from "react-router-dom";

interface IProps {
    product: Product;
}

function ProductCard({ product }: IProps) {
    const {
        id,
        title,
        variants,
        images,
        selectable_colors
    } = product;

    const [image, setImage] = useState<ProductVariantImage>()

    const renderColors = () => {
        return selectable_colors.map((color) => (
            <button
                key={color.id}
                id={color.id.toString()}
                style={{ backgroundColor: color.colors![0] }}
                className={`w-6 h-6 rounded-full border border-gray-300 bg-[${color.colors![0]}]`}
            ></button>
        ));
    };

    for (let i = 0; i < variants.length; i++) {
        if (variants[i].is_default){
            setImage(variants[i].images[0])
        }
      }
    

    return (
        <Link to={{
            pathname: `/products/${id}`,
        }}>
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow mx-auto my-8">
                <img className="p-8 rounded-t-lg" src={image!.src} alt="product image" />
                <div className="grid grid-cols-10 gap-y-4 mt-4 p-4">
                    {renderColors()}
                </div>
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
