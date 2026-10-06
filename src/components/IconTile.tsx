import {
  CakeSlice,
  Coffee,
  CookingPot,
  CupSoda,
  EggFried,
  Sandwich,
  Soup,
  UtensilsCrossed,
  Wheat,
  type LucideIcon,
} from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  coalho: Sandwich,
  coco: Wheat,
  sol: CookingPot,
  ovo: EggFried,
  bolo: CakeSlice,
  combo: UtensilsCrossed,
  caja: CupSoda,
  umbu: CupSoda,
  cafe: Coffee,
  pamonha: Wheat,
  canjica: Soup,
}

export function IconTile({ art, size = 52 }: { art: string; size?: number }) {
  const Icon = icons[art] ?? UtensilsCrossed
  return (
    <div className={`icon-tile art-${art}`} style={{ width: size, height: size }} aria-hidden="true">
      <Icon size={Math.round(size * 0.44)} strokeWidth={1.6} />
    </div>
  )
}
