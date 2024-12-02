
export enum TipoCliente {
    FISICA = "FISICA",
    JURIDICA = "JURIDICA"
  }

  export enum Situacao {
    ATIVO = "ATIVO",
    INATIVO = "INATIVO"
  }
  
  export interface Cliente {
    id: string;
    nome: string;
    tipo: TipoCliente;  
    cpf: string;
    cnpj: string;
    situacao: Situacao;  
    endereco: string;
  }
  