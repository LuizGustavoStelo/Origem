# Origem MS

Origem MS é uma plataforma de curadoria premium para gastronomia, cultura e turismo no Mato Grosso do Sul. O projeto começa com uma landing page editorial e evolui para um marketplace SaaS multiestado, com assinatura mensal de estabelecimentos, painel administrativo, métricas de visitação e faturamento.

## Estado Atual

- Landing page e páginas editoriais servidas por container Docker.
- Rotas públicas funcionais: `/`, `/gastronomia`, `/cultura`, `/turismo`, `/a-rota`.
- Rotas provisórias para conteúdo futuro: `/sobre`, `/expedicoes`, `/contato`, `/privacidade`, `/termos`, `/admin`.
- Infraestrutura estática inicial com dois containers web balanceáveis pelo Nginx externo.
- Header e footer unificados em [assets/origem-layout.js](assets/origem-layout.js).
- PostgreSQL e Redis já estão planejados em [docker-compose.yml](docker-compose.yml), mas o deploy atual usa [docker-compose.static.yml](docker-compose.static.yml).
- Deploy automatizado por GitHub Actions para a VPS `147.15.31.73`, no diretório `/var/www/Origem`.

## Arquitetura Proposta

O Nginx fica instalado diretamente na VPS e balanceia requisições entre containers web publicados apenas em `127.0.0.1`.

```text
Internet
  |
  v
Nginx na VPS
  |
  +--> origem-web-a:3001
  +--> origem-web-b:3002
          |
          +--> PostgreSQL
          +--> Redis
```

Essa base mantém a aplicação stateless, permitindo aumentar a quantidade de containers web sem mudar o domínio público. Para alto volume, as próximas evoluções recomendadas são PgBouncer para pool de conexões PostgreSQL, CDN para imagens, fila de jobs para relatórios/cobrança, storage externo para uploads e observabilidade com logs centralizados.

Veja a visão técnica em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Multi-Tenancy

O domínio inicial é `origemms.com.br`. A arquitetura já considera múltiplos domínios estaduais:

- `origemms.com.br`: Mato Grosso do Sul.
- `origemrj.com.br`: Rio de Janeiro.
- `origemrs.com.br`: Rio Grande do Sul.
- `origemmt.com.br`: Mato Grosso.

A aplicação deve resolver o tenant pelo `Host` recebido no Nginx. No banco, a entidade principal deve ser `tenants` ou `states`, e todos os registros operacionais relevantes devem carregar `tenant_id`: estabelecimentos, usuários, assinaturas, faturas, visitas, posts e relatórios.

## Perfis de Usuário

- `superadmin`: vê todos os estados, estabelecimentos, faturamento, visitas, usuários e configurações globais.
- `admin`: vê e gerencia os estabelecimentos do tenant/estado ao qual pertence.
- `user`: vê somente o próprio estabelecimento, faturas, status da assinatura e gráficos de visitas.

O permissionamento deve ser RBAC, com validação no backend e nunca apenas na interface.

## Módulos Planejados

- Catálogo público de estabelecimentos.
- Página de cada estabelecimento com fotos, descrição, localização, horários, categorias e selo de curadoria.
- Painel do estabelecimento com visitas, gráficos, faturas e dados cadastrais.
- Painel administrativo estadual para aprovar, editar e acompanhar estabelecimentos.
- Painel superadmin para alternar entre estados, ver faturamento consolidado e gerenciar admins.
- Assinaturas mensais, inicialmente com plano de referência de R$ 100/mês.
- Relatórios de MRR, inadimplência, visitas, conversão e crescimento por tenant.

## Publicação Inicial Somente Estática

Para colocar no ar agora, sem banco e sem painel administrativo funcional, precisamos somente de:

- VPS com Docker e Docker Compose instalados.
- Nginx instalado direto na VPS.
- Domínio `origemms.com.br` apontando para `147.15.31.73`.
- Arquivo `.env` em `/var/www/Origem`.
- Secrets configurados no GitHub Actions.

Na VPS, crie o diretório e o `.env`:

```bash
sudo mkdir -p /var/www/Origem
sudo chown -R "$USER":"$USER" /var/www/Origem
cd /var/www/Origem
cat > .env <<'EOF'
NODE_ENV=production
WEB_A_PORT=3001
WEB_B_PORT=3002
EOF
```

Configure o Nginx usando [infra/nginx/origemms.com.br.conf](infra/nginx/origemms.com.br.conf), apontando para `127.0.0.1:3001` e `127.0.0.1:3002`.

Depois, configure no GitHub os secrets:

- `VPS_USER`: usuário SSH da VPS.
- `VPS_SSH_KEY`: chave privada SSH autorizada na VPS.
- `GHCR_PAT`: token para puxar a imagem do GitHub Container Registry se o pacote for privado.

Com isso, basta fazer commit e push na branch `main`. O GitHub Actions constrói a imagem, envia para o GHCR e atualiza os containers na VPS.

## Desenvolvimento Local

Crie o arquivo de ambiente:

```powershell
Copy-Item .env.example .env
```

Suba a stack estática:

```powershell
docker compose -f docker-compose.static.yml up -d --build
```

Ou suba a stack completa planejada, com PostgreSQL e Redis:

```powershell
docker compose up -d --build
```

Acesse:

- `http://localhost:3001`
- `http://localhost:3002`
- `http://localhost:3001/healthz`

Para rodar sem Docker:

```powershell
npm start
```

## Nginx Externo

O arquivo de exemplo está em [infra/nginx/origemms.com.br.conf](infra/nginx/origemms.com.br.conf).

Na VPS, depois de subir os containers, o Nginx deve apontar para:

- `127.0.0.1:3001`
- `127.0.0.1:3002`

Comandos esperados na VPS:

```bash
sudo cp infra/nginx/origemms.com.br.conf /etc/nginx/sites-available/origemms.com.br
sudo ln -s /etc/nginx/sites-available/origemms.com.br /etc/nginx/sites-enabled/origemms.com.br
sudo nginx -t
sudo systemctl reload nginx
```

O HTTPS deve ser configurado com Certbot ou outro gerenciador de certificados.

## Deploy com GitHub Actions

O workflow está em [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Fluxo:

1. Push na branch `main`.
2. GitHub Actions constrói a imagem Docker.
3. A imagem é publicada no GitHub Container Registry.
4. A action acessa a VPS por SSH.
5. O código em `/var/www/Origem` é atualizado.
6. O Docker Compose estático recria os containers web usando a imagem nova.

Secrets necessários no GitHub:

- `VPS_USER`: usuário SSH da VPS.
- `VPS_SSH_KEY`: chave privada SSH autorizada na VPS.
- `GHCR_PAT`: token com permissão para puxar imagens do GitHub Container Registry, caso o pacote seja privado.

Antes do primeiro deploy, crie `/var/www/Origem/.env` na VPS com base em `.env.example`, usando senhas fortes.

## Próximos Passos Técnicos

1. Escolher stack da aplicação completa: sugestão profissional é `Next.js` para web/admin e `NestJS` ou API modular em Node.js para regras de negócio.
2. Modelar banco PostgreSQL com tenants, usuários, roles, estabelecimentos, assinaturas, faturas e eventos de visita.
3. Criar autenticação com sessões seguras em Redis ou JWT curto com refresh token.
4. Implementar painel admin/superadmin.
5. Implementar cobrança e conciliação de faturas.
6. Mover imagens para storage externo e servir via CDN.
7. Adicionar migrations, testes, logs estruturados, backup automático e monitoramento.
