import { useContext } from 'react'
import { useRouter } from 'next/router'

import { useHotkeys } from 'reakeys'

import { AppContext } from '@/components/ContextProvider'

const mouseClickEvents = ['click']

function simulateMouseClick(element) {
  mouseClickEvents.forEach((mouseEventType) =>
    element.dispatchEvent(
      new MouseEvent(mouseEventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1,
      })
    )
  )
}

function clientEventLogger(pathname, data) {
  const url = `https://us-central1-johnmathews-website.cloudfunctions.net/client-event-logger?path=${pathname}`
  window.navigator.sendBeacon(url, data)
}

const KeyboardShortcuts = () => {
  const router = useRouter()
  const [state, dispatch] = useContext(AppContext)

  function TOGGLE_MODAL() {
    dispatch({
      type: 'MODAL',
    })
  }
  function HIDE_MODAL() {
    if (state.showModal) {
      dispatch({
        type: 'HIDE_MODAL',
      })
    }
  }

  function HOUSEKEEPING(resetList = true, resetScroll = false) {
    HIDE_MODAL()
    dispatch({ type: 'KEYBOARD_HINTS_OFF' })
    if (resetList) {
      dispatch({ type: 'LIST_POSITION_RESET' })
      dispatch({ type: 'KEYBOARD_MODE_OFF' })
    }
    if (resetScroll) {
      window.scrollTo(0, 0)
    }
  }

  useHotkeys([
    {
      name: 'Search',
      keys: ['/', 'command+k'],
      category: 'Search',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'cmd+k' })
        clientEventLogger(router.asPath, data)
        e.preventDefault()

        let searchBox = document.querySelector('.aa-DetachedSearchButtonPlaceholder')
        let overlay = document.querySelector('.aa-DetachedCancelButton')

        if (overlay) {
          simulateMouseClick(overlay)
          e.preventDefault()
        } else {
          simulateMouseClick(searchBox)
          searchBox.focus()
          e.preventDefault()
        }
      },
    },
    {
      name: 'tab',
      keys: ['tab'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'tab' })
        clientEventLogger(router.asPath, data)
        dispatch({ type: 'TOGGLE_KEYBOARD_HINTS' })
      },
    },
    {
      name: 'j',
      keys: ['j'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'j' })
        clientEventLogger(router.asPath, data)
        window.scrollBy({ top: 200, left: 0, behavior: 'smooth' })
        HIDE_MODAL()
      },
    },
    {
      name: 'k',
      keys: ['k'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'k' })
        clientEventLogger(router.asPath, data)
        window.scrollBy({ top: -200, left: 0, behavior: 'smooth' })
        HIDE_MODAL()
      },
    },
    {
      name: 'ctrl+j',
      keys: ['ctrl+j'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'ctrl+j' })
        clientEventLogger(router.asPath, data)
        dispatch({ type: 'KEYBOARD_MODE_ON' })
        const element = document.getElementsByClassName('selected')
        if (element[0] != undefined) {
          dispatch({ type: 'LIST_POSITION_INCREASE' })
          try {
            element[0].scrollIntoView({ behavior: 'smooth', block: 'end' })
            const y = element[0].getBoundingClientRect().top + window.pageYOffset - 400
            window.scrollTo({ top: y, behavior: 'smooth' })
          } catch {
            dispatch({ type: 'LIST_POSITION_RESET' })
          }
        }
      },
    },
    {
      name: 'ctrl+k',
      keys: ['ctrl+k'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'ctrl+k' })
        clientEventLogger(router.asPath, data)
        dispatch({ type: 'KEYBOARD_MODE_ON' })
        const element = document.getElementsByClassName('selected')
        if (element[0] != undefined) {
          dispatch({ type: 'LIST_POSITION_DECREASE' })
          const y = element[0].getBoundingClientRect().top + window.pageYOffset - 400
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      },
    },
    {
      name: 'return',
      keys: ['return'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'return' })
        clientEventLogger(router.asPath, data)
        let selectedPost = document.querySelector('.viewable .selected')
        dispatch({ type: 'LIST_POSITION_RESET' })
        simulateMouseClick(selectedPost)
        HOUSEKEEPING()
      },
    },
    {
      name: 'escape',
      keys: ['?', 'esc', 'q'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: '?' })
        clientEventLogger(router.asPath, data)
        TOGGLE_MODAL()
      },
    },
    {
      name: 'n p',
      keys: ['n', 'p'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'np' })
        clientEventLogger(router.asPath, data)
        let nextPostButton = document.querySelector('#nextPost')
        simulateMouseClick(nextPostButton)
        HIDE_MODAL()
        dispatch({ type: 'LIST_POSITION_RESET' })
      },
    },
    {
      name: 'p p',
      keys: ['p p'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'pp' })
        clientEventLogger(router.asPath, data)
        let prevPostButton = document.querySelector('#previousPost')
        simulateMouseClick(prevPostButton)
        HOUSEKEEPING()
      },
    },
    {
      name: 't t',
      keys: ['t t'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'tt' })
        clientEventLogger(router.asPath, data)
        let themeButton = document.querySelector('#themeSwitcher')
        simulateMouseClick(themeButton)
        HOUSEKEEPING(false, false)
      },
    },
    {
      name: 'g g',
      keys: ['g g'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gg' })
        clientEventLogger(router.asPath, data)
        window.scrollTo(0, 0)
        HOUSEKEEPING(false, false)
      },
    },
    {
      name: 'G',
      keys: ['G'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'G' })
        clientEventLogger(router.asPath, data)
        window.scrollTo(0, 999999)
        HOUSEKEEPING(false, false)
      },
    },
    {
      name: 'b f',
      keys: ['b f'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gf' })
        clientEventLogger(router.asPath, data)
        window.history.forward()
        HOUSEKEEPING()
      },
    },
    {
      name: 'b b',
      keys: ['b b'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gb' })
        clientEventLogger(router.asPath, data)
        window.history.back()
        HOUSEKEEPING()
      },
    },
    {
      name: 'c a',
      keys: ['c a'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'ca' })
        clientEventLogger(router.asPath, data)
        router.push('/categories')
        HOUSEKEEPING()
      },
    },
    {
      name: 'c e',
      keys: ['c e'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'ce' })
        clientEventLogger(router.asPath, data)
        router.push('/engineering')
        HOUSEKEEPING()
      },
    },
    {
      name: 'g a',
      keys: ['g a'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'ga' })
        clientEventLogger(router.asPath, data)
        router.push('/about')
        HOUSEKEEPING()
      },
    },
    {
      name: 'g o',
      keys: ['g o'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'go' })
        clientEventLogger(router.asPath, data)
        router.push('/collections')
        HOUSEKEEPING()
      },
    },
    {
      name: 'g e',
      keys: ['g e'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'ge' })
        clientEventLogger(router.asPath, data)
        router.push('/experience')
        HOUSEKEEPING()
      },
    },
    {
      name: 'g i',
      keys: ['g i'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gi' })
        clientEventLogger(router.asPath, data)
        router.push('/posts')
        HOUSEKEEPING()
      },
    },
    {
      name: 'g p',
      keys: ['g p'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gp' })
        clientEventLogger(router.asPath, data)
        router.push('/projects')
        HOUSEKEEPING()
      },
    },
    {
      name: 'g l',
      keys: ['g l'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gl' })
        clientEventLogger(router.asPath, data)
        router.push('/')
        HOUSEKEEPING()
      },
    },
    {
      name: 'g m',
      keys: ['g m'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gm' })
        clientEventLogger(router.asPath, data)
        router.push('/metrics')
        HOUSEKEEPING()
      },
    },
    {
      name: 'g s',
      keys: ['g s'],
      category: 'keys',
      callback: (e) => {
        let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gs' })
        clientEventLogger(router.asPath, data)
        router.push('/snippets')
        HOUSEKEEPING()
      },
    },
  ])
  return <></>
}

export default KeyboardShortcuts
