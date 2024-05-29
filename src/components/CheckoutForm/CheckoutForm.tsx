import React, { useState } from "react";
import Step1 from "./FormSteps/Step1";
import Step2 from "./FormSteps/Step2";
import Step3 from "./FormSteps/Step3";
import Step4 from "./FormSteps/Step4";
import axios from "axios";
import { CheckoutFormData } from "../../models";
import loadingSpinner from "../../img/loading.gif";


const CheckoutForm = () => {
  const steps = [1, 2, 3, 4];
  const [formData, setFormData] = useState<CheckoutFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    country: "",
    region: "",
    zip: "",
  });
  const [step, setStep] = useState(1);
  const [validationMessage, setValidationMessage] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("formData", formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            setFormData={setFormData}
            formData={formData}
            handleChange={handleChange}
          />
        );
      case 2:
        return (
          <Step2
            setFormData={setFormData}
            formData={formData}
            handleChange={handleChange}
          />
        );
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      default:
        return (
          <Step1
            setFormData={setFormData}
            formData={formData}
            handleChange={handleChange}
          />
        );
    }
  };

  const handleNext = async () => {
    if (
      step === 1 &&
      formData?.email &&
      formData?.first_name &&
      formData?.last_name &&
      formData?.phone
    ) {
      setStep(step + 1);
      setValidationMessage("");
    } else if (
      step === 2 &&
      formData?.address1 &&
      formData?.country &&
      formData?.city &&
      formData?.zip
    ) {
      setLoading(true);
      try {
        const data = {
          line_items: [
            {
              product_id: "665385475eed34c9370c9a2e",
              variant_id: 78993,
              quantity: 1,
            },
          ],
          shipping_method: 1,
          is_printify_express: false,
          is_economy_shipping: false,
          send_shipping_notification: true,
          address_to: {
            ...formData,
          },
        };
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/order/create`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response:", response.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
      setValidationMessage("");
      setStep(step + 1);

    } else {
      setValidationMessage("Please Fill all Fields to proceed");
    }
  };
  const handleback = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 my-24">
      <div className="flex items-center justify-between relative">
        <div className="h-1 w-full absolute top-1/2 right-0 mx-auto bg-[#5e17eb] z-[-1]" />
        {steps?.map((node, i) => {
          return (
            <div
              key={i}
              className={`w-20 h-20 rounded-full   flex items-center justify-center text-2xl font-semibold ${
                step === node
                  ? "bg-yellow-400 text-white"
                  : "bg-[#5e17eb] text-white"
              }`}
            >
              {node}
            </div>
          );
        })}
      </div>
      {loading ? (
        <div className="w-full flex justify-center items-center absolute top-[55%] -translate-y-1/2 -translate-x-1/2 left-1/2">
          <img
            height={100}
            width={100}
            src={loadingSpinner}
            alt="loading spinner"
          />{" "}
        </div>
      ) : (
        <div className="">
          <div className="my-20">{renderStep()}</div>
          {validationMessage && (
            <p className="text-center -mt-5 mb-10 text-red-600 font-medium text-base">
              {validationMessage}
            </p>
          )}
          <div className="w-full flex justify-between items-center">
            <button
              onClick={handleback}
              disabled={step === 1}
              className={`bg-[#5e17eb] rounded-lg text-white w-full max-w-52 px-4 py-3 text-lg font-medium  ${
                step === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90"
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              type="submit"
              className="bg-[#5e17eb] rounded-lg text-white w-full max-w-52 px-4 py-3 text-lg font-medium hover:opacity-90"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
