/* eslint-disable react/display-name */
import { useMemo } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import Image from './Image'
import CustomLink from './Link'
import TOCInline from './TOCInline'
import Pre from './Pre'

import PostLayout from '../layouts/PostLayout'
import ListLayout from '../layouts/ListLayout'
import SnippetLayout from '../layouts/SnippetLayout'
import SnippetCardLayout from '../layouts/SnippetCardLayout'
import AboutPageLayout from '../layouts/AboutPageLayout'
import ExperienceLayout from '../layouts/ExperienceLayout'

const layouts = {
  PostLayout,
  ListLayout,
  SnippetLayout,
  SnippetCardLayout,
  AboutPageLayout,
  ExperienceLayout,
}

export const MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
}

export const MDXLayoutRenderer = ({ layout, mdxSource, ...rest }) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])
  const Layout = layouts[layout]

  return (
    <Layout {...rest}>
      <MDXLayout components={MDXComponents} {...rest} />
    </Layout>
  )
}
