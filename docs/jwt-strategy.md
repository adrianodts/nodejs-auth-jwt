# Estratégia para JWT

[00:00] Agora que nós conseguimos devolver o Token para nosso usuário, podemos começar a construir nossa próxima estratégia autenticação para Tokens. Nesse caso, no Passport, essa estratégia se chama bearer que vem de bearer token, no português significa “token de autenticação”. Então para começar, nós precisamos instalar o módulo da estratégia pelo npm.

[00:24] Vamos então abrir o nosso projeto e instalar esse módulo. Antes disso, vocês podem notar que eu mudei de computador, antes eu estava usando um Mac e agora estou no Linux. Mas vai ser do mesmo jeito daqui para frente usando o Linux, sem nenhuma outra mudança.

[00:43] Uma coisa que vocês também podem perceber, é que por eu ter mudado de computador, eu também mudei a base de dados. Então vamos começar com a nossa base de dados zerada. Então vamos ao diretório do nosso projeto, importar o módulo da estratégia do bearer token.

[01:04] Para isso vamos fazer npm install e o nome do módulo da estratégia: passport-http-bearer e a versão que vamos estar usando nesse curso, que é “1.0.1”. Vamos esperar ele instalar, então dado que já temos o módulo da estratégia, vamos começar editar o arquivo das nossas estratégias de autenticação em “SRC > usuários > estratégias-autenticacao.js”.

[01:45] Para iniciar a configuração de uma nova estratégia de autenticação, precisamos fazemos igual fizemos com a estratégia local, importar a classe da estratégia, então vamos fazer: const BearerStrategy = require(‘passport’-http-bearer).Strategy. Certo, temos a estratégia, então vamos na linha “45” começar a configurar estratégia, do mesmo jeito que tínhamos feito com estratégia local.

[02:27] Como vocês podem ver, usamos o passport.use e a nossa nova configuração estratégia new BearerStrategy. Não vamos precisar de nenhum objeto de opções então podemos partir direto para função de verificação. O que essa função de verificação vai receber? A anterior recebia o e-mail senha e o done, nesse não vamos ter o e-mail e senha, mas vamos ter o Token.

[03:04] Então vamos fazer uma nova função de verificação que vai receber o Token e o done, essa vai ser assinatura da nosso função de verificação, e o que que ela vai precisar fazer? A primeira coisa, dado que vamos receber o Token do nosso cliente, vai ser verificar se o Token está válido e recuperar o Payload a partir dele.

[03:30] Para isso, vamos precisar da mesma biblioteca que usamos para gerar esse Token, que é o módulo JSON WEB TOKEN. Vamos na linha “10” e importar const jwt = require(‘jsonwebtoken’). Agora que temos o jwt, esse módulo tem um método que chama jwt.verify. O que que esse método faz?

[04:04] Ele vai receber o a string do nosso Token, que vamos receber do cliente, e a chave secreta que está guardada dentro das nossas variáveis de ambiente. Então process.env.CHAVE_JWT, e o que que ele devolve? Ele devolve o Payload se o Token estiver válido, e se não estiver válido ele devolve um erro.

[04:36] Então já que ele devolve o Payload se estiver válido, colocamos o resultado do jwt.verify no Payload. Uma coisa que é legal notar, é que já vemos a importância de colocar essa senha nas variáveis de ambiente, a nossa senha da CHAVE_JWT, é que ela consegue ser acessada também a partir desse arquivo, e de todos os outros arquivos do nosso projeto uniformemente.

[05:00] Então vamos continuar aqui o processo da construção da nossa função de verificação, partindo do pressuposto que o jwt.verify vai ter aceitado o Token. Então dado que o Token está correto, vamos saber o Payload, recebendo o Payload vamos poder recuperar usuário, essa é uma das principais funções da função de verificação.

[05:25] Então como conseguimos recuperar usuário? O Payload vai ter o ID como atributo dele, então podemos receber usuário a partir da model: Usuario.buscaPorId, e o ID vai estar como atributo do Payload. Como buscaPorId retorna uma promisse, podemos colocar await na frente da chamada da função e async no começo da nossa função de verificação.

[06:03] Conseguimos recuperar o usuário e dado que o ato de recuperar o usuário deu tudo certo, o que podemos fazer é: chamar função done com o parâmetro de erros null, porque não aconteceu nenhum erro e o usuário que acabamos de recuperar. Então essa é situação ideal, onde um usuário válido faz a requisição para nossa plataforma.

[06:27] Se não der certo vamos receber um erro, então precisamos tratar esse erro, encapsulando todo esse bloco de código num bloco de try cath. Então vamos recortar todo esse bloco que acabamos de escrever e colocar no try e se der algum erro interno no nosso servidor, chamamos o done com o erro que houve.

[07:02] Então se der tudo certo, conseguimos recuperar o usuário e chamar função done com erros para null e devolver no usuário, se der algum erro no processo, só chamamos done com o erro que houve. É dessa forma que conseguimos configurar a função de verificação para estratégia bearer token e agora podemos testar e implementar essa estratégia nas nossas rotas protegendo-as.

[07:30] Quais vão ser as rotas que vamos inserir isso? Vão ser as rotas de criação de post e identificação de usuário. Então vamos primeiro na nossa pasta “SRC > posts > posts-rotas.js”, aqui vamos importar o passport, então const passport = require(‘passport’) e vamos usar o middleware de autenticação do passport authenticate na rota post, do endereço post.

[08:07] Então passport.authenticate com a estratégia que vamos estar usando, a estratégia bearer e session: false, porque não vamos estar usando sessões. Então colocamos esse middleware do passport em nossa na rota de post, na criação de posts. Vamos inserir na segunda rota, agora em usuários, vamos em “SRC > posts > usuários > usuarios-rotas.js”, já temos passport importado, só precisamos inserir a rota de deleção de usuários.

[08:55] Então passport.authenticate, vamos colocar estratégia bearer e a opção de session: false, então inserimos aqui o nosso middleware de autenticação na rota de deleção de usuário. Agora vamos testar o nosso projeto para ver se está tudo funcionando direito. Primeiro vamos iniciar nosso servidor com npm start, servidor ligou. Agora vamos para o “Insomnia”, fazer uma requisição para o nosso servidor.

[09:44] Então vamos tentar fazer uma requisição de criação de post, se você for ver, não tem nada nos headers, não tem autenticação nenhuma. Antes era uma coisa que podíamos fazer, uma requisição de criação de post sem nenhuma autenticação, agora vamos ver se o nosso servidor barra, se a nossa aplicação consegue barrar essa requisição.

[10:06] Fazendo isso, eu recebo o código “401” de não autorizado. Então nossa aplicação viu que não temos as credenciais válidas para fazer requisição e barrou-nos, disse que não estamos autorizados a fazer isso. Então vamos tentar agora fazer essa mesma requisição, só que com o autenticado. Primeiro como nossa base está zerada, que nem eu comentei no começo do vídeo, vamos criar nosso usuário de novo.

[10:31] Vamos efetuar o login, login feito. Temos o nosso Token, e agora precisamos usar esse Token para fazer a próxima requisição, mas como precisa ser a estrutura da nossa requisição, para enviarmos esse Token para nosso servidor? O passport quando interpreta o conteúdo da nossa requisição para jogar para estratégia de autenticação, nossa função de verificação, ele aceita alguns padrões, onde você pode inserir esse Token.

[11:10] Um deles é inserirmos esse Token nos headers da requisição e no header específico que o header authorization, e não só isso, é também inserir esse Token no header authorization com o prefixo bearer, para explicitar que tipo de Token que você está enviando, que tipo de credencial de autorização de autenticação você está enviando.

[11:38] Então podemos copiar esse Token, ir na nossa requisição de criar post, no header vamos criar header authorization com valor bearer e o nosso Token. Então vamos refazer a requisição, e deu certo. Conseguimos criar o post, ele entendeu o Token que enviamos, viu que estávamos autenticados e permitiu que criássemos o post.

[11:17] Se você está usando o “Insomnia”, ainda tem uma forma mais fácil de você realizar esse tipo de proposta de autenticação, que é na tab de auth onde ele já tem vários métodos, um pouco mais amigáveis para o usuário, para realizar esse tipo de autenticação, então você tem vários modelos, e um deles é o de berarer token.

[12:39] Então se você não quiser colocar explicitamente o Token no header, você pode só colar o seu próprio Token na tab de autenticação, no caso, na autenticação bearer ele já tem o prefixo automático como bearer e o que ele vai fazer é: colocar o que você está inserindo nessa tab direto nos headers.

[13:06] Então em vez de fazer isso que fizemos, podemos usar esse método do “Insomnia” que funciona da mesma forma. Então se forem ver, ele entendeu a requisição, porque ele está enviando isso nos headers da mesma forma que fizemos antes. Assim conseguimos realizar a autenticação usando Tokens e dessa forma podemos manter o estado do nosso login a cada requisição.