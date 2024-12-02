import {
    Box,
    Flex,
    Image,
    IconButton,
    Collapse,
    useDisclosure,
  } from "@chakra-ui/react";
  import { Link } from "react-router-dom";
  import CustomButton from "../../ui/CustomButton";
  import { HamburgerIcon } from "@chakra-ui/icons";
  
  const Header: React.FC = () => {
    const { isOpen, onToggle } = useDisclosure();
  
    return (
      <Box
        as="header"
        bg="primary"
        color="text"
        shadow="lg"
        w={{ base: "100%", md: "95%" }}
        mt={5}
        borderRadius="md"
        mx="auto"
        height="80px" 
        px={{ base: 4, md: 8 }}
      >
        <Flex align="center" justify="space-between" height="100%">
          <Box height="100%">
            <Link to="/">
              <Image
                src="/assets/logo/logo-nestor.svg"
                alt="Logo"
                height="100%" 
                objectFit="contain"
              />
            </Link>
          </Box>
          <IconButton
            display={{ base: "block", md: "none" }}
            aria-label="Abrir menu"
            icon={<HamburgerIcon />}
            onClick={onToggle}
            variant="ghost"
            color="white"
            height="100%" 
          />
          <Flex
            gap={4}
            w="60%"
            justify="space-between"
            display={{ base: "none", md: "flex" }}
            mx="auto"
            height="50%"
          >
            <Link to="/clientes">
              <CustomButton variant="text" height="100%">
                Clientes
              </CustomButton>
            </Link>
            <Link to="/produtos">
              <CustomButton variant="text" height="100%">
                Produtos
              </CustomButton>
            </Link>
            <Link to="/pedidos">
              <CustomButton variant="text" height="100%">
                Pedidos de Venda
              </CustomButton>
            </Link>
          </Flex>
          <Collapse in={isOpen}>
            <Box pb={4}>
              <Flex direction="column" gap={4}>
                <Link to="/clientes">
                  <CustomButton variant="text">Clientes</CustomButton>
                </Link>
                <Link to="/produtos">
                  <CustomButton variant="text">Produtos</CustomButton>
                </Link>
                <Link to="/pedidos">
                  <CustomButton variant="text">Pedidos de Venda</CustomButton>
                </Link>
              </Flex>
            </Box>
          </Collapse>
        </Flex>
      </Box>
    );
  };
  
  export default Header;
  