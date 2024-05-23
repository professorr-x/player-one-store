import React, { useState, useEffect } from "react";

interface QuantityInputProps {
  initialQuantity?: number;
  onQuantityChange: (newQuantity: number) => void;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  initialQuantity = 1,
  onQuantityChange,
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      onQuantityChange(newQuantity);
      return newQuantity;
    });
  };

  const handleDecrease = () => {
    setQuantity((prevQuantity) => {
      if (prevQuantity > 1) {
        const newQuantity = prevQuantity - 1;
        onQuantityChange(newQuantity);
        return newQuantity;
      }
      return prevQuantity;
    });
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        className={`px-2 py-1 w-6 h-6 flex justify-center items-center bg-gray-200 text-gray-700 rounded focus:outline-none ${
          quantity > 1 ? "" : "opacity-90 bg-gray-400"
        }`}
        onClick={handleDecrease}
      >
        -
      </button>
      <span className="text-center w-full max-w-16 flex justify-center border rounded focus:outline-none">
        {quantity}
      </span>
      <button
        className="px-2 py-1 w-6 h-6 flex justify-center items-center bg-gray-200 text-gray-700 rounded focus:outline-none"
        onClick={handleIncrease}
      >
        +
      </button>
    </div>
  );
};

export default QuantityInput;
