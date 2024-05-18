import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/products";
import { Product, ProductOptionValue, ProductVariants } from "../models";
import placeholderImage from "../../src/img/placeholder.png";

function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product>();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariants>();
  const [sizeOptions, setSizeOptions] = useState<ProductOptionValue[]>([]);
  const [colorOptions, setColorOptions] = useState<ProductOptionValue[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [notAvailable, setNotAvailable] = useState<number[]>([]);

  useEffect(() => {
    const fetchProductById = async () => {
      if (id) {
        try {
          const data = await getProductById(id);

          setProduct(data);
          if (data) {
            const colors: ProductOptionValue[] = [];
            const sizes: ProductOptionValue[] = [];

            data.options.forEach((option) => {
              if (option.type === "color") {
                option.values.forEach((color) => {
                  if (!colors.some((option) => color.id === option.id)) {
                    colors.push(color);
                  }
                });
              } else if (option.type === "size") {
                option.values.forEach((size) => {
                  if (!sizes.some((option) => size.id === option.id)) {
                    sizes.push(size);
                  }
                });
              }
            });

            setColorOptions(colors);
            setSizeOptions(sizes);

            const defaultVariant = data.variants.find(
              (variant) => variant.is_default
            );
            if (defaultVariant) {
              setSelectedVariant(defaultVariant);
              setSelectedOptions([
                defaultVariant.options[1],
                defaultVariant.options[0],
              ]);

              // Initialize size options based on default color
              const defaultColorId = defaultVariant.options.find((optionId) =>
                data.options
                  .find((option) => option.type === "color")
                  ?.values.some((color) => color.id === optionId)
              );

              if (defaultColorId) {
                const selectedColorVariants = data.variants.filter((variant) =>
                  variant.options.includes(defaultColorId)
                );
                const availableSizes = selectedColorVariants
                  ?.map((variant) => {
                    return data.options
                      .find((option) => option.type === "size")
                      ?.values.find((size) =>
                        variant.options.includes(size.id)
                      );
                  })
                  .filter(
                    (size): size is ProductOptionValue => size !== undefined
                  );

                setSizeOptions(availableSizes || []);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching product by ID:", error);
        }
      }
    };

    fetchProductById();
  }, [id]);

  const handleOptionSelect = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, type: string) => {
      const optionId = parseInt(e.currentTarget.id);
      let newSelectedOptions = [...selectedOptions];

      if (type === "color") {
        const colorOptionIds = colorOptions.map((option) => option.id);
        newSelectedOptions = newSelectedOptions.filter(
          (id) => !colorOptionIds.includes(id)
        );
        newSelectedOptions.push(optionId);

        // Filter size options based on the selected color
        const selectedColorVariants = product?.variants.filter((variant) =>
          variant.options.includes(optionId)
        );

        const availableSizes = selectedColorVariants
          ?.map((variant) => {
            return product?.options
              .find((option) => option.type === "size")
              ?.values.find((size) => variant.options.includes(size.id));
          })
          .filter((size): size is ProductOptionValue => size !== undefined);
        const latestsize = availableSizes?.filter((node) => {
          const id = node.id;
          return product?.variants?.filter(
            (data) => data?.options.includes(id) && data.is_available === true
          );
        });

        setSizeOptions(availableSizes || []);
        setSelectedOptions(newSelectedOptions);
      } else if (type === "size") {
        const sizeOptionIds = sizeOptions?.map((option) => option.id);
        newSelectedOptions = newSelectedOptions?.filter(
          (id) => !sizeOptionIds?.includes(id)
        );
        newSelectedOptions.push(optionId);
        setSelectedOptions([newSelectedOptions[1], newSelectedOptions[0]]);
      }

      const newSelectedVariant = product?.variants?.find((variant) =>
        variant?.options?.every((option) =>
          newSelectedOptions?.includes(option)
        )
      );

      setSelectedVariant(newSelectedVariant);
    },
    [colorOptions, sizeOptions, selectedOptions, product]
  );

  useEffect(() => {
    const data =
      product?.variants
        ?.filter(
          (node) =>
            node?.options?.includes(selectedOptions[1]) &&
            node?.is_available === false
        )
        ?.map(({ options }) => options[1]) || [];
    setNotAvailable(data);
  }, [selectedOptions[1]]);

  const renderSizes = () => {
    return sizeOptions.map((size, i) => {
      return (
        <button
          key={size.id}
          id={size.id.toString()}
          className={`bg-gray-300 text-gray-700 py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 relative overflow-hidden ${
            selectedOptions.includes(size.id)
              ? "border-2 border-black"
              : "border-none"
          } ${
            notAvailable?.includes(size?.id)
              ? "before:w-[calc(100%-20px)] before:left-[10px] before:-translate-y-1/2 before:top-1/2 before:h-[1.5px] before:block before:absolute before:rotate-[-30deg] before:bg-black"
              : ""
          }`}
          onClick={(e) => {
            handleOptionSelect(e, "size");
          }}
        >
          {size.title}
        </button>
      );
    });
  };

  const renderColors = () => {
    return colorOptions.map((color) => (
      <button
        key={color.id}
        id={color.id.toString()}
        style={{ backgroundColor: color.colors![0] }}
        className={`w-6 h-6 rounded-full bg-[${color.colors![0]}] mr-2 ${
          selectedOptions.includes(color.id)
            ? "border-2 border-black"
            : "border-none"
        }`}
        onClick={(e) => handleOptionSelect(e, "color")}
      ></button>
    ));
  };

  return (
    <div>
      {selectedVariant && product && (
        <div className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row -mx-4">
              <div className="md:flex-1 px-4">
                <div className="h-[460px] rounded-lg bg-gray-300 mb-4">
                  {selectedVariant?.images[0]?.src ? (
                    <img
                      className="w-full h-full object-cover"
                      src={selectedVariant?.images[0]?.src || ""}
                      alt="Product Image"
                    />
                  ) : (
                    <img
                      src={placeholderImage}
                      className="object-cover h-full w-full"
                      alt="Placeholder"
                    />
                  )}
                </div>
                <div className="-mx-2 mb-4">
                  <div className="px-2">
                    <button
                      disabled={notAvailable?.includes(selectedOptions[0])}
                      className="w-full bg-gray-900 disabled:bg-[#7b7b7b] text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800"
                    >
                      {notAvailable?.includes(selectedOptions[0])
                        ? "Sold Out"
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="md:flex-1 px-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedVariant.title}
                </h2>
                <p
                  className="text-gray-600 text-sm mb-4"
                  dangerouslySetInnerHTML={{ __html: product?.description }}
                />
                <div className="flex mb-4">
                  <div className="mr-4">
                    <span className="font-bold text-gray-700 ">Price:</span>
                    <span className="text-gray-600 ">
                      ${selectedVariant.price}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-700 ">
                      Availability:
                    </span>
                    <span className="text-gray-600 ">
                      {notAvailable?.includes(selectedOptions[0])
                        ? "Out Of Stock"
                        : "In Stock"}
                    </span>
                  </div>
                </div>
                {colorOptions.length > 0 && (
                  <div className="mb-4">
                    <span className="font-bold text-gray-700">
                      Select Color:
                    </span>
                    <div className="grid grid-cols-10 gap-y-4 mt-4">
                      {renderColors()}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <span className="font-bold text-gray-700">Select Size:</span>
                  <div className="flex items-center mt-2 ">{renderSizes()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
