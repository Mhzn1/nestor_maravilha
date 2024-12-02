import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL || "http://localhost:5002"}/produtos`;

export const getProdutos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao carregar produtos");
  }
};

export const deleteProduto = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log(id);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data.message || `Erro HTTP: ${error.response.status}`);
      } else if (error.request) {
        throw new Error("Erro de rede: A solicitação não obteve resposta.");
      } else {
        throw new Error("Erro desconhecido ao excluir produto.");
      }
    }
    throw new Error("Erro desconhecido.");
  }
};

export const updateProduto = async (id: string, produto: any) => {
  try {
    await axios.put(`${API_URL}/${id}`, produto);
  } catch (error) {
    throw new Error("Erro ao editar produto");
  }
};

export const createProduto = async (produto: any) => {
  try {
    await axios.post(API_URL, produto);
  } catch (error) {
    throw new Error("Erro ao adicionar produto");
  }
};

export const getProdutoById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data.message || `Erro HTTP: ${error.response.status}`);
      } else if (error.request) {
        throw new Error("Erro de rede: A solicitação não obteve resposta.");
      } else {
        throw new Error("Erro desconhecido ao buscar produto.");
      }
    }
    throw new Error("Erro desconhecido.");
  }
};
