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
import { getPedidos } from "../../services/api.pedidos";
import { getClientes } from "../../services/api.clientes";
import { Pedido } from "../../services/types/type.pedidoVenda";
import ConfirmDeleteModal from "./DeletePedido/DeletePedidoModal";
import CustomButton from "../../ui/CustomButton";
import { Cliente } from "../../services/types/type.clientes";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { formatCurrency } from "../../utils/formatCurrency";
import Player from "react-lottie-player";
import EmptyAnimation from "../../components/Assets/Animations/Empty_animation.json";

const Pedidos: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [pedidoToDelete, setPedidoToDelete] = useState<string | null>(null);

  const {
    data: pedidos,
    isLoading,
    isError,
    error,
  }: UseQueryResult<Pedido[], Error> = useQuery({
    queryKey: ["pedidos"],
    queryFn: getPedidos,
  });

  const {
    data: clientes,
    isLoading: clientesLoading,
  }: UseQueryResult<Cliente[], Error> = useQuery({
    queryKey: ["clientes"],
    queryFn: getClientes,
  });

  const clientesMap =
    clientes?.reduce((acc: Record<string, Cliente>, cliente: Cliente) => {
      acc[cliente.id] = cliente;
      return acc;
    }, {}) ?? {};

  if (isError) {
    toast({
      title: "Erro ao carregar pedidos",
      description: (error as Error)?.message,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }

  const editarPedido = (pedido: Pedido) => {
    navigate(`/editorder/${pedido.id}`);
  };
  const handleOpenModal = (id: string) => {
    setPedidoToDelete(id);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <CustomButton variant="solid" onClick={() => navigate("/createOrder")}>
          + Criar Pedido
        </CustomButton>
      </Box>

      {isLoading || clientesLoading ? (
        <Text>Carregando...</Text>
      ) : isError ? (
        <Text>Erro ao carregar pedidos: {(error as Error)?.message}</Text>
      ) : pedidos?.length === 0 ? (
        <Box textAlign="center" mt={10}>
          <Player
            play
            loop
            animationData={EmptyAnimation}
            style={{ height: "300px", width: "300px", margin: "0 auto" }}
          />
          <Text mt={4} fontSize="lg" fontWeight="medium" color="gray.600">
            Nenhum pedido encontrado.
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
              Lista de Pedidos
            </Text>
            <Tr>
              <Th w="20%">ID</Th>
              <Th w="25%">Cliente</Th>
              <Th w="15%">Emissão</Th>
              <Th w="15%">Situação</Th>
              <Th w="15%">Total</Th>
              <Th w="15%">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pedidos?.map((pedido) => {
              const cliente = clientesMap[pedido.clienteId];

              return (
                <Tr key={pedido.id}>
                  <Td>{pedido.id}</Td>
                  <Td>{cliente ? cliente.nome : "Cliente não encontrado"}</Td>
                  <Td>
                    {new Date(pedido.emissao).toLocaleDateString("pt-BR")}
                  </Td>

                  <Td>
                    <Badge
                      p={2}
                      borderRadius="md"
                      w="full"
                      textAlign="center"
                      colorScheme={
                        pedido.situacao === "PENDENTE"
                          ? "yellow"
                          : pedido.situacao === "CONCLUIDO"
                          ? "green"
                          : "red"
                      }
                    >
                      {pedido.situacao}
                    </Badge>
                  </Td>
                  <Td>{formatCurrency(pedido.totalPedido)}</Td>
                  <Td>
                    <IconButton
                      aria-label="Editar pedido"
                      icon={<EditIcon />}
                      bg="primary"
                      color="details"
                      onClick={() => editarPedido(pedido)}
                      mr={2}
                    />
                    <IconButton
                      aria-label="Excluir pedido"
                      icon={<DeleteIcon />}
                      bg="error"
                      color="details"
                      onClick={() => handleOpenModal(pedido.id)}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}

      {pedidoToDelete !== null && (
        <ConfirmDeleteModal
          isOpen={pedidoToDelete !== null}
          onClose={() => setPedidoToDelete(null)}
          codigoPedido={String(pedidoToDelete)}
          carregarPedidos={() => {}}
        />
      )}
    </Box>
  );
};

export default Pedidos;
