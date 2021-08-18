[00:00] Agora, vamos ver como que a gente consegue implementar proteção de senhas à nossa aplicação. A primeira coisa que precisamos fazer é instalar o “BCrypt”. Então vamos abrir aqui o terminal. O terminal aqui na nossa pasta de fazer o npm insatall bcrypt@, o bcrypt com a versão que vamos usar que vai ser a 3.0.8. Então tá instalando, tudo certo. Pronto, ele terminou de instalar.

[00:42] Então vamos começar implementando a função de hash do “BCrypt” dentro da nossa aplicação para proteger as nossas senhas. A primeira coisa que a gente precisa fazer então, é criar a função dentro do model para gerar essa senha hash.

[01:01] Então vamos abrir na nossa aplicação, canto superior esquerdo, ” usuários > usuários-modelo”. Aqui, temos o model dos nossos usuários e vamos implementar uma nova função, uma função estática, chamada gerarSenhaHash. Essa vai ser a função que vai receber a nossa senha e devolver o hash da senha.

[01:34] Então ela vai receber a senha. E como que a gente faz para gerar o hash da senha? É basicamente devolvendo o bcrypt.hash(senha, custo Hash). Qual vai ser esse custo? O custo, como eu já disse, será o que vai definir o quão demorado a função vai demorar em executar. E isso varia dependendo da capacidade computacional da época.

[02:11] Para a nossa época atual, um custo 12 é o suficiente. O incremento que você dá nesse custo vai dobrar o quanto a função vai demorar para executar. Então um curso de 12 vai ser basicamente dois elevado a 12, em comparação a uma função se não tivesse custo. Então agora é só contar tudo certinho. A gente só precisa ir no começo e importar o bcrypt cont bcrypt = require(bcrypt).

[03:07] E agora? Qual que é o nosso próximo passo? A gente já tem a função que gera o hash. E ao invés de adicionarmos a senha no banco de dados, teremos que adicionar senha hash. Então vamos criar um novo método. Chamado adicionaSenha, que vai receber a senha.

[03:36] Certo. Então o que ele vai fazer é pegar o resultado do gerarSenhaHash e vai colocar na variável this.senhaHash . Então agora em vez de guardar senha a gente vai guardar a senha hash.

No caso o usuário tiver a senha hash. Como essa função retorna uma Promise. Podemos usar anotação await para ele devolver o valor que a gente quer. E transformar a nossa função adicionaSenha com um modificador async.

[04:33] Além disso, como agora a nossa senha não vai estar mais dentro do nosso Model, vai ser a senha hash, vamos precisar de alguma forma fazer as validações de tamanho máximo e mínimo da senha, como a gente fazia aqui em na função “valida”. O que podemos basicamente fazer é copiar as validações de “valida” e colocar antes no adicionaSenha .

[05:10] E, nesse nesse caso, substituindo os this.senhasó por senha. E pronto, conseguimos fazer as validações da senha e tamanho máximo, mínimo, se ela tá preenchida, ou não. E conseguimos colocar no nosso modelo a senha hash em vez de guardar a senha.

[05:38] E com isso a gente tem que fazer algumas modificações dentro da nossa aplicação. A primeira modificação que temos que fazer é substituir o nome “senha” por “senha hash” porque agora não estamos mais guardando a senha. Então vamos agora ao nosso “usuários-dao” de, na hora de inserir um usuário, vamos trocar senha por senhaHash. E aqui do mesmo jeito, senha por senhaHash.

[06:09] E agora um pouco mais fundo na base de dados, a gente vai modificar o “database.js” do esquema dos usuários, vamos trocar senha por senhaHash. E agora com tudo modificado só precisamos modificar o controlador que vai substituir senha para agora adicionamos a nossa senha hash.

[06:35] Então indo no “src > usuários-controlador” , logo aqui vemos a parte onde adicionamos a senha. Agora não vamos mais fazer mais isso, removemos a senha e ela agora vai ser adicionada pelo método do usuário. adicionaSenha . Como esse método ele teve um modificador async ele devolve uma promise. Então, também, vamos colocar await.

[07:16] Agora vamos testar para ver se a nossa pressão de senha está funcionando como a gente imaginava. Então vamos pegar aqui, vamos iniciar a nossa aplicação de novo com npm start e vamos voltar no “Insomnia” e criar um novo usuário. Antes de voltar no “Insomnia”, é importante deletar a base de dados, porque como a gente fez modificações nos esquemas e tudo mais, ela ainda está com a base de dados antiga.

[07:54] Então vamos deletar o “db.sqlite” e tudo certo. Reiniciando a aplicação ele cria bases tudo de novo. Então agora estamos com uma base nova, sem nenhuma informação nela. Voltando para o “Insomnia” vamos fazer nossa requisição de criar um usuário. Então vamos “post > criar usuário” de vamos fazer requisição. 201, usuário foi criado, agora vamos ver o que tá na nossa base.

[08:26] Pronto, nossa requisição deu certo. Vamos dar uma olhada um pouco melhor em como ela funciona. Temos o “Id”, o nome e o e-mail, que era uma coisa que já tinha na nossa base de dados anterior, só que agora, em vez da senha, a gente tem a senha hash. E se olharmos melhor, ela é uma string aparentemente aleatória e que não dá nenhuma informação sobre a nossa senha original.

[08:52] Então como expliquei anteriormente de como o “BCrypt” funciona a gente conseguiu de fato implementar a prestação de senhas da nossa aplicação.