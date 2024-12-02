import React, { useState } from "react";
import { Box, FormControl, useToast, Grid, GridItem } from "@chakra-ui/react";
import InputForm from "../../../components/Inputs/InputForm";
import SelectForm from "../../../components/Inputs/SelectForm";
import { createProduto } from "../../../services/api.produtos";
import CustomButton from "../../../ui/CustomButton";

const CreateProduto: React.FC = () => {
  const toast = useToast();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [unidade, setUnidade] = useState("UND");
  const [preco, setPreco] = useState("");
  const [situacao, setSituacao] = useState("ATIVO");

  const handleSubmit = async () => {
    if (!nome || !descricao || !preco) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const produto = {
        nome,
        descricao,
        unidade,
        preco: parseFloat(preco),
        situacao,
      };

      await createProduto(produto);
      toast({
        title: "Produto Criado",
        description: "Produto criado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNome("");
      setDescricao("");
      setUnidade("UND");
      setPreco("");
      setSituacao("ATIVO");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o produto.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="full" mx="auto" bg="details" borderRadius="md" p={4}>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl mb={4}>
            <InputForm
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome do produto"
              bg="details"
              color="primary"
              borderRadius="md"
              label="Nome"
              isRequired
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl mb={4}>
            <InputForm
              id="preco"
              type="preco"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="Digite o preço do produto"
              bg="details"
              color="primary"
              borderRadius="md"
              label="Preço"
              isRequired
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl mb={4}>
            <InputForm
              type="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Digite a descrição do produto"
              bg="details"
              color="primary"
              borderRadius="md"
              label="Descrição"
              isRequired
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl mb={4}>
            <SelectForm
              label="Unidade"
              type="unidade"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
              options={[
                { value: "UND", label: "UND" },
                { value: "KG", label: "KG" },
                { value: "LT", label: "LT" },
              ]}
              isRequired
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl mb={4}>
            <SelectForm
              label="Situação"
              type="situacao"
              value={situacao}
              onChange={(e) => setSituacao(e.target.value)}
              options={[
                { value: "ATIVO", label: "ATIVO" },
                { value: "INATIVO", label: "INATIVO" },
              ]}
              isRequired
            />
          </FormControl>
        </GridItem>
      </Grid>

      <CustomButton variant="solid" w="full" mt={4} onClick={handleSubmit}>
        Criar Produto
      </CustomButton>
    </Box>
  );
};

export default CreateProduto;
