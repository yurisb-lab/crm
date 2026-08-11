# Handoff: Redesenho do CRM Yuri Fotos

## Visão geral
Redesenho de todas as telas principais do CRM (app de página única em `index.html`, repo `yurisb-lab/crm`, branch `main`).
Objetivos: reduzir cliques nas tarefas frequentes, melhorar hierarquia visual, reorganizar a navegação,
aumentar a densidade útil das listas e tornar o mobile realmente usável.

O padrão central do redesenho é **lista + painel lateral de detalhe**: em Clientes, Eventos e Negociações
a lista nunca desaparece; o detalhe abre num painel de 360px à direita. Isso substitui o fluxo atual de
"clicar → nova página → voltar".

## Sobre os arquivos de design
Os arquivos deste pacote são **referências visuais feitas em HTML** — protótipos que mostram
aparência e comportamento pretendidos, **não código para copiar e colar**.
A tarefa é **recriar esses layouts dentro do `index.html` existente**, usando as variáveis CSS,
classes (`.card`, `.stat-card`, `.badge`, `.pill`) e o padrão de funções `render*()` que já existem no arquivo.
Nada de bibliotecas novas, nada de build step: o app é um único HTML com JS vanilla e template strings.

## Fidelidade
**Alta fidelidade.** Cores, tipografia, espaçamentos e textos dos mocks são finais.
Reproduza os valores como estão, mas **sempre via variáveis CSS existentes** quando houver equivalente
(a tabela de tokens abaixo faz o mapeamento hex → variável).

---

## Tokens de design

Já existem em `index.html` (`:root`) — use-os, não escreva hex solto:

| Variável | Valor (tema escuro) | Uso no redesenho |
|---|---|---|
| `--bg` | `#0f0d0b` | fundo da página |
| `--surface` | `#1a1611` | cards, linhas de tabela, inputs |
| `--surface-2` | `#221b13` | linha selecionada, botão secundário, avisos |
| `--border` | `#3a3226` | divisórias internas |
| `--border-solid` | `#33291c` | borda de card (0.5px) |
| `--text` | `#f2ede4` | texto principal |
| `--muted` | `#a8a196` | texto secundário |
| `--muted-2` | `#655f56` | metadados, labels, ícones inativos |
| `--amber` | `#c98a3f` | botão primário (texto `#181008`), acento ativo |
| `--amber-text` | `#e7b878` | números destacados, links, ícones ativos |
| `--amber-dim` | `#c98a3f1f` | fundo de item de nav ativo, chip ativo, botão fantasma |
| `--accent-2` / `--accent-2-dim` | `#8a6fb0` / `#8a6fb01f` | badge "Editando" |
| `--radius` | `10px` | cards |

Cores de estado usadas nos mocks (verifique se já existem como `--green` / `--danger` / `--terracotta` e reutilize):
verde `#8bc27a` + fundo `#8bc27a1f` (ok/quitado/fiel), vermelho suave `#d9847e` + fundo `#d9847e1f`
(atrasado, esfriando, saldo aberto).

**Tipografia** — como já está no app: `Inter` no corpo, `Fraunces` em `h1,h2,h3,.serif` e em números grandes.
Escala usada: título de página 28px/500; título de painel 22px Fraunces; número grande 22–26px Fraunces;
corpo 14–15px; secundário 12.5–13px; label de tabela 11px uppercase letter-spacing .06em peso 700.

**Espaçamento**: raios 7px (botão/chip), 8–9px (input, item de lista), 10–11px (card); gaps 6/8/10/12/16/20px;
padding de card 12–16px; padding de conteúdo de página 32px; painel lateral 28px 24px.

---

## Navegação (aplica-se a todas as telas)

A sidebar passa a ter **grupos com rótulo** em vez de uma lista plana. Rótulo: 10px, uppercase,
letter-spacing .08em, `--muted-2`, padding `0 10px`, `margin:16px 0 6px`.

- **Visão geral** — Dashboard, Agenda
- **Captação** — Leads, Negociações
- **Clientes** — Clientes, Aniversariantes
- **Eventos** — Eventos
- **Catálogo** — Produtos
- (rodapé, separado por `border-top:1px solid`) Configurações

Item de nav: `display:flex; gap:10px; padding:9px 10px; border-radius:7px; font-size:14px`,
cor `--muted`; ativo → `background:var(--amber-dim); color:var(--amber-text); font-weight:600`.
Largura da sidebar: 240px, `background:#17130f`, `border-right:1px solid var(--border-solid)`.

**Mobile**: tab bar fixa no rodapé com 5 itens — Início, Agenda, Pipeline, Clientes, Mais.
`background:#17130f`, `border-top:1px solid`, `padding:10px 8px 26px` (safe area),
ícone 20px + label 10px, ativo em `--amber-text`. Tudo que não couber nos 4 primeiros vai no "Mais".
Alvos de toque nunca abaixo de 44px de altura.

---

## Telas

### 1. Clientes (`renderCollectionPage` / `renderCollectionList` / `renderViewCliente`)

**Objetivo**: encontrar um cliente e agir (WhatsApp, novo evento) sem sair da lista.

**Layout desktop**: sidebar 240px | conteúdo flexível (padding `32px 28px 32px 32px`) | painel 360px fixo.

Cabeçalho: título "Clientes" 28px/500 + subtítulo `--muted` 13px ("148 no total · 12 novos em agosto").
À direita, botão primário "Novo cliente" (`--amber`, texto `#181008`, `padding:11px 20px`, radius 8px, ícone +).

Barra de filtros (gap 10px, abaixo do cabeçalho): campo de busca em `flex:1`
("Buscar por nome, telefone ou cidade", ícone lupa, cor `--muted-2`) + dois filtros
("Relacionamento", "Cidade") como botões `--surface` com borda 0.5px.

Tabela num card `--surface` radius 10px overflow hidden.
Grid: `2fr 1.55fr 1fr 0.9fr 96px`, gap 12px, padding de célula `14px 18px`.
Colunas: **Cliente** (nome 14.5px/600 + linha `--muted-2` 12px "Cidade · telefone"),
**Relacionamento** (badge), **Último contato** (texto relativo: "há 6 dias", "ontem"),
**Total gasto** (13.5px/600), **ações** (alinhadas à direita).

Badges de relacionamento — pílula `padding:3px 9px; border-radius:20px; font-size:11px; font-weight:600; white-space:nowrap`:
- Fiel · N eventos → verde
- Em negociação → âmbar
- Esfriando · N meses → vermelho suave
- Primeiro evento → `--border-solid` com texto `--muted`

**Ações na linha**: dois botões-ícone 28×28, radius 7px, fundo `--amber-dim`, ícone `--amber-text`
(WhatsApp, câmera+ = novo evento). Aparecem **no hover** da linha e sempre na linha selecionada.
Nada de menu "…" escondendo ações frequentes.

Linha selecionada: `background:var(--surface-2)`.

**Painel de detalhe** (360px, `background:#17130f`, `border-left:1px solid`, gap 20px entre blocos):
1. Nome em Fraunces 22px + "Cliente desde março de 2023" 12.5px `--muted`; `×` de fechar à direita.
2. Duas ações lado a lado: "WhatsApp" (primário) e "Novo evento" (secundário: `--surface`, borda, texto `--amber-text`).
3. Dois stat cards (grid 1fr 1fr): "Total gasto" (valor em Fraunces 22px `--amber-text`) e "Eventos" (contagem).
4. **Histórico**: label uppercase 11px + lista de itens (ícone 26×26 radius 7 + título 13px + "data · status" 11.5px).
   Evento futuro usa ícone em `--amber-dim`/`--amber-text`; passados em `--border-solid`/`--muted`.
5. **Anotações**: card com texto 13px line-height 1.55 `--muted`.

**Mobile**: título + contagem, busca, chips de filtro roláveis (Todos / Fiéis / Esfriando),
lista de cards (nome 15px/600, "Cidade · último contato" 12px, badge à direita).
O **card selecionado/primeiro expande** mostrando os dois botões de ação em largura total (padding 9–11px).
Tocar num card abre o detalhe como sheet de tela cheia (mesmo conteúdo do painel desktop).

### 2. Eventos (`renderEventosPage` / `renderEventosList` / `renderViewEvento`)

**Objetivo**: saber em que etapa da produção cada evento está e quanto falta receber.

Cabeçalho: "Eventos" + "6 em agosto · 2 com saldo aberto"; botão "Novo evento".

Filtros como chips-contadores (pílula `padding:8px 14px; border-radius:20px`, ativo em `--amber-dim`):
Todos 6 · Contratado 2 · Editando 3 · Entregue 1.

Tabela grid `2fr 1.4fr 1.1fr 0.9fr`: **Evento** (nome + "local · cidade"), **Etapa** (badge),
**Data**, **Saldo** — saldo aberto em `#d9847e`, quitado em `#8bc27a` com a palavra "quitado" (não R$ 0).

Badges de etapa: Contratado → âmbar; Editando → `--accent-2`; Entregue → verde.

**Painel de detalhe** — o diferencial desta tela é o **stepper vertical de produção**:
Contratado → Fotografado → Editando → Entregue.
Etapa concluída: círculo 22px preenchido `#8bc27a` com check, texto `--muted`.
Etapa atual: círculo com `border:2px solid var(--amber)` e fundo `--amber-dim`; texto `--amber-text` peso 600,
com progresso quando existir ("Editando · 240 de 400").
Etapa futura: círculo com borda `--border-solid`, texto `--muted-2`.
Conectores: barra 2px, `margin-left:10px`, altura 14px, colorida até a etapa atual.
Abaixo, botão primário de avanço com o nome da próxima ação ("Marcar como entregue").

Depois: dois stat cards ("Contrato", "Saldo aberto" em `#d9847e`);
bloco **Pagamentos** (linhas título + "pago em MM/AAAA" / "vence na entrega", valor à direita colorido por estado)
com botão secundário "Registrar pagamento";
bloco **Cliente** com nome, telefone e botão-ícone de WhatsApp.

### 3. Negociações (`renderNegociacoesPage` / `renderPilhaNegociacoes` / `renderViewNegociacao`)

**Objetivo**: ver o funil inteiro e agir na negociação parada.

Cabeçalho: "Negociações" + "9 abertas · R$ 31.400 em jogo"; botão "Nova".

**Desktop**: funil em 3 colunas (`grid-template-columns:1fr 1fr 1fr`, gap 12px), sem scroll horizontal.
Cabeçalho de coluna **empilhado** (`flex-direction:column; align-items:flex-start; gap:2px`) para não quebrar
em telas estreitas: nome da etapa + contagem (12.5px, uppercase, peso 700, `--muted`) e, abaixo,
o total da coluna (12px, `--muted-2`, `white-space:nowrap`).
Etapas: Primeiro contato · Orçamento enviado · Negociando.

Card do funil: `--surface`, borda 0.5px, radius 10px, padding 13px — nome 14px/600,
"tipo · data" 12px `--muted-2`, valor 13px `--amber-text`.
Card **em atenção** ganha `background:var(--surface-2); border:0.5px solid var(--amber)` e uma linha
final 11.5px em `#d9847e` com o motivo ("sem resposta há 4 dias").
Card selecionado usa o mesmo destaque.

**Painel de detalhe**:
1. Nome Fraunces 22px + "tipo · mês do evento"; `×`.
2. **Faixa de alerta** quando parado: fundo `#d9847e14`, borda `0.5px solid #d9847e4d`, radius 10px,
   texto 13px `#e0a7a2` com o diagnóstico e a sugestão.
3. Ações: "WhatsApp" (primário) + "Gerar contrato" (secundário).
4. **Etapa** como segmented control de 4 posições em largura total (Contato / Orçamento / Negociando / Fechado);
   ativo com `background:var(--amber-dim); border:0.5px solid var(--amber); color:var(--amber-text)`.
   Mover de etapa é 1 clique, sem drag e sem modal.
5. Dois cards: "Valor proposto" (Fraunces 22px `--amber-text`) e "Pacote" (nome do produto).
6. **Histórico de contato**: itens com descrição 13px + data 11.5px `--muted-2`; botão secundário "Registrar contato".

**Mobile**: manter a versão em **abas** já validada (uma etapa por vez, chips de etapa no topo com contagem),
não scroll horizontal de colunas.

### 4. Produtos (`renderProdutosPage` / `renderPilhaProdutos` / `renderViewProduto`)

Catálogo em **cartões**, não tabela — um pacote é um preço, não uma linha.
Grid 2 colunas (1 no mobile), gap 12px. Cada cartão `--surface`, borda 0.5px, radius 10px, padding 16px:
- nome 15px/600 + ícone "…" `--muted-2` no canto
- preço em Fraunces 26px `--amber-text` (`margin:8px 0 10px`)
- o que inclui: 12.5px `--muted` line-height 1.6 ("8h de cobertura · 400 fotos tratadas · álbum 30×30")
- rodapé separado por `border-top:1px solid var(--border)`, `padding-top:10px`, 12px `#8bc27a`:
  **"12 vendas em 2026 · R$ 54.000"** — é o dado que diz se vale manter o pacote

Último tile do grid: **"Adicionar pacote"** — `border:1px dashed var(--border-solid)`, fundo `--bg`,
ícone + 20px e label 13px, centralizado, cor `--muted-2`.

Pacotes sem venda recente não somem: faixa `--surface-2` no fim da lista —
"Pacote arquivado: **Mini ensaio 20 min** — sem vendas desde 2025."

### 5. Configurações (`renderConfiguracoes`)

Deixa de ser página única e longa e passa a ter **abas**: Negócio · Funil · Mensagens · Conta.
Aba: `padding:9px 14px; font-size:13.5px`; ativa com `color:var(--amber-text)` e
`border-bottom:2px solid var(--amber)`; a régua de abas tem `border-bottom:1px solid var(--border)`.

Os campos que **mudam o comportamento do app** vão para o topo da aba Negócio — começando por
"Meta de faturamento mensal" (input com o valor em 15px/600), depois "Nome do estúdio" e
"WhatsApp de contato" em grid 1fr 1fr.

Toggles como linha de card (`--surface`, borda, radius 9px, padding 14px): título 14px +
explicação 12px `--muted-2` à esquerda; switch 42×24 radius 20px à direita
(ligado: `background:var(--amber)` com bolinha 20px `#181008` à direita;
desligado: `--border-solid` com bolinha `--muted-2` à esquerda).
Exemplos de conteúdo: "Avisar sobre leads parados — Depois de 7 dias sem contato" (ligado);
"Lembrar de pedir feedback — 3 dias após a entrega do evento" (desligado).

**Salvamento automático**: sem botão "Salvar". Confirmação discreta no fim do formulário —
12.5px `#8bc27a` com ícone de check: "Alterações salvas automaticamente".

---

## Interações e comportamento

- **Seleção na lista**: clicar numa linha/card seleciona (`--surface-2`) e abre o painel; o painel substitui a navegação para página de detalhe. `Esc` ou `×` fecha.
- **Hover de linha**: fundo `--surface-2` e revelação dos botões-ícone de ação. Transições curtas (120–150ms, ease-out) apenas em `background` e `opacity`.
- **Ações de 1 clique** que hoje exigem navegação: WhatsApp, novo evento a partir do cliente, avançar etapa (evento e negociação), registrar pagamento, registrar contato, adiar contato.
- **Estado vazio**: reutilizar `.empty-state` existente — título em `.serif` + uma linha de orientação com a ação sugerida ("Tente outro filtro ou cadastre um novo evento"). Nunca uma área em branco.
- **Estado de carregamento**: skeletons no lugar do conteúdo (blocos `--surface-2` com pulse de 1.2s), mantendo a altura das linhas para não haver salto de layout. Não usar spinner de página cheia.
- **Erro**: faixa no padrão da faixa de alerta de Negociações (`#d9847e14` / borda `#d9847e4d` / texto `#e0a7a2`) com a mensagem e uma ação de repetir.
- **Feedback de ação**: toast discreto no rodapé (`--surface-2`, borda, radius 10px) por ~2.5s. Mudanças de etapa e pagamentos atualizam os contadores do cabeçalho na hora.
- **Responsivo**: abaixo de ~1100px o painel lateral vira sheet sobreposto; abaixo de ~760px, layout mobile completo (tab bar, cards, filtros em chips). Tabelas nunca em scroll horizontal no mobile — viram cards.

## Estado necessário
- `selectedId` + `selectedCollection` — quem está aberto no painel.
- `panelOpen` (desktop: painel; mobile: sheet).
- `filters` por tela: busca (texto), relacionamento, cidade (Clientes); etapa (Eventos); etapa ativa da aba mobile (Negociações).
- `activeSettingsTab` — Negócio | Funil | Mensagens | Conta.
- Derivados dos dados existentes, não campos novos: último contato, dias sem resposta, saldo aberto, vendas por pacote no ano, motivo de "contatar agora".

## Assets
Nenhum novo. Ícones continuam os do Tabler Icons (`<i class="ti ti-...">`) já usados no app:
`ti-layout-dashboard, ti-calendar, ti-user-plus, ti-affiliate, ti-users, ti-cake, ti-camera, ti-camera-plus,
ti-package, ti-settings, ti-search, ti-filter, ti-map-pin, ti-plus, ti-brand-whatsapp, ti-check, ti-x, ti-dots, ti-list, ti-menu-2`.
Fontes: Fraunces + Inter, já carregadas.

## Arquivos deste pacote
- `CRM Redesign.dc.html` — todos os mocks (desktop e mobile), organizados por turno; abra no navegador.
  Os mocks desktop estão dentro de uma moldura de navegador e os mobile dentro de uma moldura de iPhone.
- `browser-window.jsx`, `ios-frame.jsx`, `support.js` — apenas as molduras/runtime do protótipo. **Não** fazem parte do design a implementar.

## Ordem sugerida de implementação
1. Navegação agrupada (sidebar) + tab bar mobile — afeta todas as telas.
2. Padrão lista + painel lateral, implementado uma vez e reutilizado.
3. Clientes → Eventos → Negociações → Produtos → Configurações.
4. Estados vazio / carregando / erro e toasts.
