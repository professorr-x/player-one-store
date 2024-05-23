import React from "react";
import CartItem from "../CartItem/CartItem";
import { BsCart4 } from "react-icons/bs";

interface CartWidgetProps {
  items: Array<{
    id: string;
    productId: string;
    title: string;
    size: string;
    price: number;
    sol_price: number;
    quantity: number;
    images: [];
  }>;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

const CartWidget: React.FC<CartWidgetProps> = ({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onClose,
}) => {
  const total = items?.reduce(
    (acc, item) => acc + item?.sol_price * item?.quantity,
    0
  );

  const checkoutData:any = [];
  for (let i = 0; i < items.length; i++) {
    checkoutData?.push({
      productId: items[i]?.productId,
      variantID: items[i]?.id,
      quantity: items[i]?.quantity,
    });
  }

  return (
    <div className="fixed z-20 inset-0 bg-gray-800 bg-opacity-75 flex justify-end">
      <div className="w-full flex justify-between flex-col z-50 max-w-md bg-[#1b1a20] h-full shadow-xl relative overflow-hidden">
        <div className="flex justify-center items-center gap-4 py-4 border-b border-gray-700">
          <div className="relative">
            <BsCart4 className="w-[30px] h-[30px]" />
            {items?.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 h-[15px] w-[15px] py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {items?.length}
              </span>
            )}
          </div>
          <h2 className="text-white text-lg text-center">Cart</h2>
        </div>
        <button
          className="text-gray-400 text-3xl hover:text-gray-200 absolute right-4 top-3"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="overflow-y-auto flex-grow">
          {items?.map((item) => (
            <CartItem
              key={item?.id}
              {...item}
              onIncrease={() => onIncrease(item.id)}
              onDecrease={() => onDecrease(item.id)}
              onRemove={() => onRemove(item.id)}
            />
          ))}
        </div>
        <div className="p-4 py-8 border-t shadow-2xl shadow-black overflow-hidden border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-yellow-500">{total.toFixed(2)} SOL</span>
          </div>
          <button
            onClick={() => console.log(checkoutData)}
            className="w-full mt-4 py-2 border-2 border-yellow-500 text-white bg-zinc-950 rounded"
          >
            CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartWidget;
