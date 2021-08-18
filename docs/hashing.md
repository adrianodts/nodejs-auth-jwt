[00:00] Agora vamos ver qual “Função de Hashing” é a mais adequada para o nosso uso. Existem várias opções de hashings de uso geral no mercado, por exemplo: o MD5 e SHA-256.

[00:15] Vamos, por exemplo, pegar o SHA-256. Poderíamos usá-lo para receber a nossa senha, e gerar a nossa senha hash. Só que esses tipos de funções de hashings de uso geral tem um problema. Elas são muito rápidas. Isso pode parecer um pouco contra intuitivo, mas, por exemplo, um atacante consegue gerar aproximadamente 50 milhões de hashs por segundo com essa função de hash.

[00:46]Se ele tiver um computador bom e não necessariamente até especializado para fazer esse tipo de operação. Então que ele pode fazer é uma tabela, com os valores da senha e a senha hash, que foi gerada pela senha. E, com isso, se ele tiver acesso a nossa base de dados, o atacante pode pegar a senha hash que está guardada lá de, pela tabela, ele consegue descobrir qual foi a senha que gerou a senha hash.

[01:16] Então, dessa forma, ele basicamente consegue descobrir a senha do nossos usuários, do mesmo jeito que ele conseguia fazer se não tivesse a proteção usando a nossa função de hash.

[01:30] Então como que a gente pode fazer para arrumar isso daí? E como esse atacante consegue gerar essas senhas? Ele pode pegar de, na hora de gerar a senha, aplicar o hash nessa senha, ele pega uma lista das 10 milhões de senhas mais comuns que são liberadas todo ano e para cada uma dessas senhas, ele pode fazer a permutação, mudando a sequência dos números, pegando só as consoantes ou mudando a ordem dos termos.

[02:02] E com isso, ele consegue fazer uma lista de possíveis senhas bem robusta e, facilmente, com um pouco tempo, ele consegue gerar o hash dessa senhas e gerar uma tabela que provavelmente ele vai conseguir senhas dos usuários na base de dados.

[02:20] Então como que conseguimos fazer para deter esse tipo de ataque? E não só isso, em vez de usar apenas uma tabela com todas as senhas e as senhas hash, ele pode usar uma estrutura de dados um pouquinho mais avançada chamada de “Rainbow Table” ou “Tabela Arco-íris”, onde você consegue guardar basicamente as mesmas informações da da senha hash gerada pela senha, de uma forma que ocupa um pouquinho menos espaço.

[02:51] Esse tipo de ataque é um ataque muito comum, e é chamado de “Rainbow Table Attack”. Então esse é um ataque que pode fazer com que nossas senhas sejam expostas. Como conseguimos fazer para evitar esse tipo de ataque?

[03:07] Primeiro, o que precisamos fazer é temperar um pouquinho mais essa função. DE, para isso, modificamos ela para receber uma string aleatória de uso único, ou uma string pseudo-aleatória de uso único. Essa string será chamada de salt, que vem do inglês para “sal”.

[03:37] Assim, essa função de hash modificada, vai receber a senha, de o salt vai combinar os dois na geração da senha com hash. Então, para isso, então para isso o atacante que quer fazer o mesmo tipo de ataque, vai ter que fazer uma tabela para cada probabilidade de salt.

[03:51] O que torna inviável o “Rainbow Table Attack”. Torna inviável esse ataque, mas não impossibilita que ele descubra a senha, porque esse salt está atrelado a senha na base de dados, ele tá guardado na base de dados.

[04:08] Então nesse caso, que o atacante tem acesso ao nosso banco, ele pode basicamente pegar o salt e a senha hash e fazer o mesmo método anterior para gerar possíveis senhas para aplicarmos o hash.

[04:28] Então, com isso, ele consegue, um por um, descobrir a senha de alguns usuários. Só usando esse mesmo método, acaba ficando um pouquinho mais lento do que a “Rainbow Table Attack”,mas ainda assim, não é impossível ele conseguir quebrar a segurança das senhas na base de dados.

[04:48] Então o método para resolver esse problema é simplesmente trocando a função de hash para uma função mais específica para esse caso. E, no caso, essa função existe e vai resolver todos os problemas de uma vez.

[05:03] Porque além de receber a nossa senha, ele vai receber um valor de custo e esse curso vai determinar o quão lento a função vai demorar para executar. Assim a gente consegue controlar a velocidade de execução do algoritmo baseado no poder computacional da época.

[05:22] Então, quanto maior o custo, mais demorada essa função vai ser para executar. E, conforme os anos passam, os computadores ficam mais rápidos e apenas precisamos aumentar a função de custo, que nosso sistema vai continuar com a mesma segurança.

[05:38] E além disso, com a biblioteca que a gente vai usar, o salt vai ser gerado automaticamente para nós. Então não precisamos nos preocupar com isso. E essa função é chamada de Bcrypt e na nossa aplicação a gente vai usar a função chamada de Bcrypt.hash. Então vamos ver como conseguimos instalar ela a nossa API.