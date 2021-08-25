
# Refresh tokens

Para atualizar os access tokens, que tem um tempo de expiração curto, criamos um novo token, o refresh token.

Das opções abaixo, quais descrevem características corretas sobre os refresh tokens?

1. Como os refresh tokens são capazes de atualizar tokens, pode ser interessante colocar um tempo de expiração menor que a de um access token para minimizar ataques.


2. Com apenas um refresh token, é possível obter seu tempo de expiração e o id do usuário a qual ele se refere.


3. Uma vantagem de atualizar também os refresh tokens, que possuem, na implementação do curso, um tempo de expiração de 5 dias, é a pessoa que utiliza a aplicação só precisar realizar login novamente depois de 5 dias inativos.
R: Alternativa correta! Correto! Sem a atualização do refresh token, a pessoa seria obrigada a realizar login novamente depois de 5 dias, independentemente do uso. Outra vantagem da atualização é a minimização e identificação de roubo desses tokens.

4. Como os refresh tokens tem um tempo de expiração mais longo, eles precisam ser implementados como tokens opacos com uma allowlist para evitar ataques.

Falso. Os refresh tokens são implementados como tokens opacos com uma allowlist, mas esse não é exatamente o seu motivo. Essa implementação é feita porque eles são invalidados muitas vezes dentro de seu tempo de expiração. Dessa forma, se implementados como JSON Web Tokens, cada usuário poderia potencialmente manter dezenas ou centenas de tokens guardados numa blocklist.