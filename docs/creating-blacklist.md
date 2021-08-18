# Criando Blacklist

[00:00] Então, conseguimos criar Tokens que não duram para sempre, mas que ainda são válidos durante os 15 minutos de tempo de vida deles. Isso não é o suficiente para fazer um sistema de logout. O que queremos? Queremos que quando o usuário fizer uma requisição de logout para nosso servidor, consigamos quase que instantaneamente invalidar esse Token.

[00:26] Dessa forma quando o usuário fizer uma próxima requisição, se ele usar o mesmo Token, vamos rejeitar, mesmo que esteja dentro dos 15 minutos de vida do Token. Para fazer isso, vamos ter que guardar alguma informação no nosso servidor sobre esse Token, para saber se ele foi invalidado por logout ou não.

[00:48] Como podemos fazer isso? Podemos fazer isso por meio de uma lista de Tokens inválidos por logout. Essa lista vai funcionar da seguinte forma: quando o usuário faz uma requisição de logout no nosso servidor, ele vai enviar um Token, vamos pegar esse Token e colocar dentro dessa lista. Dessa forma, as próximas requisições que ele fizer, quando ele enviar um Token, vamos pegar esse Token e verificar se ele está dentro da lista ou não.

[01:20] Se estiver dentro da lista invalidamos o Token e rejeitamos a requisição, porque ele já havia sido invalidado em uma requisição anterior. Dessa forma, em todas as requisições dos nossos clientes, os Tokens vão passar por essa verificação. Se o Token enviado está dentro dessa lista de Tokens inválidos por logout ou não.

[01:45] Assim sempre terá mais uma camada de segurança, e verificação desses Tokens. Vocês podem pensar que se só adicionamos Tokens nessa lista, ela pode acabar crescendo infinitamente. Então precisamos criar um critério para remover esses Tokens da lista. E um critério válido é pensar que uma hora ou outra esse Tokens vão expirar, e quando eles expirarem, eles já vão ser rejeitados pelo jwt.verify.

[02:20] Então não precisamos tratá-los agora. Quando eles expiraram, podemos só removê-los da lista, e essa lista vai virar um conjunto de Tokens que foram invalidados por logout, mas que ainda estão dentro dos 15 minutos de vida deles. Vamos chamar essa lista de Blacklist, que vai ser nossa lista negra de Tokens.

[02:45] Agora entendemos como funciona, mas que estruturas de dados vamos usar para implementar isso. Precisamos de uma estrutura de dados eficiente para fazer esse tipo de consulta, uma opção para esse tipo de aplicação é usar “redis”. Essa é uma base de dados chave/valor em memória, muito famosa por ser super rápida.

[03:08] Se você tem interesse em entender como o “redis” funciona, aqui na Alura temos cursos sobre ele, só que não é pré-requisito, então não precisa se estressar com isso. Agora vamos ter nossa base de dados chave/valor, mas como conseguimos ligar isso com os Tokens que temos?

[03:30] Dado que recebemos o Token do nosso cliente, queremos saber se o Token está dentro da base ou não. Então vamos usar esse Token como uma chave de busca na base, por isso vamos ter que colocar esse Token como chave. O próprio Token vai ser a chave de busca para nossa base de dados chave/valor. Também como essa é a única informação que queremos ter da base, não precisamos por nada como valor.

[04:04] Essa base de base de dados vai ser, o Token como chave e nada como valor. Agora entendemos como funciona e que estrutura de dados vamos usar, agora podemos começar a implementar. Indo no diretório do nosso projeto, a primeira coisa que vocês precisam fazer é certificar que já instalaram o “redis” no computador de vocês, porque está tudo explicado na tarefa de “preparando ambiente”.

[04:30] Feito isso, vamos poder instalar o módulo npm do “redis” para nosso projeto. Então vamos abrir no terminal e instalar o módulo com npm install redis@3.0.2. Terminando de instalar, tendo um módulo npm, vamos começar a projetar as coisas da nossa Blacklist. Para separar a lógica do nosso programa principal com a lógica das coisas do “redis”, vamos criar uma outra pasta na raiz do nosso projeto, ao lado de “SRC” e “app.js”.

[05:32] Essa pasta vai se chamar “redis”. Dentro dessa pasta, vamos criar o arquivo onde vamos exportar o cliente instanciado do “redis”, que vai chamar blacklist.js. Então vai ser aqui que vamos importar o “redis” e criar o cliente instanciado da base. A primeira coisa que vamos fazer é const redis = require(‘redis’), e como criamos esse cliente? Criamos como redis.createClient.

[06:25] E como argumento podemos enviar um objeto para fazer as configurações desse cliente, um deles é a configuração para colocar o prefixo na chave. No “redis” é sempre uma boa prática você prefixar as chaves de sua base sobre que objeto ele vai estar tratando. Nesse caso vamos colocar o prefixo blacklist:, então todas as próximas chaves vão estar com o prefixo blacklist: e vai estar tudo atrelado com esse cliente específico.

[07:07] Sempre que fizermos uma consulta, colocar chaves dentro dessa base usando esse cliente “redis”, vai estar com o prefixo blacklist:, e exportamos esse cliente com module.exports que vai receber o cliente “redis”. Feito isso, podemos instanciar esse cliente em “BLOG-DO-CODIGO > server.js” e instanciamos o cliente com require(‘./redis/blacklist’).

[07:49] Então criamos nosso cliente, instanciamos ele, e agora vamos testar para ver se está tudo funcionando. Vamos abrir o terminal e iniciar o nosso servidor com npm start, assim vemos que está tudo funcionando. Agora temos nosso cliente do “redis”, só que ainda não temos funções para interagir com ele, então precisamos criar nossa API de interação com o “redis”.