export interface Produto {
    id: string;
    nome: string;
    descricao: string;
    unidade: string;
    preco: number; 
    situacao: "ATIVO" | "INATIVO"; 
  }
  
  export interface ProdutoResponse {
    produtos: Produto[];
  }
  