import { CangacoIcon } from './CangacoIcon'

type Props = { compact?: boolean; light?: boolean; stacked?: boolean }

export function Logo({ compact, light, stacked }: Props) {
  const size = stacked ? 112 : compact ? 36 : 48

  return (
    <div
      className={`brand ${compact ? 'brand-compact' : ''} ${light ? 'brand-light' : ''} ${stacked ? 'brand-stacked' : ''}`}
    >
      <span className="brand-mark" aria-hidden="true">
        <CangacoIcon size={size} />
      </span>
      <div>
        <strong>Raízes do Nordeste</strong>
        {!compact && <span>Tradição em cada unidade</span>}
      </div>
    </div>
  )
}
