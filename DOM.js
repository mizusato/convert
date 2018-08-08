'use strict'


function $ (selector) {
    return document.querySelector(selector)
}


function $$ (selector) {
    return document.querySelectorAll(selector)
}


function create (data) {

  if ( typeof data == 'undefined' ) {
    return undefined
  }
  
  if ( typeof data != 'object' || data == null ) {
    throw Error('create(): Invalid Argument')
  }
  
  var element = document.createElement(data.tag)
  element.$fields = {}

  var reserved = ['classList', 'style', 'dataset', 'handlers', 'children']

  if (data.classList) {
    for ( let className of data.classList ) {
      if (className) {
	element.classList.add(className)
      }
    }
  }
  
  ['style', 'dataset'].forEach(function(hash_property) {
    if (data[hash_property]) {
      for ( let key of Object.keys(data[hash_property]) ) {
	if ( typeof data[hash_property][key] != 'undefined' ) {
	  if ( data[hash_property][key] instanceof field )  {
	    let field = data[hash_property][key]
	    let current_key = key
	    element.$fields[field.name] = {
	      'read': function () {
		return element[hash_property][current_key]
	      },
	      'update': function (value) {
		element[hash_property][current_key] = value
	      }
	    }
	    if ( typeof field.def_val != 'undefined' ) {
	      element[hash_property][current_key] = field.def_val
	    }
	  } else {
	    element[hash_property][key] = data[hash_property][key]
	  } // field or value
	} // if data[hash_property] is set
      } // for key in data[hash_property]
    } // data of hash_property exists
  })

  if (data.handlers) {
    for ( let event_name of Object.keys(data.handlers) ) {
      element.addEventListener(event_name, data.handlers[event_name])
    }
  }

  for ( let property of Object.keys(data) ) {
    if ( typeof data[property] != 'undefined' ) {
      if ( reserved.indexOf(property) == -1 ) {
	if ( data[property] instanceof field ) {
	  let field = data[property]
	  let current_property = property
	  element.$fields[field.name] = {
	    'read': function (value) {
	      return element[current_property]
	    },
	    'update': function (value) {
	      element[current_property] = value
	    }
	  }
	  if ( typeof field.def_val != 'undefined' ) {
	    element[current_property] = field.def_val
	  }
	} else {
	  element[property] = data[property]
	} // field or value
      } // property is not children or processed property
    } // property data exists
  }

  if (data.children) {
    for ( let child of data.children ) {
      if ( child instanceof HTMLElement ) {
	element.appendChild(child)
      } else if ( typeof child != 'undefined' ) {
	element.appendChild(create(child))
      }
    }
  }

  return element
}


function create_style (rules) {
  function convert_property_name (name) {
    return name.replace( /[A-Z]/, upper => '-' + upper.toLowerCase() )
  }
  return create({ tag: 'style', textContent: '\n' + join((function* () {
    for ( let rule of rules ) {
      let selectors = rule[0]
      let styles = rule[1]
      let selectors_str = selectors.join(', ')
      let styles_str = join(map(
	styles,	(property, value) =>
	  (typeof value != 'undefined')?
	  `${convert_property_name(property)}: ${value}; `: ''
      ))
      if ( styles_str != '' ) {
	yield `${selectors_str} { ${styles_str}}\n`
      } else {
	yield ''
      }
    }
  })()) })
}


function inject_style (name, style_tag) {
  if (style_tag instanceof HTMLStyleElement) {
    var existing = $(`style.injected.${name}`)
    if ( !existing ) {
      existing = create(
	{ tag: 'style', classList: ['injected', name] }
      )
      document.head.appendChild(existing)
    }
    replace(existing, style_tag)
  } else {
    throw Error('inject_style(): Invalid Argument')
  }
}


function exists (iterable, f) {
  for ( let I of iterable ) {
    if ( f(I) ) {
      return true
    }
  }
  return false
}


function any (iterable, f) {
  return !exists(iterable, x => !f(x))
}


function join (iterable, linker = '') {
  var string = ''
  var iterator = iterable[Symbol.iterator]()
  var p = iterator.next()
  var q = iterator.next()
  while ( !p.done ) {
    string += p.value
    if ( !q.done ) {
      string += linker
    }
    p = q
    q = iterator.next()
  }
  return string
}


function map (arg, f) {
  if ( typeof arg[Symbol.iterator] == 'function' ) {
    let iterable = arg
    let result = []
    let index = 0
    let jump_amount = 0
    for ( let I of iterable ) {
      if ( jump_amount > 0 ) {
	jump_amount--
	index++
	continue
      }
      let J = f(I, index)
      if ( J instanceof jump ) {
	jump_amount = J.amount
	if ( typeof J.value != 'undefined' ) {
	  result.push(J.value)
	}
      } else {
	result.push(J)
      }
      index++
    }
    return result
  } else {
    let hash = arg
    if ( f.length >= 2 ) {
      let result = []
      for ( let key of Object.keys(hash) ) {
	result.push(f(key, hash[key]))
      }
      return result
    } else {
      let result = {}
      for ( let key of Object.keys(hash) ) {
	result[key] = f(hash[key])
      }
      return result
    }
  }
}


function jump (amount, value = undefined) {
  var object = { amount: amount, value: value }
  object.__proto__ = jump.prototype
  return object
}


function field (name, default_value) {
  var field_object = {'name': name, 'def_val': default_value}
  field_object.__proto__ = field.prototype
  return field_object
}


function read (element, field_name) {
  if ( typeof element.$fields[field_name] != 'undefined' ) {
    return element.$fields[field_name].read.call(element)
  }
  for ( let child of element.children ) {
    read(child, field_name)
  }
}


function update (element, data) {
  for ( let field_name of Object.keys(element.$fields) ) {
    if ( typeof data[field_name] != 'undefined' ) {
      element.$fields[field_name].update.call(element, data[field_name])
    }
  }
  for ( let child of element.children ) {
    update(child, data)
  }
}


function* concat (args) {
  for ( let i=0; i<arguments.length; i++ ) {
    for ( let element of arguments[i] ) {
      yield element
    }
  }
}


function* values (object) {
  for ( let key of Object.keys(object) ) {
    yield object[key]
  }
}


function getlist (iterable) {
  var result = []
  for ( let I of iterable ) {
    result.push(I);    
  }
  return result
}


function replace (element, new_element) {
  if ( element.id ) {
    new_element.id = element.id
  }
  for ( let className of element.classList ) {
    new_element.classList.add(className)
  }
  element.parentNode.replaceChild(new_element, element)
  return element
}


function replaceable (placeholder) {
  var object = { element: placeholder }
  replaceable.prototype.update = function (new_element) {
    replace(this.element, new_element)
    this.element = new_element
  }
  object.__proto__ = replaceable.prototype
  return object
}


function activate_tabs (tabs, enable, disable) {
  for ( let tab of tabs ) {
    tab.addEventListener('click', function tab_click (ev) {
      for ( let tab of tabs ) {
	if (!tab) { throw Error('tab_click(): Invalid Page Selector') }
	enable(tab)
	$(tab.dataset.page).style.display = 'none'
      }
      disable(this)
      $(this.dataset.page).style.display = ''
    })
  }
}


class CompatEventTarget {
  constructor () {
    this.$handlers = {}
  }

  addEventListener (name, callback) {
    if ( typeof callback != 'function' ) {
      throw Error(
	'CompatEventTarget.prototype.addEventListener(): Invalid Argument'
      )
    }
    if ( !this.$handlers[name] ) {
      this.$handlers[name] = []
    }
    for ( let handler of this.$handlers[name] ) {
      if ( handler == callback ) {
	return false
      }
    }
    this.$handlers[name].push(callback)
    return true
  }

  removeEventListener (name, callback) {
    if ( this.$handlers[name] ) {
      this.$handlers[name] = this.$handlers[name].filter(
	handler => handler != callback
      )
      return true
      // return true does not mean there must exist a handler == callback
    } else {
      return false
    }
  }

  dispatchEvent (event) {
    if ( this.$handlers[event.type] ) {
      for ( let handler of this.$handlers[event.type] ) {
	handler.call(this, event)
      }
    }
  }
}


function load_config (name) {
  if ( !localStorage[name] ) {
    localStorage[name] = JSON.stringify({})
  }
  return JSON.parse(localStorage[name])
}


function save_config (name, obj) {
  localStorage[name] = JSON.stringify(obj)
}


function add_iterator (class_constructor) {
  if (!class_constructor.prototype[Symbol.iterator]) {
    class_constructor.prototype[Symbol.iterator] = function* () {
      for ( let i=0; i<this.length; i++ ) {
	yield this[i]
      }
    }
  }
}


add_iterator(NodeList)
add_iterator(DOMTokenList)
add_iterator(DOMStringMap)
