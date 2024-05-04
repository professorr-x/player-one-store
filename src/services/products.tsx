import axios from 'axios';
import { IGetProductsResponse } from '../models';

export const getProducts = async () => {
  let response: IGetProductsResponse;

  response = await axios.get(
    `https://api.printify.com/v1/shops/${process.env.REACT_APP_STORE_ID}/products.json`, {
    headers: {
      "Authorization": `Bearer ${process.env.REACT_APP_PRINTIFY_TOKEN}`,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    }
  }

  );

  const { products } = response.data || [];

  return products;
};
