import React, { useRef } from "react";
import Input from "../../Input/Input";
import { CheckoutFormData } from "../../../models";


interface FormComponentProps {
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Step1: React.FC<FormComponentProps> = ({
  formData,
  setFormData,
  handleChange,
}) => {

  return (
    <div className="">
      <h2 className="text-2xl font-semibold text-center text-gray-950">
        Personal Details
        <form className="mt-5">
          <div className="flex flex-col gap-5">
            <Input
              name="first_name"
              placeholder="First Name"
              type="text"
              required
              value={formData?.first_name || ""}
              otherClasses=" max-w-sm mx-auto"
              onChange={handleChange}
            />
            <Input
              name="last_name"
              placeholder="Last Name"
              type="text"
              required
              value={formData?.last_name || ""}
              otherClasses="max-w-sm mx-auto"
              onChange={handleChange}
            />
            <Input
              name="email"
              placeholder="Email"
              type="email"
              required
              value={formData?.email || ""}
              otherClasses=" max-w-sm mx-auto"
              onChange={handleChange}
            />
            <Input
              name="phone"
              placeholder="Phone"
              type="tel"
              required
              value={formData?.phone || ""}
              otherClasses=" max-w-sm mx-auto appearance-none"
              onChange={handleChange}
            />
          </div>
        </form>
      </h2>
    </div>
  );
};

export default Step1;
