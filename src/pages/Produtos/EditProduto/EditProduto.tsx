import React, { useEffect, useState } from "react";
import { Box, FormControl, useToast, Grid, GridItem } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import InputForm from "../../../components/Inputs/InputForm";
import SelectForm from "../../../components/Inputs/SelectForm";
import { getProdutoById, updateProduto } from "../../../services/api.produtos";
import CustomButton from "../../../ui/CustomButton";

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [unidade, setUnidade] = useState("UND");
  const [preco, setPreco] = useState("");
  const [situacao, setSituacao] = useState("ATIVO");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduto = async () => {
      if (!id) return;

      try {
        const produto = await getProdutoById(id);
        setNome(produto.nome);
        setDescricao(produto.descricao);
        setUnidade(produto.unidade);
        setPreco(produto.preco.toString());
        setSituacao(produto.situacao);
      } catch (error) {
        toast({
          title: "Erro ao carregar produto",
          description: "Não foi possível carregar os dados do produto.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/produtos");
      }
    };

    fetchProduto();
  }, [id, navigate, toast]);

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

    setLoading(true);
    try {
      const produto = {
        nome,
        descricao,
        unidade,
        preco: parseFloat(preco),
        situacao,
      };

      if (!id) {
        toast({
          title: "Erro",
          description: "ID do produto é inválido.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await updateProduto(id, produto);
      toast({
        title: "Produto Atualizado",
        description: "Produto atualizado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/produtos");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o produto.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
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
              type="text"
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
              type="text"
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
              type="text"
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
              type="text"
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

      <CustomButton
        variant="solid"
        w="full"
        mt={4}
        onClick={handleSubmit}
        isLoading={loading}
        isDisabled={loading}
      >
        Atualizar Produto
      </CustomButton>
    </Box>
  );
};

export default EditProduct;
