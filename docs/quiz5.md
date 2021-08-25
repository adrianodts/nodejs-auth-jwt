Cliente da API

Se quiséssemos implementar um cliente mobile da API do Blog do Código utilizada no curso, quais das funcionalidades abaixo seriam implementações corretas para esse cliente?

1. Quando o cliente realizar uma operação de atualização de tokens, se o refresh token ainda for válido, só há a necessidade de substituir o access token. Dessa forma, é possível manter o cache do refresh token que ainda é válido, aprimorando a performance do aplicativo.


2. Quando uma pessoa realizar uma operação de login no aplicativo, o cliente poderá guardar persistentemente suas credenciais, como e-mail e senha. Dessa forma, ele poderá fazer requisições POST para /usuario/login sempre que seus tokens expirarem, sem a necessidade de uma operação manual.


3. Quando uma pessoa realizar uma operação de login no aplicativo, o cliente deverá fazer uma requisição POST para a rota /usuario/login da API. Em seguida, ele deverá guardar o access token e refresh token para próximos usos.
R: Alternativa correta! Correto! Como os tokens deverão ser enviados pelo cliente em rotas que necessitam de autenticação, é preciso guardá-los após o login.

4. Quando o cliente recebe uma resposta 401 Unauthorized, dizendo que o access token está expirado, ele deverá tentar atualizar esses tokens automaticamente. Para isso, ele fará uma requisição para /usuario/atualiza_token, enviando o refresh token, e, se este for válido, receberá dois novos tokens. Dessa forma, o cliente deverá refazer a requisição respondida com código 401, mas agora com um access token válido.
R: Alternativa correta! Correto! Essa estratégia permite que a pessoa não tenha que fazer operações manuais dentro do aplicativo para atualizar seus tokens. O uso de refresh tokens dá a liberdade ao cliente para realizar todos esses procedimentos por debaixo dos panos.

Quando um cliente realizar uma requisição para uma rota que necessite de autenticação, ele deverá enviar tanto o access token quanto refresh token, pois eles são os certificados da pessoa que está utilizando.