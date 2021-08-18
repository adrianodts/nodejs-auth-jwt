# Parte 1

[00:00] Até agora temos três rotas que queremos proteção, que são: “adicionar post”, “efetuar login” e “deletar usuário”. E anteriormente implementamos o nosso middleware de autenticação local, que usuário tem que enviar o e-mail e senha para poder se autenticar. Só que deixamos agora duas rotas desprotegidas, “adicionar post” e “deletar usuário”.

[00:26] Como podemos garantir autenticação do nosso usuário sem que ele tenha que enviar e-mail e senha toda hora? Como eu já falei anteriormente, ele vai realizar esse tipo de autenticação por meio de Tokens, então o que precisamos fazer agora, é uma estratégia muito parecida com a que estamos fazendo na estratégia local.

[00:49] Agora, em vez de usar e-mail e senha, nosso cliente terá que enviar um Token para gente, onde que ele vai conseguir esse Token? No momento que ele se autentica com a estratégia local, ele vai receber um Token de volta, ele vai ter que guardar de alguma forma e enviar para gente nas próximas requisições.

[01:10] Então precisamos implementar a criação desse Token e o envio dele para o usuário, para isso vamos usar o pacote JSON WEB TOKEN. Vamos agora então instalar o módulo do JSON WEB TOKEN na nossa aplicação. Então vamos abrir a nossa pasta do projeto: npm install jsonwebtoken@8.5.1. Está funcionando, tudo certo.

[01:48] Conseguimos instalar, agora vamos implementar a criação do nosso token jwt. Para isso vamos fazer uma função, criaTokenJWT(usuario), que vai receber o usuário. Para fazer a criação do Token, a primeira coisa que precisamos fazer é criar o Payload, já que o cabeçalho já é gerado automaticamente, e assinatura é baseada nesses outros dois.

[02:24] Então vamos criar o nosso Payload,const payload = ele vai ser um objeto. Dentro do Payload vamos colocar uma informação do usuário que nesse caso é o ID. Então vamos fazer id: usuario.id. É assim que criamos um Payload, e agora vamos gerar todo o nosso Token JWT a partir desse Payload.

[02:54] Para isso, vamos precisar de um método JSON WEB TOKEN. Então vamos importar o JSON WEB TOKEN com const jwt = require(‘jsonwebtoken’). Que método vamos precisar usar no JSON WEB TOKEN? Esse pacote tem um método chamado sign que ele vai gerar um Token e assinar ele, baseado no Payload e na senha secreta do nosso servidor.

[03:36] Para isso vamos receber o nosso Token, ele vai ser gerado com esse const token = jwt.sign(payload, ‘senha-secreta’); de assinar. Ele vai receber o payload e nossa senha secreta. Nesse caso vamos colocar senha-secreta, apenas uma string em texto puro aqui no nosso código. Gerado o Token, nós apenas retornamos o Token, e é assim que é a função de criação do Token JWT.

[04:12] Feito isso, vamos agora na função de login, na linha 42, antes de enviarmos a nossa página, nossa resposta, vamos criar o nosso Token gerado, que vai chamar a função: criaTokenJWT(req.user), que vai receber o user que está dentro da requisição. Esses user é colocado no momento em que o passport authentication é finalizado.

[04:53] A partir desse momento que o req passa a ter o atributo user como o nosso usuário, que buscamos na nossa estratégia local. Temos agora nosso Token e precisamos enviar esse Token de alguma forma para o nosso usuário. Enviar ele no corpo da nossa resposta é uma alternativa, só que não é muito indicada.

[05:18] O método mais usado pra esse tipo de coisa é colocarmos nos cabeçalho da nossa resposta, não em qualquer cabeçalho, no cabeçalho authorization. Para fazer isso, podemos usar o método set da resposta, que vai receber uma string, dizendo em qual cabeçalho você quer colocar. Nesse caso é Authorization, que é uns cabeçalhos padrões para esse tipo de coisa e vamos enviar o Token.

[05:57] Ou seja, no momento da resposta, quando o usuário for observar dentro dos cabeçalhos, vai ter o cabeçalho Authorzation com o Token. Então é dessa forma que conseguimos colocar o header com o nosso Token e enviar para o usuário. Aliás, o código 204, que colocamos na linha 44, não só diz que a página de resposta, é uma página em branco mas também que os cabeçalhos podem ser úteis.

[06:28] Então já nosso próprio status http, já indicamos que usuário vai ter que olhar o headers para encontrar o Token, para fazer os próximos requisições. Então vamos abrir no “Insomnia” e testar para ver se está funcionando tudo certinho. Primeiro vamos rodar aqui no servidor, npm start. Está tudo funcionando. Abrindo o “Insomnia”, vamos corrigir a nossa requisição e fazer uma requisição de login para o servidor.

[07:05] Ok, código 204, deu tudo certo. No header, temos em Authorization o nosso Token. Você consegue ver no cabeçalho o Payload e a nossa assinatura.

[07:26] Então é dessa forma que conseguimos fazer todo esse processo de geração do Token, e é com esse Token que nosso usuário vai ter que enviar as próximas requisições que fizer.


async function criaTokenJwt(usuario) {
  const payload = { id: usuario.id }
  return await jwt.sign(payload, 'senha-secreta')
}


login : async (req, res) => {
    const token = await criaTokenJwt(req.user) // o user é colocado na requisição quando o passport auth é finalizado
    res.set('Authorization', token)
    res.status(204).send()
  },



# Parte 2

[00:00] Agora que sabemos que a geração do nosso Token funciona, podemos voltar lá atrás, e ver um passo que deixamos um pouco de lado. Se formos ao nosso código, na geração do nosso Token, como senha, usamos uma sign chamada senha secreta. Só que na explicação de como o JWT funciona, vemos que a nossa senha é o que torna todo nosso Token seguro.

[00:29] Então é importante que ele seja de alguma forma mais seguro e forte possível, e para resolver isso, um dos métodos de gerar senhas seguras é usando geradores de números aleatórios, ou gerador de números pseudoaleatórios, que vai ser o nosso caso. Para isso, vamos abrir o terminal no nosso projeto, vamos usar uma biblioteca do Node que já vem com o próprio Node que se chama cripto.

[01:08] Então podemos rodar um programa com node -e para executar esse comando no string, que vai imprimir o resultado de uma função do módulo crypto. Que função que esse módulo tem? Ele tem a função randomBytes, essa função gera bytes pseudoaleatórios de acordo com a quantidade que você quer, nosso caso vamos gerar 256 bytes que é basicamente uma string com 256 caracteres e vamos quantificar isso para uma string no formato base64.

[02:05] Com isso, temos esse resultado, essa string grande é uma senha muito mais segura do que apenas uma senha secreta, como tínhamos colocado. Então um método de colocar isso em nossa aplicação é copiar essa string e substituir a senha secreta por isso.

[02:30] Além dos erros de formatação que isso levou, que nesse caso poderia ser só substituídas por essa formatação de string. Colocar uma senha secreta dentro do seu código, não é a maneira mais indicada, principalmente em algum outro código quando você usa controle de versão, por exemplo, o git, onde seu código é público, eventualmente isso vai tornar a sua senha secreta pública.

[03:05] Para resolver isso, podemos não guardar a nossa senha dentro do código, mas dentro de uma variável de ambiente, que ela não só facilita para você não publicar ela dentro do seu [ININTELIGÍVEL] de controle versão, mas como dentro da variável de ambiente, ela vai ser acessível por todos os pontos do seu programa, podemos apenas modificar nossa variável de ambiente.

[03:30] Dependendo se estamos em estágio de desenvolvimento ou de produção, que a nossa senha vai mudar para todas as partes do programa e não precisamos ficar alterando ponto a ponto. Para isso vamos ver como conseguimos usar variáveis de ambiente dentro do nosso projeto. Vamos criar um novo arquivo aqui na raiz do nosso projeto chamado “.env”.

[03:59] Nesse arquivo, vamos colocar CHAVE_JWT e como valor desse argumento, vamos colocar a nossa chave jwt que geramos. Então é dessa forma que colocamos como variável de ambiente, a nossa senha. Agora para guardarmos a nossa senha na variável de ambiente, precisamos primeiro criar um novo arquivo na raiz do nosso projeto, chamado “.env”.

[04:42] Nesse arquivo, vamos criar a variável de ambiente, nesse caso, vou chamar de CHAVE_JWT, essa que vai receber uma string com a chave. Nesse caso vamos só recortar do nosso controlador e colar na frente de CHAVE_JWT, agora a variável de ambiente vai receber esse valor, e particularmente, minha tela está colorida desse jeito porque eu instalei uma extensão de syntax highlighting, da extensão “dotEnv”].

[05:27] Agora sabemos que temos essa senha dentro de um arquivo .anv, mas como fazemos para ler essa variável de ambiente no nosso programa? Para isso vamos precisar de um pacote chamado “dotEnv”. Ele é feito para você conseguir ler a variável de ambiente dentro da sua aplicação node. Vamos instalar com npm instal dotenv@8.2.0.

[06:01] No caso estamos usando a versão “8.2.0”. Ele está instalando tudo certo, funcionou. Agora o que precisamos fazer? A primeira coisa que precisamos fazer é executar a configuração do “dotEnv” em no começo do nosso programa. Então em “BLOG-DO-CODIGO > server.js”, na primeira linha vamos executar require(‘dotenv’).config(), que configura todas as variáveis de ambiente dentro do nosso programa.

[06:58] A partir disso, podemos ler uma variável de ambiente, usando o objeto process, que é variável que já está dentro do nosso ambiente. Então, a variável process com elemento env e a variável de ambiente que queremos, nesse caso a CHAVE_JWT. Dessa forma conseguimos ler a variável chave CHAVE_JWT a partir de uma variável de ambiente, dentro do nosso projeto.

[07:38] Se você usa algum gerenciador de versão, por exemplo um git, colocaríamos esse .env dentro do gitgnore, dessa forma seu projeto público não iria junto com uma chave que deveria ser privada. Essa chave vai ser compartilhada dentro de todas seu programa note. É dessa forma que conseguimos criar a nossa CHAVE JWT e mais para frente, veremos como conseguimos criar a nossa estratégia com Tokens.



1- Gerar senha aleatória:

node -e "console.log(require('crypto').randomBytes(256).toString('base64'))"

2- Criar arquivo de environment (.env) na raiz do projeto e criar a chave:

CHAVE_JWT="l0NpFIvvSG44n+sZN7RnAnDgQ3jq35KrIB5C8lCTUiWZCMdTZbHal4yosHZiHP6CUQY5oroQ54GNmanQvgizHQBA86nRkWeDu4r/Wpu7wK3ZyCIFHYnrJEKK+a7y14swfVEy+HIk3HVgrLIL/vqW8SSctIvd5N4CmKir/fitoo8c/+zus/T0UujwvLXxfoUN1+SuQSuhU//pYJ34FU0Xnhz6R2kBbcWfwnnmRra+i27mKNIh1jdviNXtS7IiQKwtDpme4F6Uo3JuMSzsruWiXy5MczSwUKukmyKLhBpaSr23k/G/ZRoAg6BB4Y4GJHlhu3ePlMT/t3wcMH5AYyfb9A=="

3- Instalar dotenv e inicializar:

require('dotenv').config()

4- Usar a chave:

const key = process.env.CHAVE_JWT


Ex: 
async function criaTokenJwt(usuario) {
  const payload = { id: usuario.id }
  const key = process.env.CHAVE_JWT
  return await jwt.sign(payload, key) 
}
