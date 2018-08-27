# App para vendas por consultoras

Esse app tem a função de organizar o estoque e controlar pessoas e peças para um sistema de consultores.
Existem diferentes níveis de usuário:
- Estoque: administra a entrada de peças no estoque e a criação e envio de kits
- Controladoria: administra as pessoas (consultores e supervisores), aprova encomendas e vê relatórios
- Supervisor: administra seus consultores, realiza acertos, repassa kits e faz encomendas
- Consultor: realiza vendas, trocas e recebe/entrega brindes

Esse projeto é uma generalização originada no app desenvolvido para Ambaya Semijoias, que pode ser acessado aqui: minha.ambaya.com.br.

Um demo do app pode ser acessado aqui: https://webdrops-sellthings.herokuapp.com/

Os usuários padrão são: 
- estoque/webdrops
- controlador/webdrops

Supervisor e consultor podem ser criados. O nome de usuário do supervisor será também sua senha.
O consultor se criado pela pagina de registro terá o nome de usuário igual ao CPF e a senha será a escolhida.
Se criado pelo supervisor terá senha e nome de usuário iguais ao CPF.

## Angular.js

O app é desenvolvido no framework Angular.js (Angular 1.5). O processo de build pode ser feito utilizando Gulp, mas o script não se encontra no projeto. O ideal é a adaptação para o uso do webpack, mas atualmente ainda é utilizado o Gulp.

## Servidor e banco de dados
O back end para esse projeto foi desenvolvido utilizando Node + Express + Mongo DB + Mongoose. O projeto ainda não tem versão pública, mas está em progresso.