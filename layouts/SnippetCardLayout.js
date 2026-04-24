export default function SnippetCardLayout({ children }) {
  return (
    <article className="snippetCard">
      <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
        <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
          <div id="content" className="prose dark:prose-invert max-w-none overflow-y-auto pb-3">
            {children}
          </div>
        </div>
      </div>
    </article>
  )
}
