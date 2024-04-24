const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "signoooo",
  password: "ds564",
  port: 7007,
});

function calcularIdadeSigno(dataNascimento) {
  const dataNasc = new Date(dataNascimento);
  const dataAtual = new Date();

  let idade = dataAtual.getFullYear() - dataNasc.getFullYear();
  const m = dataAtual.getMonth() - dataNasc.getMonth();
  if (m < 0 || (m === 0 && dataAtual.getDate() < dataNasc.getDate())) {
    idade--;
  }

  let signo = "";
  const dia = dataNasc.getDate();
  const mes = dataNasc.getMonth() + 1;
  if ((dia >= 21 && mes == 3) || (dia <= 19 && mes == 4)) signo = "Áries ♈";
  else if ((dia >= 20 && mes == 4) || (dia <= 20 && mes == 5)) signo = "Touro ♉";
  else if ((dia >= 21 && mes == 5) || (dia <= 20 && mes == 6)) signo = "Gêmeos ♊";
  else if ((dia >= 21 && mes == 6) || (dia <= 22 && mes == 7)) signo = "Câncer ♋";
  else if ((dia >= 23 && mes == 7) || (dia <= 22 && mes == 8)) signo = "Leão ♌";
  else if ((dia >= 23 && mes == 8) || (dia <= 22 && mes == 9)) signo = "Virgem ♍";
  else if ((dia >= 23 && mes == 9) || (dia <= 22 && mes == 10)) signo = "Libra ♎";
  else if ((dia >= 23 && mes == 10) || (dia <= 21 && mes == 11)) signo = "Escorpião ♏";
  else if ((dia >= 22 && mes == 11) || (dia <= 21 && mes == 12)) signo = "Sagitário ♐";
  else if ((dia >= 22 && mes == 12) || (dia <= 19 && mes == 1)) signo = "Capricórnio ♑";
  else if ((dia >= 20 && mes == 1) || (dia <= 18 && mes == 2)) signo = "Aquário ♒";
  else if ((dia >= 19 && mes == 2) || (dia <= 20 && mes == 3)) signo = "Peixes ♓";
  return { idade, signo };
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Rota funcionando! ✅");
});

app.get("/users", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM usuarios");
    res.json({
      total: resultado.rowCount,
      usuarios: resultado.rows,
    });
  } catch (error) {
    console.error("Erro ao exibir usuarios ❌", error);
    res.status(500).json({ message: "Erro ao exibir usuarios" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { idade, signo } = calcularIdadeSigno(req.body.datanascimento);
    const { nome, sobrenome, datanascimento, email } = req.body;
    await pool.query(
      "INSERT INTO usuarios (nome, sobrenome, datanascimento, email, idade, signo ) VALUES ($1, $2, $3, $4, $5, $6)",
      [nome, sobrenome, datanascimento, email, idade, signo]
    );
    res.status(201).send({ message: "Usuario inserido com sucesso!" });
  } catch (error) {
    console.error("Erro ao inserir usuario", error);
    res.status(500).json({ message: "Erro ao inserir usuario" });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    res.status(200).send({ message: "Usuario deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar usuario", error);
    res.status(500).json({ message: "Erro ao deletar usuario" });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { idade, signo } = calcularIdadeSigno(req.body.datanascimento);
    const { id } = req.params;
    const { nome, sobrenome, datanascimento, email } = req.body;
    await pool.query(
      "UPDATE usuarios SET nome = $1, sobrenome = $2, datanascimento = $3, email = $4  WHERE id = $3",
      [nome, sobrenome, datanascimento, email, idade, signo, id]
    );
    res.status(200).send({ message: "Usuario atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar usuario", error);
    res.status(500).json({ message: "Erro ao atualizar usuario" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
      id,
    ]);
    if (resultado.rowCount === 0) {
      return res.status(404).send({ message: "Id não encontrado!" });
    } else {
      res.json({
        usuario: resultado.rows[0],
      });
    }
  } catch (error) {
    console.error("Erro ao exibir usuario pelo id", error);
    res.status(500).json({ message: "Erro ao exibir usuario pelo id" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🎀`);
});
