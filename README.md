# 📨 Messages API

Uma API REST moderna e completa desenvolvida com **NestJS** para gerenciamento de mensagens entre usuários, com sistema de autenticação JWT, upload de imagens e notificações por email.

## 🚀 Tecnologias

- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem de programação
- **[TypeORM](https://typeorm.io/)** - ORM para banco de dados
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[JWT](https://jwt.io/)** - Autenticação e autorização
- **[Swagger](https://swagger.io/)** - Documentação interativa da API
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Hash de senhas
- **[Nodemailer](https://nodemailer.com/)** - Envio de emails
- **[Helmet](https://helmetjs.github.io/)** - Segurança HTTP
- **[Throttler](https://docs.nestjs.com/security/rate-limiting)** - Rate limiting

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com email e senha
- Geração de tokens JWT (access token e refresh token)
- Renovação automática de tokens
- Guards para proteção de rotas
- Sistema de políticas de acesso (Route Policies)

### 👥 Usuários
- Criação de conta
- Listagem de usuários
- Busca de usuário por ID
- Atualização de perfil (apenas próprio usuário)
- Exclusão de conta (apenas própria conta)
- Upload de foto de perfil (PNG, máximo 10MB)
- Validação de dados com class-validator

### 💬 Mensagens
- Envio de mensagens para múltiplos destinatários
- Listagem paginada de mensagens
- Busca de mensagem específica
- Atualização de mensagens (apenas do próprio autor)
- Exclusão de mensagens (apenas do próprio autor)
- Relacionamento entre remetente e destinatários

### 📧 Email
- Integração com serviço de email (Nodemailer)
- Notificações automáticas

### 🛡️ Segurança
- Rate limiting (10 requisições por minuto)
- Helmet para headers de segurança
- CORS configurável por ambiente
- Validação de dados de entrada
- Hash de senhas com bcrypt
- Proteção contra SQL injection (TypeORM)

### 📚 Documentação
- Swagger UI disponível em `/docs`
- Documentação interativa de todos os endpoints
- Autenticação Bearer Token integrada

## 📋 Pré-requisitos

- Node.js 20+ ([nvm](https://github.com/nvm-sh/nvm) recomendado)
- PostgreSQL 12+
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/nest_messages_api.git
cd nest_messages_api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados PostgreSQL**
```sql
CREATE USER seu_usuario WITH ENCRYPTED PASSWORD 'sua_senha';
CREATE DATABASE nome_database WITH OWNER seu_usuario;
GRANT ALL PRIVILEGES ON DATABASE nome_database TO seu_usuario;
```

4. **Configure as variáveis de ambiente**

Crie um arquivo `.env.development` na raiz do projeto:

```env
# Database
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=seu_usuario
DATABASE=nome_database
DATABASE_PASSWORD=sua_senha
DATABASE_AUTOLOAD_ENTITIES=true
DATABASE_SYNCHRONIZE=true

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_TOKEN_AUDIENCE=http://localhost:3000
JWT_TOKEN_ISSUER=http://localhost:3000
JWT_TOKEN_EXPIRATION_TIME=3600
JWT_REFRESH_TTL=86400

# Application
APP_PORT=3000
NODE_ENV=development
CORS_ORIGIN=https://seu-dominio.com.br  # Apenas para produção

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_app
EMAIL_SECURE=false
EMAIL_FROM=noreply@example.com
```

> ⚠️ **Importante**: Em produção, defina `DATABASE_SYNCHRONIZE=false` e use migrations do TypeORM.

## 🏃 Executando a aplicação

### Desenvolvimento
```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3000`

### Produção
```bash
npm run build
npm run start:prod
```

### Debug
```bash
npm run start:debug
```

## 📖 Documentação da API

Após iniciar a aplicação, acesse a documentação Swagger em:
```
http://localhost:3000/docs
```

A documentação inclui:
- Todos os endpoints disponíveis
- Parâmetros de entrada e saída
- Exemplos de requisições
- Autenticação Bearer Token integrada

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:cov

# Testes end-to-end
npm run test:e2e
```

## 📁 Estrutura do Projeto

```
src/
├── app/              # Módulo principal e configurações
├── auth/             # Autenticação e autorização
│   ├── guards/       # Guards de autenticação
│   ├── hashing/      # Serviço de hash de senhas
│   └── decorators/   # Decorators customizados
├── users/            # Módulo de usuários
├── messages/         # Módulo de mensagens
├── email/            # Serviço de email
├── common/           # Recursos compartilhados
│   ├── decorators/   # Decorators comuns
│   ├── dto/          # DTOs compartilhados
│   ├── filters/      # Exception filters
│   ├── guards/       # Guards comuns
│   ├── interceptors/ # Interceptors
│   ├── pipes/        # Pipes de validação
│   └── regex/        # Utilitários de regex
└── main.ts           # Arquivo de inicialização
```

## 🔑 Endpoints Principais

### Autenticação
- `POST /auth` - Login
- `POST /auth/refresh` - Renovar token

### Usuários
- `POST /users` - Criar usuário
- `GET /users` - Listar usuários
- `GET /users/:id` - Buscar usuário (autenticado)
- `PATCH /users/:id` - Atualizar usuário (próprio)
- `DELETE /users/:id` - Deletar usuário (próprio)
- `POST /users/upload-picture` - Upload de foto (autenticado)

### Mensagens
- `GET /messages` - Listar mensagens (paginado)
- `GET /messages/:id` - Buscar mensagem
- `POST /messages` - Criar mensagem (autenticado)
- `PATCH /messages/:id` - Atualizar mensagem (autor)
- `DELETE /messages/:id` - Deletar mensagem (autor)

## 🎯 Recursos Técnicos Implementados

- ✅ Arquitetura modular (NestJS)
- ✅ Injeção de dependências
- ✅ Validação de dados com DTOs
- ✅ Transformação de dados
- ✅ Exception filters customizados
- ✅ Interceptors (timing, headers)
- ✅ Guards de autenticação e autorização
- ✅ Pipes customizados
- ✅ Rate limiting
- ✅ Upload de arquivos
- ✅ Serviço estático de imagens
- ✅ Configuração por ambiente
- ✅ Validação de variáveis de ambiente (Joi)
- ✅ Documentação automática (Swagger)
- ✅ Testes unitários e E2E
- ✅ TypeScript strict mode

## 🔒 Segurança

- Senhas hasheadas com bcrypt
- Tokens JWT com expiração
- Rate limiting para prevenir abuso
- Helmet para headers de segurança
- Validação rigorosa de entrada
- CORS configurável
- Guards para proteção de rotas

## 📝 Licença

Este projeto é privado e não possui licença pública.

## 👨‍💻 Autor

**Gabriel Campos Peixoto**

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
