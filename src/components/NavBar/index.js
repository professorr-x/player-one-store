import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { BsCart4 } from "react-icons/bs";
import logoImage from "../../img/logo_transparent_white.png";
import CartIcon from "../CartIcon/CartIcon";
import CartWidget from "../CartWidget/CartWidget";

const Navbar = ({ setCartItems, cartItems }) => {
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: "Home" },
    { id: 2, text: "Company" },
    { id: 3, text: "Resources" },
    { id: 4, text: "About" },
    { id: 5, text: "Contact" },
  ];

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCartItems = JSON.parse(
      localStorage.getItem("cartItems") || "[]"
    );
    setCartItems(savedCartItems);
  }, [isCartOpen]);

  const handleIncreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);
      return updatedItems;
    });
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="bg-black flex justify-between items-center h-24 px-4 text-white">
      {/* Logo */}
      <a href="/">
        <img src={logoImage} className="w-2/6 md:w-1/6" alt="Logo" />
      </a>

      {/* Desktop Navigation */}
      <ul className="flex items-center justify-end w-full gap-5">
        {/* {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'
          >
            {item.text}
          </li>
        ))} */}
        <li>
          <WalletMultiButton />
        </li>
        <li className="cursor-pointer">
          <CartIcon itemCount={cartItems?.length} onClick={toggleCart} />
        </li>
      </ul>

      {/* Mobile Navigation Icon */}
      {/* <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div> */}

      {/* Mobile Navigation Menu */}
      {/* <ul
        className={
          nav
            ? "fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
            : "ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]"
        }
      >
        <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4">REACT.</h1>
        <li className="m-8">
          <WalletMultiButton />
        </li>
      </ul> */}
      {isCartOpen && (
        <CartWidget
          items={cartItems}
          onIncrease={handleIncreaseQuantity}
          onDecrease={handleDecreaseQuantity}
          onRemove={handleRemoveItem}
          onClose={toggleCart}
        />
      )}
    </div>
  );
};

export default Navbar;
