[00:00] Agora, vamos entender como a informação do usuário com assinatura é codificada pelo JSON WEB TOKEN. Primeiro vamos chamar essa informação toda de Token. Como esse Token é gerado? Primeiro, o servidor pega as informações do usuário, como id_usuário, e codifica ele em JSON. Essa sessão é chamada de Payload, que é um nome muito utilizado no mercado, que não tem uma tradução muito boa.

[00:30] Em seguida, o servidor cria uma sessão também codificada em JSON, chamada de cabeçalho, que possui informações como o algoritmo de assinatura usado, nesse caso é o HMAC-SHA256 que é uma variação do algoritmo da função de hashing, que vimos anteriormente, só que ela foi modificada para receber também uma senha. Nesse cabeçalho, temos informações do tipo do Token, nesse caso é o JSON WEB TOKEN.

[01:03] Por fim, temos a sessão de assinatura, que é nada mais que o resultado da função HMACSHA256, que com o primeiro argumento recebe o cabeçalho e o Payload codificados na Base64Url, que é uma variação da Base64 concatenados e separados por um ponto. Como segundo argumento ele recebe uma senha secreta, que é uma senha guardada apenas no servidor.

[01:32] Depois disso, ele pega essas três informações, codifica de novo na Base64Url e concatena eles separados por um ponto. O resultado é apenas uma string de todas essas três informações, e assim temos o nosso Token que depois vai ser enviado para nossos usuários. Mas como que a assinatura que colocamos no Token garante a integridade dele?

[02:02] Primeiro, o servidor cria o Token, envia para o usuário e no momento que o usuário envia o Token junto com a requisição, por exemplo uma requisição de criar post. O servidor pega o Token, dividi ele nas três seções: cabeçalho, Payload e assinatura, ele usa o mesmo algoritmo para gerar uma assinatura, a partir do cabeçalho e do Payload que o usuário enviou.

[02:29] Nesse processo, ele usa a senha secreta, a senha secreta que só o servidor tem. É importante notar essa parte. E assim o servidor gera essa assinatura, baseado nas informações que o usuário deu, e a senha secreta que tem guardada com ele e apenas com servidor. Assim ele faz uma comparação, se a assinatura ideal, é igual a assinatura que usuário enviou para ele.

[02:55] Esse foi ok, então ele tem certeza que esse Token foi emitido pelo próprio servidor. Então, o usuário que está enviando é realmente um usuário válido, e não outro atacante se passando por ele. Mas como toda essa operação consegue impedir um ataque? Vamos simular se um atacante tenta criar um Token, o que ele precisa?

[03:24] Ele pode criar um cabeçalho, que nada mais é que colocar todas as informações codificadas em JSON em Base64. Depois disso, o que ele pode fazer é criar o Payload, que também tem quase a mesma dificuldade. Ele pode apenas chutar um ID de usuário, e criar um Payload substituindo para JSON e codificado em Base64. Mas e para fazer a assinatura? Para fazer assinatura do cabeçalho do payload ele precisaria da senha secreta que apenas o servidor tem.

[03:58] Dessa forma não tem como ele adivinhar a senha do servidor para criar uma assinatura válida. Dessa forma qualquer tentativa de forjar uma assinatura desse Token, vai resultar numa assinatura inválida. É assim que o JSON WEB TOKEN consegue autenticar os nossos usuários, assim que ele consegue certificar que apenas os próprios usuários estão enviando Tokens válidos.




# Terminologias do JWT

Como você viu nessa aula, o JSON Web Token possui alguns elementos que podem não ser tão recorrentes. Alguns deles são:

Payload
O payload é uma das 3 seções do JSON Web Token. Esse é um termo muito utilizado no mercado, sem uma tradução literal muito boa.

Num contexto de transporte de mercadoria, payload significa a carga que efetivamente gera lucro. Por exemplo, um caminhão que transporta computadores carrega outras cargas, necessárias para a transmissão da mensagem, como motoristas e estepes, mas apenas os computadores serão efetivamente vendidos e gerarão lucro, ou seja, os computadores são o payload. Para um contexto de computação, o payload são os dados que realmente importam na mensagem, em comparação com cabeçalhos e assinaturas, que apenas existem para permitir a transmissão da mensagem.

Lá é possível guardar também informações como nome do usuário e a data de criação (timestamp) do token.

## HMAC-SHA256
O HMAC (Hash-based Message Authentication Code - https://pt.wikipedia.org/wiki/HMAC) é um tipo de autenticador de mensagem (MAC - https://pt.wikipedia.org/wiki/Autenticador_de_mensagem) envolvendo uma função de hashing e uma chave secreta. Como a função de hashing usada, no caso, é a SHA256, o processo de geração desse código é chamado de HMAC-SHA256.

Ele é um dos algoritmos usados para a assinatura do JWT.

Base64URL
O Base64URL (https://base64.guru/standards/base64url) é uma variação da codificação Base64 (https://pt.wikipedia.org/wiki/Base64), criado para permitir seu uso em nomes de arquivos ou endereços URL. Essa codificação é, então, usada no processo de criação do JWT.


## Gerador de JWTs

A Auth0 (https://auth0.com/) possui uma plataforma chamada jwt.io (https://jwt.io/) que permite a decodificação, verificação e geração de um JWT através de uma interface gráfica. Lá é possível criar tokens com diferentes cabeçalhos, payloads, algoritmos de assinatura e senhas secretas.