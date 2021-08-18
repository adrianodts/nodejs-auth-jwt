As vantagens do bcrypt

Quais são as motivações do uso do bcrypt para a proteção de senhas?

* Alternativa correta
1. Ser resistente a ataques de tabela arco-íris. Isso acontece pois a função utiliza também um salt, uma string aleatória ou pseudo aleatória de uso único, o que obriga a criação de um número inviável de tabelas para realizar esse ataque.

R: Isso! Sem esse salt, descobrir múltiplas senhas ao mesmo tempo se torna muito mais fácil.


2. Esconder qualquer informação sobre a senha original. Por isso, qualquer função de hashing de uso geral, como o MD5 ou SHA 256, pode ser usada no lugar do bcrypt.


* Alternativa correta
3. Ser adaptável à capacidade computacional vigente. Para isso, ela recebe um fator de custo, que possibilita o incremento no tempo de execução da função.

R: Isso! Cada incremento no fator de custo dobra o tempo de execução da função. Assim, podemos alterar esse fator conforme a capacidade computacional avança ao longo dos anos.


4. Ser extremamente rápida e eficiente. Dessa forma, não é perdido um tempo desnecessário para o cálculo da função, aumentando a escalabilidade do projeto.