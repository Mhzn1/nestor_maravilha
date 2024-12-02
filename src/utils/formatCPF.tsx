export const formatCPF = (cpf: string): string => {
    const cleaned = cpf.replace(/\D/g, ""); 
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };
  
  export const formatCNPJ = (cnpj: string): string => {
    const cleaned = cnpj.replace(/\D/g, "");
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };
  