# Tratando erros do login

[00:00] Até agora, boa parte do nosso sistema de login já está funcionando, só tem alguns pontos que precisamos ver com mais calma. Um deles é o comportamento da resposta quando algo der errado no meio da autenticação, por exemplo, vamos ir à requisição de efetuar login e vamos fazer uma requisição onde dá tudo certo, com as credencias válidas.

[00:22] Se fizermos, recebemos a resposta usual, com header, Token e tudo mais . Mas se enviarmos uma requisição com a senha incorreta, a resposta que temos é um código “500” de erro interno no servidor, e no corpo da resposta temos uma mensagem de erro nem um pouco digerida para nosso usuário, no máximo uma mensagem falando “e-mail e senha inválidos”.

[00:49] Não está no formato que esperamos, então como conseguimos resolver esse tipo de problema? Para fazermos isso, precisamos primeiro saber de onde está vindo essa mensagem de erro. De que lugar está vindo esse código “500” e esse corpo na resposta? Para isso vamos olhar para nossa implementação, para nosso projeto e entender onde ele pode ter parado.

[01:19] Se voltarmos no projeto, nas rotas de login, vemos que antes de bater no controlador de login, a rota da requisição passa por um middleware de autenticação do passport authenticate, e é aí que nossa requisição é barrada e ele envia direto essa resposta de erro “500”.

[01:48] A partir do momento que esse middleware verifica que tem um erro na nossa estratégia de autenticação, antes de passar pelo controlador ele já intercepta isso e envia a resposta com o erro que ele obteve na estratégia. Para conseguimos digerir isso e fazer uma resposta de acordo com nossas regras de negócios, precisamos modificar o comportamento do passport authenticate.

[02:16] Isso pode ser feito modificando o terceiro argumento do passport authenticate, que é uma função call-back customizada. Então modificamos a função call-back do passport authenticate. Para deixarmos tudo isso singularizado, podemos criar um novo arquivo na pasta “SRC > usuarios”, chamado “middlewares-autenticacao.js”.

[02:44] Vai ser nesse arquivo que vamos criar agora nosso novos middlewares que vão fazer o papel do passport authenticate só que agora com as funções call-back customizadas para nossa regra de negócios. Então a primeira coisa que vamos precisar fazer é importar o passport então: const passport = require(‘passport’).

[03:15] Com o passport o que vamos fazer? Vamos exportar os nossos middlewares, então module.exports e agora as funções que vão ser os nossos próprios middlewares. Primeiro vamos fazer o middleware de autenticação para estratégia local, então vamos chamá-lo de local: e aqui vai ser o middleware que vamos exportar.

[03:39] Como só queremos modificar a função call-back do passport authenticate, poderíamos simplesmente devolver o passport authenticate com os parâmetros que estávamos usando, que no caso são: estratégia, estratégia local, a opção que estamos usando que é session: false e a função call-back personalizada.

[04:11] O que precisa ir nessa função de call-back? A função de call-back vai ter os mesmos argumentos que a função done da estratégia de autenticação, e o que elas são? Elas vão ser o erro, o primeiro argumento é o erro que você obteve da estratégia, o segundo é o usuário que você obteve, e por último, um objeto de informações adicionais, info.

[04:42] Essa vai ser a assinatura da nossa função, e o que precisamos fazer dentro dela? Quais são os objetivos dessa função? Ela primeiro precisa fazer o que o passport authenticate já fazia. Como vamos customizar, vamos sobrescrever todas ações que ele tinha.

[04:58] Então a primeira coisa importante a se fazer é inserir o usuário que recebemos da estratégia de autenticação, no atributo user da requisição. Aí surge um problema, como podemos acessar o nosso objeto de requisição? Porque ele é enviado para o passport authenticate, só que não temos acesso interno nele.

[05:25] Para resolver esse problema, essa solução é mostrada na documentação do passport, é criarmos uma nova função, nesse caso, uma função como um novo middleware que vai receber a req, res e o next, e vai englobar o nosso passport authentticate e vai chamar ele com meus argumentos: rec, res, next.

[06:01] Então criamos um novo middleware, uma nova função, só para encapsular o nosso passport authenticate e chama ele na função. Dessa forma, temos acesso a todos esses atributos, assim conseguimos fazer a primeira ação necessária na função call-back, que é inserir req.user = usuario, e logo em seguida, finalizamos a execução da função, chamando o próximo middleware.

[06:38] Isso é num caso onde deu tudo certo e inserimos o usuário para o controlador continuar a execução do programa. Agora podemos começar a tratar os erros que podem vir de acordo com nossa regra de negócio. Na parte superior, devemos começar a pensar que tipos de erros podemos receber da execução em si.

[07:05] Se olharmos para a estratégia local que fizemos, nós especificamos um erro, que é quando o usuário envia um e-mail que não está na nossa base, ou quando a senha não bate com o e-mail que ele tinha. Esse tipo de erro é um erro customizado, que tinha o nome de invalidArgumentError, então para isso, podemos fazer uma verificação.

[07:31] Vamos criar na linha “9” uma condicional, vamos ver se tiver algum erro, o erro não for nulo e o nome desse erro, o atributo name dele, for igual a invalidArgumentError, vamos devolver uma resposta de acordo. Qual é a melhor resposta? Devolvemos uma resposta de código res.status(401) dizendo que as credencias dele não foram válidas.

[08:10] Enviamos o ´.json({ erro: erro.message });´ com o erro que a pessoa vai obter, nesse caso o atributo message, a mensagem de erro do objeto que recebemos. Então essa, é a primeira resposta, nossa primeira condicional de erro. Qual outra possível situação que podemos ter? Se olharmos para nossa estratégia de autenticação, não tratamos de nenhum outro erro especificamente.

[08:40] Então qualquer outra coisa que puder acontecer, vai ser algo fora de nosso alcance, algo que não foi tratado, então podemos englobar todos os outros erros possíveis em uma outra condicional de erro, e retornar com uma resposta de return res.status(500). Dizendo que foi um erro interno no servidor, que não conseguimos tratá-lo, e mandamos uma mensagem do erro que houve: .json({ erro: erro.message});.

[09:22] Além disso podemos ter alguma coisa? Na verdade podemos, ainda tem mais uma situação, que é uma situação específica do passport, que é quando a requisição que o cliente manda, está mal formatada; como assim? É uma situação onde por exemplo, o usuário envia uma requisição, mas não envia e-mail e nem senha, dessa forma o passport não consegue nem iniciar a estratégia de autenticação.

[09:52] Porque se olharmos, além de receber a função done, ela vai receber o e-mail e senha, para começarmos iniciar a estratégia de autenticação. Então como ele não tem informação nem para isso, ele tem o comportamento padrão, que é chamar a função call-back do passport authenticate com os atributos erro como null e usuário como false.

[10:20] Então nessa situação, para não acontecer um erro no passport, se formos ver o erro está como null, então não vai entrar em nenhuma das duas condicionais. Só que não vamos ter um usuário, o usuário não está nem perto de estar autenticado para continuarmos a execução de nosso programa. Então precisamos fazer essa verificação, para tratar do caso em que o input dele está mal formatado.

[10:44] Então fazemos mais uma verificação se o usuário não for false, e como sabemos que o erro é nulo, ele não entrou em nenhuma das duas condicionais, podemos só fazer essa verificação, nesse caso: se usuário for false, devolvemos uma resposta com status(401) de que ele não está autenticado, suas credencias estão invalidas e um json().

[11:21] Porque o status(401) já dá um indício de que ele tem que rever suas credencias enviadas. Então é isso, essa é a última verificação que fazemos, então a partir desse ponto, já sabemos que o usuário já passou por todas verificações, e temos certeza que ele está autenticado.

[11:40] O que podemos fazer então, é ir em “usuarios-rotas.js”, importar nosso arquivo de middlewaresAuteticacao e substituir o passport authenticate pelo nosso middleware de autenticação da estratégia local, então middlewareAutenticacao.local, assim é esperado que os próximos erros que tivermos vão estar tratados de acordo com nossa função, nosso middleware customizado.

[12:27] Vamos testar para ver se está tudo funcionando? Indo no “Insomnia”, vamos fazer o mesmo login, a mesma requisição de login, mas com a senha errada. Enviando a requisição, recebemos agora a resposta, invés do código “500” e uma mensagem mal formatada, recebemos o código “401” de não autorizado.

[12:50] Sabemos que nossa credencias estão inválidas e uma mensagem de erro muito melhor, pois agora está em um json, falando qual erro que obtivemos, ou e-mail e senha incorretos. Se voltarmos com a senha correta, dá tudo certo, conseguimos efetuar o login da forma correta. Então com a estratégia local funcionando, vamos fazer a mesma coisa, só que agora na estratégia bearer para os Tokens.