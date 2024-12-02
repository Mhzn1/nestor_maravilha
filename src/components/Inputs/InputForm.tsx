import React from "react";
import { Input, InputProps, FormControl, FormLabel, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

type InputFormProps = {
  label?: string;
  isDisabled?: boolean;
  type: "descricao" | "preco" | "text" | "date" | "search" | "cpf" | "cnpj";
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, rawValue?: string) => void;
} & InputProps;

const InputForm: React.FC<InputFormProps> = ({ label, type, value, onChange, isDisabled, ...props }) => {
  const id = (label ?? "defaultLabel").replace(/\s+/g, "-").toLowerCase();

  const applyMask = (inputValue: string): string => {
    if (type === "cpf") {
      return inputValue
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .substring(0, 14);
    }

    if (type === "cnpj") {
      return inputValue
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5")
        .substring(0, 18);
    }

    return inputValue;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    if (type === "cpf" || type === "cnpj") {
      const unmaskedValue = inputValue.replace(/\D/g, "");
      const maskedValue = applyMask(unmaskedValue);
      e.target.value = maskedValue;

      if (onChange) {
        onChange(e, unmaskedValue);
      }
    } else {
      if (onChange) onChange(e);
    }
  };

  return (
    <FormControl id={id} mb={4}>
      <FormLabel color="primary">{label}</FormLabel>
      <InputGroup>
        {type === "search" && (
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="primary" />
          </InputLeftElement>
        )}
        <Input
          type={type === "date" ? "date" : type === "search" ? "text" : type}
          bg="details"
          color="primary"
          borderRadius="md"
          boxShadow="md"
          placeholder={label}
          value={type === "cpf" || type === "cnpj" ? applyMask(value.replace(/\D/g, "")) : value}
          onChange={handleInputChange}
          isDisabled={isDisabled}
          {...props}
        />
      </InputGroup>
    </FormControl>
  );
};

export default InputForm;
