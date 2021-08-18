const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('jsonwebtoken')
const Usuario = require('./usuarios-modelo');
const manipulaBlacklist = require('../../redis/manipula-blacklist')
const { InvalidArgumentError } = require('../erros');

const bcrypt = require('bcrypt');

function verificaUsuario(usuario) {
  if (!usuario) {
    throw new InvalidArgumentError('Não existe usuário com esse e-mail!');
  }
}

async function verificaTokenNaBlacklist(token) {
  const tokenNaBlacklist = await manipulaBlacklist.contemToken(token)
  if (tokenNaBlacklist) {
    throw new jwt.JsonWebTokenError('Token inválido por logout!');
  }
}

async function verificaSenha(senha, senhaHash) {
  console.log(await bcrypt.compare(senha, senhaHash));
  const senhaValida = await bcrypt.compare(senha, senhaHash);
  if (!senhaValida) {
    throw new InvalidArgumentError('E-mail ou senha inválidos!');
  }
}

// Local Strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'senha',
    session: false
  },
  async (email, senha, done) => {
    try {
      const usuario = await Usuario.buscaPorEmail(email);
      verificaUsuario(usuario);
      await verificaSenha(senha, usuario.senhaHash);

      done(null, usuario);
    } catch (erro) {
      done(erro);
    }
  })
);

// Bearer Strategy
passport.use(new BearerStrategy(
  async (token, done) => {
    try {
      await verificaTokenNaBlacklist(token)
      const key = process.env.CHAVE_JWT
      const payload = jwt.verify(token, key)
      const usuario = await Usuario.buscaPorId(payload.id)
      done(null, usuario, { token: token });
    } catch (error) {
      done(error)
    }
  })
)
