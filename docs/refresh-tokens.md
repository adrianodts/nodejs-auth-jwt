# Como renovar tokens

[00:00] No curso anterior, nós vimos como fazer um sistema de autenticação usando tokens. Dessa forma, sempre quando o usuário faz o login, põe e-mail e senha, ele vai receber um token chamado JWT para ele poder usar nas próximas requisições.

[00:16] Todo esse código está aberto no editor de texto e antes de nós começarmos a trabalhar em cima dele, eu queria comentar algumas modificações que ele teve em relação ao curso anterior, uma delas é que o pessoal front do Blog do Código disse que teve um pouco de dificuldade de se comunicar com a nossa “API”.

[00:37] Para resolver esse problema, nós decidimos padronizar a entrada saída da nossa aplicação para ser tudo em Json. Então, se nós formos em “app.js” do lado esquerdo, você vai ver que nós usamos o [ininteligível] bodyParser.json para permitir que o corpo das requisições seja em Json e não num formulário codificado em “URL”, que era como nós estávamos fazendo anteriormente.

[00:59] Outra coisa também que nós modificamos é que se nós formos em “usuarios-controlador.js” do lado esquerdo, você vai ver que a sintaxe das funções exportadas em module.exports mudou um pouco.

[01:14] Então, em vez de nós usarmos as arrow functions como nós estávamos fazendo anteriormente, agora nós usamos essa sintaxe para declarar métodos em objetos explícitos do Java Script, que fica muito mais parecido com funções nomeadas como essa [1787_Aula1.3_Imagem1] ou com métodos de classe do Java Script.

[01:34] E não só a sintaxe é diferente, a semântica muda um pouco e essa propriedade nós vamos explorar mais para frente baseado nessa nova sintaxe de declarar métodos que nós estamos usando.

[01:49] mais uma coisa que eu queria comentar, que foi modificado o jeito que nós escrevemos os [ininteligível], tanto do usuário, quanto dos posts, que nós usamos aquele método que fizemos no redis que é “promisficando” as funções de run, get e all que nós usamos para se comunicar com a base de dados.

[02:08] Desse forma nós conseguimos uma sintaxe bem mais enxuta para retornar promises e para se comunicar com o banco de dados da nossa aplicação.

[02:19] Teve uma coisa ou outra também modificada, mas tudo o que for importante, nós vamos comentar mais frente. Agora que você viu por cima as mudanças que tiveram no projeto do curso anterior para cá, eu queria chamar a tua atenção para uma característica do nosso sistema de autenticação com tokens.

[02:37] Nós já comentamos que pelo fato de nós estarmos usando um token JWT e por segurança, nós temos um tempo de expiração curto para os tokens, um tempo de expiração de 15 minutos.

[02:49] Só que dessa forma, sempre quando o token expira, o usuário tem que ir e realizar o login novamente para conseguir um novo token e conseguir continuar usando a nossa aplicação.

[03:00] Então a cada quinze minutos, ele tem que ficar fazendo login para continuar usando a nossa aplicação e isso não é muito confortável para o usuário, mas então como que nós conseguimos ter um sistema de autenticação com tokens e não precisar ter que fazer o login a todo o momento?

[03:19] Para resolver esse problema, nós vamos precisar inserir um novo elemento no nosso sistema, esse elemento vai ser um segundo token, um token capaz de gerar novos tokens à medida que eles vão expirando.

[03:32] Quando o usuário fizer o login com e-mail e senha, ele vai receber o token JWT, que ele já recebia anteriormente, mas também um segundo token, esse token que vai ter agora um tempo de expiração maior, em relação ao JWT e ele vai ser responsável por atualizar o token JWT, conforme ele expirar.

[03:55] Por causa dessas duas funções, nós vamos dar agora novos nomes para eles, o token JWT que nós já usávamos anteriormente é chamado de Access Token porque ele vai ser responsável pelo acesso às rotas protegidas.

[04:11] E o segundo token, o novo token que nós estamos adicionando agora vai chamar de Refresh Token ou Token de Atualização e Revigoração porque ele vai ser responsável por atualizar os tokens conforme eles expiram.

[04:24] Esse tipo de nomenclatura e dinâmica é muito popular em sistemas de autorização o [ininteligível]. Então vamos ver como que nós conseguimos implementar agora esse sistema usando o Refresh Tokens e melhorando a usabilidade da nossa aplicação.


# Explorando o uso de tokens

Neste curso, estamos criando um sistema de login com tokens para o Blog do Código. Dessa forma, algumas decisões de projeto levam em conta as demandas desse serviço. Entretanto, aplicações diferentes podem precisar de decisões de projeto diferentes. Assim, vamos descrever algumas modificações no projeto que podem extrair o máximo da escalabilidade dos tokens.

Remover rota de logout
Num contexto de sessões, é esperado existir uma operação de logout em conjunto com a de login. Entretanto, ao utilizar Json Web Tokens, é necessário criar uma blocklist para permitir essa operação e fazer consultas nessa base a cada uso do token.

Por isso, num sistema com muitos acessos, essa consulta pode sobrecarregar o servidor. Assim, pode ser interessante remover essa operação, eliminando a necessidade de consultar uma base a cada requisição, mesmo que seja em memória como o Redis.

Além disso, é possível remover essa rota e ainda simular uma operação de logout através da plataforma que consumiria a API. Por exemplo, um aplicativo mobile poderia guardar o token JWT no momento de login e, quando a pessoa executasse a operação de logout, esse token seria apagado da memória. Com isso, uma pessoa que possuísse esse token ainda poderia fazer requisições com ele mas quem estivesse usando o aplicativo da forma usual teria a ilusão de que o token foi invalidado. Ainda, o tempo de expiração do token deve ser diminuído para dificultar ataques.

Remover busca do usuário na base
No começo de toda rota que precisa de autenticação, a requisição passa por um middleware que verifica se a pessoa está autenticada e busca seu respectivo usuário na base, inserindo em req.user. Entretanto, se alguma dessas rotas tiver um fluxo de requisições muito alto e não há a necessidade de buscar as informações do usuário na base, apenas saber seu id, então pode ser interessante modificar esse padrão de desenvolvimento.

Assim, pode ser feito um outro middleware de autenticação que verifica o token e insere apenas o id na requisição. Dessa forma, essas rotas podem operar sem qualquer consulta numa base de dados.

Além disso, é possível notar o impacto de uma consulta a um banco através de alguns benchmarks. Se pegarmos um teste de requisições onde é feita uma consulta em banco, vemos que ela é 10 vezes mais lenta que uma requisição onde devolve-se apenas um plaintext .


https://www.techempower.com/benchmarks/#section=data-r19&hw=ph&test=db
https://www.techempower.com/benchmarks/#section=data-r19&hw=ph&test=plaintext


# Implementando refresh tokens

[00:00] Nós agora já sabemos que nós vamos precisar usar um segundo token para autenticação, mas como efetivamente ele vai ser usado? Para entender isso, vamos pensar numa situação que o usuário tem o access token expirado.

[00:15] O que ele vai querer fazer é acessar uma rota enviando ele para o servidor e o servidor vai devolver para o usuário falando que o access token está expirado, que ele vai precisar de um access token válido.

[00:27] É nesse momento que o refresh token entra em jogo, o usuário tendo refresh token válido, ele vai enviar isso para o servidor numa segunda rota, uma rota de atualização de token.

[00:39] O servidor vai ver, vai conferir se o refresh token está válido ou não, estando válido, vai devolver para o usuário dois novos tokens como na rota de login. Então o usuário vai conseguir ter um access token novo e realizar a requisição novamente.

[00:56] Por que eu também gero um novo refresh token, sendo que o anterior já era válido? Ainda estava dentro do tempo de expiração?

[01:05] Esse é um ponto muito importante, nesse esquema, os refresh token são de uso único, ou seja, sempre quando o usuário usa um refresh token para gerar dois novos tokens para atualizar o access token dele.

[01:18] O refresh token anterior, o que foi usado tem que ser invalidado, por isso que nós sempre temos que gerar um novo refresh token para substituir o antigo. Uma das vantagens dessa dinâmica é que ela permite a criação de um sistema de identificação de roubo de refresh tokens.

[01:34] Nós não vamos ver nesse curso, mas pode ser muito útil, dependendo da sua aplicação. Então é dessa forma que o refresh token vai funcionar dentro do nosso novo sistema de autenticação que nós vamos criar.

[01:49] É assim que o refresh token vai ser usado na nossa aplicação, mas como isso tudo é implementado? Como é a cara de um refresh token? A uma primeira vista, pode ser interessante implementar o refresh token como nós fizemos com o access token, como um token de JWT.

[02:07] Dessa forma, qualquer um vai conseguir ler o seu conteúdo e garantir a sua validade, sem ter que olhar no banco de dados. O problema é que um token JWT é valido durante todo o seu tempo de expiração.

[02:21] Então, se nós queremos invalidar ele antes disso, nós vamos ter que usar uma blacklist, só que o ‘’refresh token” é algo que no melhor dos casos vai estar sempre sendo invalidado dentro do seu tempo de expiração porque um access token tem um tempo de vida bem menor, em relação ao refresh token.

[02:41] E nós usamos um refresh token no momento que o access token expira e nós vamos gerar um novo refresh token e invalidar o antigo, ou seja, a cada 15 minutos, nós vamos estar gerando um novo par de tokens e invalidando o refresh token antigo, sempre que o access token expira.

[03:03] Como o refresh token pode ter um tempo de expiração bem grande na escala de dias, nós podemos ter potencialmente dezenas ou centenas de tokens por usuário, por dispositivo conectado e isso não é algo muito eficiente.

[03:20] Dessa forma, nós precisamos de uma nova solução e para resolver esse problema, nós podemos substituir a nossa blacklist que diz quais são os tokens inválidos por uma whitelist, que vai dizer quais são os tokens válidos, assim nós podemos consultar essa lista para saber quais são os tokens válidos dentro da nossa aplicação.

[03:42] Aliás, essa lista vai ser a única fonte de verdade sobre quais tokens são válidos e quais não são, mas então como nós já vamos ter que olhar a nossa lista de qualquer forma, nós não precisamos passar o payload a todo o momento pela rede e deixar ele na responsabilidade do usuário.

[04:04] Nós podemos pegar e também guardar o payload nessa lista usando o refresh token como chave, assim nós deixamos o payload apenas guardado dentro do nosso servidor.

[04:15] E como o payload vai estar seguro dentro do nosso servidor, nós não vamos precisar de uma assinatura para comprovar que os dados que o usuário tem em mãos são verdadeiros e nós não vamos precisar de cabeçalhos para ajudar nessa segurança.

[04:32] Então nós podemos substituir o refresh token que nós tínhamos construído como um Json do token para uma string aleatória, o bytes aleatório é difícil de [ininteligível] e que vai servir única e exclusivamente para ser a chave dessa lista, para nós podermos recuperar o payload e descobrir sobre qual usuário que essa aquisição está sendo feita.

[04:53] Então é dessa forma que nós vamos construir o nosso refresh token e nós conseguimos ver que o refresh token é bem diferente do access token, que está implementado como Json token porque um Json [ininteligível] qualquer pessoa pode pegar, decodificar ele [ininteligível] e ler o conteúdo dele que está em Json.

[05:17] Então qualquer pessoa pode pegar, ler o payload, entender o que está por dentro desse token, mas isso já não acontece com o refresh token porque ele apenas é uma senha aleatória, ele só faz sentido dentro do nosso servidor.

[05:32] E essa é a grande característica desse token e é por isso que ele é chamado de Token Opaco ou Opaque Token porque ele é um token que só faz sentido dentro do servidor e qualquer outro serviço, ele não vai ter nenhum significado.

[05:49] Então é por isso que na nossa aplicação, nós vamos ter dois tipos de tokens, token JWT e tokens opacos. Outra coisa que é importante nós falarmos são sobre dois termos que nós usamos nesse curso e no curso anterior, que é blacklist e whitelist.

[06:08] Esses dois termos são termos antigos e o mesmo que a sentença da sua verdadeira origem, elas ainda colaboram para a manutenção daquele símbolo de que a dicotomia preto e branco está relacionada com ruim e bom.

[06:21] E como programadoras e programadores exercem esse papel de grande impacto na sociedade é importante nós tentarmos quebrar esses costumes ruins e numa tentativa de quebrar esses costumes ruins, nós vamos substituir os termos blacklist e whitelist por blocklist que é lista de bloqueio no inglês e allowlist, que é lista de permissões.

[06:46] Dessa forma, além de ajudar a quebrar esse símbolo ruim, nós ainda vamos estar usando nomes potencialmente mais significativos, principalmente para quem não conhecia os termos anteriores.

[06:59] Dessa forma, vamos ver como que nós conseguimos implementar refresh token usando uma allowlist.


# Identificando roubos de refresh tokens

Nesse curso, não será detalhado um sistema que faz a identificação do roubo de refresh tokens. Mesmo assim, esse sistema, como já apresentado pelo SuperTokens (https://supertokens.io/blog/the-best-way-to-securely-manage-user-sessions), funcionaria da seguinte forma.

Para detectar o roubo, é necessário que tanto o atacante quanto a vítima usam o token após o ataque. Por exemplo:

Digamos que o refresh token refresh_token_0 da vítima foi roubado.

Em algum momento, o access token (access_token_0) da vítima expirará e, por isso, ambos terão que atualizar seus tokens.

Dessa forma, se o atacante usar refresh_token_0 antes, ele receberá novos tokens refresh_token_1 e access_token_1, invalidando o antigo.

Em seguida, quando a vítima tentar atualizar seus tokens, ela usará o refresh_token_0 invalidado. Isso dispara uma possível indicação de roubo, pois é esperado que a pessoa tivesse utilizado o refresh_token_1.

Numa outra situação, se a vítima usar refresh_token_0 antes, o argumento é análogo ao anterior.
Assim, se um roubo de refresh tokens for detectado, é possível disparar uma rotina que remove esse token da allowlist, cessando o ataque.

