export type ItemPedido = {
    sequencial: string; 
    produtoId: string;
    quantidade: number;
    valorUnitario: number;
    desconto: number;
    total: number;
  };
  
  export type Pedido = {
    id: string;
    situacao: "PENDENTE" | "CONCLUIDO" | "CANCELADO"; 
    clienteId: string; 
    emissao: string; 
    descontoTotal: number;
    totalPedido: number;
    itens?: ItemPedido[];
  };
  