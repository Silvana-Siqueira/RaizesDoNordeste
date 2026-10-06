import type { Product, Unit, UnitOverride } from '../types'

export const products: Product[] = [
  {
    id: 'tapioca-coalho',
    name: 'Tapioca de queijo coalho',
    description: 'Massa sequinha, queijo coalho derretido e um fio de manteiga de garrafa.',
    category: 'Tapiocas',
    price: 16.9,
    tags: ['salgada', 'rápida'],
    art: 'coalho',
  },
  {
    id: 'tapioca-coco',
    name: 'Tapioca de coco',
    description: 'Coco ralado fresco e leite condensado, no ponto da primeira unidade de Recife.',
    category: 'Tapiocas',
    price: 15.5,
    tags: ['doce'],
    art: 'coco',
  },
  {
    id: 'cuscuz-sol',
    name: 'Cuscuz de carne de sol',
    description: 'Cuscuz de milho recheado, carne de sol desfiada e queijo coalho.',
    category: 'Cuscuz',
    price: 24.9,
    tags: ['recheado'],
    needsFullKitchen: true,
    art: 'sol',
  },
  {
    id: 'cuscuz-ovo',
    name: 'Cuscuz com ovo',
    description: 'Cuscuz quente, ovo frito e manteiga de garrafa. O café da manhã de todo dia.',
    category: 'Cuscuz',
    price: 18.5,
    tags: ['clássico'],
    art: 'ovo',
  },
  {
    id: 'bolo-macaxeira',
    name: 'Bolo de macaxeira',
    description: 'Fatia alta, úmida e assada no dia. Receita da Dona Francisca.',
    category: 'Forno',
    price: 9.9,
    tags: ['casa'],
    needsFullKitchen: true,
    art: 'bolo',
  },
  {
    id: 'combo-sertanejo',
    name: 'Café da manhã sertanejo',
    description: 'Cuscuz, ovo, queijo coalho, suco da fruta e café passado.',
    category: 'Combos',
    price: 32.0,
    tags: ['completo'],
    needsFullKitchen: true,
    art: 'combo',
  },
  {
    id: 'suco-caja',
    name: 'Suco de cajá',
    description: 'Polpa da fruta, gelo e o azedinho que acorda a manhã.',
    category: 'Bebidas',
    price: 9.5,
    tags: ['regional'],
    art: 'caja',
  },
  {
    id: 'suco-umbu',
    name: 'Suco de umbu',
    description: 'Umbu batido na hora. Disponível conforme a safra da unidade.',
    category: 'Bebidas',
    price: 9.5,
    tags: ['safra'],
    art: 'umbu',
  },
  {
    id: 'cafe-passado',
    name: 'Café passado',
    description: 'Coado na hora, no ponto forte do sertão.',
    category: 'Bebidas',
    price: 5.5,
    tags: ['quente'],
    art: 'cafe',
  },
  {
    id: 'pamonha',
    name: 'Pamonha de milho',
    description: 'Só no calendário junino da unidade. Milho fresco, palha e manteiga.',
    category: 'São João',
    price: 12.0,
    tags: ['sazonal'],
    seasonal: true,
    seasonLabel: 'São João',
    needsFullKitchen: true,
    art: 'pamonha',
  },
  {
    id: 'canjica',
    name: 'Canjica cremosa',
    description: 'Milho macerado, leite e canela. Prato de festa junina.',
    category: 'São João',
    price: 11.0,
    tags: ['sazonal'],
    seasonal: true,
    seasonLabel: 'São João',
    art: 'canjica',
  },
]

export const units: Unit[] = [
  {
    id: 'recife-casa-forte',
    name: 'Casa Forte',
    city: 'Recife',
    state: 'PE',
    address: 'Rua da Tradição, 120 — Casa Forte',
    hours: '06h às 20h',
    kitchen: 'completa',
    seasonalEnabled: false,
    productIds: [
      'tapioca-coalho',
      'tapioca-coco',
      'cuscuz-sol',
      'cuscuz-ovo',
      'bolo-macaxeira',
      'combo-sertanejo',
      'suco-caja',
      'suco-umbu',
      'cafe-passado',
    ],
    note: 'Unidade-mãe. Cozinha completa e cardápio de referência da franquia.',
  },
  {
    id: 'caruaru-centro',
    name: 'Centro',
    city: 'Caruaru',
    state: 'PE',
    address: 'Av. do Forró, 45 — Centro',
    hours: '06h às 21h',
    kitchen: 'completa',
    seasonalEnabled: true,
    productIds: [
      'tapioca-coalho',
      'tapioca-coco',
      'cuscuz-sol',
      'cuscuz-ovo',
      'bolo-macaxeira',
      'combo-sertanejo',
      'suco-caja',
      'cafe-passado',
      'pamonha',
      'canjica',
    ],
    note: 'Interior com calendário junino estendido. Receitas com leve variação regional.',
  },
  {
    id: 'sp-vila-mariana',
    name: 'Vila Mariana',
    city: 'São Paulo',
    state: 'SP',
    address: 'Rua Domingos de Morais, 890 — Vila Mariana',
    hours: '07h às 19h',
    kitchen: 'reduzida',
    seasonalEnabled: false,
    productIds: ['tapioca-coalho', 'tapioca-coco', 'cuscuz-ovo', 'suco-caja', 'cafe-passado'],
    note: 'Formato reduzido: sem forno completo. Só itens de linha rápida.',
  },
]

export const unitOverrides: Record<string, Record<string, UnitOverride>> = {
  'caruaru-centro': {
    'tapioca-coco': {
      name: 'Tapioca de coco queimado',
      description: 'Coco tostado da zona da mata e leite condensado. Variação de Caruaru.',
    },
  },
}

export function money(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function getProduct(id: string) {
  return products.find((item) => item.id === id)
}

export function getUnit(id: string) {
  return units.find((item) => item.id === id)
}

export function resolveProduct(productId: string, unitId: string) {
  const base = getProduct(productId)
  if (!base) return undefined
  const override = unitOverrides[unitId]?.[productId]
  return { ...base, ...override }
}

export function productAvailable(product: Product, unit: Unit, stock: number) {
  if (!unit.productIds.includes(product.id)) return false
  if (product.seasonal && !unit.seasonalEnabled) return false
  if (product.needsFullKitchen && unit.kitchen === 'reduzida') return false
  return stock > 0
}

export const pickupSlots = [
  { id: 'agora', label: 'Retirar agora' },
  { id: '15', label: 'Em 15 minutos' },
  { id: '30', label: 'Em 30 minutos' },
  { id: '60', label: 'Em 1 hora' },
]
