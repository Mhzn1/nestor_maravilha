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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getClientes } from "../../services/api.clientes";
import { Cliente } from "../../services/types/type.clientes";
import ConfirmDeleteModal from "./DeleteCliente/DeleteClientModal";
import CustomButton from "../../ui/CustomButton";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import InputForm from "../../components/Inputs/InputForm";
import Player from "react-lottie-player";
import EmptyAnimation from "../../components/Assets/Animations/Empty_animation.json";
import { formatCPF, formatCNPJ } from "../../utils/formatCPF";

const Clientes: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [clienteToDelete, setClienteToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: clientes,
    isLoading,
    isError,
    error,
  }: UseQueryResult<Cliente[], Error> = useQuery({
    queryKey: ["clientes"],
    queryFn: getClientes,
  });

  if (isError) {
    toast({
      title: "Erro ao carregar clientes",
      description: (error as Error)?.message,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
  const editarCliente = (cliente: Cliente) => {
    navigate(`/editClient/${cliente.id}`);
  };

  const handleOpenModal = (id: string) => {
    setClienteToDelete(id);
  };

  const filteredClientes = clientes?.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        mb={4}
        alignItems="center"
      >
        <InputForm
          type="search"
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxWidth="400px"
        />
        <CustomButton variant="solid" onClick={() => navigate("/createClient")}>
          + Criar Cliente
        </CustomButton>
      </Box>
      {isLoading ? (
        <Text>Carregando...</Text>
      ) : isError ? (
        <Text>Erro ao carregar clientes: {(error as Error)?.message}</Text>
      ) : clientes?.length === 0 ? (
        <Box textAlign="center" mt={10}>
          <Player
            play
            loop
            animationData={EmptyAnimation}
            style={{ height: "300px", width: "300px", margin: "0 auto" }}
          />
          <Text mt={4} fontSize="lg" fontWeight="medium" color="gray.600">
            Nenhum cliente encontrado.
          </Text>
        </Box>
      ) : (
        <Table variant="simple" bg="details" p={4} borderRadius="md">
          <Thead>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              mb={4}
              ml={5}
              p={2}
              color="primary"
            >
              Lista de Clientes
            </Text>
            <Tr>
              <Th w="20%">ID</Th>
              <Th w="35%">Nome</Th>
              <Th w="20%">CPF/CNPJ</Th>
              <Th w="15%">Situação</Th>
              <Th w="10%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredClientes?.map((cliente) => (
              <Tr key={cliente.id}>
                <Td>{cliente.id}</Td>
                <Td>{cliente.nome}</Td>
                <Td>
                  {cliente.tipo === "FISICA"
                    ? formatCPF(cliente.cpf)
                    : formatCNPJ(cliente.cnpj)}
                </Td>
                <Td>
                  <Badge
                    p={2}
                    borderRadius="md"
                    w="full"
                    textAlign="center"
                    colorScheme={cliente.situacao === "ATIVO" ? "green" : "red"}
                  >
                    {cliente.situacao}
                  </Badge>
                </Td>
                <Td>
                  <IconButton
                    aria-label="Editar cliente"
                    icon={<EditIcon />}
                    bg="primary"
                    color="details"
                    onClick={() => editarCliente(cliente)}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Excluir cliente"
                    icon={<DeleteIcon />}
                    bg="error"
                    color="details"
                    onClick={() => handleOpenModal(cliente.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {clienteToDelete !== null && (
        <ConfirmDeleteModal
          isOpen={clienteToDelete !== null}
          onClose={() => setClienteToDelete(null)}
          codigoCliente={String(clienteToDelete)}
          carregarClientes={() => {}}
        />
      )}
    </Box>
  );
};

export default Clientes;
