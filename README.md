# Raízes do Nordeste

Protótipo **front-end** do Projeto Multidisciplinar (UNINTER, 2026). Simula a jornada omnichannel da rede: o cliente pede e retira, a loja opera a fila e a franqueadora vê o consolidado — sem misturar dados pessoais em relatório.

Stack: Vite, React 19, TypeScript e React Router. Estado e pedidos ficam no navegador (`localStorage`). Não há backend.

## Cinco canais

| Canal | Rota | O que cobre |
| --- | --- | --- |
| **Aplicativo** | `/app` | Unidade, cardápio da loja, sacola, pagamento, status da retirada, fidelidade com LGPD |
| **Site** | `/site` | A mesma jornada no computador ou notebook, com layout largo e menu no topo |
| **Totem** | `/totem` | Autoatendimento com alvos grandes, cardápio da unidade e retirada no balcão |
| **Balcão** | `/balcao` | Fila da cozinha, avanço de status, desconto e cancelamento com auditoria |
| **Matriz** | `/matriz` | Login da franquia, KPIs, mix de canal/pagamento, estoque no limite, pedidos e trilha de auditoria |

Três lojas de demonstração:

- **Recife · Casa Forte** — cozinha completa
- **Caruaru · Centro** — calendário de São João
- **São Paulo · Vila Mariana** — formato reduzido

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (em geral `http://localhost:5173`).

```bash
npm run build    # checagem TypeScript + build de produção
npm run preview  # ver o build localmente
```

## Acesso da matriz

Tela protegida em `/matriz`. Credenciais do protótipo:

- **E-mail:** `matriz@raizesdonordeste.com`
- **Senha:** `raizes2026`

O painel já abre com um cenário de pedidos, estoque no limite e eventos de auditoria, para a banca não encontrar a matriz vazia.

## Regras de negócio visíveis

- Cardápio e estoque mudam por unidade
- O sistema só **solicita** a cobrança; o gateway confirma ou recusa (checkbox *Simular negativa do gateway* no checkout)
- Fidelidade exige consentimento explícito e pode ser revogada
- A matriz mostra volume anonimizado; nome e e-mail do programa ficam no canal do cliente
- Cancelar pedido ou aplicar desconto no balcão gera trilha de auditoria

## Publicação

O professor precisa de um **repositório público** e de um **link do site no ar**. Sugestão: [Vercel](https://vercel.com) apontando para este projeto. O arquivo `vercel.json` já redireciona as rotas do React Router para o `index.html`.

Sem acesso público na correção, o item zera.

## Evidências para o PDF

Percorra e tire print (também no celular):

1. Capa com os cinco canais
2. App: unidade → cardápio → sacola → pagamento (sucesso **e** negativa)
3. Site: mesmo fluxo no layout de computador
4. Totem: tela de toque e um pedido
5. Balcão: status, 10% de desconto e cancelamento
6. Matriz: login, KPIs, unidades, estoque e auditoria
7. Fidelidade: consentir e revogar

Declare o uso de inteligência artificial na conclusão do PDF, como pede a disciplina.
