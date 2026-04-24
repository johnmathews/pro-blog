import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'

import { useRouter } from 'next/router'

import { useContext } from 'react'
import { AppContext, placeholderPostMetaData } from './ContextProvider'

import Autocomplete from '@/components/AutoComplete'
import '@algolia/autocomplete-theme-classic'

import Category from '@/components/Category'

const LayoutWrapper = ({ children }) => {
  const router = useRouter()
  const [state, dispatch] = useContext(AppContext)

  const postMetaData = state.blogPostMeta || placeholderPostMetaData

  var bottomSection
  if (router.query.slug !== undefined) {
    bottomSection = (
      <div id="sidebarBottomSection" className="hidden items-center text-base leading-5 md:block">
        <div
          id="sideBarDivider"
          className="my-8 border-t-4 border-double border-gray-800 2xl:my-10 dark:border-gray-100"
        ></div>

        <div className="md:block">
          <div className="flex flex-col">
            <div className="text-md mb-3">
              <dt className="mb-1 flex text-left text-gray-900 md:flex-col dark:text-gray-100">
                Category:
              </dt>
              <dd className="flex text-left text-gray-900 hover:underline md:flex-col dark:text-gray-100">
                {postMetaData.category.map((cat) => {
                  return <Category key={cat} text={cat} />
                })}
              </dd>
            </div>

            {(postMetaData.next || postMetaData.prev) && (
              <div className="mt-3 mb-3 flex w-44 flex-col justify-between text-gray-900 lg:block dark:text-gray-100">
                {postMetaData.prev && (
                  <div className="mb-3">
                    <div className="mb-1"> Previous: </div>
                    <div className="line-clamp-2 hover:underline">
                      <Link id="previousPost" href={`/blog/${postMetaData.prev.slug}`}>
                        {postMetaData.prev.title}
                      </Link>
                    </div>
                  </div>
                )}
                {postMetaData.next && (
                  <div className="mb-3">
                    <div className="mb-1"> Next: </div>
                    <div className="line-clamp-2 hover:underline">
                      <Link id="nextPost" href={`/blog/${postMetaData.next.slug}`}>
                        {postMetaData.next.title}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } else {
    bottomSection = null
  }

  return (
    <div
      id="LayoutContainer"
      className="3xl:w-0/12 mx-auto mt-5 px-4 lg:mt-16 lg:px-10 xl:mt-32 xl:w-11/12 xl:px-0 2xl:w-10/12"
    >
      <div id="layoutwrapperInclFooter" className="">
        <div
          id="LayoutWrapperExcFooter"
          className="mx-auto flex flex-col justify-between lg:flex-row"
        >
          <div id="mobileNavWrapper" className="z-50 lg:hidden">
            <MobileNav />
          </div>
          <div id="sidebarOuterWrapper" className="have_a_look_at_css/Tailwind.css">
            <div id="sidebarInnerWrapper" className="text-base leading-5 lg:fixed">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="my-1 flex py-1 text-left text-lg text-gray-900 hover:underline md:flex-col 2xl:my-2 dark:text-gray-100"
                >
                  {link.title}
                </Link>
              ))}

              <div id="autoCompleteComponentWrapper" className="mt-5">
                <Autocomplete />
              </div>
              <div className="mt-2 -ml-2 text-left">
                <ThemeSwitch />
              </div>

              {bottomSection}
            </div>
          </div>
          <main id="mainWrapper" className="flex-auto lg:ml-12 2xl:mr-36 2xl:ml-28">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default LayoutWrapper
