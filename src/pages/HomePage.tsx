import { Box, Image } from "@chakra-ui/react";

const Home: React.FC = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      overflow="hidden"
      bg="background"
      mx="auto"
    >
      <Image
        src="/assets/logo/Imagem-background.svg"
        alt="Imagem de fundo"
        height="100%"
        width="100%"
        objectFit="contain"
      />
    </Box>
  );
};

export default Home;
