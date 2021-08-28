Endereços dinâmicos

Nessa aula, substituímos a rota /usuario/verifica_email/<id> por /usuario/verifica_email/<token JWT>. Ou seja, construímos o endereço de verificação de e-mail usando um JSON Web Token.

Qual foi a motivação para essa mudança?

1. Utilizando o token JWT no endereço, o id da pessoa não se torna mais explícito.
Falso. Mesmo codificado em JSON e base64URL, o JWT ainda permite recuperar o id da pessoa. Porém, esse id não pode ser forjado.

2. Utilizando o token JWT, é possível invalidar as URLs e inserir um tempo de expiração nelas. Dessa forma, podemos proteger essa rota ao notar qualquer atividade suspeita com o token.
Falso. Isso é uma característica do token, mas não foi uma motivação para a mudança. Nós utilizamos um tempo de expiração apenas para diminuir o impacto de algum roubo de tokens, mas não houve a necessidade de implementar uma invalidação com blocklist.

3. Utilizando o token JWT, é possível descobrir a pessoa de interesse da requisição de forma mais segura. Como o id é guardado no servidor, os dados da pessoa não podem ser roubados.
Falso. Com um token JWT, os dados da pessoa não ficam guardados no servidor, mas sim no próprio token.

4. Utilizando o token JWT, a URL não pode mais ser chutada. Isso acontece porque necessitaria do conhecimento da CHAVE_JWT privada do servidor para forjar um token JWT válido.

Alternativa correta! Correto! Essa é a mesma justificativa que usamos para garantir a confiabilidade dos access token.