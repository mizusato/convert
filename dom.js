'use strict';


function $(selector){
    return document.querySelector(selector);
}


function $$(selector){
    return document.querySelectorAll(selector);
}


function create(data) {
  
  if ( typeof data != 'object' || data == null ) {
    throw Error('create(): Invalid Argument');
  }
  
  var element = document.createElement(data.tag);
  element.$fields = {}

  var reserved = ['classList', 'style', 'dataset', 'handlers', 'children'];

  if (data.classList) {
    for ( let className of data.classList ) {
      if (className) {
	element.classList.add(className);
      }
    }
  }
  
  ['style', 'dataset'].forEach(function(hash_property) {
    if (data[hash_property]) {
      for ( let key of Object.keys(data[hash_property]) ) {
	if (data[hash_property][key]) {
	  if ( data[hash_property][key] instanceof field )  {
	    let field = data[hash_property][key];
	    let current_key = key;
	    element.$fields[field.name] = function update(value) {
	      element[hash_property][current_key] = value;
	    };
	    element[hash_property][current_key] = field.def_val;
	  } else {
	    element[hash_property][key] = data[hash_property][key];
	  } // field or value
	} // if data[hash_property] is set
      } // for key in data[hash_property]
    } // data of hash_property exists
  });

  if (data.handlers) {
    for ( let event_name of Object.keys(handlers) ) {
      element.addEventListener(event_name, handlers[event_name]);
    }
  }

  for ( let property of Object.keys(data) ) {
    if ( data[property] || typeof data[property] == 'boolean' ) {
      if ( reserved.indexOf(property) == -1 ) {
	if ( data[property] instanceof field ) {
	  let field = data[property];
	  let current_property = property;
	  element.$fields[field.name] = function update (value) {
	    element[current_property] = value;
	  };
	  element[current_property] = field.def_val;
	} else {
	  element[property] = data[property];
	} // field or value
      } // property is not children or processed property
    } // boolean type or true value of other types
  }

  if (data.children) {
    for ( let child of data.children ) {
      element.appendChild(create(child));
    }
  }

  return element;

}


function map(list, f) {
  var result = [];
  for ( let I of list ) {    
    result.append(f(I));
  }
  return result;
}


function field(name, default_value) {
  var field_object = {'name': name, 'def_val': default_value};
  field_object.__proto__ = field.prototype;
  return field_object;
}


function update(element, data) {
  for ( let field_name of Object.keys(element.$fields) ) {
    if ( data[field_name] || typeof data[field_name] == 'boolean' ) {
      element.$fields[field_name].call(element, data[field_name]);
    }
  }
  for ( let child of element.children ) {
    update(child, data);
  }
}
