import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import { Answer } from '@/components/chat/Answer/Answer'
import { BlogChunk } from '@/types/chat'
import { IconArrowRight, IconExternalLink, IconSearch } from '@tabler/icons-react'
import endent from 'endent'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/router'

function clientEventLogger(pathname: string, eventData: string) {
  const url = `https://us-central1-johnmathews-website.cloudfunctions.net/client-event-logger?path=${pathname}`
  window.navigator.sendBeacon(url, eventData)
}

export default function Chat() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState<string>('')
  const [chunks, setChunks] = useState<BlogChunk[]>([])
  const [answer, setAnswer] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [freshPage, setFreshPage] = useState<boolean>(true)

  const [mode, setMode] = useState<'search' | 'chat'>('chat')
  const [matchCount, setMatchCount] = useState<number>(5)

  const handleSearch = async () => {
    if (!query) {
      alert('Please enter a query.')
      return
    }

    setAnswer('')
    setChunks([])

    setLoading(true)

    const searchResponse = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, matches: matchCount }),
    })

    if (!searchResponse.ok) {
      setLoading(false)
      throw new Error(searchResponse.statusText)
    }

    const results: BlogChunk[] = await searchResponse.json()
    setChunks(results)

    setLoading(false)

    inputRef.current?.focus()

    return results
  }

  const handleAnswer = async () => {
    if (!query) {
      alert('Please enter a query.')
      return
    }

    let eventData = JSON.stringify({
      category: 'chatbot',
      event: 'query',
      details: String(query),
    })
    clientEventLogger(router.asPath, eventData)

    setFreshPage(false)
    setAnswer('')
    setChunks([])

    setLoading(true)

    const searchResponse = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, matches: matchCount }),
    })

    if (!searchResponse.ok) {
      setLoading(false)
      throw new Error(searchResponse.statusText)
    }

    const results: BlogChunk[] = await searchResponse.json()

    setChunks(results)

    const prompt = endent`
            You are helping someone interview John Mathews. You accurately answer queries about John Mathews and the content on his blog. Use the text provided to form your answer, but avoid copying word-for-word. You can support your answers with details or references from any source. Be accurate, helpful, concise, and clear. It is very important that you prioritise information from recent blog posts. Assume you are speaking in a secular context to a professional recruiter or developer. You should promote him. If someone asks "what does john do?" then you should assume they are asking "what does he do professionally?" Use the following passages to provide an answer to the query: "${query}"

    ${results?.map((d: any) => d.content).join('\n\n')}
    `

    const answerResponse = await fetch('/api/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })

    if (!answerResponse.ok) {
      setLoading(false)
      throw new Error(answerResponse.statusText)
    }

    const data = answerResponse.body

    if (!data) {
      return
    }

    setLoading(false)

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      setAnswer((prev) => prev + chunkValue)
    }

    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (mode === 'search') {
        handleSearch()
      } else {
        handleAnswer()
      }
    }
  }

  useEffect(() => {
    if (matchCount > 10) {
      setMatchCount(10)
    } else if (matchCount < 1) {
      setMatchCount(1)
    }
  }, [matchCount])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <>
      <PageSEO title={`Chatbot - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Chatbot
          </h1>
          <p>Ask an AI about me or my blog</p>
          <p className="text-xl">
            Update: Following OpenAI's recent release of custom GPTs, I've created{' '}
            <a
              className="text-blue-600 hover:text-green-600 dark:text-blue-500 dark:hover:text-green-500"
              href="https://chat.openai.com/g/g-13yb89STk-bloggpt"
            >
              BlogGPT
            </a>{' '}
          </p>
        </div>
        <div className="flex h-screen w-full flex-col items-start">
          <div className="w-full">
            <div className="flex h-full w-full flex-col items-center pr-3 pt-4 sm:pt-8">
              <div id="inputWrapper" className="relative mt-4 w-full">
                <IconSearch className="absolute left-1 top-3 h-6 w-10 rounded-full opacity-50 dark:text-gray-800 sm:left-3 sm:top-4 sm:h-8" />

                <input
                  ref={inputRef}
                  className="h-12 w-full rounded-xl border border-zinc-600 pl-11 pr-12 text-gray-800 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 dark:text-gray-800 sm:h-16 sm:py-2 sm:pl-16 sm:pr-16 sm:text-lg"
                  type="text"
                  placeholder="Is John a consultant data scientist?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                <button>
                  <IconArrowRight
                    onClick={mode === 'search' ? handleSearch : handleAnswer}
                    className="absolute right-2 top-2.5 h-7 w-7 rounded-xl bg-green-700 p-1 text-white hover:cursor-pointer hover:bg-green-600 sm:right-3 sm:top-3 sm:h-10 sm:w-10"
                  />
                </button>
              </div>

              {freshPage ? (
                <div className="mt-6 w-full">
                  <div className="text-xl">Things you could ask:</div>
                  <ul className="ml-3 mt-4 list-inside list-disc">
                    <li>What are John's skills?</li>
                    <li>What professional experience does he have?</li>
                    <li>Is John a terrible programmer?</li>
                    <li>Does John enjoy exercise?</li>
                    <li>What are his hobbies?</li>
                  </ul>
                </div>
              ) : null}

              {loading ? (
                <div className="mt-6 w-full">
                  {mode === 'chat' && (
                    <>
                      <div className="text-2xl font-bold">Answer</div>
                      <div className="mt-2 animate-pulse">
                        <div className="h-4 rounded bg-gray-300"></div>
                        <div className="mt-2 h-4 rounded bg-gray-300"></div>
                        <div className="mt-2 h-4 rounded bg-gray-300"></div>
                        <div className="mt-2 h-4 rounded bg-gray-300"></div>
                        <div className="mt-2 h-4 rounded bg-gray-300"></div>
                      </div>
                    </>
                  )}

                  <div className="mt-6 text-2xl font-bold">Passages</div>
                  <div className="mt-2 animate-pulse">
                    <div className="h-4 rounded bg-gray-300"></div>
                    <div className="mt-2 h-4 rounded bg-gray-300"></div>
                    <div className="mt-2 h-4 rounded bg-gray-300"></div>
                    <div className="mt-2 h-4 rounded bg-gray-300"></div>
                    <div className="mt-2 h-4 rounded bg-gray-300"></div>
                  </div>
                </div>
              ) : answer ? (
                <div className="mt-6">
                  <div className="mb-2 text-2xl font-bold">Answer</div>
                  <Answer text={answer} />

                  <div className="mb-16 mt-6">
                    <div className="text-2xl font-bold">Passages</div>

                    {chunks.map((chunk, index) => (
                      <div key={index}>
                        <div className="mt-4 rounded-lg border border-zinc-600 p-4">
                          <div className="flex justify-between">
                            <div>
                              <div className="text-xl font-bold">{chunk.blog_title}</div>
                              <div className="mt-1 text-sm font-bold">{chunk.blog_date}</div>
                            </div>
                            <a
                              className="ml-2 hover:opacity-50"
                              href={chunk.blog_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <IconExternalLink />
                            </a>
                          </div>
                          <div className="mt-2">{chunk.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : chunks.length > 0 ? (
                <div className="mt-6 pb-16">
                  <div className="text-2xl font-bold">Passages</div>
                  {chunks.map((chunk, index) => (
                    <div key={index}>
                      <div className="mt-4 rounded-lg border border-zinc-600 p-4">
                        <div className="flex justify-between">
                          <div>
                            <div className="text-xl font-bold">{chunk.blog_title}</div>
                            <div className="mt-1 text-sm font-bold">{chunk.blog_date}</div>
                          </div>
                          <a
                            className="ml-2 hover:opacity-50"
                            href={chunk.blog_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <IconExternalLink />
                          </a>
                        </div>
                        <div className="mt-2">{chunk.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 text-center text-lg"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
