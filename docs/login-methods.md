[00:00] Vamos analisar outro problema que nossa aplicação tem. Se formos ver no “Insomnia”, conseguimos criar posts. Vemos que criamos mais um post em nossa base; e olhando os usuários, conseguimos criar um novo usuário se registrando. Só que esse usuário de ID 2, então podemos deleta-lo também, sem o menor problema. Isso não é algo que esperamos e que vamos querer em nossa aplicação.

[00:37] Uma coisa que normalmente acontece é que apenas usuários registrados consigam fazer posts, e só os próprios usuários consigam deletar eles mesmos. Isso não é uma coisa que acontece, não temos nenhuma verificação para saber quem que está adicionando post e que está deletando usuário. Para isso, precisamos de algum sistema de login. E como podemos implementar esse sistema de login?

[01:03] Como vocês já viram, o protocolo http não guarda estados por padrão, então se por acaso fizermos uma requisição de login, nas próximas requisições, o servidor não saberá que você já fez o login anteriormente. Para ele você é só mais um outro cliente qualquer. Então como temos essa noção de estado guardado sempre quando vamos acessar outros serviços como redes sociais e afins?

[01:34] Existem vários métodos de implementar um sistema de login, um dos primeiros métodos usados para implementar o sistema de login são as sessões. Como funcionam as sessões? No momento de login, o usuário envia as informações, como e-mail e senha para o servidor, se as informações estiverem corretas, o servidor cria na memória uma sessão e devolve o ID dessa sessão para o usuário.

[02:03] Dessa forma o usuário pega esse ID e deixa guardado em algum lugar, para que nas próximas requisições que ele fizer, ele enviar esse ID junto. Por exemplo, quando ele quiser criar um post, junto com a requisição de criar post ele envia o ID. É dessa forma que o servidor vai saber qual usuário está se comunicando com ele.

[02:26] Nesse caso ele sabe que esse usuário foi autenticado por login anteriormente, dessa forma ele consegue criar um post. Só que esse tipo de sistema tem alguns problemas, por exemplo, se muitos usuários fizerem login ao mesmo tempo no servidor, ele vai acabar guardando muitos estados e várias sessões, isso pode acabar sobrecarregando-o.

[02:55] Isso prejudica a escalabilidade da aplicação. Se você quer montar um sistema com vários servidores distribuídos, você precisa criar algum sistema que consiga descobrir em qual servidor a sessão está armazenada. E se vários usuários acessarem esse mesmo sistema, pode ser que eles acabem usando apenas um único servidor, sobrecarregando-o de qualquer forma, e deixando os outros ociosos.

[03:30] Isso é uma coisa que dificulta a escalabilidade dessa aplicação, e não só isso, mas também vai contra os princípios do rest, que diz que usuários não devem depender de um estado guardado no servidor para fazer as requisições. Então o servidor também não deve se preocupar de guardar os estados dos clientes para ele ser usado. Então como conseguimos combater esse tipo de situação?

[04:04] Se o estado então não pode ser guardado no servidor, temos que guardá-lo em algum lugar, e nesse caso guardaremos no cliente. Dessa forma o cliente vai ter que fazer login enviando o e-mail e senha, por exemplo. Se ele estiver correto, o servidor precisa devolver alguma informação que identifica seu usuário.

[04:24] Nesse caso pode ser o ID do usuário que está guardado na base. Então o usuário vai deixar guardado em algum lugar esse ID, e quando ele fizer as próximas requisições, ele só envia esse ID junto com criar post. Dessa forma o servidor sabe quem foi o usuário que estava fazendo essa requisição, e ele sabe o que fazer depois disso, nesse caso, criar um post.

[04:51] Só que isso tem um problema. Como temos 100% de certeza de que o cliente que está fazendo essa requisição para o servidor, enviando um ID, realmente é o usuário que fez login e é o usuário que tem esse ID? Não é, por exemplo, algum atacante que apenas chutou um ID de um usuário e está tentando se passar por ele.

[05:21] Precisamos de alguma forma, certificar de que apenas usuários vão conseguir enviar os próprios IDs. Para fazer essa certificação, precisamos de algo, como se o nosso servidor conseguisse assinar o ID do usuário, mostrando que esse ID foi gerado pelo servidor e entregue apenas ao usuário que teve uma tentativa de login bem sucedida, o que é algo esperado.

[05:51] Dessa forma o servidor poderia assinar esse ID, entregar para o usuário, e o seu usuário vai guardar o ID assinado. Então apenas com essa assinatura, ele vai poder enviar uma requisição com o ID, e avaliando se a assinatura está correta ele deixa o usuário executar a requisição dele.

[06:16] É dessa forma conseguimos prevenir que mesmo se um atacante quiser fazer uma requisição, chutando algum valor de ID, e algum valor da assinatura, ele não vai conseguir se passar por um outro usuário porque ele não vai conseguir chutar uma assinatura válida, e nesse caso, vai ser barrado.

[06:36] Então agora como conseguimos implementar esse modelo de assinatura na nossa aplicação? Um dos métodos que realizam esse tipo de coisa é o JSON WEB TOKEN, que é todo um formato para padronizarmos esse tipo de informação, e que podemos abreviar para JWT. Vamos ver agora como ele funciona, e como conseguiremos implementá-lo no nosso blog.