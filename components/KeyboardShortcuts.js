import { useContext, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Mousetrap from 'mousetrap'

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
  const stateRef = useRef(state)
  stateRef.current = state

  function TOGGLE_MODAL() {
    dispatch({
      type: 'MODAL',
    })
  }
  function HIDE_MODAL() {
    if (stateRef.current.showModal) {
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

  useEffect(() => {
    const bindings = [
      {
        keys: ['/', 'command+k'],
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'cmd+k' })
          clientEventLogger(router.asPath, data)
          e.preventDefault()

          let searchBox = document.querySelector('.aa-DetachedSearchButtonPlaceholder')
          let overlay = document.querySelector('.aa-DetachedCancelButton')

          if (overlay) {
            simulateMouseClick(overlay)
          } else {
            simulateMouseClick(searchBox)
            searchBox.focus()
          }
          return false
        },
      },
      {
        keys: 'tab',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'tab' })
          clientEventLogger(router.asPath, data)
          dispatch({ type: 'TOGGLE_KEYBOARD_HINTS' })
          e.preventDefault()
          return false
        },
      },
      {
        keys: 'j',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'j' })
          clientEventLogger(router.asPath, data)
          window.scrollBy({ top: 200, left: 0, behavior: 'smooth' })
          HIDE_MODAL()
        },
      },
      {
        keys: 'k',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'k' })
          clientEventLogger(router.asPath, data)
          window.scrollBy({ top: -200, left: 0, behavior: 'smooth' })
          HIDE_MODAL()
        },
      },
      {
        keys: 'ctrl+j',
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
        keys: 'ctrl+k',
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
        keys: 'return',
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
        keys: ['?', 'escape', 'q'],
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: '?' })
          clientEventLogger(router.asPath, data)
          TOGGLE_MODAL()
        },
      },
      {
        keys: 'n p',
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
        keys: 'p p',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'pp' })
          clientEventLogger(router.asPath, data)
          let prevPostButton = document.querySelector('#previousPost')
          simulateMouseClick(prevPostButton)
          HOUSEKEEPING()
        },
      },
      {
        keys: 't t',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'tt' })
          clientEventLogger(router.asPath, data)
          let themeButton = document.querySelector('#themeSwitcher')
          simulateMouseClick(themeButton)
          HOUSEKEEPING(false, false)
        },
      },
      {
        keys: 'g g',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gg' })
          clientEventLogger(router.asPath, data)
          window.scrollTo(0, 0)
          HOUSEKEEPING(false, false)
        },
      },
      {
        keys: 'shift+g',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'G' })
          clientEventLogger(router.asPath, data)
          window.scrollTo(0, 999999)
          HOUSEKEEPING(false, false)
        },
      },
      {
        keys: 'b f',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gf' })
          clientEventLogger(router.asPath, data)
          window.history.forward()
          HOUSEKEEPING()
        },
      },
      {
        keys: 'b b',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gb' })
          clientEventLogger(router.asPath, data)
          window.history.back()
          HOUSEKEEPING()
        },
      },
      {
        keys: 'c a',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'ca' })
          clientEventLogger(router.asPath, data)
          router.push('/categories')
          HOUSEKEEPING()
        },
      },
      {
        keys: 'c e',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'ce' })
          clientEventLogger(router.asPath, data)
          router.push('/engineering')
          HOUSEKEEPING()
        },
      },
      {
        keys: 'g a',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'ga' })
          clientEventLogger(router.asPath, data)
          router.push('/about')
          HOUSEKEEPING()
        },
      },
      {
        keys: 'g o',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'go' })
          clientEventLogger(router.asPath, data)
          router.push('/collections')
          HOUSEKEEPING()
        },
      },
      {
        keys: 'g e',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'ge' })
          clientEventLogger(router.asPath, data)
          router.push('/experience')
          HOUSEKEEPING()
        },
      },
      {
        keys: 'g i',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gi' })
          clientEventLogger(router.asPath, data)
          router.push('/posts')
          HOUSEKEEPING()
        },
      },
      {
        keys: 'g p',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gp' })
          clientEventLogger(router.asPath, data)
          router.push('/projects')
          HOUSEKEEPING()
        },
      },
      {
        keys: 'g l',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gl' })
          clientEventLogger(router.asPath, data)
          router.push('/')
          HOUSEKEEPING()
        },
      },
      {
        keys: 'g m',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gm' })
          clientEventLogger(router.asPath, data)
          router.push('/metrics')
          HOUSEKEEPING()
        },
      },
      {
        keys: 'g s',
        callback: (e) => {
          let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gs' })
          clientEventLogger(router.asPath, data)
          router.push('/snippets')
          HOUSEKEEPING()
        },
      },
    ]

    bindings.forEach(({ keys, callback }) => {
      Mousetrap.bind(keys, callback)
    })

    return () => {
      bindings.forEach(({ keys }) => {
        Mousetrap.unbind(keys)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- HIDE_MODAL/TOGGLE_MODAL/HOUSEKEEPING use stateRef intentionally to avoid stale closures
  }, [router, dispatch])

  return <></>
}

export default KeyboardShortcuts
