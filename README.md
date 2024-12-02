Como Configurar e Usar o Projeto com React e JSON Server

Este projeto foi criado com o Create React App e usa o JSON Server para simular uma API de backend local. Abaixo estão todos os passos necessários para rodar o projeto, configurar o ambiente e iniciar o servidor.

1. Instalar o Node.js:  
   Certifique-se de ter o Node.js instalado no seu computador. Caso não tenha, faça o download e instale a versão mais recente do Node.js através do link: https://nodejs.org/.

2. Clonar o Repositório:  
   Se você ainda não tem o repositório localmente, clone o projeto com o seguinte comando:

   git clone https://github.com/Mhzn1/nestor_maravilha.git

3. Instalar Dependências:  
   Navegue até o diretório do projeto e instale as dependências necessárias com o comando:

   npm install

4. Rodar o Projeto React:  
   Para rodar a aplicação em modo de desenvolvimento, use o comando:

   npm start

   Após isso, o projeto estará disponível em http://localhost:3000.

5. Instalar o JSON Server:  
   Este projeto usa o JSON Server para simular uma API local. Para instalar o JSON Server globalmente, use o seguinte comando:

   npm install -g json-server

6. Criar o Arquivo `db.json`:  
   Dentro do diretório do seu projeto, crie uma pasta chamada `src/db` e, dentro dela, crie o arquivo `db.json` com o seguinte conteúdo:

   {
  "clientes": [
    {
      "id": "9b49",
      "nome": "Microsys",
      "situacao": "ATIVO",
      "tipo": "JURIDICA",
      "cpf": "",
      "cnpj": "86910502000175",
      "endereco": "Maravilha"
    }
  ],
  "produtos": [
    {
      "id": "70b7",
      "nome": "Produto A",
      "descricao": "Descrição do produto A",
      "unidade": "UND",
      "preco": 10,
      "situacao": "ATIVO"
    }
  ],
  "pedidos": [],
  "itens_pedido": []
}

7. Iniciar o JSON Server:  
   Para iniciar o servidor do JSON Server, use o seguinte comando:

   json-server --watch src/db/db.json --port 5002

   Isso irá fazer com que o JSON Server fique observando o arquivo `db.json` e crie um servidor API local na porta 5002. Agora você pode acessar a API em http://localhost:5002.

8. Conectar o Frontend com a API:  
   No seu código React, você pode fazer requisições para o JSON Server.

9. Comandos do Create React App:  
   Além dos passos acima, o Create React App oferece outros comandos úteis para o desenvolvimento. Alguns dos comandos disponíveis são:

   - `npm start`: Roda o app em modo de desenvolvimento.
   - `npm test`: Executa os testes do projeto.
   - `npm run build`: Cria uma versão otimizada do projeto para produção.
   - `npm run eject`: Ejetar a configuração do Create React App (não recomendado a menos que tenha certeza).

10. Para mais informações:  
    - Para aprender mais sobre o Create React App, consulte a documentação oficial em https://reactjs.org/docs/getting-started.html.
    - Para aprender mais sobre o JSON Server, consulte a documentação em https://github.com/typicode/json-server.

Com isso, você terá o ambiente completo configurado, tanto o frontend em React quanto o backend simulado com JSON Server, prontos para serem utilizados no seu projeto.
