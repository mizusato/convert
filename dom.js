'use strict';


function $(selector){
    return document.querySelector(selector);
}


function $$(selector){
    return document.querySelectorAll(selector);
}


function create(data) {

  if ( typeof data == 'undefined' ) {
    return undefined;
  }
  
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
	    element.$fields[field.name] = {
	      'read': function () {
		return element[hash_property][current_key];
	      },
	      'update': function (value) {
		element[hash_property][current_key] = value;
	      }
	    }
	    if ( typeof field.def_val != 'undefined' ) {
	      element[hash_property][current_key] = field.def_val;
	    }
	  } else {
	    element[hash_property][key] = data[hash_property][key];
	  } // field or value
	} // if data[hash_property] is set
      } // for key in data[hash_property]
    } // data of hash_property exists
  });

  if (data.handlers) {
    for ( let event_name of Object.keys(data.handlers) ) {
      element.addEventListener(event_name, data.handlers[event_name]);
    }
  }

  for ( let property of Object.keys(data) ) {
    if ( typeof data[property] != 'undefined' ) {
      if ( reserved.indexOf(property) == -1 ) {
	if ( data[property] instanceof field ) {
	  let field = data[property];
	  let current_property = property;
	  element.$fields[field.name] = {
	    'read': function (value) {
	      return element[current_property];
	    },
	    'update': function (value) {
	      element[current_property] = value;
	    }
	  }
	  if ( typeof field.def_val != 'undefined' ) {
	    element[current_property] = field.def_val;
	  }
	} else {
	  element[property] = data[property];
	} // field or value
      } // property is not children or processed property
    } // property data exists
  }

  if (data.children) {
    for ( let child of data.children ) {
      if ( child instanceof HTMLElement ) {
	element.appendChild(child);
      } else if ( typeof child != 'undefined' ) {
	element.appendChild(create(child));
      }
    }
  }

  return element;

}


function map(list, f) {
  var result = [];
  for ( let I of list ) {    
    result.push(f(I));
  }
  return result;
}


function field(name, default_value) {
  var field_object = {'name': name, 'def_val': default_value};
  field_object.__proto__ = field.prototype;
  return field_object;
}


function read(element, field_name) {
  if ( typeof element.$fields[field_name] != 'undefined' ) {
    return element.$fields[field_name].read.call(element);
  }
  for ( let child of element.children ) {
    read(child, field_name);
  }
}


function update(element, data) {
  for ( let field_name of Object.keys(element.$fields) ) {
    if ( typeof data[field_name] != 'undefined' ) {
      element.$fields[field_name].update.call(element, data[field_name]);
    }
  }
  for ( let child of element.children ) {
    update(child, data);
  }
}


function concat(args) {
  var result = [];  
  for(let i=0; i<arguments.length; i++) {
    result = result.concat(arguments[i]);
  }
  return result;
}
