import React, { useState } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  IconButton,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getProdutos } from "../../services/api.produtos"; 
import { Produto } from "../../services/types/type.produtos"; 
import DeleteProdutoModal from "./DeleteProduto/DeleteProdutoModal";
import CustomButton from "../../ui/CustomButton";
import { EditIcon, DeleteIcon, ChevronDownIcon, ChevronUpIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { formatCurrency } from "../../utils/formatCurrency";
import InputForm from "../../components/Inputs/InputForm";
import Player from "react-lottie-player";
import EmptyAnimation from "../../components/Assets/Animations/Empty_animation.json"; // Importe a animação

const Produtos: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [produtoToDelete, setProdutoToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'normal'>('normal'); 

  const { data: produtos, isLoading, isError, error }: UseQueryResult<Produto[], Error> = useQuery({
    queryKey: ['produtos'], 
    queryFn: getProdutos, 
  });

  if (isError) {
    toast({
      title: "Erro ao carregar produtos",
      description: (error as Error)?.message,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }

  const editarProduto = (produto: Produto) => {
    navigate(`/editProduct/${produto.id}`); 
  };

  const handleOpenModal = (id: string) => { 
    setProdutoToDelete(id);
  };

  const filteredProdutos = produtos?.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortProdutosByPrice = (produtos: Produto[]) => {
    if (sortOrder === 'asc') {
      return produtos.sort((a, b) => a.preco - b.preco);
    } else if (sortOrder === 'desc') {
      return produtos.sort((a, b) => b.preco - a.preco);
    }
    return produtos; 
  };

  const sortedProdutos = sortProdutosByPrice(filteredProdutos);

  const toggleSortOrder = () => {
    if (sortOrder === 'normal') {
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('normal');
    }
  };

  return (
    <Box>
      <HStack justifyContent="space-between" mb={4}>
        <InputForm
          type="search"
          placeholder="Buscar produto por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxWidth="400px"
        />
        <CustomButton variant="solid" onClick={() => navigate("/createproduct")}>
          + Criar Produto
        </CustomButton>
      </HStack>

      {isLoading ? (
        <Text>Carregando...</Text>
      ) : isError ? (
        <Text>Erro ao carregar produtos: {(error as Error)?.message}</Text>
      ) : produtos?.length === 0 ? ( 
        <Box textAlign="center" mt={10}>
          <Player
            play
            loop
            animationData={EmptyAnimation}
            style={{ height: "300px", width: "300px", margin: "0 auto" }}
          />
          <Text mt={4} fontSize="lg" fontWeight="medium" color="gray.600">
            Nenhum produto encontrado.
          </Text>
        </Box>
      ) : (
        <Table variant="simple" bg="details" p={4} borderRadius="md">
          <Thead>
            <Text fontSize="2xl" fontWeight="bold" mb={4} ml={5} p={2} color="primary">
              Lista de Produtos
            </Text>
            <Tr>
              <Th w="20%">ID</Th>
              <Th w="35%">Nome</Th>
              <Th 
                w="20%" 
                cursor="pointer" 
                onClick={toggleSortOrder} 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between"
              >
                Preço 
                {sortOrder === 'normal' && <ChevronRightIcon />}
                {sortOrder === 'asc' && <ChevronUpIcon />}
                {sortOrder === 'desc' && <ChevronDownIcon />}
              </Th>
              <Th w="15%">Situação</Th>
              <Th w="10%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedProdutos?.map((produto) => (
              <Tr key={produto.id}>
                <Td>{produto.id}</Td>
                <Td>{produto.nome}</Td>
                <Td>{formatCurrency(produto.preco)}</Td>
                <Td>
                  <Badge p={2} borderRadius="md" w="full" textAlign="center" colorScheme={produto.situacao === "ATIVO" ? "green" : "red"}>
                    {produto.situacao}
                  </Badge>
                </Td>
                <Td>
                  <IconButton
                    aria-label="Editar produto"
                    icon={<EditIcon />}
                    bg="primary"
                    color="details"
                    onClick={() => editarProduto(produto)}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Excluir produto"
                    icon={<DeleteIcon />}
                    bg="error"
                    color="details"
                    onClick={() => handleOpenModal(produto.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {produtoToDelete !== null && (
        <DeleteProdutoModal
          isOpen={produtoToDelete !== null}
          onClose={() => setProdutoToDelete(null)}
          codigoProduto={produtoToDelete}
          carregarProdutos={() => {}} 
        />
      )}
    </Box>
  );
};

export default Produtos;
