import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL || "http://localhost:5002"}/pedidos`;
const ITEM_URL = `${process.env.REACT_APP_API_URL || "http://localhost:5002"}/itens_pedido`;

export const getPedidos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    throw new Error("Erro ao carregar pedidos");
  }
};

export const deletePedido = async (id: string) => {
  try {
    const itensResponse = await axios.get(`${ITEM_URL}`, {
      params: { sequencial: id },
    });
    const itens = itensResponse.data;

    for (const item of itens) {
      await axios.delete(`${ITEM_URL}/${item.id}`);
    }
    const pedidoResponse = await axios.delete(`${API_URL}/${id}`);
    return pedidoResponse; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data.message || `Erro HTTP: ${error.response.status}`);
      } else if (error.request) {
        throw new Error("Erro de rede: A solicitação não obteve resposta.");
      } else {
        throw new Error("Erro desconhecido ao excluir pedido.");
      }
    }
    throw new Error("Erro desconhecido.");
  }
};

export const updatePedido = async (id: string, pedido: any) => {
  try {
    await axios.put(`${API_URL}/${id}`, pedido);
  } catch (error) {
    throw new Error("Erro ao editar pedido");
  }
};

export const createPedido = async (pedido: any) => {
  try {
    if (!pedido || !pedido.itens || !Array.isArray(pedido.itens)) {
      throw new Error("Os dados do pedido ou itens estão inválidos.");
    }

    const pedidoData = {
      clienteId: pedido.clienteId,
      emissao: pedido.emissao,
      situacao: pedido.situacao,
      descontoTotal: pedido.descontoTotal,
      totalPedido: pedido.totalPedido,
    };

    const pedidoResponse = await axios.post(API_URL, pedidoData);
    const pedidoId = pedidoResponse.data.id;

    if (!pedidoId) {
      throw new Error("Erro ao criar pedido: ID do pedido não foi retornado pela API.");
    }

    const itensParaBanco = pedido.itens.map((item: any) => ({
      sequencial: pedidoId, 
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
      desconto: item.desconto,
      total: item.total,
    }));

    const itensPromises = itensParaBanco.map((item: any) =>
      axios.post(`${ITEM_URL}`, item)
    );

    await Promise.all(itensPromises);

    return {
      pedidoId,
      mensagem: "Pedido e itens criados com sucesso.",
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Erro na comunicação com a API: ${error.response?.data?.message || error.message || "Erro desconhecido"}`
      );
    } else {
      throw new Error(error.message || "Erro desconhecido ao criar pedido.");
    }
  }
};

export const getPedidoById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    const pedido = response.data;

    const itensResponse = await axios.get(ITEM_URL);
    const itensPedido = itensResponse.data.filter((item: any) => item.sequencial === id);

    return { ...pedido, itens: itensPedido };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data.message || `Erro HTTP: ${error.response.status}`);
      } else if (error.request) {
        throw new Error("Erro de rede: A solicitação não obteve resposta.");
      } else {
        throw new Error("Erro desconhecido ao buscar pedido.");
      }
    }
    throw new Error("Erro desconhecido.");
  }
};

export const getPedidosComItens = async () => {
  try {
    const pedidosResponse = await axios.get(API_URL);
    const pedidos = pedidosResponse.data;

    const itensResponse = await axios.get(ITEM_URL);
    const itens = itensResponse.data;

    const pedidosComItens = pedidos.map((pedido: any) => {
      const itensDoPedido = itens.filter((item: any) => item.sequencial === pedido.id);
      return { ...pedido, itens: itensDoPedido };
    });

    return { pedidos: pedidosComItens };
  } catch (error) {
    throw new Error('Erro ao carregar pedidos e itens.');
  }
};
