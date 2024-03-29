import { canvasDocument, canvasWindow } from '../canvas'

const win = canvasWindow()
const doc = canvasDocument()

const content = {
  commands: {
    'Escape': 'exit',
    'Enter': 'exit',
  },

  on_enter({ selections }) {
    const selection = selections[0]

    if (selection.firstChild && selection.firstChild.nodeType === 3) {
      selection.setAttribute('contenteditable', 'true')
      selection.focus()

      const documentSelection = win.getSelection()
      const range = doc.createRange()
      range.selectNodeContents(selection)
      documentSelection.removeAllRanges()
      documentSelection.addRange(range)
    }
  },

  exit({ selections }) {
    selections[0].blur()
    selections[0].removeAttribute('contenteditable')

    return {
      mode: 'select',
    }
  },
}

export default content
