# Documentação de controle de estoque

## Contextualização
- Um fabricante de ferramentas enfrenta desafios críticos na gestão de estoque.

## Desafio
- Desenvolver um sistema web que permite cadastrar produtos, gerenciar entrada e saida do estoque/produtos.

## Tecnologias Utilizadas
- JavaScript;
- Express,js;
- SQlite;
- VScode.

## Requisitos Funcionais
1. Login de usuário com validação e mensagem de erro.
2. Cadastro de novos usuários.
3. Interface principal exibindo nome do usuário logado.
4. Logout redirecionando á tela de login.
5. Cadastro, edição, exclusão e busca de produtos.
6. Visualização de produtos cadastrados em tabela.
7. Movimentação de estoque (entrada/saída) com registro de usuário e data.
8. Alertas automáticos quando estoque estive abaixo do minimo.
9. Ordenação de produtos alfabeticamente na gestão de estoque.

## Requisitos não funcionais
1. O sistema deve carregar a interface principal em até 2 segundo.
2. As senhas devem ser armazenadas de forma segura.
3. O acesso as páginas internas deve ser restrito apenas a usuários autenticados.
4. Sessões expiram automaticamente após 30 minutos de inatividade.
5. Mensagem de eroo e alertas devem ser claras e informativas para o usuário.
6. Possibilidade de adicionar novos módulos, como relatórios e gráficos de estoque.

## Script de criação do banco de dados

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
## Diagrama Entidade-Relacionamento (DER)

| Tabela     | Campos                                  |
|-----------|----------------------------------------|
| USUARIO   | id_usuario (PK), nome, login, senha     |
| PRODUTO   | id_produto (PK), nome, descricao, material, peso, tamanho, estoque_minimo, estoque_atual |
| MOVIMENTACAO | id_mov (PK), id_produto (FK), id_usuario (FK), tipo_mov, quantidade, data_mov |

## Tabela de Casos de teste



| Caso de Teste | Requisito | Entrada | Saída Esperada |
|---------------|-----------|--------|----------------|
| CT01 | Login correto | Usuário e senha válidos | Redireciona para a tela principal |
| CT02 | Login incorreto | Usuário ou senha inválidos | Exibe mensagem de erro e permanece na tela de login |
| CT03 | Registro de novo usuário | Nome, login, senha | Usuário criado com sucesso; redireciona para login |
| CT04 | Logout | Usuário logado clica em logout | Redireciona para a tela de login |
| CT05 | Cadastro de produto | Nome, descrição, material, peso, tamanho, estoque mínimo | Produto inserido e listado na tabela de cadastro |
| CT06 | Edição de produto | Alteração de qualquer campo do produto | Produto atualizado corretamente na tabela |
| CT07 | Exclusão de produto | Seleção de produto e confirmação | Produto removido da tabela |
| CT08 | Busca de produto | Palavra-chave no campo de busca | Lista filtrada mostrando apenas os produtos correspondentes |
| CT09 | Movimentação de estoque - entrada | Seleção de produto, quantidade, data | Estoque do produto atualizado corretamente, registro adicionado no histórico |
| CT10 | Movimentação de estoque - saída | Seleção de produto, quantidade, data | Estoque do produto atualizado corretamente, alerta se estoque < mínimo, registro adicionado no histórico |
| CT11 | Ordenação de produtos | Lista de produtos cadastrados | Produtos exibidos em ordem alfabética |
| CT12 | Visualização de estoque | Abrir a interface de gestão de estoque | Exibe corretamente estoque atual e estoque mínimo de cada produto |
| CT13 | Alerta de estoque baixo | Saída de produto que deixa estoque abaixo do mínimo | Mensagem de alerta visível na interface |
| CT14 | Acesso restrito sem login | Usuário tenta acessar /principal, /cadastro_produto ou /gestao_estoque | Redireciona para tela de login |
| CT15 | Inserção de dados inválidos | Campos obrigatórios vazios ou valores negativos | Mensagem de erro e impede inserção/alteração |
| CT16 | Botão de voltar | Usuário clica no botão de voltar em qualquer interface | Redireciona para a tela principal sem alterar dados |
| CT17 | Responsividade da interface | Abrir em diferentes tamanhos de tela | Interface ajusta elementos sem sobreposição |
| CT18 | Histórico de movimentações | Consultar movimentações de produtos | Lista correta de movimentações com usuário, tipo, quantidade e data |
| CT19 | Integração com banco de dados | Inserir, editar, excluir produtos e movimentações | Alterações refletidas corretamente no banco de dados SQLite |
| CT20 | Consistência de estoque | Realizar múltiplas entradas e saídas | Estoque final corresponde às somas/subtrações corretas das movimentações |


## Interface do Login em diagrama

flowchart TD
    A[Tela de Login] -->|Login correto| B[Tela Principal]
    A -->|Login incorreto| A
    B --> C[Cadastro de Produto]
    B --> D[Gestão de Estoque]
    B --> E[Logout]

## Interface Principal do sistema

flowchart TD
    A[Tela Principal] --> B[Cadastro de Produto]
    A --> C[Gestão de Estoque]
    A --> D[Logout]

## Interface de cadastro de produto

flowchart TD
    A[Cadastro de Produto] --> B[Tabela de Produtos Cadastrados]
    A --> C[Campos de Cadastro]
    C --> D[Cadastrar Produto]
    B --> E[Editar Produto]
    B --> F[Excluir Produto]
    A --> G[Voltar para Tela Principal]

## Interface de gestão de estoque

flowchart TD
    A[Gestão de Estoque] --> B[Selecionar Produto]
    B --> C[Tipo de Movimentação]
    C --> D[Inserir Quantidade]
    D --> E[Inserir Data]
    E --> F[Registrar Movimentação]
    A --> G[Tabela de Produtos com Estoque]
    F --> G
    A --> H[Voltar para Tela Principal]