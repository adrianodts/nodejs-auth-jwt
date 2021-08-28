const usuariosControlador = require('./usuarios-controlador');
const middlewaresAutenticacao = require('./middlewares-autenticacao')


module.exports = app => {

  app
    .route('/usuario/atualiza-token')
    .post(middlewaresAutenticacao.refresh, usuariosControlador.login)

  app
    .route('/usuario/login')
    .post(middlewaresAutenticacao.local, usuariosControlador.login)
    //.post(passport.authenticate('local', { session: false }), usuariosControlador.login)

  app
    .route('/usuario/logout')
    .post([middlewaresAutenticacao.refresh, middlewaresAutenticacao.bearer] , usuariosControlador.logout)

  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app.route('/usuario/:id').delete(
    [middlewaresAutenticacao.bearer],
    usuariosControlador.deleta);
    //passport.authenticate('bearer', { session: false }), 

  app
    .route('/usuario/verifica_email/:token')
    .get(middlewaresAutenticacao.verificacaoEmail, usuariosControlador.verificaEmail);

};
