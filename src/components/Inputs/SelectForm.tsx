import React from "react";
import { FormControl, FormLabel, Select, InputGroup, FormErrorMessage } from "@chakra-ui/react";

type SelectFormProps = {
  label: string;
  type: "situacao" | "unidade" | "text";
  options: { value: string; label: string }[]; 
  value: string;
  name?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
  isRequired?: boolean; 
  isDisabled?: boolean;
  errorMessage?: string; 
  placeholder?: string;
};

const SelectForm: React.FC<SelectFormProps> = ({
  label,
  options,
  value,
  onChange,
  isRequired = false,
  isDisabled = false, 
  errorMessage = "Este campo é obrigatório", 
}) => {
  const isInvalid = isRequired && !value; 

  return (
    <FormControl id={label} mb={4} isRequired={isRequired} isInvalid={isInvalid}>
      <FormLabel color="primary">{label}</FormLabel>
      <InputGroup>
        <Select
          bg="details"
          color="primary"
          borderRadius="md"
          boxShadow="md"
          placeholder={`Selecione ${label.toLowerCase()}`}
          value={value}
          onChange={onChange}
          isDisabled={isDisabled} 
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </InputGroup>
      {isInvalid && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
};

export default SelectForm;
