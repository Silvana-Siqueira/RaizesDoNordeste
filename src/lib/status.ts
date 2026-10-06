import type { OrderStatus } from '../types'

export const statusLabel = (status: OrderStatus) =>
  ({
    pagamento_pendente: 'Aguardando o gateway',
    pagamento_negado: 'Pagamento recusado',
    recebido: 'Pedido recebido',
    em_preparo: 'Na cozinha',
    pronto: 'Pronto para retirar',
    entregue: 'Entregue',
    cancelado: 'Cancelado',
  })[status]

export const statusFlow: OrderStatus[] = ['recebido', 'em_preparo', 'pronto', 'entregue']
