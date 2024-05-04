import React, {useEffect} from 'react'
import { useProducts } from '../contexts/products-context';
import Product from './Product';

function Store() {
    const { isFetching, products, fetchProducts } = useProducts();

    useEffect(() => {
        fetchProducts();
        console.log(products)
    }, [fetchProducts]);

  return (
    <div className='grid grid-flow-row-dense grid-cols-3 grid-rows-3'>
        {isFetching && <h1> Loading </h1>}
        {products?.map((p) => (
        <Product product={p} key={p.sku} />
      ))}
        
    </div>
  )
}

export default Store
