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

  var reserved = ['classList', 'style', 'dataset', 'handlers', 'children'];

  if (data.classList) {
    for ( let className of data.classList ) {
      if (className) {
	element.classList.add(className);
      }
    }
  }
  
  ['style', 'dataset'].forEach(function(item) {
    if (data[item]) {
      for ( let I of Object.keys(data[item]) ) {
	if (data[item][I]) {
	  element[item][I] = data[item][I];
	}
      }
    }
  });

  if (data.handlers) {
    for ( let I of Object.keys(handlers) ) {
      element.addEventListener(I, handlers[I]);
    }
  }

  for ( let I of Object.keys(data) ) {
    if ( data[I] || typeof data[I] != 'boolean' ) {
      if ( reserved.indexOf(I) == -1 ) {
	element[I] = data[I];
      }
    }
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
