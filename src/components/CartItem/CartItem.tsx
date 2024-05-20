import React from "react";

interface CartItemProps {
  id: string;
  title: string;
  size: string;
  price: number;
  quantity: number;
  images: {
    src: string;
    position?: string;
  }[];
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({
  title = "",
  size = "",
  price = 0,
  quantity = 0,
  images = [],
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const size1 = title?.split("/")?.pop()?.trim();
  console.log("images", images);
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <div className="flex items-center">
        <img className="w-16 h-16 rounded" src={images[0]?.src} alt={title} />
        <div className="ml-4">
          <h3 className="text-white">{title}</h3>
          <p className="text-gray-400">Size: {size1}</p>
          <p className="text-gray-400">Quantity: {quantity}</p>
        </div>
      </div>
      <div className="flex flex-col items-end space-y-3">
        <div className="flex items-center space-x-4">
          <button
            className="text-gray-400 hover:text-gray-200"
            onClick={onRemove}
          >
            &times;
          </button>
        </div>
        <div className="text-yellow-500">${price?.toFixed(2)}</div>
        <div className="flex items-center space-x-1">
          <button
            disabled={quantity > 1 ? false : true}
            className={`px-2 py-1 w-6 h-6 flex justify-center items-center bg-gray-200 text-gray-700 rounded focus:outline-none ${
              quantity > 1 ? "" : "opacity-90 bg-gray-400"
            }`}
            onClick={onDecrease}
          >
            -
          </button>
          <button
            className="px-2 py-1 w-6 h-6 flex justify-center items-center bg-gray-200 text-gray-700 rounded focus:outline-none"
            onClick={onIncrease}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
