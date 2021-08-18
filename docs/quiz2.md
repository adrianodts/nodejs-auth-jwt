Autenticação com JWT

Das opções abaixo, quais são as características corretas em relação a um sistema de autenticação com JSON Web Token?

1. Possui um sistema de assinatura criptográfica que garante a integridade dos tokens utilizando uma senha guardada no servidor. Além disso, depois de assinar os tokens, a senha precisa ser descartada e substituída por uma nova para manter sua segurança.


2. Cria uma sessão com o servidor através dos JSON Web Tokens. Por isso, o middleware da estratégia local de autenticação é escrito da seguinte forma:

passport.authenticate('local', { session: true })

3. Todas as informações necessárias para a autenticação são armazenadas no servidor. Dessa forma, a requisição do usuário não precisa de elementos adicionais muito complexos.

* Alternativa Correta
4. Mesmo que o processo de criação de um token JWT possa ser público, a senha secreta guardada no servidor impede que um token válido seja forjado por um atacante.

R: Isso! A senha é essencial para garantir a segurança da autenticação. Portanto, ela deve ser mantida em segurança, mesmo que o processo de construção do token seja público.