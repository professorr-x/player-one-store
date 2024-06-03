import React from "react";
import { Response } from "../../../models";

interface step4Props {
  response?: Response;
}
const Step4: React.FC<step4Props> = ({ response }) => {
  return (
    <div className="max-w-screen-md mx-auto px-4">
      <p className="text-3xl text-gray-950 text-center mb-6 font-semibold">
        Order#: {response?.order_id}
      </p>
      <p className="text-3xl text-gray-950 text-center mb-6 font-semibold">
        Thank you For Submiting your order
      </p>
    </div>
  );
};

export default Step4;
