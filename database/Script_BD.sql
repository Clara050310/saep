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
    estoque_atual INTEGER DEFAULT 0,
    estoque_minimo INTEGER DEFAULT 0
);

CREATE TABLE movimentacao (
    id_mov INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produto INTEGER,
    id_usuario INTEGER,
    tipo_mov TEXT CHECK(tipo_mov IN ('entrada','saida')),
    quantidade INTEGER,
    data_mov TEXT,
    FOREIGN KEY(id_produto) REFERENCES produto(id_produto),
    FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario)
);

INSERT INTO usuario (nome, login, senha)
VALUES ('Administrador', 'admin', '123');

INSERT INTO produto (nome, descricao, material, peso, tamanho, estoque_atual, estoque_minimo)
VALUES ('Martelo de Aço', 'Cabeça de aço e cabo de madeira', 'Aço', 0.8, '30cm', 10, 5);
