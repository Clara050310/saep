const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./database/sistema.db');

// Configurações básicas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'chave_secreta',
  resave: false,
  saveUninitialized: true
}));

// Middleware de autenticação
function auth(req, res, next) {
  if (!req.session.usuario) return res.redirect('/');
  next();
}

// =================================
// Rotas de Login e Registro
// =================================

// Página de login
app.get('/', (req, res) => res.render('login', { erro: null }));

// Login
app.post('/login', (req, res) => {
  const { login, senha } = req.body;
  db.get("SELECT * FROM usuario WHERE login=? AND senha=?", [login, senha], (err, row) => {
    if (row) {
      req.session.usuario = row;
      res.redirect('/principal');
    } else {
      res.render('login', { erro: 'Usuário ou senha incorretos.' });
    }
  });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// Página de registro
app.get('/registro', (req, res) => {
  res.render('registro', { erro: null });
});

// Registro de usuário
app.post('/registro', (req, res) => {
  const { nome, email, senha, confirma_senha } = req.body;

  if (senha !== confirma_senha) {
    return res.render('registro', { erro: 'As senhas não conferem.' });
  }

  db.get("SELECT * FROM usuario WHERE login=?", [email], (err, row) => {
    if (row) {
      return res.render('registro', { erro: 'E-mail já cadastrado.' });
    }

    db.run("INSERT INTO usuario (nome, login, senha) VALUES (?, ?, ?)",
      [nome, email, senha], err => {
        if (err) return res.render('registro', { erro: 'Erro ao registrar usuário.' });
        res.redirect('/');
      });
  });
});

// =================================
// Página Principal
// =================================
app.get('/principal', auth, (req, res) => {
  res.render('principal', { usuario: req.session.usuario });
});

// =================================
// Cadastro de Produtos
// =================================
app.get('/cadastro_produto', auth, (req, res) => {
  db.all("SELECT * FROM produto", [], (err, produtos) => {
    res.render('cadastro_produto', { produtos });
  });
});

app.post('/cadastro_produto', auth, (req, res) => {
  const { nome, descricao, material, peso, tamanho, estoque_minimo } = req.body;
  db.run(`INSERT INTO produto (nome, descricao, material, peso, tamanho, estoque_minimo, estoque_atual) 
          VALUES (?, ?, ?, ?, ?, ?, 0)`,
          [nome, descricao, material, peso, tamanho, estoque_minimo],
          err => res.redirect('/cadastro_produto'));
});

app.post('/excluir_produto/:id', auth, (req, res) => {
  db.run("DELETE FROM produto WHERE id_produto=?", [req.params.id], err => {
    res.redirect('/cadastro_produto');
  });
});

// =================================
// Gestão de Estoque
// =================================
app.get('/gestao_estoque', auth, (req, res) => {
  db.all("SELECT * FROM produto ORDER BY nome ASC", [], (err, produtos) => {
    res.render('gestao_estoque', { produtos });
  });
});

app.post('/movimentar', auth, (req, res) => {
  const { id_produto, tipo, quantidade, data_mov } = req.body;
  const qtd = parseInt(quantidade);

  db.get("SELECT * FROM produto WHERE id_produto=?", [id_produto], (err, produto) => {
    if (!produto) return res.redirect('/gestao_estoque');

    let novoEstoque = produto.estoque_atual;

    if (tipo === 'entrada') {
      novoEstoque += qtd;
    } else if (tipo === 'saida') {
      if (qtd > produto.estoque_atual) {
        console.log(`❌ Estoque insuficiente para ${produto.nome}!`);
        return res.redirect('/gestao_estoque');
      }
      novoEstoque -= qtd;
    }

    db.run("UPDATE produto SET estoque_atual=? WHERE id_produto=?", [novoEstoque, id_produto]);
    db.run(`INSERT INTO movimentacao (id_produto, id_usuario, tipo_mov, quantidade, data_mov)
            VALUES (?, ?, ?, ?, ?)`,
      [id_produto, req.session.usuario.id_usuario, tipo, qtd, data_mov]);

    if (novoEstoque < produto.estoque_minimo) {
      console.log(`⚠️ Estoque baixo para ${produto.nome}!`);
    }

    res.redirect('/gestao_estoque');
  });
});

// =================================
// Servidor
// =================================
app.listen(3000, () => console.log("🚀 Servidor rodando em http://localhost:3000"));
