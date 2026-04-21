import { AppContext } from '@/components/ContextProvider'
import { useContext, useEffect } from 'react'

import { useRouter } from 'next/router'

import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'

function compareDates(a, b) {
  // descending
  if (new Date(a.date) < new Date(b.date)) {
    return 1
  }
  if (new Date(a.date) > new Date(b.date)) {
    return -1
  }
  return 0
}

export async function getStaticProps() {
  const allPosts = await getAllFilesFrontMatter('blog')
  const unsortedPosts = allPosts.filter(function (post) {
    return !post.category[0].toLowerCase().includes('snippet')
  })
  const posts = unsortedPosts.sort(compareDates)
  posts.map((post, index) => {
    post['indexAllPosts'] = index
  })
  return { props: { posts } }
}

export default function Blog({ posts }) {
  const router = useRouter()
  const [_, dispatch] = useContext(AppContext)

  useEffect(() => {
    dispatch({ type: 'KEYBOARD_MODE_OFF' })
  }, [router, dispatch])

  return (
    <>
      <PageSEO title={`Blog - ${siteMetadata.author}`} description={siteMetadata.description} />
      <ListLayout posts={posts} title="Blog Posts" />
    </>
  )
}
