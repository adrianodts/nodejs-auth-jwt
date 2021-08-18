const jwt = require('jsonwebtoken')
const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const manipulaBlacklist = require('../../redis/manipula-blacklist')

async function criaTokenJwt(usuario) {
  const payload = { id: usuario.id }
  const key = process.env.CHAVE_JWT
  const token = await jwt.sign(payload, key, { expiresIn: '15m' }) 
  return token
  // return await jwt.sign(payload, 'senha-secreta')
}

module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email
      });

      await usuario.adicionaSenha(senha)
      await usuario.adiciona();

      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },

  login : async (req, res) => {
    const token = await criaTokenJwt(req.user) // o user é colocado na requisição quando o passport auth é finalizado
    res.set('Authorization', token)
    res.status(204).send()
  },

  lista: async (req, res) => {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  deleta: async (req, res) => {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  },

  logout: async (req, res) => {
    try {
      const token = req.token
      await manipulaBlacklist.adicionaToken(token)
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
};
