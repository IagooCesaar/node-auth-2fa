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
<h3>Diagrama de Entidade e Relacionamento</h3>
<h3>Rotas da API</h3>
<h3>Fluxo da API</h3>