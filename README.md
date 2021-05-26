COMO RODAR O PROJETO BAIXADO
Instalar as dependencias
### npm install

Iniciar o servidor
### npm rum dev


SEQUENCIA EXECUTADAS E BIBLIOTECAS INSTALADAS DURANTE O CURSO
Criar o arquivo package
npm init -y

//Gerencia as requisições, rotas e URLs, entre outra funcionalidades
npm install express

//Instalar o módulo para reiniciar o servidor sempre que houver alteração no código fonte
npm install -D nodemon

//Produz código JS válido - para import do ES6
npm install -D sucrase

//Iniciar o servidor
npm rum dev

//Instalar as dependencias
npm install

//Instalar o MongoDB
npm install --save mongodb

//Instalar o Mongoose - Mongoose traduz os dados do banco de dados para objetos JavaScript para que possam ser utilizados por sua aplicação.
npm install --save mongoose

//validar campo
npm install --save yup

//Instalar o módulo para criptografar a senha
npm install --save bcryptjs

//Instalar a dependencia para JWT
npm install --save jsonwebtoken

//Instalar o módulo para paginação com mongoose
npm install --save mongoose-paginate-v2

//Multer é um middleware node.js para manipulação multipart/form-data, usado para o upload de arquivos. 
npm install --save multer

//Permitir acesso a API
npm install --save cors

Gerar o backup do banco de dados MongoDB
### mongodump --db celke --out c:\data\db

Restaurar o backup do banco de dados MongoDB
### mongorestore --db celke c:\data\db\celke

//Módulo para enviar email
npm install nodemailer