import { PageSEO } from '@/components/SEO'

export default function AuthorLayout({ children, frontMatter }) {
  const { name } = frontMatter

  return (
    <>
      <PageSEO title={`Experience - ${name}`} description={`Experience - ${name}`} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1
            id="pageTitle"
            className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100"
          >
            Experience
          </h1>
        </div>
        <div className="max-w-none">
          <div id="pageContent" className="prose dark:prose-dark pt-8 pb-8">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
