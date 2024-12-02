import React, { useState } from "react";
import { Box, useToast, Grid, GridItem } from "@chakra-ui/react";
import { createCliente } from "../../../services/api.clientes";
import InputForm from "../../../components/Inputs/InputForm";
import SelectForm from "../../../components/Inputs/SelectForm";
import CustomButton from "../../../ui/CustomButton";
import { TipoCliente, Situacao } from "../../../services/types/type.clientes";

const CreateClient: React.FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState({
    nome: "",
    situacao: Situacao.ATIVO,
    tipo: TipoCliente.FISICA,
    cpf: "",
    cnpj: "",
    endereco: "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!cliente.nome) {
        toast({
          title: "Erro",
          description: "O nome do cliente é obrigatório.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      if (cliente.tipo === TipoCliente.FISICA && !cliente.cpf) {
        toast({
          title: "Erro",
          description: "O CPF é obrigatório para pessoa física.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      if (cliente.tipo === TipoCliente.JURIDICA && !cliente.cnpj) {
        toast({
          title: "Erro",
          description: "O CNPJ é obrigatório para pessoa jurídica.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      await createCliente(cliente);
      toast({
        title: "Cliente Criado",
        description: "O cliente foi criado com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setCliente({
        nome: "",
        situacao: Situacao.ATIVO,
        tipo: TipoCliente.FISICA,
        cpf: "",
        cnpj: "",
        endereco: "",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o cliente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="1900px" mx="auto" mt={4} bg="details" p={4} borderRadius="md">
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem colSpan={2} p={2}>
          <InputForm
            label="Nome"
            placeholder="Nome do cliente"
            name="nome"
            value={cliente.nome}
            onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
            type="text"
          />
        </GridItem>

        <GridItem>
          <SelectForm
            label="Situação"
            name="situacao"
            type="text"
            value={cliente.situacao}
            onChange={(e) =>
              setCliente({ ...cliente, situacao: e.target.value as Situacao })
            }
            options={[
              { value: Situacao.ATIVO, label: "Ativo" },
              { value: Situacao.INATIVO, label: "Inativo" },
            ]}
          />
        </GridItem>

        <GridItem>
          <SelectForm
            label="Tipo de Cliente"
            type="text"
            name="tipo"
            value={cliente.tipo}
            onChange={(e) =>
              setCliente({
                ...cliente,
                tipo: e.target.value as TipoCliente,
                cpf: e.target.value === TipoCliente.FISICA ? "" : cliente.cpf,
                cnpj:
                  e.target.value === TipoCliente.JURIDICA ? "" : cliente.cnpj,
              })
            }
            options={[
              { value: TipoCliente.FISICA, label: "Pessoa Física" },
              { value: TipoCliente.JURIDICA, label: "Pessoa Jurídica" },
            ]}
          />
        </GridItem>

        <GridItem>
          <InputForm
            label="CPF"
            placeholder="CPF do cliente"
            name="cpf"
            value={cliente.cpf}
            onChange={(e) =>
              setCliente({ ...cliente, cpf: e.target.value.replace(/\D/g, "") })
            }
            type="cpf"
            isDisabled={cliente.tipo === TipoCliente.JURIDICA}
          />
        </GridItem>

        <GridItem>
          <InputForm
            label="CNPJ"
            placeholder="CNPJ do cliente"
            name="cnpj"
            value={cliente.cnpj}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setCliente({ ...cliente, cnpj: rawValue });
            }}
            type="cnpj"
            isDisabled={cliente.tipo === TipoCliente.FISICA}
          />
        </GridItem>

        <GridItem colSpan={2}>
          <InputForm
            label="Endereço"
            placeholder="Endereço do cliente"
            name="endereco"
            value={cliente.endereco}
            onChange={(e) =>
              setCliente({ ...cliente, endereco: e.target.value })
            }
            type="text"
          />
        </GridItem>
      </Grid>

      <CustomButton
        variant="solid"
        w="full"
        onClick={handleSave}
        isLoading={loading}
        isDisabled={loading}
        mt={4}
      >
        Criar Cliente
      </CustomButton>
    </Box>
  );
};

export default CreateClient;
