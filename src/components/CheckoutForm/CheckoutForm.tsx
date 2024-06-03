import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import Step1 from "./FormSteps/Step1";
import Step2 from "./FormSteps/Step2";
import Step3 from "./FormSteps/Step3";
import Step4 from "./FormSteps/Step4";
import axios from "axios";
import { CheckoutFormData, ProductVariants, Response } from "../../models";
import loadingSpinner from "../../img/loading.gif";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from "@solana/web3.js";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useNavigate } from "react-router-dom";
import { calculateTotalCost } from "../../utils";

interface cartItem {
  cartItems: ProductVariants[];
  setCartItems: Dispatch<SetStateAction<ProductVariants[]>>;
}

const CheckoutForm: React.FC<cartItem> = ({ setCartItems, cartItems }) => {
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
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [response, setResponse] = useState<Response>();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const navigate = useNavigate();

  const handleSolanaPay = useCallback(
    async (response: Response) => {
      let errors: string[] = [];
      if (!publicKey) {
        errors.push("Wallet not connected");
        throw new WalletNotConnectedError();
      }
      let total_lamports =
        LAMPORTS_PER_SOL * calculateTotalCost(response).toFixed(2);

      connection.getBalance(publicKey).then((bal): any => {
        if (bal < total_lamports) {
          errors.push("Insufficient Funds");
        }
      });
      try {
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(
              "3vZHGfiYceHgurCX8ySf9u1hroEq4hhntNhVp8dBYsXL"
            ),
            lamports: total_lamports,
          })
        );

        const signature = await sendTransaction(transaction, connection);

        await connection.confirmTransaction(signature, "processed");
        let status = await connection.getSignatureStatus(signature);
        const postData = {
          order_id: response?.order_id,
          wallet_address: publicKey.toBase58(),
          signature: signature,
        };

        const res = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/order/confirm`,
          null,
          {
            params: postData,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        if (res?.status === 200) {
          setStep(step + 1);
          setCartItems([]);
          localStorage.removeItem("checkout");
          localStorage.removeItem("cartItems");
        }
      } catch (error) {
        if (error instanceof Error) {
          errors.push(error.message);
          console.log(errors);
          setValidationMessage(
            errors[0] || "Error Confirming Order, Try Again"
          );
        }
      }
    },
    [publicKey, sendTransaction, connection]
  );

  useEffect(() => {
    const itemsInCart = JSON.parse(localStorage.getItem("checkout") || "[]");

    setCheckoutItems(itemsInCart);
  }, [cartItems]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Only apply formatting and constraints to the phone field
    if (name === "phone") {
      let formattedValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      // Limit to maximum of 15 characters
      formattedValue =
        formattedValue.length > 15
          ? formattedValue.substring(0, 15)
          : formattedValue;
      // Format phone number

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: formattedValue,
      }));
    } else {
      // For other fields, update form state directly
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
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
        return <Step3 checkoutData={cartItems} response={response} />;
      case 4:
        return <Step4 response={response} />;
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

  console.log("response", response);

  const handleNext = async () => {
    if (
      step === 1 &&
      formData?.email &&
      formData?.first_name &&
      formData?.last_name &&
      formData?.phone
    ) {
      if (formData?.phone.length < 7) {
        setValidationMessage("Phone should contains minimum 7 digits");
      } else {
        setStep(step + 1);
        setValidationMessage("");
      }
    } else if (
      step === 2 &&
      formData?.address1 &&
      formData?.city &&
      formData?.country &&
      formData?.zip
    ) {
      setLoading(true);
      try {
        const data = {
          line_items: checkoutItems,
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
        setResponse(response.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
        setValidationMessage("");
        setStep(step + 1);
      }
    } else if (step === 3) {
      setLoading(true);
      try {
        if (response) {
          await handleSolanaPay(response);
        }
      } catch (error) {
        console.error("Payment error:", error);
        setValidationMessage(
          "Wallet not connected, Please connect your wallet to proceed."
        );
      } finally {
        setLoading(false);
      }
    } else if (step === 4) {
      navigate("/");
    } else {
      setValidationMessage("Please fill out all the fields to proceed.");
    }
  };
  const handleback = () => {
    if (step > 1) {
      setStep(step - 1);
      setValidationMessage("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 mt-40 mb-20">
      <div className="flex items-center justify-between relative">
        <div className="h-1 w-full absolute top-1/2 right-0 mx-auto bg-[#5e17eb] z-[-1]" />
        {steps?.map((node, i) => {
          return (
            <div
              key={i}
              className={`sm:w-20 sm:h-20 h-14 w-14 rounded-full   flex items-center justify-center text-2xl font-semibold ${
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
        <div className="w-full flex justify-center items-center mt-32">
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
          <div
            className={`w-full flex sm:flex-row flex-col gap-3 items-center ${
              step === 4 ? "justify-center" : "justify-between"
            }`}
          >
            <button
              onClick={handleback}
              disabled={step < 2}
              className={`bg-[#5e17eb] rounded-lg text-white w-full max-w-52 px-4 py-3 text-lg font-medium  ${
                step === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90"
              } ${step === 4 ? "hidden" : "block"}`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              type="submit"
              className={` rounded-lg  w-full max-w-52 px-4 py-3 text-lg font-medium hover:opacity-90 ${
                step === 3
                  ? "bg-yellow-300 text-gray-950 border border-gray-950"
                  : "bg-[#5e17eb] text-white"
              }`}
            >
              {step === 3 ? "Pay" : step === 4 ? "Continue Shopping" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
