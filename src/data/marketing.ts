import type { Unit } from '../types'

export const brandLine = 'O Nordeste que se pede e se retira na loja.'

export const promises = [
  {
    title: 'Cardápio da loja',
    text: 'Só o que aquela unidade tem hoje. Sem item fantasma.',
  },
  {
    title: 'Retirada no horário',
    text: 'Peça agora e busque quando ainda estiver quente.',
  },
  {
    title: 'Receita com origem',
    text: 'Coalho, cajá, macaxeira e o São João de Caruaru.',
  },
]

export const loyaltyPitch = {
  kicker: 'Programa Raízes',
  title: 'Pontos em cada retirada',
  text: 'Desconto que cresce com a casa: 5% na raiz nova, 8% no frequentador, 12% na casa cheia. Só com o seu consentimento.',
}

export const loyaltyTiers = [
  { name: 'Raiz nova', points: 'Até 119 pts', perk: '5% na próxima retirada' },
  { name: 'Frequentador', points: '120 pts', perk: '8% de desconto progressivo' },
  { name: 'Casa cheia', points: '300 pts', perk: '12% e prioridade de campanha' },
]

export const unitPitch: Record<string, string> = {
  'recife-casa-forte': 'Onde a rede nasceu. Cozinha completa e o bolo da Dona Francisca.',
  'caruaru-centro': 'Capital do forró. Pamonha e canjica enquanto o São João estiver na mesa.',
  'sp-vila-mariana': 'O Nordeste no intervalo. Linha rápida, mesmo sabor.',
}

export type Campaign = {
  kicker: string
  title: string
  text: string
  cta: string
  path: '/cardapio' | '/unidades' | '/fidelidade'
  productId?: string
}

export function campaignFor(unit?: Unit): Campaign {
  if (unit?.seasonalEnabled) {
    return {
      kicker: 'Campanha sazonal',
      title: 'São João na mesa',
      text: 'Pamonha de milho e canjica cremosa só em Caruaru, no calendário junino da unidade.',
      cta: 'Ver o cardápio junino',
      path: '/cardapio',
      productId: 'pamonha',
    }
  }
  if (unit?.id === 'sp-vila-mariana') {
    return {
      kicker: 'Nordeste em São Paulo',
      title: 'Linha rápida, mesmo sabor',
      text: 'Tapioca de coalho, cuscuz com ovo e cajá. O sertão que cabe no horário de Vila Mariana.',
      cta: 'Pedir a linha rápida',
      path: '/cardapio',
      productId: 'tapioca-coalho',
    }
  }
  if (unit?.id === 'recife-casa-forte') {
    return {
      kicker: 'Unidade-mãe',
      title: 'A receita que começou a rede',
      text: 'Café da manhã sertanejo e o bolo de macaxeira da Dona Francisca. Referência da franquia.',
      cta: 'Pedir o café sertanejo',
      path: '/cardapio',
      productId: 'combo-sertanejo',
    }
  }
  return {
    kicker: 'Campanha da rede',
    title: 'Café da manhã sertanejo',
    text: 'Cuscuz, ovo, queijo coalho, suco da fruta e café passado. O combo que leva o sertão para a cidade.',
    cta: 'Escolher a unidade',
    path: '/unidades',
    productId: 'combo-sertanejo',
  }
}
