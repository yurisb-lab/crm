# Yuri CRM — CRM de Fotógrafo

CRM web (PWA) para um fotógrafo de eventos sociais (Yuri Silva Fotografias, Pacatuba/CE). Centraliza leads, negociações, eventos, clientes, produtos, financeiro e feedbacks, com apoio de IA (Google Gemini) para análises e automações.

## Stack

- **Frontend**: HTML/CSS/JS puro em um único arquivo (`index.html`), sem build step nem framework.
- **Backend**: Firebase (Auth + Firestore) como banco de dados e autenticação, acessado diretamente do navegador.
- **IA**: Google Gemini, usada em vários pontos do app (avaliação financeira do mês, preenchimento automático de formulários via print/foto, análise de conversas, sugestões de mensagens etc.), configurável em Configurações com uma chave de API própria.
- **PWA**: `manifest.json` + `sw.js` (service worker) para instalação e uso offline básico.

## Estrutura do repositório

```
index.html              # aplicação inteira (HTML + CSS + JS)
manifest.json            # manifesto da PWA
sw.js                     # service worker
icon-*.png, favicon-32.png, apple-touch-icon.png   # ícones da PWA
crm-fotografo.html        # versão/experimento anterior do app
```

Não há processo de build: `index.html` é servido estaticamente (Firebase Hosting ou qualquer servidor estático).

## Módulos principais (navegação lateral)

- **Dashboard** — visão geral: próximos eventos, alertas (separados em *Alertas de Leads* e *Alertas de Clientes*), aniversários e negociações em aberto.
- **Agenda** — calendário de eventos.
- **Conversar** — chat com a IA usando o contexto do CRM.
- **Leads** — captação e acompanhamento de pessoas interessadas, com detecção de leads parados.
- **Negociações** — funil entre lead e evento fechado.
- **Eventos** — cadastro de eventos (aniversário, casamento, ensaio etc.), com status `confirmado → realizado → entregue` (clicável para avançar), entrega prevista sugerida automaticamente (45 dias após a data do evento) e controle de saldo pendente.
- **Clientes** — cadastro de clientes, com detecção de duplicatas e pilha de clientes hibernados.
- **Aniversariantes / Casamentos** — dados derivados de clientes/eventos para lembretes e mensagens automáticas.
- **Produtos** — pedidos de produtos (álbuns etc.) com etapas e prazos de prévia.
- **Feedbacks** — coleta de feedback de clientes via link público, sem login.
- **Financeiro** — relatório do mês em destaque, meses anteriores, avaliação do mês feita por IA (salva no Firestore, com comentários), histórico de pagamentos e recibos.
- **Relatórios** — exportações em PDF (ex: lista de eventos).
- **Configurações** — chave Gemini, meta mensal, catálogo de produtos, mensagens automáticas, protocolo de reativação de clientes.

## Dados e sincronização

Todas as coleções (`leads`, `clientes`, `criancas`, `casamentos`, `eventos`, `produtos`, `pagamentos`, `recibos`, `bloqueios`, `negociacoes`, `prereservas`, `feedbacks`) são sincronizadas em tempo real via `onSnapshot` do Firestore. Configurações gerais (meta mensal, catálogo, mensagens, avaliações financeiras de IA etc.) ficam no documento único `config/settings`.

## Rodando localmente

Basta servir os arquivos estáticos, por exemplo:

```bash
npx serve .
# ou
python3 -m http.server 8080
```

O app usa as credenciais do Firebase já embutidas em `index.html` (`firebaseConfig`) — é necessário estar autenticado com um usuário válido do projeto Firebase configurado.
