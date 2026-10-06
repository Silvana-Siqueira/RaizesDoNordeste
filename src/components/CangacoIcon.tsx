import { useId } from 'react'

type Props = { size?: number }

export function CangacoIcon({ size = 64 }: Props) {
  const id = useId().replace(/:/g, '')

  return (
    <svg
      viewBox="0 0 240 250"
      width={size}
      height={size}
      aria-hidden="true"
      className="cangaco-icon"
    >
      <defs>
        <mask id={id}>
          <rect width="240" height="250" fill="white" />
          <g fill="black">
            <MedallionCuts cx={120} cy={68} r={30} />
            <MedallionCuts cx={68} cy={90} r={23} />
            <MedallionCuts cx={172} cy={90} r={23} />
            <path d="M74 124c14-24 30-34 46-34s32 10 46 34c-14 10-32 14-46 14s-32-4-46-14Z" />
          </g>
        </mask>
      </defs>
      <g mask={`url(#${id})`}>
        <path
          fill="currentColor"
          d="M28 138c6-82 48-112 92-112s86 30 92 112c-20 14-48 6-92-12-44 18-72 26-92 12Z"
        />
      </g>
      <circle cx="84" cy="122" r="4.2" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="98" cy="114" r="5.6" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="114" cy="110" r="6.6" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="130" cy="110" r="6.6" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="146" cy="114" r="5.6" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="158" cy="122" r="4.2" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        d="M34 142c-12 26 0 50-8 76M34 142c14 24 4 56 10 82M206 142c12 26 0 50 8 76M206 142c-14 24-4 56-10 82"
      />
    </svg>
  )
}

function MedallionCuts({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const petal = r * 0.42
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} />
      <circle cx={cx} cy={cy} r={r - 5.5} fill="white" />
      <ellipse cx={cx} cy={cy - petal * 0.55} rx={petal * 0.72} ry={petal} />
      <ellipse cx={cx} cy={cy + petal * 0.55} rx={petal * 0.72} ry={petal} />
      <ellipse cx={cx - petal * 0.55} cy={cy} rx={petal} ry={petal * 0.72} />
      <ellipse cx={cx + petal * 0.55} cy={cy} rx={petal} ry={petal * 0.72} />
    </g>
  )
}
