import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, useToast, Grid, GridItem } from "@chakra-ui/react";
import { getClienteById, updateCliente } from "../../../services/api.clientes";
import InputForm from "../../../components/Inputs/InputForm";
import SelectForm from "../../../components/Inputs/SelectForm";
import CustomButton from "../../../ui/CustomButton";
import {
  Cliente,
  TipoCliente,
  Situacao,
} from "../../../services/types/type.clientes";

const EditClient: React.FC = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchCliente = async () => {
      try {
        const data = await getClienteById(id);
        setCliente(data);
      } catch (error) {
        toast({
          title: "Erro ao carregar cliente",
          description: "Não foi possível carregar as informações do cliente.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchCliente();
  }, [id, toast]);

  const handleSave = async () => {
    if (!cliente) return;

    setLoading(true);
    try {
      await updateCliente(cliente.id, cliente);
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/clientes");
    } catch (error) {
      toast({
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar as informações do cliente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value as TipoCliente;
    setCliente((prevCliente) => {
      if (prevCliente) {
        if (tipo === TipoCliente.FISICA) {
          return { ...prevCliente, tipo, cnpj: "", cpf: prevCliente.cpf || "" };
        } else {
          return {
            ...prevCliente,
            tipo,
            cpf: "",
            cnpj: prevCliente.cnpj || "",
          };
        }
      }
      return prevCliente;
    });
  };

  if (!cliente) {
    return <Box>Carregando...</Box>;
  }

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
              setCliente({
                ...cliente,
                situacao: e.target.value as Situacao,
              })
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
            onChange={handleTipoChange}
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
            value={cliente.cpf ?? ""}
            onChange={(e) => setCliente({ ...cliente, cpf: e.target.value })}
            type="text"
            isDisabled={cliente.tipo === TipoCliente.JURIDICA}
          />
        </GridItem>

        <GridItem>
          <InputForm
            label="CNPJ"
            placeholder="CNPJ do cliente"
            name="cnpj"
            value={cliente.cnpj ?? ""}
            onChange={(e) => setCliente({ ...cliente, cnpj: e.target.value })}
            type="text"
            isDisabled={cliente.tipo === TipoCliente.FISICA}
          />
        </GridItem>

        <GridItem colSpan={2}>
          <InputForm
            label="Endereço"
            placeholder="Endereço do cliente"
            name="endereco"
            value={cliente.endereco ?? ""}
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
        Salvar
      </CustomButton>
    </Box>
  );
};

export default EditClient;
