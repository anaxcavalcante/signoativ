CREATE TABLE usuarios (
    ID SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    datanascimento DATE NOT NULL,
    email VARCHAR(100) NOT NULL,
    idade INT,
    signo VARCHAR(30)
);