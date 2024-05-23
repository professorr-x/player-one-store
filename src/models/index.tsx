export interface Product {
  id: number;
  title: string;
  description: string;
  variants: ProductVariants[];
  images: ProductImage[];
  options: ProductOption[];
  selectable_options: SelectableProductOptions;
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
  sku: number;
  cost: number;
  price: number;
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

export interface GetProductList {
  current_page: number;
  data: Product[];
}
