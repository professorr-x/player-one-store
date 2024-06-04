import React, { Dispatch, SetStateAction } from "react";
import CheckoutForm from "../components/CheckoutForm/CheckoutForm";
import { ProductVariants } from "../models";

interface cartItem {
  cartItems: ProductVariants[];
  setCartItems: Dispatch<SetStateAction<ProductVariants[]>>;
}
const CheckoutPage: React.FC<cartItem> = ({ setCartItems, cartItems }) => {
  return (
    <div>
      <CheckoutForm setCartItems={setCartItems} cartItems={cartItems} />
    </div>
  );
};

export default CheckoutPage;
