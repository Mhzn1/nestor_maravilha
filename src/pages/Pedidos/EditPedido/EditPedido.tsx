import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Text,
  Grid,
  GridItem,
  Spinner,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPedidoById } from "../../../services/api.pedidos";
import { getProdutos } from "../../../services/api.produtos";
import { getClientes } from "../../../services/api.clientes";
import { updatePedido } from "../../../services/api.pedidos";
import InputForm from "../../../components/Inputs/InputForm";
import CustomButton from "../../../ui/CustomButton";
import SelectForm from "../../../components/Inputs/SelectForm";
import { formatCurrency } from "../../../utils/formatCurrency";

interface ItemPedido {
  produtoId: string;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  total: number;
}

const PedidoPage = () => {
  const toast = useToast();

  const [situacao, setSituacao] = useState<string>("");
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [clienteNome, setClienteNome] = useState<string>("");
  const [descontoTotal, setDescontoTotal] = useState<number>(0);
  const { id } = useParams<{ id: string }>();

  const { data: pedidoData, isLoading: pedidoLoading } = useQuery({
    queryKey: ["pedido", id],
    queryFn: () => getPedidoById(id as string),
    enabled: !!id,
  });

  const { data: produtosData, isLoading: produtosLoading } = useQuery({
    queryKey: ["produtos"],
    queryFn: getProdutos,
  });

  const { data: clientesData, isLoading: clientesLoading } = useQuery({
    queryKey: ["clientes"],
    queryFn: getClientes,
  });

  useEffect(() => {
    if (pedidoData) {
      setSituacao(pedidoData.situacao);

      if (clientesData) {
        const cliente = clientesData.find(
          (c: any) => c.id === pedidoData.clienteId
        );
        setClienteNome(cliente?.nome || "Cliente não encontrado");
      }

      if (produtosData) {
        const updatedItens = pedidoData.itens.map((item: any) => {
          const produto = produtosData.find(
            (prod: any) => prod.id === item.produtoId
          );
          return {
            produtoId: item.produtoId,
            quantidade: item.quantidade || 0,
            valorUnitario: produto?.preco || 0,
            desconto: item.desconto || 0,
            total:
              (produto?.preco || 0) * (item.quantidade || 0) -
              (item.desconto || 0),
          };
        });
        setItens(updatedItens);
      }
    }
  }, [pedidoData, produtosData, clientesData]);

  const handleItemChange = <T extends keyof ItemPedido>(
    index: number,
    field: T,
    value: ItemPedido[T]
  ) => {
    const updatedItens = [...itens];
    updatedItens[index][field] = value;

    if (
      field === "quantidade" ||
      field === "valorUnitario" ||
      field === "desconto"
    ) {
      updatedItens[index].total =
        (updatedItens[index].valorUnitario || 0) *
          (updatedItens[index].quantidade || 0) -
        (updatedItens[index].desconto || 0);
    }

    const totalDesconto = updatedItens.reduce(
      (acc, item) => acc + (item.desconto || 0),
      0
    );
    setDescontoTotal(totalDesconto);

    setItens(updatedItens);
  };

  const calcularValorTotal = () => {
    return itens
      .reduce((total, item) => total + (item.total || 0), 0)
      .toFixed(2);
  };

  const finalizarPedido = async () => {
    const pedidoAtualizado = {
      ...pedidoData,
      situacao: situacao,
      itens: itens.map((item) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        desconto: item.desconto,
      })),
    };

    try {
      if (id) {
        await updatePedido(id, pedidoAtualizado);
      } else {
        console.error("ID is undefined");
      }

      toast({
        title: "Pedido Editado",
        description: "O pedido foi editado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro ao Finalizar",
        description: "Ocorreu um erro ao tentar finalizar o pedido.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (pedidoLoading || produtosLoading || clientesLoading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box p={6} borderRadius="md" bg="details_bottom" maxW="1200px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={6} color="primary">
        Detalhes do Pedido
      </Text>

      <form>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
          <GridItem>
            <FormControl>
              <InputForm
                label="Cliente"
                type="text"
                value={clienteNome}
                isDisabled
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <InputForm
                label="Emissão"
                type="date"
                value={pedidoData?.emissao || ""}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <InputForm
                label="Desconto Total"
                type="text"
                value={formatCurrency(descontoTotal)}
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
                onChange={(e) => setSituacao(e.target.value)}
                isRequired
              />
            </FormControl>
          </GridItem>
        </Grid>
        <VStack align="start">
          <Text fontSize="2xl" fontWeight="bold" mt={6} mb={0} color="primary">
            Itens do Pedido
          </Text>
          <Text
            fontSize="10"
            fontWeight="bold"
            mt={0}
            textAlign="start"
            color="primary"
          >
            Edição bloqueada, por favor, em caso de erros crie um novo pedido!
          </Text>
        </VStack>

        {itens.map((item, index) => (
          <Box
            key={index}
            mb={6}
            p={4}
            bg="white"
            borderRadius="md"
            shadow="sm"
          >
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
              <GridItem>
                <FormControl>
                  <SelectForm
                    type="text"
                    label="Produto"
                    options={produtosData.map((prod: any) => ({
                      value: prod.id,
                      label: prod.nome,
                    }))}
                    value={item.produtoId}
                    onChange={(e) =>
                      handleItemChange(index, "produtoId", e.target.value)
                    }
                    isDisabled
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <InputForm
                    label="Quantidade"
                    type="text"
                    value={String(item.quantidade)}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantidade",
                        Number(e.target.value)
                      )
                    }
                    isDisabled
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <InputForm
                    label="Valor Unitário"
                    type="text"
                    value={formatCurrency(item.valorUnitario)}
                    isDisabled
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <InputForm
                    label="Desconto"
                    type="preco"
                    value={String(item.desconto)}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "desconto",
                        Number(e.target.value)
                      )
                    }
                    isDisabled
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </Box>
        ))}

        <Text
          fontSize="2xl"
          fontWeight="bold"
          mt={4}
          textAlign="end"
          color="primary"
        >
          Valor Total do Pedido: {formatCurrency(Number(calcularValorTotal()))}
        </Text>
        <CustomButton
          mt={6}
          variant="solid"
          width="full"
          onClick={finalizarPedido}
        >
          Editar Pedido
        </CustomButton>
      </form>
    </Box>
  );
};

export default PedidoPage;
