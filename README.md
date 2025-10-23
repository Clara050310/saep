## Documentação de controle de estoque

# Contextualização
- Um fabricante de ferramentas enfrenta desafios críticos na gestão de estoque.

# Desafio
- Desenvolver um sistema web que permite cadastrar produtos, gerenciar entrada e saida do estoque/produtos.

# Tecnologias Utilizadas
- JavaScript;
- Express,js;
- SQlite;
- VScode.

# Requisitos Funcionais
1. Login de usuário com validação e mensagem de erro.
2. Cadastro de novos usuários.
3. Interface principal exibindo nome do usuário logado.
4. Logout redirecionando á tela de login.
5. Cadastro, edição, exclusão e busca de produtos.
6. Visualização de produtos cadastrados em tabela.
7. Movimentação de estoque (entrada/saída) com registro de usuário e data.
8. Alertas automáticos quando estoque estive abaixo do minimo.
9. Ordenação de produtos alfabeticamente na gestão de estoque.

# Requisitos não funcionais
1. O sistema deve carregar a interface principal em até 2 segundo.
2. As senhas devem ser armazenadas de forma segura.
3. O acesso as páginas internas deve ser restrito apenas a usuários autenticados.
4. Sessões expiram automaticamente após 30 minutos de inatividade.
5. Mensagem de eroo e alertas devem ser claras e informativas para o usuário.
6. Possibilidade de adicionar novos módulos, como relatórios e gráficos de estoque.

# Script de criação do banco de dados

```sql

CREATE TABLE usuario (
  id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  login TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL
);

CREATE TABLE produto (
  id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT,
  material TEXT,
  peso REAL,
  tamanho TEXT,
  estoque_minimo INTEGER NOT NULL,
  estoque_atual INTEGER DEFAULT 0
);

CREATE TABLE movimentacao (
  id_mov INTEGER PRIMARY KEY AUTOINCREMENT,
  id_produto INTEGER NOT NULL,
  id_usuario INTEGER NOT NULL,
  tipo_mov TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  data_mov TEXT NOT NULL,
  FOREIGN KEY (id_produto) REFERENCES produto(id_produto),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

```


