import { AppContext } from '@/components/ContextProvider'
import Link from '@/components/Link'
import { useContext } from 'react'

import formatDate from '@/lib/utils/formatDate'

const PostsInYear = ({ year, posts, filterSnippets = true }) => {
  const [state, _] = useContext(AppContext)
  return posts[year].map((post) => {
    const { slug, date, title, category } = post

    const index = post.indexAllPosts

    if (!filterSnippets || category[0].toLowerCase() !== 'snippet') {
      return (
        <li
          key={slug}
          className={`text-normal mb-5 px-1 hover:underline lg:mb-6 ${
            state.keyboardMode && state.listPosition == index
              ? '-mr-1 -ml-1 rounded-md border-2 border-slate-400 bg-blue-200 px-2 dark:border-slate-300 dark:bg-blue-600'
              : null
          } viewable index-${index}`}
        >
          <div className="flex">
            <div className="flex-auto">
              <div>
                <div className="font-serif text-2xl font-bold">
                  <Link
                    href={`/blog/${slug}`}
                    className={`${state.listPosition == index ? 'selected' : 'notSelected'}`}
                  >
                    {title}
                  </Link>
                </div>
              </div>
            </div>

            <div
              id="dateBox"
              className="hidden flex-none text-right font-serif text-xl leading-6 font-semibold text-gray-600 md:block 2xl:text-2xl dark:text-gray-300"
            >
              <time dateTime={date}>{formatDate(date)}</time>
            </div>
          </div>
        </li>
      )
    } else {
      return null
    }
  })
}

export default PostsInYear
