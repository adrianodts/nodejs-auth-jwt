# Usando chaves públicas

Nesse curso, o servidor do Blog do Código que gera os tokens JWT é o mesmo que verifica eles, por isso nós usamos um algoritmo simétrico (https://pt.wikipedia.org/wiki/Algoritmo_de_chave_sim%C3%A9trica) de assinatura (HMAC + SHA256), que usa apenas uma chave secreta, para assinar o token. Esse é um método mais fácil de implementar e muito mais rápido que outros métodos.

Entretanto, se você estiver numa situação com um servidor que gera os tokens e um ou mais servidores diferentes que verificam os tokens, então é necessário utilizar um algoritmo assimétrico (https://pt.wikipedia.org/wiki/Criptografia_de_chave_p%C3%BAblica) para assinatura. Os mais comuns são o RS256 (assinatura do RSA + SHA256) e ES256 (assinatura do ECDSA + SHA256). Como escolher eles? Basicamente, o RSA (https://pt.wikipedia.org/wiki/RSA_%28sistema_criptogr%C3%A1fico%29) é mais rápido mas o ECDSA (https://pt.wikipedia.org/wiki/ECDSA#:~:text=Em%20criptografia%2C%20o%20Elliptic%20Curve,usa%20criptografia%20de%20curva%20el%C3%ADptica.) permite chaves menores, então é uma escolha que depende do seu caso. De qualquer forma, ambos os métodos são bem mais lentos e complexos que o HMAC.

Vamos ver então um exemplo de JWT com o algoritmo RS256. Primeiro, é preciso gerar as chaves pública e privada. Para isso, podemos criar um programa generate-keys.js como o abaixo:


const fs = require('fs');
const { generateKeyPair } = require('crypto');

// substituir 'senha super secreta' por uma senha aleatória 
// e guardada em variável de ambiente
const senha = 'senha super secreta';

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: senha
  }
}, (erro, chavePublica, chavePrivada) => {
    fs.writeFileSync('public.pem', chavePublica);
    fs.writeFileSync('private.key', chavePrivada);
    }
);COPIAR CÓDIGO
Com isso, ao rodar o programa com node generate-keys.js no seu servidor de autenticação, você vai gerar dois arquivos:

public.pem, com a chave pública;
private.key, com a chave privada criptografada.
Assim, para gerar os tokens, seu servidor de autenticação deverá fazer algo da forma

// [...]
const fs = require('fs');
const jwt = require('jsonwebtoken');

// o arquivo 'private.key' pode não estar no mesmo diretório que o programa
const privateKey = fs.readFileSync('private.key');

// substituir 'senha super secreta' pela senha usada na geração
// das chaves e guardada em variáveis de ambiente
const senha = 'senha super secreta';

const token = jwt.sign(
    payload,
    { key: privateKey, passphrase: senha},
    { algorithm: 'RS256', expiresIn: tempoExpiracao }
);

// [...]COPIAR CÓDIGO
e, para verificar o token, os outros servidores podem executar

// [...]
const fs = require('fs');
const jwt = require('jsonwebtoken');

// o modo como o serviço adquire a chave pública pode
// variar de acordo com a implementação
const publicKey = fs.readFileSync('public.pem');

const payload = jwt.verify(token, publicKey);
// [...]COPIAR CÓDIGO
É importante notar que essa é uma implementação mais complexa, principalmente pela administração adicional das chaves que é preciso ser feita. Por isso, é recomendado ler esse artigo da Ping identity(em inglês) (https://www.pingidentity.com/en/company/blog/posts/2019/jwt-security-nobody-talks-about.html) que explica as considerações adicionais de segurança que você precisará ter.