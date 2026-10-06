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
