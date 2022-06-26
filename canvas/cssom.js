
export const initStyle = () => {
  const style = document.createElement('style')
  style.setAttribute('data-identifier', 'canvas') // for later retrieval if needed
  document.head.appendChild(style)
  return style.sheet
}

export const appendRule = (id, property, value) => {
  const { stylesheet } = window.state.current

  const styles = getStylesById(stylesheet, id)

  styles.forEach((style, i) => {
    if (style.property === property) {
      stylesheet.deleteRule(i)
    }
  })

  stylesheet.insertRule(`#${id} { ${property}: ${value}; }`)
}

export const appendRules = (stylesheet, id, rules) => {
  const existingStyles = getStylesObjectById(stylesheet, id)

  const cssString = Object.entries(rules).map(([property, value]) => {
    if (existingStyles.hasOwnProperty(property)) {
      delete existingStyles[property]
    }

    return `${property}: ${value};`
  }).join('\n')

  const existingString = Object.entries(existingStyles).map(([property, value]) => `${property}: ${value};`)

  const finalString = `
    #${id} {
      ${existingString}
      ${cssString}
    }
  `

  stylesheet.insertRule(finalString)
}

export const removeStyles = (id) => {
  const { stylesheet } = window.state.current

  stylesheet.cssRules.forEach((rule, i) => {
    const id = rule.selectorText.split('#')[1]

    if (!id) {
      return
    }

    stylesheet.deleteRule(i)
  })
}

export const getStylesById = (stylesheet, id) => {
  const rules = []

  Array.from(stylesheet.cssRules).forEach((rule) => {
    const styleId = rule.selectorText.split('#')[1]

    if (id !== styleId) {
      return
    }

    rules.push({
      property: rule.style[0],
      value: rule.style[rule.style[0]],
    })
  })

  return rules
}

export const getStylesObjectById = (stylesheet, id) => {
  const styles = {}

  Array.from(stylesheet.cssRules).forEach((rule) => {
    const styleId = rule.selectorText.split('#')[1]

    if (id !== styleId) {
      return
    }

    Array.from(rule.style).forEach((property) => {
      styles[property] = rule[property]
    })
  })

  return styles
}

export const getId = (rule) => {
  return rule.selectorText.split('#')[1]
}

export const updateRule = (stylesheet, id, property, value) => {
  const rules = Array.from(stylesheet.cssRules)
  const index = rules.findIndex((rule) => {
    return getId(rule) === id
  })

  const rule = rules[index]

  const newStyles = {}

  if (index !== -1) {
    stylesheet.deleteRule(index)
    Array.from(rule.style).forEach((p) => newStyles[p] = rule.style[p])
  }

  newStyles[property] = value

  const cssString = Object.entries(newStyles).map(([p, v]) => `${p}: ${v};`).join('\n')

  stylesheet.insertRule(`#${id} { ${cssString} }`)
}
