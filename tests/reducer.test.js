import { describe, it, expect } from 'vitest'
import reducer from '../lib/reducer'

const initialState = {
  blogPostMeta: null,
  showModal: false,
  listPosition: 0,
  keyboardHints: false,
  keyboardMode: false,
  searchVisible: false,
}

describe('reducer', () => {
  it('BLOG_POST sets blogPostMeta', () => {
    const meta = { title: 'Test', slug: 'test' }
    const state = reducer(initialState, { type: 'BLOG_POST', frontMatter: meta })
    expect(state.blogPostMeta).toEqual(meta)
  })

  it('MODAL toggles showModal', () => {
    const state = reducer(initialState, { type: 'MODAL' })
    expect(state.showModal).toBe(true)
    const state2 = reducer(state, { type: 'MODAL' })
    expect(state2.showModal).toBe(false)
  })

  it('HIDE_MODAL sets showModal to false', () => {
    const state = reducer({ ...initialState, showModal: true }, { type: 'HIDE_MODAL' })
    expect(state.showModal).toBe(false)
  })

  it('LIST_POSITION_INCREASE increments listPosition', () => {
    const state = reducer(initialState, { type: 'LIST_POSITION_INCREASE' })
    expect(state.listPosition).toBe(1)
  })

  it('LIST_POSITION_DECREASE does not go below 0', () => {
    const state = reducer(initialState, { type: 'LIST_POSITION_DECREASE' })
    expect(state.listPosition).toBe(0)
  })

  it('LIST_POSITION_RESET sets listPosition to 0', () => {
    const state = reducer({ ...initialState, listPosition: 5 }, { type: 'LIST_POSITION_RESET' })
    expect(state.listPosition).toBe(0)
  })

  it('KEYBOARD_MODE_ON sets keyboardMode true', () => {
    const state = reducer(initialState, { type: 'KEYBOARD_MODE_ON' })
    expect(state.keyboardMode).toBe(true)
  })

  it('KEYBOARD_MODE_OFF sets keyboardMode false', () => {
    const state = reducer({ ...initialState, keyboardMode: true }, { type: 'KEYBOARD_MODE_OFF' })
    expect(state.keyboardMode).toBe(false)
  })

  it('TOGGLE_KEYBOARD_HINTS toggles keyboardHints', () => {
    const state = reducer(initialState, { type: 'TOGGLE_KEYBOARD_HINTS' })
    expect(state.keyboardHints).toBe(true)
  })

  it('KEYBOARD_HINTS_OFF sets keyboardHints false', () => {
    const state = reducer({ ...initialState, keyboardHints: true }, { type: 'KEYBOARD_HINTS_OFF' })
    expect(state.keyboardHints).toBe(false)
  })

  it('unknown action throws', () => {
    expect(() => reducer(initialState, { type: 'UNKNOWN' })).toThrow()
  })
})
