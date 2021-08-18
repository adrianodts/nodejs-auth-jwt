# Manipulando uma blacklist

[00:00] Agora que nós temos nossa Blacklist instanciada, podemos começar a implementar as funções para fazer a manipulação dessa lista, assim, na pasta “BLOG-DO-CODIGO > redis”, vamos criar um novo arquivo chamado “manipula-blacklist.js”. Vai ser nesse arquivo que vamos criar as funções para manipulação da Blacklist.

[00:25] E para isso vamos precisar importa-la com const blacklist = require(‘./blacklist’). Em seguida o que devemos fazer é exportar as funções, então module.exportes e o objeto das funções que vamos criar. Então agora devemos pensar quantas e quais vão ser as funções que vamos precisar usar para interagir com essa lista.

[01:00] Vamos ter duas operações, uma é que queremos adicionar Tokens na lista e a segunda operação é verificar se um Token está na lista ou não. Então criamos duas funções, uma adiciona que vai receber e adicionar esse Token na base, e a segunda função que vamos chamar de contemToken, é uma função que também vai receber um Token, e responder se esse Token está na base ou não, se a base contém esse Token ou não.

[01:45] Agora podemos começar a pensar em como como implementar a função adiciona. O cliente do redis blacklist que temos, tem várias funções para interagir com essa base, e uma delas é o set. Se fizermos blacklist.set, ele recebe uma chave e um valor, e adicionamos essa dupla em nossa base no “redis”. Assim como comentamos, podemos usar o set para adicionar o Token como chave e uma string vazia com o valor.

[02:33] É dessa forma que adicionamos coisas no “redis”, e como que podemos fazer a verificação se a blacklist contém o Token ou não? Para isso temos um outro método do cliente que se chama exists, o que ele faz? Ele recebe o Token e devolve o resultado de se essa chave existe na base ou não. Só que para receber esse valor, temos um problema, todas as funções do cliente “redis”, funcionam de forma assíncrona.

[03:23] Além disso essa a API do “Node”, nessa versão que estamos usando, ainda não suporta promise. Então para utilizar a estrutura de código que já estamos fazendo nesse projeto, podemos usar uma ferramenta auxiliar, uma função que vai nos ajudar, a função promisify, uma função do módulo util, que já vem com o “Node”.

[03:49] Essa função consegue transformar uma função que está esperando uma função call-back, em uma função que devolve uma promisi. Então podemos importar promisify para receber require(‘util’). Em seguida podemos criar uma nova função a partir do pomisify. Assim podemos chamar uma função, por exemplo, existsAsyn que vai receber o resultado do promisify(blacklist.exists).

[04:45] Além disso temos que entrelaçar/atrelar essa função com o objeto blacklist, isso nós fazemos com bind(blacklist). Assim criamos uma função como blacklist.exists, só que agora ela vai devolver uma promisi. Então invés de usar blacklist.exist, usamos nosso existsAsync.

[05:16] Com isso conseguimos recuperar o resultado dessa função const resultado, e como ele vai devolver uma promise, colocamos await no resultado dessa função e async em contemToken. Agora temos o resultado dessa função, e o que ele significa? Se você ver a documentação, o resultado da função vai ser 1 se essa chave estiver na base, e 0 se não estiver.

[05:47] Então podemos retornar essa função se o resultado for igual a 1, ou seja, significa que a base contém o Token. Agora implementamos tudo certo nas nossas duas funções, e podemos seguir, pensando como conseguimos deletar os Tokens das bases. O que temos que fazer é expirar os valores do “redis”, da mesma forma que expiramos os Tokens, e na mesma faixa de tempo.

[06:25] Para fazer isso, conseguimos usar um outro método do nosso cliente “redis”, que se chama expireat, assim na linha “9”, podemos escrever: blacklist.expireat e definir sobre qual chave estamos querendo expirar, nesse caso o nosso Token, e em qual timestamp queremos que esse Token expire, em qual tempo queremos que essa chave expire.

[06:59] Para recuperar esse timestamp, precisamos pegar ele no payload do Token. Então antes de completar, vamos importar o módulo jwt, então const jwt = require(‘jsonwebtoken’), e vai ser disso que vamos usar o método para recuperar o payload do Token.

[07:32] Como no momento que chamamos essa adiciona, já vamos ter passado pelo jwtverify, não precisamos mais fazer a verificação se esse Token é válido ou não, já temos certeza que ele é válido. Então dessa forma podemos usar em vez de jwtverify, o jwt.decode, que devolve o payload para gente sem fazer nenhuma verificação. Como argumento, damos o Token.

[07:59] Além disso, invés de receber o payload, vamos pegar o valor exp, que é o timestamp de expiração desse Token, guardamos isso em uma outra variável chamada dataExpiracao. Então essa é a data de expiração do nosso Token, que recuperamos, e podemos usar isso como segundo argumento do blacklist.expireat, então dataExpiracao como segundo argumento.

[08:32] Esse método que usamos, ainda dá o mesmo problema do contemToken, porque blacklist.set também é uma função assíncrona, dessa forma pode ser que essa chave não seja criada na base, no momento que definirmos expireat. Então o que precisamos fazer é esperar a execução de blacklist.set, para executar o expireat.

[09:01] Isso é feito da mesma forma com o async, temos que transformar em uma função que devolve uma promise e colocamos a qword await. Então na linha “5”, criamos nossa função setAsync, que vai receber o resultado de promisify, agora do blacklist.set e atrelamos isso à blacklist. Agora usamos setAsync ao invés de blacklist.set.

[09:38] Para fazer essa função esperar executar, colocamos async na funciona adiciona e await no resultado de setAsync. Então vamos esperar executar para fazer essa chave esperar. Agora tem só mais uma parte que eu não comentei com vocês, que vai ficar muito mais clara agora que vocês estão vendo o código.

[10:02] Se você olhar na linha “12”, o que colocamos como chave é o Token, e o tamanho de Token é proporcional ao payload dele, assim quanto maior o payload, maior vai ser a chave que estamos colocando na base, com isso podemos acabar perdendo o controle, e ele pode acabar ficando grande, ainda mais com a chave que é uma coisa que precisamos fazer busca.

[10:24] Então para isso, é interessante que ao invés de guardarmos o Token como chave, guardarmos o hash dele, um hash que tenhamos certeza de qual tamanho ele vai ser, então fica uma coisa muito mais padronizada. Dessa forma, o que podemos fazer é criar outra função, que vamos chamar de geraTokenHash, essa que vai receber o Token e vai gerar um hash desse Token.

[10:53] Para gerar esse hash, podemos usar uma função do módulo crypto, chamada createHash. Então na linha “8”, importamos const { createHash} = require(‘crypto’), então temos o método createHash do módulo crypty. Dessa forma usamos o createHash para criar uma função de hash, podemos escolher o algoritmo, e pode ser qualquer algoritmo de hash de uso geral, nesse caso vai ser o sha256.

[11:37] Criado o algoritmo de hash, podemos aplica-lo no nosso Token, isso é feito usando o método update(algoritimo), então uptadate(token). Dado que criamos o hash desse Token, temos que escolher a codificação usada desse hash. Isso é feito com o método digest e a codificação que escolhermos, por exemplo, hex de [ININTELIGÍVEL].

[12:07] Devolvemos isso como resultado dessa função. Então está tudo certo, criamos a função que gera o hash do Token, então podemos fazer agora esse passo anterior mais esse passo adicional. Invés de adicionarmos os Tokens como chave, criamos uma nova variável chamada tokenHash que será o resultado de geraTokenHash(token) e na linha “20”, invés de Token, enviamos tokenHash.

[12:45] Da mesma forma, na função contemToken, criamos a variável const tokenHash = geraTokenHash(token) e na linha “25”, substituímos o Token, por tokenHash. Feito isso, implementamos as duas funções que vão fazer o papel de interagir com a blacklist, e agora podemos começar a usa-las no nosso sistema de* logout*.



# Blacklist no logout

[00:00] Agora que já temos as funções para fazer a manipulação na Blacklist, podemos começar a implementar o logout. Então em “BLOG-DO-CODIGO > SRC > usuários > usuarios-controlador.js” temos que criar a função de logout do controlador. Então abaixo do login, criamos a função logout, que vai receber a requisição, a resposta e vai realizar o processo de logout.

[00:24] O que precisamos fazer nessa função? Como já tínhamos discutido, no processo de logout, o usuário vai dar o Token para nós, e o que devemos fazer é adicionar esse Token na Blacklist. Onde temos esse Token? Em nenhum momento recebemos ele explicitamente, o máximo que temos é ele nos headers da requisição, de uma forma nem um pouco bem formatada.

[00:55] O jeito fácil de conseguirmos esse Token, é a partir da estratégia de autenticação. Se formos em “BLOG-DO-CODIGO > SRC > usuários > estratégia-autenticacao.js”, ele do header da autenticação, faz [ININTELIGÍVEL] do header, e recupera o Token para nós. O que podemos fazer, é a partir dessa parte, irmos passando até chegar em nosso controlador.

[01:23] Então a primeira coisa que fazemos é enviar o Token para o middleware de autenticação, o passport.authenticate. Para enviarmos, colocamos um terceiro parâmetro na função done, que é um objeto de informações adicionais, o terceiro argumento da função call-back do passport authenticate.

[01:52] Nesse objeto, criamos um atributo Token, que vai receber o Token da estratégia. Feito isso, podemos ir em “BLOG-DO-CODIGO > SRC > usuários > middlewares-autenticacao.js”, na estratégia bearer e recuperar o Token que está no terceiro argumento, que está como atributo de info. O que podemos fazer para conseguirmos recuperar o Token no controlador, podemos inserir ele na requisição.

[02:31] Então criamos um novo atributo na requisição, req.token, e inserimos o Token que está no info, então: info.token. Dessa forma inserimos o Token na requisição. Agora podemos voltar em “BLOG-DO-CODIGO > SRC > usuários > usuarios-controlador.js”, e aqui temos um acesso mais fácil para o Token, então: const token = req.token.

[02:59] Agora conseguimos recuperar o Token e adicioná-lo na blacklist, mas como fazemos isso? Precisamos primeiro importar as funções de manipulação da blacklist. Se formos na linha “5”, fazemos: const blacklist = require(‘../../redis/manipula-blacklist’). Feito isso, para adicionar o Token na lista, conseguimos fazer apenas: blacklist.adiciona(token).

[03:47] Como esse blacklist.adiciona retorna uma promise, colocamos await para esperar a execução dele e async na chamada da função do logout. Se conseguirmos adicionar o Token na blacklist, fazermos uma resposta com status(204) de página vazia, e enviamos uma página vazia ao usuário.

[04:18] Se não der certo, por exemplo, se der algum erro no ato de adicionar o “redis”, o que podemos fazer é encapsular tudo em um bloco de try catch. No try, colocamos tudo isso que acabamos de escrever, no catch retornamos uma resp.status(500) e no corpo, um json({ erro: erro.message}). Dessa forma que implementamos a função de logout.

[05:08] Agora podemos ir em “BLOG-DO-CODIGO > SRC > usuários > usuarios-rotas.js”, e criar a rota de logout. Embaixo da rota de login criamos app.route(‘/usuario/logout’).get(usuariosControlador.logout). Como queremos que usuários estejam autenticados para fazer isso, pois queremos o Token deles para realizar o logout, colocamos como argumento do middleware de autenticação a estratégia bearer.

[06:03] Então na linha “11” enviamos o middleware de autenticação com a estratégia bearer e o Controlador.logout. Vamos testar para ver se está tudo funcionando. Então com nosso servidor funcionando, vamos no “Insomnia” criar nossa requisição de logout. Então em New Request colocamos “Efetua logout”, é uma requisição de método get e isso vai ser para localhost:3000/usuario/logout.

[06:49] Fazendo a requisição, recebemos “401” de não autorizado, porque não estamos autenticados, em nenhum momento colocamos nossa autenticação. Então para isso precisamos fazer login primeiro, efetuando o login conseguimos recuperar o Token, que está no servers, copiamos, e em autenticação, fazemos uma autenticação da forma bearer token, e enviamos nosso Token que acabamos de fazer o login.

[07:21] Enviando, deu tudo certo. A requisição deu certo com código “204”, só que ele adicionou o Token na blacklist, mas ainda não verificamos se em outra requisição, o Token do cliente está na blacklist ou não. Então se, por exemplo, eu fizer uma requisição de criar post enviando o Token que eu acabei de fazer logout, ele deixa eu criar, porque ele ainda não tem a verificação de se o Token foi invalidado por logout ou não.

[07:59] Então temos que voltar para nosso projeto e implementarmos essa verificação, onde conseguimos fazer isso? Se voltarmos agora para “BLOG-DO-CODIGO > SRC > usuários > estratégia-autenticacao.js”, teremos que criar uma nova verificação nela. Para fazer essa verificação, vamos criar uma nova função: function verificaTokenNaBlacklist(token).

[08:36] O que vamos fazer? Primeiro, recebendo o Token, vamos querer saber o resultado, se o Token está na blacklist ou não, para isso importamos nossa funções de manipulação da lista. Então na linha “12” vamos importar: const blacklist = require(‘../../manipula-blacklist’). Então fazemos a verificação: blacklist.contemToken(token). Se a blacklist não contém o Token, queremos retornar um erro, esse erro jogamos com throw new jwt.JsonWebTokenError.

[09:57] Esse é o mesmo erro que pegamos nos middlewares de autenticação, que é um erro de jwt. Então conseguimos especificar uma mensagem de erro dizendo “Token inválido por logout!”. Então invés de usar um erro personalizado nosso, nós usamos um erro personalizado do jwt, um erro JsonWebTokenError, esse erro é um Token inválido por logout.

[10:31] Só que ainda tem uma coisa, blacklist.contemToken devolve uma promise, então o que devemos fazer é modularizar isso, colocando em uma outra variável, por exemplo: tokenNaBlacklist = await blacklist.contemToken(token), então invés de fazer a verificação da aplicação da função, fazemos a verificação com o Token da blacklist e colocamos async na função da linha “20”.

[11:16] Com isso podemos voltar na estratégia de autenticação bearer e fazer a verificação, fazemos: verificaTokenNaBlacklist(token), como ele devolve uma promise, colocamos await no início da linha “59”. Tudo certo, é assim que verificamos se o Token está na blacklist ou não antes de continuar o processo. O que podemos fazer agora, é testar para ver se está tudo funcionando.

[11:50] Nosso servidor está ligado, então vamos para o “Insomnia” tentar fazer logout de novo. Vamos tentar fazer login, feito o login, pegamos o Tokens, enviamos o Token para realizar o logout, colamos o Token que acabamos de copiar e deu errado de novo.

[12:16] Isso foi uma falha de implementação nossa, porque a verificação que fazemos é se o Token não está na blacklist, damos o erro, mas é o contrário, é se o Token está na blacklist, significa que ele foi inválido por logout, então temos que dar o erro.

[12:35] Agora podemos tentar fazer de novo, e realizar o logout que dá certo. O que acontece se tentarmos realizar o logout de novo? Agora temos certeza que o Token está inválido, se clicarmos de novo, ele dá o erro que estamos esperando. É dessa forma que conseguimos criar um sistema de logout, usando Tokens.