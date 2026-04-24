import { useContext } from 'react'
import { AppContext } from '@/components/ContextProvider'

import keyboardShortcutsMenuItems from '@/data/keyboardShortcutsMenuItems'

const Modal = () => {
  const [state, _] = useContext(AppContext)
  const bgOpacity = 'rgba(128,128,128,0.25)'
  var show = state.showModal
  return (
    <>
      {show ? (
        <div
          id="keyboardShortcutsModalincludingBackground"
          style={{ backgroundColor: bgOpacity }}
          className="fixed top-0 left-0 flex h-screen w-full items-center bg-gray-100"
        >
          <div
            id="centralBox"
            className="mx-auto grid grid-flow-row grid-cols-2 gap-x-20 gap-y-2 rounded-lg border-2 border-slate-800 bg-gray-100 p-12 dark:border-slate-400 dark:bg-gray-800"
          >
            <div className="col-span-2 mx-auto mb-8 text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Keyboard Shortcuts
            </div>

            {Object.keys(keyboardShortcutsMenuItems).map((heading) => {
              return (
                <div key={heading}>
                  <h2 className="text-lg leading-9 font-extrabold tracking-tight text-gray-900 sm:text-xl sm:leading-10 md:text-2xl md:leading-14 dark:text-gray-100">
                    {heading}
                  </h2>
                  {keyboardShortcutsMenuItems[heading].map((item) => (
                    <div key={item.item} className="my-1.5 flex text-gray-800 dark:text-gray-200">
                      <div className="mr-2 rounded-lg border-2 bg-gray-400 px-2 dark:border-gray-500 dark:bg-gray-600">
                        {item.item}
                      </div>
                      <span>{item.description}</span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Modal
