import React, {
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/products";
import { Product, ProductOptionValue, ProductVariants } from "../models";
import QuantityInput from "../components/QuantityInput/QuantityInput";
import loadingSpinner from "./../img/loading.gif";
import Slider from "react-slick";

interface cartItem {
  cartItems: ProductVariants[];
  setCartItems: Dispatch<SetStateAction<ProductVariants[]>>;
}

const ProductPage: React.FC<cartItem> = ({ setCartItems, cartItems }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product>();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariants>();
  const [sizeOptions, setSizeOptions] = useState<ProductOptionValue[]>([]);
  const [colorOptions, setColorOptions] = useState<ProductOptionValue[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [notAvailable, setNotAvailable] = useState<number[]>([]);
  const [toggle, setToggle] = useState<boolean>(false);

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
          disabled={notAvailable?.includes(size.id) ? true : false}
          key={size.id}
          id={size.id.toString()}
          className={`bg-gray-300 text-gray-700 py-2 px-4 rounded-full font-bold mr-2  relative overflow-hidden ${
            selectedOptions.includes(size.id)
              ? "border-2 border-black"
              : "border-none"
          } ${
            notAvailable?.includes(size?.id)
              ? "before:w-[calc(100%-20px)] cursor-not-allowed opacity-80 before:left-[10px] before:-translate-y-1/2 before:top-1/2 before:h-[1.5px] before:block before:absolute before:rotate-[-30deg] before:bg-black"
              : "hover:bg-gray-400 "
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

  const handleQuantityChange = (newQuantity: number) => {
    setSelectedVariant((prev: any) => {
      return {
        ...prev,
        quantity: newQuantity,
      };
    });
  };

  // Cart
  const handleAddToCart = (newItem: any) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems?.find((item) => item?.sku === newItem?.sku);
      if (existingItem) {
        return prevItems?.map((item) =>
          item?.sku === newItem?.sku
            ? { ...item, quantity: item?.quantity + newItem?.quantity }
            : item
        );
      }
      return [...prevItems, newItem];
    });
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Slider Preview Image

  const images = [
    ...(selectedVariant?.images?.slice(0, 2) ??
      product?.variants
        ?.filter(({ title }) =>
          title?.includes(selectedVariant?.title?.split("/")[0] || "")
        )
        ?.find(({ images }) => images?.length > 0)
        ?.images.slice(0, 2) ??
      []),
  ];
  const imageUrls = images?.map((image) => image?.src);

  function SampleNextArrow(props: any) {
    const {onClick } = props;
    return (
      <div
        className={`absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 z-10`}
        onClick={onClick}
      >
        ›
      </div>
    );
  }

  function SamplePrevArrow(props: any) {
    const { onClick } = props;
    return (
      <div
        className={`absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 z-10`}
        onClick={onClick}
      >‹</div>
    );
  }

  var settings = {
    initialSlide: 0,
    dots: false,
    fade: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
  };

  return (
    <div>
      {selectedVariant && product ? (
        <div className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row -mx-4">
              <div className="md:w-[50%] w-full px-4">
                <div className="md:h-[460px] overflow-hidden relative rounded-lg mb-4">
                  <Slider className="relative" {...settings}>
                    {imageUrls?.map((node, i) => {
                      return (
                        <img
                          src={node}
                          alt={`Image ${node + i}`}
                          className={`w-full h-full object-cover md:-mt-10`}
                        />
                      );
                    })}
                  </Slider>
                </div>
                <div className="-mx-2 mb-4">
                  <div className="px-2">
                    {notAvailable?.includes(selectedOptions[0]) ? (
                      <button
                        disabled={notAvailable?.includes(selectedOptions[0])}
                        className="w-full bg-gray-900 disabled:bg-[#7b7b7b] text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800"
                      >
                        Sold Out
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleAddToCart({ ...selectedVariant, productId: id })
                        }
                        className="w-full bg-gray-900 disabled:bg-[#7b7b7b] text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="md:flex-1 px-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedVariant.title}
                </h2>
                <div className="flex mb-4">
                  <div className="mr-4">
                    <span className="font-bold text-gray-700 ">Price:</span>
                    <span className="text-gray-600 m-2">
                      {selectedVariant.sol_price.toFixed(2)} SOL
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-700 ">
                      Availability:
                    </span>
                    <span className="text-gray-600 m-2">
                      {notAvailable?.includes(selectedOptions[0])
                        ? "Out Of Stock"
                        : "In Stock"}
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <QuantityInput
                    key={selectedVariant?.quantity}
                    initialQuantity={selectedVariant?.quantity}
                    onQuantityChange={handleQuantityChange}
                  />
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

                <div className="mb-4 ">
                  <span className="font-bold text-gray-700">Select Size:</span>
                  <div className="flex items-center mt-2 relative z-0">
                    {renderSizes()}
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => setToggle((prev) => !prev)}
                      className={`text-lg w-full border-b border-gray-500 pb-4`}
                    >
                      <span className="flex items-center justify-between font-medium">
                        About Product
                        <span className="text-3xl">{toggle ? "-" : "+"}</span>
                      </span>
                    </button>
                    <p
                      className={`text-gray-600 text-sm text-left transition-all duration-200 ease-linear ${
                        toggle
                          ? "h-auto opacity-100 mt-3 border-b border-gray-500 pb-4"
                          : "h-0 pointer-events-none opacity-0 mt-0 border-none"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: product?.description,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center absolute top-1/2 -translate-y-1/2">
          <img
            height={100}
            width={100}
            src={loadingSpinner}
            alt="loading spinner"
          />{" "}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
