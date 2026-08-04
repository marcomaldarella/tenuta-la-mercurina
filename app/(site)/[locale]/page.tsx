import Hero from '../../../components/Hero'
import SectionRow from '../../../components/SectionRow'
import type { Locale } from '../../../lib/i18n'
import { pick } from '../../../lib/l10n'
import { getPage } from '../../../lib/queries'
import { imageUrls } from '../../../lib/sanity/image'

export const dynamic = 'force-dynamic'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const page = await getPage('home')

  return (
    <main>
      <Hero
        urls={imageUrls(page?.hero?.images)}
        heading={pick(page?.hero?.heading, locale)}
        subheading={pick(page?.hero?.subheading, locale)}
        text={pick(page?.hero?.text, locale)}
      />
      {page?.sections?.map((section, index) => (
        <SectionRow
          key={section._key}
          title={pick(section.title, locale)}
          text={pick(section.text, locale)}
          urls={imageUrls(section.images, 1200)}
          reverse={index % 2 === 1}
          href={
            section.cta === 'page' && section.pageSlug
              ? `/${locale}/${section.pageSlug}`
              : undefined
          }
        />
      ))}
    </main>
  )
}
