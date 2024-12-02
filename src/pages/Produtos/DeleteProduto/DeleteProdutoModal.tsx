import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast, 
} from '@chakra-ui/react';
import { deleteProduto } from '../../../services/api.produtos';

interface DeleteProdutoModalProps {
  isOpen: boolean;
  onClose: () => void;
  codigoProduto: string;
  carregarProdutos: () => void;
}

const DeleteProdutoModal: React.FC<DeleteProdutoModalProps> = ({
  isOpen,
  onClose,
  codigoProduto,
  carregarProdutos,
}) => {
  const toast = useToast();  

  const handleDelete = async () => {
    try {
      await deleteProduto(codigoProduto); 
      carregarProdutos();
      onClose(); 
      toast({
        title: "Produto excluído.",
        description: "O produto foi excluído com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Erro ao excluir produto", error);
      toast({
        title: "Erro ao excluir produto",
        description: "Ocorreu um erro ao tentar excluir o produto. Tente novamente.",
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
        <ModalHeader>Excluir Produto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Tem certeza de que deseja excluir este produto? Esta ação não pode ser desfeita.
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={onClose} mr={3}>
            Cancelar
          </Button>
          <Button colorScheme="red" onClick={handleDelete}>
            Excluir
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteProdutoModal;
