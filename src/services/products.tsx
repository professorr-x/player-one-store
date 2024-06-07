import axios from 'axios';
import { Product } from '../models';

export const getProducts = async () => {
  let response: Product[];

  response = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/products`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    }
  }
  );

  return response;
};


export const getProductById = async (productId: string) => {
  let response: {data: Product};

  response = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/products/${productId}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    }
  }
  );

  return response.data || [];
};
