# Parte 1

[00:00] Para iniciar a implementação do nosso sistema de login, a primeira coisa que precisamos fazer é configurar nossa primeira estratégia de autenticação, a estratégia local, que é estratégia onde recebemos o e-mail e senha do nosso cliente. Para facilitar a criação dos Middlewares de autenticação usaremos dois módulos que é o passport e o passport-local.

[0:25] Primeiro para começar, vamos no nosso projeto e vamos instalar esses dois pacotes. Então npm install passport@0.4.1, nesse caso estamos usando a versão “0.4.1” do passport. Agora vamos instalar o passport-local, então npm install passport-local@1.0.0, nesse caso, estamos usando a versão “1.0.0”. Agora com esses dois pacotes instalados vamos começar a configurar a nossa estratégia de autenticação.

[01:19] Para isso vamos na pasta, clicando do lado superior esquerdo em “BLOG-DO-CODIGO > node_modules > src > posts > usuários”, e vamos criar o arquivo estratégias-autenticacao.js. Então vai ser nesse arquivo que vamos configurar todas as nossas estratégias de autenticação. Para isso, vamos começar importando passport, const passport = require( ‘passport’ ) e a estratégia local const LocalStrategy = require( ‘passport-local’ ).Strategy.

[02:12] Agora, a primeira coisa que precisamos fazer é configurar a nossa nova estratégia. Para isso usamos o método passport, passport.use( new LocalStrategy). Esse método LocalStrategy vai receber dois argumentos, o primeiro é um objeto opcional com algumas opções de modificação, e o segundo vai ser o nossa função de verificação da estratégia local.

[02:45] Então o que colocamos nesse objeto opcional que vai ser o nosso primeiro argumento? Como não usamos os nomes padrões do passport, teremos que fazer algumas modificações como usarnameField, que em vez de usar username, estamos usando e-mail. Como não usamos passport, no campo passportField, colocamos senha.

[03:22] Além disso como agora nosso sistema de login vai ser sistema de login sem sessões também precisamos configurar session: false. Pronto, e é isso o objeto de configurações. Agora vamos criar a nossa função de verificação, essa função de verificação recebe três argumentos, nesse caso, o e-mail, senha da requisição que o cliente envia para nós, e uma função done, que vai ser a função call-back do passport authenticate.

[04:03] E qual que é o objetivo dessa função? O objetivo dessa função é, se as credenciais do usuário estiverem válidas, essa função devolve o usuário para a função call-back do passport authenticate. Já que precisamos do nosso usuário, a primeira coisa que devemos fazer é importar ele no nosso arquivo.

[04:30] Então para isso, aqui no começo do código vai ser const Usuario = require(‘./usuários-modelo), agora já temos o nosso model, então só vamos buscar o nosso usuário a partir do e-mail, então const usuário = Usuario.buscaPorEmail(email) que vai receber o e-mail que o cliente mandou na requisição.

[05:06] Como esse método devolve uma promise. Vamos só colocar essas qwords assim: asynce await, ai conseguimos usar essas estruturas de código. Certo, recebemos nosso usuário. O que mais precisamos fazer? O que acontece se essa busca der errado? Precisamos tratar desse erro, então vamos usar um try catch para encapsular todo esse bloco de código.

[05:39] Então vamos colocar a busca do usuário no try, e no catch do erro vamos chamar função done, enviando o erro que aconteceu. Certo, agora tratamos do caso em que a busca falhou, e o que acontece se a busca retorna nulo? Que nesse caso não existe usuário com esse e-mail na base, e precisamos de alguma função para verificar se usuário existe ou não.

[06:10] Então vamos fazer uma função chamada “verifique o usuário”, na linha 6, vamos fazer: function verificaUsuario (usuario), que vai receber nosso usuário. O que ela vai fazer? Se o usuário for nulo, ou seja, if (!usuario), ele vai jogar um erro, ou seja throw new Error(). Nesse caso, jogar um erro genérico não é tão informativo para toda nossa aplicação, e para resolver esse problema, nossa aplicação já tem erros customizados implementados.

[06:55] Então para resolver isso podemos importar um dos nossos erros customizados, que é InvalidArgumentError que é o erro de argumento inválido, que vai importar do diretório anterior, o arquivo “erros”. Certo, então substituindo o nosso erro genérico, criamos um novo InvalidArgumentError e na mensagem do erro podemos dizer “Não existe usuário com esse e-mail”.

[07:42] Então agora para verificar o usuário, podemos ir debaixo da busca por e-mail e chamar a função verificaUsuario(usuario). Então se o usuário não existir, ele vai jogar um erro, e se existir ele continua a lógica do programa normalmente. Então tudo bem, a partir desse ponto do programa, a sabemos que o usuário existe, só que não temos certeza se a senha que ele enviou é a senha desse mesmo usuário.

[08:18] Então para isso precisamos criar uma outra função chamada verifica senha, então aqui em baixo vamos criar uma nova function verificaSenha(senha, senhaHash) que vai receber a senha que um cliente enviou e a senha hash do usuário que acabamos de buscar. Então como conseguimos fazer a comparação da senha, com a senha hash? Para isso temos o método do bcrypt, chamado bcrypt compare.

[08:53] Então vamos importar ele na linha 7 const bcrypt = require(‘bcrypt’) agora vamos conseguir usar o método bcrypt compare, que vai retornar se a senha é válida ou não. Então const senhaValida = bcrypt.compare(senha, senhaHash). Um ponto importante, esse bcrypt compare retorna uma promise. Então vamos usar await e async dessa função.

[09:43] Certo, e o que acontece se a senha não for válida, retornamos um novo erro. Então throw new InvalidArgumentError(‘E-mail ou senha inválidos’), pronto. Dessa forma conseguimos fazer nossa função de verificação da senha, e para isso só precisamos chamar ela embaixo de verificaUsuario(usuário);, verificaSenha(senha, usuário.senhaHash);, enviando a senha que o cliente enviou na requisição e a senha hash do usuário que acabamos de buscar.

[10:36] Então depois de todas as verificações de usuário e de senha, temos certeza que as credenciais que o cliente enviou na requisição dele, são válidas. E para isso só precisamos chamar o done(null, usuário), que vai receber no argumento de erros caso, que nesse caso não teve nenhum. E o usuário que acabamos de buscar, mostrando que esse cliente que fez a requisição está autentificado.

[11:04] Então é dessa forma que configuramos a nossa primeira estratégia de autenticação e mais pra frente, veremos como inserir essa estratégia dentro das rotas da nossa aplicação.



# Parte 2

00:00] Agora para finalizar nossa primeira estratégia de autenticação, a primeira coisa que vamos fazer é corrigir um pequeno erro. Em verificaSenha temos que colocar await, porque no caso devolve uma promise, então para manter essa estrutura de código, colocamos o await.

[00:22] Precisamos primeiro inicializar a nossa estratégia, então antes de inicializar em “app.js”, vamos no “index.js”, e fazer com que ele seja visível. Vamos exportar nosso módulo, na linha 5 vamos colocar estrategiasAutenticacao: require(‘./estratégias-autenticacao’). Dessa forma podemos importar o nosso módulo de outros arquivos.

[01:07] Agora vamos em “app.js”, e aqui vai inicializar a nossa estratégia de autenticação, no caso as outras estratégias que podemos ter no futuro. Por isso vamos pôr na linha 5: const { estrategiasAutenticacao } = require (‘./src/usuarios’). Então vamos importar as nossas estratégias de autenticação dos usuários, no “app.js” que é o arquivo de configuração do express.

[01:50] Agora com nossa estratégia já inicializada, vamos começar a fazer as rotas do nosso sistema de login, para isso vamos primeiro criar o controlador, em “usuarios-controlador.js”, que vai implementar a resposta depois de um login bem-sucedido. Vamos criar nossa função de login: (req, res) => que vai receber a requisição e a resposta.

[02:26] O que que ela vai devolver? No caso como a parte da requisição de fato, onde vai implementar a estratégia de autenticação, vai ser feita no middleware na rota, já temos a certeza que usuário dentro dessa função está autentificado. Então a única coisa que precisamos é devolver uma resposta como status 204, de página vazia. Então: res.status(204).send().

[03:02] Se o login foi bem-sucedido, ele só vai devolver “204”, deu tudo certo e não tem nada nessa página. Agora que vamos implementar na rota, a nossa rota de login. Em “usuarios-rotas.js”, vamos criar aqui uma nova rota. Nossa rota vai se chamar .route(‘/usuário/login’). Ela vai ser o método post, e o controlador que ele vai chamar vai ser o usuariosControlador.login.

[03:50] Dentro dessa rota, com método post, vamos inserir o middleware de autenticação suporte para isso então vamos importar o passport, const passport = require(‘passport’), e vamos usar o método do passport, que é .post(passport.authenticate(). Esse passport.authenticate recebe dois ou mais argumentos.

[04:27] O primeiro vai ser a estratégia que vamos usar nessa autenticação, no caso vamos usar a estratégia local, então colocamos string locale o segundo argumento que vamos colocar, vai estar relacionado ao fato de que não estamos mais usando sessões na nossa aplicação, vamos fazer um sistema de login sem sessões e como padrão para express é sessão como true, só precisamos configurar no objeto de configuração, session : false.

[05:05] Dessa forma configuramos o middleware de autenticação, que vai chamar nossa estratégia local, verificar se usuário, o cliente que enviou requisição, está autenticado ou não. É dessa forma que conseguimos inserir essa estratégia de autenticação na nossa aplicação e agora vamos testar para ver se está tudo funcionando certo.

[05:30] Então abrindo o terminal, vou colocar npm start, aparentemente está tudo funcionando. Vamos aqui no “Insomnia” e vamos criar uma nova requisição de login, vamos criar a requisição “Efetua login”, que vai ser uma requisição do método post com o corpo do formulário.

[05:58] Essa requisição vai ser uma requisição para método localhost:3000/usuario/login. No corpo da nossa requisição, vamos enviar o e-mail, nesse caso “andrew@alura.com.br” e a senha, nesse caso vai ser “123123123”. Vamos ver se está tudo funcionando essa daqui é as credenciais usuário cadastrado na base Então está tudo funcionando, essas daqui são as credencias do meu usuário cadastrado na base.

[06:35] Então está tudo certo. Ele enviou o código “204” que colocamos no controlador, então aparentemente ele está identificando quando um usuário é válido. Se por acaso enviar uma credencial inválida, eu errar a senha e colocar sem o último caractere, ele consegue identificar isso? Fazendo a requisição de novo ele dá um erro, e no erro ele fala e-mail e senha inválidos. Então conseguimos implementar nosso primeiro sistema de login usando a estratégia local.

