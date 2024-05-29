import React from "react";

interface InputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  pattern?: string;
  maxLength?: number;
  otherClasses?: string;
  ref?: React.Ref<HTMLInputElement>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      onChange,
      type,
      name,
      placeholder = "",
      required = false,
      value,
      otherClasses = "",
      pattern,
      maxLength,
    },
    ref
  ) => {
    const inputClasses = `${otherClasses}`;

    return (
      <input
        ref={ref}
        maxLength={maxLength}
        type={type}
        name={name}
        id={name}
        pattern={pattern}
        value={value}
        className={`${inputClasses}
        w-full py-[12px] flex rounded-lg border-[1px] border-gray-300 bg-gray-50 px-4 text-base outline outline-[3px] outline-transparent focus:border-green-600 focus:outline-green-600/30 placeholder:text-gray-500`}
        placeholder={placeholder}
        onChange={onChange}
        required={required ? required : false}
      />
    );
  }
);

export default Input;
