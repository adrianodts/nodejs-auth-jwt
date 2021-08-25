Utilizando o novo módulo

William está desenvolvendo novas funcionalidades para sua API, baseada no projeto do Blog do Código feita no curso. Para isso, ele precisará de dois novos tokens para autenticação: um token JWT e um token opaco.

Considerando o módulo tokens.js criado nessa aula, como ele fará essa implementação?

1. Para implementar o novo token opaco, ele só precisará inserir um novo atributo no objeto exportado de tokens.js. Nesse atributo, definirá um novo objeto com as informações de nome, nova allowlist e seu tempo de expiração. Em seguida, apenas precisará definir os métodos que precisa, chamando as funções já implementadas para token opacos genéricos.

R: Alternativa correta! Correto! Com as funções para tokens opacos já implementadas e um padrão bem definido, a criação de novos tokens se torna apenas a definição de valores e a chamada de funções.

2. Como a implementação atual não foi pensada para permitir novos tokens, ele precisará definir novamente o processo de criação e manipulação desses novos objetos em tokens.js.


3. Se não for necessária a revogação do novo token JWT, ele não precisará criar uma blocklist nem adicionar um método invalida() para esse token.

R: Alternativa correta! Correto! A motivação para a criação de uma blocklist era a necessidade de invalidar o token JWT. Assim, caso não seja necessário, o novo token pode ser implementado sem ela e, consequentemente, sem método invalida().

4. Como os métodos para a manipulação de cada token não têm um padrão definido, não há a garantia de que os métodos de criação de um refresh token serão os mesmos que os do novo token opaco.

5. Como os valores sempre são adicionados no mesmo banco do Redis invariavelmente, não há a necessidade de criar uma allowlist para o novo token opaco. Em vez disso, ele poderia utilizar a blocklist do refresh token para uma implementação mais eficiente.