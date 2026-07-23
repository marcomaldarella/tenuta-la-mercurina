export const metadata = {
  title: 'Sanity Studio — Tenuta La Mercurina',
  robots: { index: false },
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
