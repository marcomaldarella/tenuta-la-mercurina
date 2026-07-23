// Path esatto del glifo ↘ (U+2198) estratto da DM Sans con fontTools —
// il carattere non è nel subset latin servito da next/font, quindi va inlined.
export default function Arrow({ size = '0.6em' }: { size?: string }) {
  return (
    <svg
      viewBox="40 66 549 550"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        verticalAlign: '0.03em',
      }}
    >
      <path
        d="M103 611 514 200V616H589V97L557 66H40V141H462L47 555Z"
        transform="matrix(1 0 0 -1 0 682)"
        fill="currentColor"
      />
    </svg>
  )
}
