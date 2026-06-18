# Arquitetura Origem MS

## Objetivo

Criar uma plataforma multi-tenant de alto tráfego para listar estabelecimentos, vender assinaturas mensais e entregar painéis administrativos por estado, mantendo o Nginx fora dos containers.

## Topologia Inicial

```text
Usuário
  |
  v
DNS: origemms.com.br
  |
  v
Nginx host-level
  |
  +-- 127.0.0.1:3001 -> web-a
  +-- 127.0.0.1:3002 -> web-b
                    |
                    +-- PostgreSQL
                    +-- Redis
```

## Decisões

- O Nginx externo faz TLS, compressão, rate limiting e balanceamento.
- Os containers web não mantêm sessão em memória local.
- O PostgreSQL é a fonte de verdade.
- O Redis atende cache, sessão, locks, filas simples e proteção contra abuso.
- Cada tenant é resolvido pelo domínio recebido em `Host`.

## Multi-Tenancy

Modelo recomendado:

- `tenants`: estado, domínio principal, domínios alternativos, status, configurações comerciais.
- `users`: usuários globais.
- `tenant_users`: vínculo entre usuário, tenant e role.
- `establishments`: estabelecimentos associados a um tenant.
- `subscriptions`: plano, status, recorrência e validade.
- `invoices`: faturas geradas para cada estabelecimento.
- `visits`: eventos agregáveis de visita por estabelecimento, data, origem e página.

Com esse desenho, o `superadmin` consulta todos os tenants, enquanto `admin` e `user` recebem filtros obrigatórios por `tenant_id`.

## Escala

Fase atual:

- Dois containers web.
- Um PostgreSQL.
- Um Redis.
- Nginx com `least_conn`.

Fase de crescimento:

- Aumentar containers web: `web-c`, `web-d` ou migração para Docker Swarm/Kubernetes.
- Adicionar PgBouncer entre aplicação e PostgreSQL.
- Separar API e frontend em containers distintos.
- Usar CDN e storage externo para imagens de restaurantes.
- Criar workers para envio de e-mails, geração de relatórios, cobrança e conciliação.

Fase de alta disponibilidade:

- PostgreSQL gerenciado ou cluster com réplica.
- Backups automáticos testados com restore.
- Redis gerenciado ou Sentinel/cluster.
- Deploy blue-green ou rolling update.
- Observabilidade com métricas, logs estruturados e alertas.

## Segurança

- Senhas e tokens somente em secrets ou `.env` fora do Git.
- RBAC validado no backend.
- Uploads fora do container, com validação de tipo e tamanho.
- Rate limiting no Nginx e, futuramente, também por usuário/IP no Redis.
- Auditoria para ações administrativas sensíveis.

## Deploy

O GitHub Actions cria uma imagem Docker versionada pelo SHA do commit e publica no GHCR. A VPS puxa essa imagem e recria os containers definidos no Compose.

O deploy não deve sobrescrever `.env` da VPS. Esse arquivo fica sob responsabilidade operacional do servidor.
