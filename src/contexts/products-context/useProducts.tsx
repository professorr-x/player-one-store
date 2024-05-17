import { useCallback } from "react";

import { useProductsContext } from "./ProductsContextProvider";
import { Product } from "../../models";
import { getProducts } from "../../services/products";

const useProducts = () => {
  const {
    isFetching,
    setIsFetching,
    products,
    setProducts,
    filters,
    setFilters,
  } = useProductsContext();

  const fetchProducts = useCallback(async () => {
    try {
      setIsFetching(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsFetching(false);
    }
  }, [setIsFetching, setProducts]);

  // const filterProducts = (filters: string[]) => {
  //   setIsFetching(true);

  //   getProducts().then((products: Product[]) => {
  //     setIsFetching(false);
  //     let filteredProducts;

  //     if (filters && filters.length > 0) {
  //       filteredProducts = products.filter((p: Product) =>
  //         filters.find((filter: string) =>
  //           p.availableSizes.find((size: string) => size === filter)
  //         )
  //       );
  //     } else {
  //       filteredProducts = products;
  //     }

  //     setFilters(filters);
  //     setProducts(filteredProducts);
  //   });
  // };

  return {
    isFetching,
    fetchProducts,
    products,
    // filterProducts,
    filters,
  };
};

export default useProducts;
