import React, { useEffect, useState } from "react";
import Input from "../../Input/Input";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { CheckoutFormData } from "../../../models";

type PlaceResult = {
  formatted_address?: string;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry?: {
    location?: {
      lat: number;
      lng: number;
    };
  };
  place_id?: string;
};

interface FormComponentProps {
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Step2: React.FC<FormComponentProps> = ({
  formData,
  setFormData,
  handleChange,
}) => {
  const handlePlaceSelected = (place: PlaceResult) => {
    console.log(place);
    if (place?.address_components) {
      const countryTypes = place?.address_components?.find((node) =>
        node?.types?.includes("country")
      );
      const cityTypes =
        place?.address_components?.find((node) =>
          node?.types?.includes("locality")
        ) ||
        place?.address_components?.find((node) =>
          node?.types?.includes("political")
        );
      const regionTypes =
        place?.address_components?.find((node) =>
          node?.types?.includes("administrative_area_level_1")
        ) ||
        place?.address_components?.find((node) =>
          node?.types?.includes("political")
        );
      console.log(
        "region",
        place?.address_components?.find(
          (node) =>
            node?.types?.includes("administrative_area_level_1") ||
            node?.types?.includes("political")
        )
      );

      setFormData((prevFormData) => ({
        ...prevFormData,
        city: cityTypes?.long_name || "",
        region: regionTypes?.long_name || "",
        country: countryTypes?.long_name || "",
      }));
    }
  };

  return (
    <div className="">
      <h2 className="text-2xl font-semibold text-center text-gray-950">
        Shipping Details
        <form className="mt-5">
          <div className="flex flex-col gap-5">
            <Input
              name="address1"
              placeholder="Address 1"
              type="text"
              required
              value={formData?.address1 || ""}
              otherClasses=" max-w-sm mx-auto"
              onChange={handleChange}
            />
            <Input
              name="address2"
              placeholder="Address 2"
              type="text"
              value={formData?.address2 || ""}
              otherClasses=" max-w-sm mx-auto"
              onChange={handleChange}
            />
            <ReactGoogleAutocomplete
              placeholder="City"
              className="w-full py-[12px] flex rounded-lg border-[1px] border-gray-300 bg-gray-50 px-4 text-base outline outline-[3px] outline-transparent focus:border-green-600 focus:outline-green-600/30 placeholder:text-gray-500 max-w-sm mx-auto"
              apiKey={process.env.REACT_APP_GOOGLE_AUTOCOMPLETE_API_KEY}
              onPlaceSelected={handlePlaceSelected}
              style={{ width: "100%" }}
              options={{
                types: ["(regions)"],
              }}
            />
            <ReactGoogleAutocomplete
              defaultValue={formData?.country}
              placeholder="Country"
              className="w-full py-[12px] flex rounded-lg border-[1px] border-gray-300 bg-gray-50 px-4 text-base outline outline-[3px] outline-transparent focus:border-green-600 focus:outline-green-600/30 placeholder:text-gray-500 max-w-sm mx-auto"
              apiKey={process.env.REACT_APP_GOOGLE_AUTOCOMPLETE_API_KEY}
              style={{ width: "100%" }}
              options={{
                types: ["(regions)"],
              }}
            />
            <Input
              name="zip"
              placeholder="ZIP Code"
              type="text"
              value={formData?.zip || ""}
              otherClasses=" max-w-sm mx-auto"
              onChange={handleChange}
            />
          </div>
        </form>
      </h2>
    </div>
  );
};

export default Step2;
