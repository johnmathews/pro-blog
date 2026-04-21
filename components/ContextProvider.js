import { createContext, useReducer } from 'react'
import reducer from '@/lib/reducer'

export const AppContext = createContext()

export const placeholderPostMetaData = {
  title: 'PLACEHOLDER',
  date: '2021-08-01',
  category: ['PLACEHOLDER'],
  next: null,
  prev: null,
}

const initialState = {
  blogPostMeta: placeholderPostMetaData,
  showModal: false,
  listPosition: 0,
  keyboardHints: false,
  keyboardMode: false,
  searchVisible: false,
}

export default function ContextProvider(props) {
  // a reducer is a function that takes the current (initial) state and an action as arguments, and returns a new state result.
  const [state, dispatch] = useReducer(reducer, initialState)
  return <AppContext.Provider value={[state, dispatch]}>{props.children}</AppContext.Provider>
}
