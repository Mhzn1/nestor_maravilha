import React, { useState } from "react";
import {
  Box,
  Text,
  Grid,
  GridItem,
  FormControl,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import SelectForm from "../../../components/Inputs/SelectForm";
import InputForm from "../../../components/Inputs/InputForm";
import CustomButton from "../../../ui/CustomButton";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useQuery } from "@tanstack/react-query";
import { getClientes } from "../../../services/api.clientes";
import { createPedido } from "../../../services/api.pedidos";
import { getProdutos } from "../../../services/api.produtos";
import { Produto } from "../../../services/types/type.produtos";
import { Cliente } from "../../../services/types/type.clientes";

type ItemPedido = {
  produtoId: string;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  total: number;
};
const initialItem: ItemPedido = {
  produtoId: "",
  quantidade: 1,
  valorUnitario: 0,
  desconto: 0,
  total: 0,
};

const CreatePedido: React.FC = () => {
  const toast = useToast();

  const { data: clientes } = useQuery<Cliente[], Error>({
    queryKey: ["clientes"],
    queryFn: getClientes,
  });

  const { data: produtos } = useQuery<Produto[], Error>({
    queryKey: ["produtos"],
    queryFn: getProdutos,
  });

  const [clienteId, setClienteId] = useState<string>("");
  const [emissao, setEmissao] = useState<string>("");
  const [situacao, setSituacao] = useState<"PENDENTE" | "FINALIZADO">(
    "PENDENTE"
  );
  const [descontoTotal, setDescontoTotal] = useState<number>(0);
  const [itens, setItens] = useState<ItemPedido[]>([]);

  const handleAddItem = () => {
    setItens([
      ...itens,
      { produtoId: "", quantidade: 1, valorUnitario: 0, desconto: 0, total: 0 },
    ]);
  };

  const handleProdutoSelect = (index: number, produtoId: string) => {
    const selectedProduto = produtos?.find(
      (produto) => produto.id === produtoId
    );
    const updatedItens = [...itens];

    if (selectedProduto) {
      updatedItens[index].produtoId = produtoId;
      updatedItens[index].valorUnitario = selectedProduto.preco;
      updatedItens[index].total =
        updatedItens[index].quantidade * selectedProduto.preco -
        updatedItens[index].desconto;
    }

    setItens(updatedItens);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItens = [...itens];
    updatedItens.splice(index, 1);
    setItens(updatedItens);
  };

  const handleItemChange = <T extends keyof ItemPedido>(
    index: number,
    field: T,
    value: ItemPedido[T]
  ) => {
    const updatedItens: ItemPedido[] = [...itens];
    updatedItens[index][field] = value;

    if (
      field === "quantidade" ||
      field === "valorUnitario" ||
      field === "desconto"
    ) {
      updatedItens[index].total =
        updatedItens[index].valorUnitario * updatedItens[index].quantidade -
        updatedItens[index].desconto;
    }

    const totalDesconto = updatedItens.reduce(
      (total, item) => total + item.desconto,
      0
    );
    setDescontoTotal(totalDesconto);

    setItens(updatedItens);
  };

  const totalPedido = itens.reduce((total, item) => {
    return total + item.total;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clienteId || !emissao || itens.length === 0) {
      toast({
        title: "Preencha todos os campos obrigatórios.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const pedido = {
        clienteId,
        emissao,
        situacao,
        descontoTotal,
        totalPedido,
        itens,
      };
      await createPedido(pedido);

      toast({
        title: "Pedido criado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setClienteId("");
      setEmissao("");
      setSituacao("PENDENTE");
      setDescontoTotal(0);
      setItens([initialItem]);
    } catch (error) {
      toast({
        title: "Erro ao criar pedido.",
        description: (error as Error).message || "Erro desconhecido.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="1900px" mx="auto" mt={4} bg="details" p={4} borderRadius="md">
      <Text fontSize="2xl" fontWeight="bold" color="primary" mb={6}>
        Criar Pedido
      </Text>
      <form onSubmit={handleSubmit}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
          <GridItem>
            <FormControl mb={4}>
              <SelectForm
                type="text"
                label="Cliente"
                options={
                  clientes
                    ? clientes.map((cliente) => ({
                        value: cliente.id,
                        label: cliente.nome,
                      }))
                    : []
                }
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                isRequired
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl mb={4}>
              <InputForm
                label="Emissão"
                type="date"
                value={emissao}
                onChange={(e) => setEmissao(e.target.value)}
                isRequired
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl mb={4}>
              <InputForm
                label="Desconto Total"
                type="text"
                value={formatCurrency(descontoTotal)}
                onChange={(e) => setDescontoTotal(parseFloat(e.target.value))}
                isDisabled
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl mb={4}>
              <SelectForm
                type="text"
                label="Situação"
                options={[
                  { value: "PENDENTE", label: "Pendente" },
                  { value: "CONCLUIDO", label: "Concluido" },
                  { value: "FINALIZADO", label: "Finalizado" },
                ]}
                value={situacao}
                onChange={(e) =>
                  setSituacao(e.target.value as "PENDENTE" | "FINALIZADO")
                }
                isRequired
              />
            </FormControl>
          </GridItem>
        </Grid>

        <Text fontSize="xl" fontWeight="bold" color="primary" mt={5}>
          Adicionar Produtos
        </Text>

        <Box mb={4}>
          {itens.map((item, index) => (
            <Box key={index} mb={5} borderBottomWidth={1} position="relative">
              <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
                <GridItem>
                  <SelectForm
                    type="text"
                    label="Produto"
                    options={
                      produtos
                        ? produtos.map((produto) => ({
                            value: produto.id,
                            label: produto.nome,
                          }))
                        : []
                    }
                    value={item.produtoId}
                    onChange={(e) => handleProdutoSelect(index, e.target.value)}
                    isRequired
                  />
                </GridItem>

                <GridItem>
                  <FormControl mb={2}>
                    <InputForm
                      label="Quantidade"
                      type="text"
                      value={String(item.quantidade)}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantidade",
                          parseInt(e.target.value)
                        )
                      }
                      isRequired
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
                <GridItem>
                  <FormControl mb={2}>
                    <InputForm
                      label="Valor Unitário"
                      type="text"
                      value={
                        (produtos &&
                          formatCurrency(
                            produtos.find(
                              (produto) => produto.id === item.produtoId
                            )?.preco || 0
                          )) ||
                        ""
                      }
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "valorUnitario",
                          parseFloat(e.target.value)
                        )
                      }
                      isRequired
                      isDisabled
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl mb={2}>
                    <InputForm
                      label="Desconto (apenas números inteiros)"
                      type="preco"
                      value={String(item.desconto)}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "desconto",
                          Number(e.target.value.replace(/\D/g, ""))
                        )
                      }
                      isRequired
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              <IconButton
                aria-label="Remover item"
                icon={<DeleteIcon />}
                position="absolute"
                top={0}
                right={0}
                color="error"
                onClick={() => handleRemoveItem(index)}
                zIndex={1}
                background="transparent"
                _hover={{ bg: "transparent" }}
              />
            </Box>
          ))}
          <CustomButton mt={2} onClick={handleAddItem} variant="solid">
            Adicionar Produto
          </CustomButton>
        </Box>

        <Text fontSize="xl" fontWeight="bold" color="primary" mt={10}>
          Total do Pedido: R$ {totalPedido.toFixed(2)}
        </Text>
        <CustomButton mt={5} variant="solid" type="submit" w="full">
          Criar Pedido
        </CustomButton>
      </form>
    </Box>
  );
};

export default CreatePedido;
