import React, { useEffect, useState, useCallback } from 'react'
import { useProducts } from '../contexts/products-context';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/products';
import { Product, ProductOptionValue, ProductVariants } from '../models';


function ProductPage() {
    const { id } = useParams()
    const [product, setProduct] = useState<Product>()
    const [selectedVariant, setSelectedVariant] = useState<ProductVariants>()
    const [sizeOptions, setSizeOptions] = useState<ProductOptionValue[]>([])
    const [colorOptions, setColorOptions] = useState<ProductOptionValue[]>([])
    const [selectedOptions, setSelectedOptions] = useState<number[]>([])


    function handleOptionSelect(e: any, type: string) {
        let optionsIdList: number[] = []
        if (type == 'color'){
            optionsIdList = colorOptions.map(a => a.id);
        } else if (type == 'size'){
            optionsIdList = sizeOptions.map(a => a.id);
        }
        let optionId = parseInt(e.target.id)

        console.log(optionsIdList)
        console.log(optionId)
        console.log(selectedOptions)
        for (let i = 0; i < optionsIdList.length; i++) {
            var index = selectedOptions.indexOf(optionsIdList[i]);
            if (index >= 0) { 
                selectedOptions[index] = optionId
                break; 
            }
          }
        product!.variants.map((variant) => {
            if (variant.options.includes(optionId)) {
                setSelectedVariant(variant)
            }
        })
    }


    useEffect(() => {
        if (id) {
            getProductById(id).then(data => {
                setProduct(data);
                data.variants.map((variant) => {
                    if (variant.is_default) {
                        setSelectedVariant(variant)
                        setSelectedOptions(variant.options)
                    }
                })
            });
        }
    }, []);

    const sizes = () => {
        if (product) {
            product.options.map((option) => {
                if (option.type == "size") {
                    option.values.map((size) => {
                        if (!sizeOptions.includes(size)) {
                            sizeOptions.push(size)
                        }
                    })
                }
            })
        }
        return (
            sizeOptions.map((size) => (
                < button key={size.id} id={size.id.toString()} className={`bg-gray-300 text-gray-700 py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 ${selectedOptions.includes(size.id) ? 'border-2 border-black' : 'border-none'}`} >
                    {size.title}
                </button>
            ))
        )
    }

    const colors = () => {
        if (product) {
            product.options.map((option) => {
                if (option.type == "color") {
                    option.values.map((color) => {
                        if (!colorOptions.includes(color)) {
                            colorOptions.push(color)
                        }
                    })
                }
            })
        }
        return (
            colorOptions.map((color) => (
                <button key={color.id} id={color.id.toString()} style={{ backgroundColor: color.colors![0] }} className={`w-6 h-6 rounded-full bg-[${color.colors![0]}] mr-2 ${selectedOptions.includes(color.id) ? 'border-2 border-black' : 'border-none'}`} onClick={(e) => handleOptionSelect(e, 'color')}></button>
            ))
        )
    }

    return (
        <div>
            {(selectedVariant && product) && (
                <div className="py-8">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row -mx-4">
                            <div className="md:flex-1 px-4">
                                <div className="h-[460px] rounded-lg bg-gray-300 mb-4">
                                    <img className="w-full h-full object-cover" src={selectedVariant.images[0].src} alt="Product Image"/>
                                </div>
                                <div className="-mx-2 mb-4">
                                    <div className="px-2">
                                        <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                            <div className="md:flex-1 px-4">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedVariant.title}</h2>
                                <p className="text-gray-600 text-sm mb-4">
                                    {product.description}
                                </p>
                                <div className="flex mb-4">
                                    <div className="mr-4">
                                        <span className="font-bold text-gray-700 ">Price:</span>
                                        <span className="text-gray-600 ">${selectedVariant.price}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-700 ">Availability:</span>
                                        <span className="text-gray-600 ">In Stock</span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <span className="font-bold text-gray-700">Select Color:</span>
                                    <div className="flex items-center mt-2">
                                        {colors()}
                                    </div>
                                </div>


                                <div className="mb-4">
                                    <span className="font-bold text-gray-700">Select Size:</span>
                                    <div className="flex items-center mt-2">
                                        {sizes()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </div >

    )
}

export default ProductPage
