import React, { useEffect } from "react";
import { useProducts } from "../contexts/products-context";
import ProductCard from "../components/Products/ProductCard";

function Store() {
  const { isFetching, products, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
    console.log(products);
  }, [fetchProducts]);
  console.log("products", products);
  return (
    <div className="grid grid-flow-row-dense sm:grid-cols-1 md:grid-cols-3">
      {isFetching && <h1> Loading </h1>}
      {products.data?.map((p) => (
        <ProductCard product={p} key={p.id} />
      ))}
    </div>
  );
}

export default Store;
