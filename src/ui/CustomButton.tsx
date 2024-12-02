import { Button, ButtonProps } from "@chakra-ui/react";

const CustomButton: React.FC<ButtonProps> = ({ children, variant, ...props }) => {
  return (
    <Button
      {...props}
      borderRadius="30px"
      variant={variant || "solid"} 
      color="details" 
      backgroundColor={variant === "solid" ? "primary" : variant === "cancel" ? "red.500" : undefined} 
      _focus={{ boxShadow: "none" }} 
      _hover={{
        backgroundColor: variant === "cancel" ? "red.600" : "primary-dark", 
        color: "text-secondary",
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
