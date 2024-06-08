export interface Product {
  id: number;
  title: string;
  description: string;
  variants: ProductVariants[];
  images: ProductImage[];
  options: ProductOption[];
  selectable_options: SelectableProductOptions;
  selectable_colors: ProductOptionValue[]
}

export interface ProductOption {
  name: string;
  type: string;
  values: ProductOptionValue[];
}

export interface SelectableProductOptions {
  [key: string]: [];
}

export interface ProductOptionValue {
  id: number;
  title: string;
  colors?: string[];
}

export interface ProductVariants {
  productId: string;
  id: number;
  sol_price: number;
  title: string;
  is_available: boolean;
  is_default: boolean;
  images: ProductVariantImage[];
  options: number[];
  quantity: number;
}

export interface ProductVariantImage {
  src: string;
  position: string;
}

export interface ProductImage {
  src: string;
  variant_ids: number[];
  position: string;
  is_default: boolean;
}

export interface ICartProduct extends Product {
  quantity: number;
}

export interface ICartTotal {
  productQuantity: number;
  installments: number;
  totalPrice: number;
  currencyId: string;
  currencyFormat: string;
}


export interface CheckoutFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  country: string;
  region: string;
  zip: string;
}

export interface Response {
  order_id: string;
  total_price: number;
  total_shipping: number;
  total_tax: number;
}
