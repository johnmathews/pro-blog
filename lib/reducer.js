export default function reducer(state, action) {
  switch (action.type) {
    case 'BLOG_POST':
      return {
        blogPostMeta: action.frontMatter,
        showModal: state.showModal,
        listPosition: state.listPosition,
        keyboardMode: state.keyboardMode,
        keyboardHints: state.keyboardHints,
        searchVisible: state.searchVisible,
      }
    case 'MODAL':
      return {
        blogPostMeta: state.blogPostMeta,
        showModal: !state.showModal,
        listPosition: state.listPosition,
        keyboardMode: state.keyboardMode,
        keyboardHints: state.keyboardHints,
        searchVisible: state.searchVisible,
      }
    case 'HIDE_MODAL':
      return {
        blogPostMeta: state.blogPostMeta,
        showModal: false,
        listPosition: state.listPosition,
        keyboardMode: state.keyboardMode,
        keyboardHints: state.keyboardHints,
        searchVisible: state.searchVisible,
      }
    case 'LIST_POSITION_RESET':
      return {
        blogPostMeta: state.blogPostMeta,
        showModal: false,
        listPosition: 0,
        keyboardMode: true,
        keyboardHints: state.keyboardHints,
        searchVisible: state.searchVisible,
      }
    case 'LIST_POSITION_INCREASE':
      return {
        blogPostMeta: state.blogPostMeta,
        showModal: false,
        listPosition: state.listPosition + 1,
        keyboardMode: true,
        keyboardHints: state.keyboardHints,
        searchVisible: state.searchVisible,
      }
    case 'LIST_POSITION_DECREASE':
      return {
        blogPostMeta: state.blogPostMeta,
        showModal: false,
        listPosition: Math.max(state.listPosition - 1, 0),
        keyboardMode: true,
        keyboardHints: state.keyboardHints,
        searchVisible: state.searchVisible,
      }
    case 'KEYBOARD_MODE_ON':
      return {
        blogPostMeta: state.blogPostMeta,
        showModal: state.showModal,
        listPosition: state.listPosition,
        keyboardHints: state.keyboardHints,
        keyboardMode: true,
        searchVisible: state.searchVisible,
      }
    case 'KEYBOARD_MODE_OFF':
      return {
        blogPostMeta: state.blogPostMeta,
        showModal: state.showModal,
        listPosition: state.listPosition,
        keyboardHints: state.keyboardHints,
        keyboardMode: false,
        searchVisible: state.searchVisible,
      }
    case 'TOGGLE_KEYBOARD_HINTS':
      return {
        blogPostMeta: state.blogPostMeta,
        showModal: state.showModal,
        listPosition: state.listPosition,
        keyboardHints: !state.keyboardHints,
        keyboardMode: state.keyboardMode,
        searchVisible: state.searchVisible,
      }
    case 'KEYBOARD_HINTS_OFF':
      return {
        blogPostMeta: state.blogPostMeta,
        showModal: state.showModal,
        listPosition: state.listPosition,
        keyboardHints: false,
        keyboardMode: state.keyboardMode,
        searchVisible: state.searchVisible,
      }
    default:
      throw new Error()
  }
}
