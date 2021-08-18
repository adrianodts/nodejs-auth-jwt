# Tratando erros do token

[00:00] Já que o tratamento de erro da estratégia local já está funcionando, vamos voltar no middleware de autenticação do nosso projeto e começar a fazer a mesma coisa que fizemos na estratégia local, na estratégia bearer. Então na linha “26”, vamos criar mais uma função bearer, que será do mesmo jeito que fizemos em cima, um middleware, que vai receber uma requisição req, uma resposta res, um next e vai chamar o passport.authenticate com os atributos req, res, next.

[00:50] Na linha “29” vamos falar qual vai ser a estratégia, no caso a estratégia bearer, a opção de session para false e a função call-back customizada, que vai receber o erro, usuário, info e objeto de informações. Do mesmo jeito que fizemos na função customizada anterior, teremos que analisar os possíveis erros que podemos ter nessa estratégia específica.

[01:37] Antes de pensar no erro, vamos fazer o que fizemos como primeira coisa na função anterior, que é inserir o usuário em req.user, caso a autenticação tenha dado certo, e finalizar a função, chamando o próximo middleware. Então antes de fazer a inserção do usuário, vamos realizar as verificações para fazer todos os tratamentos de erro.

[02:07] Quais são os erros que englobamos dentro da estratégia de autenticação? Os erros que temos dentro da estratégia de autenticação, são os erros vindo do jwt.verify, que são erros que precisamos tratar diferentemente de um erro interno.

[02:32] Se olharmos na documentação do JsonWebToken, veremos que o erro que ele vai disparar nos casos que abrangem a gente, que são os de Tokens mal formatadas e assinaturas inválidas, é o erro chamado JsonWebTokenError .

[02:48] Então para isso, podemos fazer a condicional, se tivermos o erro, se o objeto erro não for nulo e o atributo name, o nome do erro, for JsonWebTokenError, nós devolvermos a resposta. Paramos a execução da função, devolvendo uma resposta return res.status(401), a credencial que ele está enviando não é válida, e o json com a mensagem a mensagem do erro que ele teve.

[03:34] Então: json({ erro: erro.message }) é a verificação do erro baseada no erro que sai do jwt.verify. Fora isso, não precisamos tratar de nenhum outro erro, não é nenhum erro que está em nossa regra de negócios. Então tirando isso, encapsulamos tudo em um erro genérico, qualquer outra coisa que não estamos esperando, paramos a execução dessa função específica, enviando um código “500” como resposta, e um json com a mensagem do erro.

[04:23] Fora isso, fazemos igual tínhamos feito anteriormente, no caso, o usuário é false e o erro é null. Paramos a execução do programa, com uma resposta de código “401” e um json(), porque provavelmente a requisição que ele fez está mal formatada e não tem as credenciais que precisamos para começar a avaliar isso.

[04:55] Finalizamos a configuração do nosso middleware personalizado, então podemos começar a inserir nas rotas que precisamos, que são as rotas de criação de post e deleção de usuário, para manter o padrão que já estávamos fazendo.

[05:14] Para conseguir importar, a partir das rotas de posts, precisamos ir em “BLOG-DO-CODIGO > SRC > usuarios-index.js” e criar a referência para middlewaresAutenticacao, que vai significar esse atributo, que vai ser o require de middlewares-autenticacao.

[05:41] Então a partir disso, podemos importar esse arquivo no “BLOG-DO-CODIGO > SRC > posts-rota.js”, na linha “2” importamos o middlewaresAutenticacao, referenciamos ao objeto e fazemos o require da pasta anterior, à usuarios. Então importamos os middlewares de autenticação de usuários e substituímos pelo passport authenticate.

[06:27] Então ao invés de usar o passport.authenticate.bearer, vamos usar middlewaresAutenticacao.bearer. Se formos ver, não precisamos mais do passport nesse arquivo, vamos só usar nossa estratégia customizada. E do mesmo jeito, se formos em “BLOG-DO-CODIGO > SRC > usuarios-rotas.js”, podemos substituir o que já tínhamos feito em passport, pelo middlewaresAutenticacao.bearer.

[07:01] Dessa forma, também não precisamos usar o passport, assim conseguimos substituir todos locais que estávamos usando o passport.authenticate em nossas rotas e podemos testar no “Insomnia” para ver se tudo está funcionando. Rodando o servidor, vamos pedir para ele fazer uma requisição de criação de post.

[07:25] Indo em ”Criar post”, estamos com nosso Token, então vamos enviar a requisição e está funcionando. O que acontece se deletarmos algum atributo da assinatura? Ele devolve a resposta com o erro de invalid signature, já que estamos com uma assinatura inválida.

[07:44] E assim tratamos nosso erro, que agora está com um código melhor, igual tínhamos feito na estratégia local e a mensagem de erro muito mais adaptada a um API, que é a nossa aplicação. Assim tratamos com sucesso todos os erros de autenticação da nossa aplicação e demos mais um passo para finalizar nosso sistema de autenticação com Tokens.