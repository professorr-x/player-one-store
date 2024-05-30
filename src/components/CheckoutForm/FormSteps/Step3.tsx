import React from "react";
import { ProductVariants, Response } from "../../../models";


interface CheckoutItems {
  checkoutData: ProductVariants[];
  response?: Response;
}

const Step3: React.FC<CheckoutItems> = ({ checkoutData, response }) => {
  function calculateTotalCost({
    total_price,
    total_shipping,
    total_tax,
  }: Response): number {
    return total_price + total_shipping + total_tax;
  }

  return (
    <div className="">
      <h2 className="text-2xl font-semibold text-center text-gray-950">
        Checkout
        {checkoutData && (
          <div>
            {checkoutData?.map((node, i) => {
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border-b border-gray-700"
                >
                  <div className="w-[20%]">
                    {node?.images && (
                      <img
                        className="w-full max-w-[200px]"
                        src={node?.images[0]?.src}
                        alt={node?.title}
                      />
                    )}
                  </div>
                  <div className="flex flex-col text-right gap-1">
                    <p className="text-gray-400 text-xl">{node?.title}</p>
                    <p className="text-gray-400 text-xl">
                      Quantity: {node?.quantity}
                    </p>
                    <p className="text-yellow-500 text-xl">
                      {node?.sol_price?.toFixed(2)} SOL
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {response && (
          <div className="text-center flex flex-col items-center gap-2 mt-20">
            <p className="text-gray-400 text-xl">
              <span className="font-medium text-gray-950">
                Total Item Cost:
              </span>{" "}
              {response?.total_price.toFixed(2)} SOL
            </p>
            <p className="text-gray-400 text-xl">
              <span className="font-medium text-gray-950">Shipping Cost:</span>{" "}
              {response?.total_shipping.toFixed(2)} SOL
            </p>
            <p className="text-gray-400 text-xl">
              <span className="font-medium text-gray-950">VAT:</span>{" "}
              {response?.total_tax.toFixed(2)} SOL
            </p>
            <div className="mt-6">
              <p className="font-medium text-gray-950">Total</p>
              <p className="mt-2 text-gray-400">
                {calculateTotalCost(response).toFixed(2)} SOL
              </p>
            </div>
          </div>
        )}
      </h2>
    </div>
  );
};

export default Step3;
