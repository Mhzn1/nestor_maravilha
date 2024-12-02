import React from "react";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Text, useToast } from "@chakra-ui/react";
import { deletePedido } from "../../../services/api.pedidos";

interface DeletePedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  codigoPedido: string;
  carregarPedidos: () => void;
}

const DeletePedidoModal: React.FC<DeletePedidoModalProps> = ({ isOpen, onClose, codigoPedido, carregarPedidos }) => {
  const toast = useToast();

  const handleDelete = async () => {
    try {
      if (!codigoPedido) {
        toast({
          title: "Erro",
          description: "Código do pedido inválido.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await deletePedido(codigoPedido);
      carregarPedidos(); 
      onClose(); 
      toast({
        title: "Pedido excluído",
        description: "O pedido foi excluído com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir pedido",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmar Exclusão</ModalHeader>
        <ModalBody>
          <Text>Tem certeza que deseja excluir este pedido?</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button colorScheme="red" onClick={handleDelete} ml={3}>Excluir</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeletePedidoModal;
