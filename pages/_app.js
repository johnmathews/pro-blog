import '@/css/tailwind.css'
import '@/css/prism.css'
import '@/css/notebook.css'
import '@/css/analytics.css'
import '@/css/algolia.css'
import 'katex/dist/katex.css'

// state management in React and Next.js
// https://www.smashingmagazine.com/2021/08/state-management-nextjs/

import '@fontsource/inter/index.css'

import { ThemeProvider } from 'next-themes'
import Head from 'next/head'

import { useEffect } from 'react'

import siteMetadata from '@/data/siteMetadata'
import { Analytics } from '@vercel/analytics/react'
import LayoutWrapper from '@/components/LayoutWrapper'
import Modal from '@/components/Modal'
import ContextProvider from '@/components/ContextProvider'
import { ClientReload } from '@/components/ClientReload'

import { useRouter } from 'next/router'
import KeyboardShortcuts from '@/components/KeyboardShortcuts'

const isDevelopment = process.env.NODE_ENV === 'development'
const isSocket = process.env.SOCKET

function homeBrewAnalytics(pathname) {
  const url =
    'https://us-central1-johnmathews-website.cloudfunctions.net/page_view_logger?path=' + pathname
  window.navigator.sendBeacon(url)
}

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    homeBrewAnalytics(router.asPath)
  }, [router.asPath])

  const isLandingPage = router.asPath === '/' || router.asPath.startsWith('/?')

  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      {isDevelopment && isSocket && <ClientReload />}
      <Analytics />
      <ContextProvider>
        {isLandingPage ? (
          <Component {...pageProps} />
        ) : (
          <LayoutWrapper>
            <Component {...pageProps} />
          </LayoutWrapper>
        )}
        <Modal />
        <KeyboardShortcuts />
      </ContextProvider>
    </ThemeProvider>
  )
}
