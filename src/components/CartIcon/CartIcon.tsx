import React from "react";
import { BsCart4 } from "react-icons/bs";

interface CartIconProps {
  itemCount: number;
  onClick: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({ itemCount, onClick }) => {
  console.log("itemCount", itemCount);

  return (
    <div className="relative" onClick={onClick}>
      <BsCart4 className="w-[35px] h-[35px]" />
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 h-[20px] w-[20px] py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
          {itemCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
