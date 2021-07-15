<h1>Node Auth 2FA</h1>

API desenvolvida para estudos de modelo de autenticação em duas etapas, ou dois fatores de autenticação (Two-Factor Authentication).

Muitos apps e sites atualmente acrescentam uma **camada adicional de segurança** para o processo de login da conta, exigindo que o usuário forneça, além de suas credenciais (e-mail e senha, por exemplo), uma segunda forma de se autenticar.

São muitas as formas de estabelecer um segundo fator de autenticação:
- Envio de código por SMS;
- Envio de código por e-mail;
- Token USB;
- Aplicativo específico (como do Google);
- Outros

A autenticação em duas etapas não é infalível, mas desempenha como uma barreira adicional de proteção para evitar acessos não autorizados. Além disso, se o tipo de comprovação exigir um envio de código para um telefone ou e-mail previamente cadastrado, poderá servir também como um aviso alertando que a senha foi descoberta, cabendo ao usuário alterá-la por razões óbvias.

<h2>Como executar o projeto</h2>
<h3>Requisitos</h3>
Será necessário possuir instalado na máquina os seguintes componentes:

- Node : 12.x.x
- Yarn
- Docker
- Docker-Compose

<h3>Faça clone do projeto para sua máquina</h3>
Utilize o git para clonar o projeto para sua máquina, como o exemplo utilizando SSH:

```
git clone https://github.com/IagooCesaar/node-auth-2fa minha_pasta
```

> "minha_pasta" é um propriedade adicional, onde poderá ser determinada um diretório específico para realização do clone do repositório

Você também poderá efetuar download do código fonte compactado, como de costume.

<h3>Instalando dependências do projeto</h3>

Via terminal, navegue até a pasta criada, onde foi depositado o clone do projeto, e execute o comando `yarn`. Todas as dependências do projeto serão instaladas.

<h3>Preparando o banco de dados</h3>

Ainda no terminal execute o comando `docker-compose up -d` para instanciar o banco de dados Postgres e também o Redis. Se esta for a primeira vez que utiliza algumas destas imagens do Docker Hub, este procedimento poderá levar alguns minutos.

Uma vez que os container tenham sido criados, execute o comando `yarn typeorm migration:run` no seu terminal. Isto irá criar todos os objetos de banco de dados necessários para o funcionamento da API. 

<h3>Executando o projeto</h3>

Com todas as dependências resolvidas, o projeto poderá ser executado. Para isso, basta executar o comando `yarn dev`. Isto instanciará a API em ambiente de desenvolvimento, e você poderá acessá-la através da url http://localhost:3333

<h3>Executando os testes</h3>

Antes de iniciar o script de testes, será necessário criar uma nova instancia do banco de dados para este propósito. Utilize seu cliente de banco de dados Postgres favorito para criar esta nova instância:

```SQL
create database auth2fa_test
```

Para executar o script de testes, execute o comando `yarn test`.

<h3>Cobertura dos testes</h3>

Uma vez os testes tenham sido executando ao menos uma vez e que a API esteja em execução (ainda em ambiente de desenvolvimento), o relatório de cobertura de testes estará disponível na rota http://localhost:3333/api/coverage

<h2>Funcionamento do API</h2>

O método utilizado para segundo fator de autenticação nesta API será o **TOTP** (Time-Based One Time Password), ou senha de uso único baseada no tempo. TOTP é um algorítimo que gera senhas únicas baseando-se no tempo para garantir que as senhas sejam únicas. Seu funcionamento consiste em gerar um código numérico, geralmente de seis dígitos, dado o conjunto de uma **chave secreta** e uma referência para **época** (data/hora).

<h3>Utilizando a API</h3>

O primeiro passo é cadastrar um usuário na API. Se tudo ocorrer bem, será retornado um objeto contendo os dados do usuário e também uma URL onde o QR Code foi disponibilizado.  Veja a seguir exemplo de um QR Code criado pela API:

<div style="text-align:center">
<img src="https://github.com/IagooCesaar/node-auth-2fa/blob/main/tmp/qrcode/55094550-217b-464f-bf63-ba15b6fe6c36.png?raw=true" alt="Exemplo de QR Code">
</div>

> Neste QR Code está inserido uma URI, como `otpauth://totp/${nome da aplicação}:${identificador da conta}?secret=${chave secreta}&period=${periodo de validade em segundos}&digits=${quantidade de dígitos do código}&algorithm=${algoritimo utilizado}&issuer=${provedor}`

 Ao efetuar a leitura do QR Code com aplicativo compatível, como o [Microsoft Authenticator](https://www.microsoft.com/pt-br/account/authenticator), serão exibidos códigos de seis dígitos a cada 30 segundos.
 
 O próximo passo então será validar o código gerado pelo aplicativo, fornecendo o ID do usuário (retornado no objeto ao criar o usuário) e o código exibido pelo aplicativo.

 Validando o código, o usuário poderá então inciar a etapa de autenticação. Primeiramente deverão ser fornecidas as credenciais (e-mail e senha). Tudo ocorrendo bem, será retornado um **token temporário** com validade de 3 minutos.
 Envie este token e o código gerado pelo aplicativo para validação do segundo fator de autenticação. Tudo ocorrendo bem, será retornado um **token** e um **refresh token** para o controle de sessão.

 [👉 Neste link você poderá acessar um vídeo 📹📹](https://www.youtube.com/watch?v=z35aPwAaETk) onde demonstro o funcionamento da API.

<h3>Diagrama de Entidade e Relacionamento</h3>

A seguir, diagrama de entidade e relacionamento do banco de dados:

<div style="text-align:center">
<img src="https://github.com/IagooCesaar/node-auth-2fa/blob/main/.github/der-auth2fa.png?raw=true" alt="Diagrama de entidade e relacionamento">
</div>


<h3>Rotas da API</h3>

Se você utiliza o Insomnia, disponibilizei [arquivo de configuração](https://github.com/IagooCesaar/node-auth-2fa/blob/main/.github/Insomnia.json) para que possa importar todas as rotas da aplicação.

- **POST** `/users/`: espera que sejam enviados os dados cadastrais do usuário e retorna o dados deste usuário, confirmando a criação do mesmo, e também uma URL onde o QR Code poderá ser acessado.

- **POST** `/users/generate2fa`: espera que seja enviado o ID do usuário e retorna URL onde o novo QR Code poderá ser acessado

- **POST** `/users/validate2fa`: esperada que sejam enviados o ID do usuário e o código de seis dígitos gerado pelo aplicativo autenticador

- **GET** `/users/profile`: espera que seja fornecido token de autenticação e retorna os dados do usuário autenticado

- **POST** `/sessions`: espera que sejam fornecidos e-mail e senha e retorna um token temporário

- **POST** `/sessions/two-factor`: espera que sejam fornecidos o token temporário e código de seus dígitos gerado pelo aplicativo autenticador e retorna dados do usuário, token e refresh token

- **POST** `/sessions/refresh-token`: esperada que seja enviado o refresh token e retorna novos token e refresh token