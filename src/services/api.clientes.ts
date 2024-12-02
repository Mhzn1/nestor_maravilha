import axios from "axios";

const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5002") + "/clientes";


export const getClientes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao carregar clientes");
  }
};

export const deleteCliente = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log(id)
    return response; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data.message || `Erro HTTP: ${error.response.status}`);
      } else if (error.request) {
        throw new Error("Erro de rede: A solicitação não obteve resposta.");
      } else {
        throw new Error("Erro desconhecido ao excluir cliente.");
      }
    }
    throw new Error("Erro desconhecido.");
  }
};

export const updateCliente = async (id: string, cliente: any) => {
  try {
    await axios.put(`${API_URL}/${id}`, cliente);
  } catch (error) {
    throw new Error("Erro ao editar cliente");
  }
};

export const createCliente = async (cliente: any) => {
  try {
    await axios.post(API_URL, cliente);
  } catch (error) {
    throw new Error("Erro ao adicionar cliente");
  }
};

export const getClienteById = async (id: string) => {
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
        throw new Error("Erro desconhecido ao buscar cliente.");
      }
    }
    throw new Error("Erro desconhecido.");
  }
};
