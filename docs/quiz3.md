# Erro de logout

Rogério está testando o projeto do curso e, para fazer algumas requisições, efetuou login na API e recebeu um token. Depois de alguns minutos, ele usou esse token para efetuar logout da API. Em seguida, efetuando o logout novamente com o mesmo token, ele recebe uma resposta, de código 401, com

{
    "erro": "Token inválido por logout!"
} 

Entretanto, no dia seguinte, ele usou o mesmo token e recebeu uma resposta diferente.

O que aconteceu?

* Correta
1. Quando Rogério usou o token no dia seguinte, ele já tinha sido removido automaticamente da blacklist pelo Redis, devido a seus 15 minutos de tempo de vida. Dessa forma, não estava mais inválido por logout, e sim expirado, resultando na resposta:

{ 
    "erro": "jwt expired"
}

R: Isso! Ao passar o tempo de expiração, não precisamos mais rejeitar um token por logout, pois ele já estará inválido por tempo. Assim, o erro é disparado pelo jwt.verify() ao receber o token expirado.

2. Como Rogério usou o token duas vezes para uma requisição de logout, a segunda requisição removeu o token da blacklist, retrocedendo a ação. Dessa forma, o token não estava mais inválido por logout, apenas expirado, resultando na resposta:

{ 
    "erro": "jwt expired"
} 

3. Quando Rogério usou o token no dia seguinte, ele já tinha sido removido automaticamente da blacklist pelo Redis, devido a seus 15 minutos de tempo de vida. Dessa forma, o token não estava mais inválido e ele conseguiu realizar a requisição.


4. Quando Rogério usou o token no dia seguinte, ele já tinha expirado, devido a seus 15 minutos de tempo de vida. Portanto sua assinatura não era mais válida, resultando na resposta:

{ 
    "erro": "invalid signature"
}