import React, { useEffect } from "react";
import { useProducts } from "../contexts/products-context";
import ProductCard from "../components/Products/ProductCard";
import loadingSpinner from "./../img/loading.gif";

function Store() {
  const { isFetching, products, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  return (
    <div>
      {isFetching ? (
        <div className="w-full flex justify-center absolute top-[55%] -translate-y-1/2">
          <img
            height={100}
            width={100}
            src={loadingSpinner}
            alt="loading spinner"
          />{" "}
        </div>
      ) : (
        <div className="grid gap-3 grid-flow-row-dense sm:grid-cols-1 md:grid-cols-3">
          {products.data?.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
      )}
    </div>
  );
}
export default Store;
