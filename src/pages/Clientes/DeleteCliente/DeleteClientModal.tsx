import React from "react";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Text, useToast } from "@chakra-ui/react";
import { deleteCliente } from "../../../services/api.clientes";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  codigoCliente: string;
  carregarClientes: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, codigoCliente, carregarClientes }) => {
  const toast = useToast();

  const handleDelete = async () => {
    try {
      if (!codigoCliente) {
        toast({
          title: "Erro",
          description: "Código do cliente inválido.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await deleteCliente(codigoCliente); 
      carregarClientes(); 
      onClose(); 
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir cliente",
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
          <Text>Tem certeza que deseja excluir este cliente?</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button colorScheme="red" onClick={handleDelete} ml={3}>Excluir</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDeleteModal;
