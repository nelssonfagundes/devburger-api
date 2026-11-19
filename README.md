# 🍔 DevBurger API

API da hamburgueria DevBurger, projeto do DevClub Full Stack (Back End, Partes I e II).
Desenvolvida com ajuda de inteligência artificial (Claude), seguindo a sequência das aulas.

## Tecnologias

- **Node.js + Express**: servidor e rotas
- **Docker**: PostgreSQL e MongoDB rodando em containers
- **PostgreSQL + Sequelize**: usuários, produtos e categorias, com migrations e relacionamento entre tabelas
- **MongoDB + Mongoose**: pedidos (banco NoSQL)
- **JWT (jsonwebtoken)**: login com token
- **Arquitetura MVC + middlewares**: autenticação e permissão de administrador
- **Yup**: validação dos dados
- **bcrypt**: senha guardada como hash
- **Multer**: upload de imagens de produtos e categorias
- **Biome**: formatação e padronização do código

## Estrutura

```
src/
├── app/
│   ├── controllers/   User, Session, Product, Category, Order
│   ├── middlewares/   auth (token JWT) e admin (só administrador)
│   ├── models/        User, Product, Category (PostgreSQL)
│   └── schemas/       Order (MongoDB)
├── config/            auth (JWT), database, multer
├── database/
│   ├── index.js       conexão com PostgreSQL e MongoDB
│   └── migrations/    users, products, categories, relacionamento e oferta
├── app.js             configura o Express
├── routes.js          rotas da API
└── server.js          liga o servidor na porta 3001
uploads/               imagens enviadas
```

## Como rodar

Precisa ter instalado: Node.js 22 LTS, Docker Desktop e VS Code (ou outro editor).

```bash
npm install              # instala as dependências
docker compose up -d     # sobe PostgreSQL e MongoDB
npm run migrate          # cria as tabelas
npm run dev              # liga o servidor em http://localhost:3001
```

## Rotas

Rotas marcadas com 🔒 precisam do token no cabeçalho `Authorization: Bearer <token>`.
Rotas marcadas com 👑 só funcionam para usuário administrador.

| Método | Rota | O que faz |
|---|---|---|
| POST | `/users` | Cadastra usuário (`name`, `email`, `password`, `admin`) |
| POST | `/session` | Login: devolve os dados do usuário e o `token` |
| GET 🔒 | `/products` | Lista os produtos com a categoria |
| POST 🔒👑 | `/products` | Cria produto (multipart: `name`, `price`, `category_id`, `offer`, `file`) |
| PUT 🔒👑 | `/products/:id` | Atualiza produto (qualquer campo, imagem opcional) |
| GET 🔒 | `/categories` | Lista as categorias |
| POST 🔒👑 | `/categories` | Cria categoria (multipart: `name`, `file`) |
| PUT 🔒👑 | `/categories/:id` | Atualiza categoria |
| GET 🔒 | `/orders` | Admin vê todos os pedidos; cliente vê só os dele |
| POST 🔒 | `/orders` | Cria pedido: `{ "products": [{ "id": 1, "quantity": 2 }] }` |
| PUT 🔒👑 | `/orders/:id` | Muda o status do pedido |

Status de pedido aceitos: `Pedido realizado`, `Em preparação`, `Saiu para entrega`, `Entregue`, `Cancelado`.

## Teste rápido (Insomnia ou Postman)

1. `POST /users` com `{ "name": "Admin", "email": "admin@devburger.com", "password": "123456", "admin": true }`
2. `POST /session` com o e-mail e a senha → copie o `token`
3. Nas próximas requisições, use o token no cabeçalho (Auth → Bearer Token)
4. `POST /categories` (Multipart Form): `name` = Hambúrgueres, `file` = uma imagem
5. `POST /products` (Multipart Form): `name`, `price` (ex.: 3500 = R$ 35,00), `category_id` = 1, `offer` = true, `file`
6. `POST /orders` com `{ "products": [{ "id": 1, "quantity": 2 }] }`
7. `PUT /orders/<id do pedido>` com `{ "status": "Em preparação" }`

## Regras implementadas

- E-mail e nome de categoria não se repetem (erro 409).
- Senha com no mínimo 6 caracteres, salva com hash bcrypt.
- Login com erro genérico, para não revelar quais e-mails existem.
- Token JWT válido por 5 dias.
- Só administrador cria e edita produtos e categorias e muda o status dos pedidos.
- O pedido usa o preço e a categoria que estão no banco, não os enviados pelo cliente.
- Preço em centavos (número inteiro).

> Antes de publicar, troque o `secret` em `src/config/auth.js` por um texto longo e só seu.
