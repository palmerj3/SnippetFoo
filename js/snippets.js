(function() {
  'use strict';

  var snippets = {},
      Snippet = window.SnippetFoo.Snippet;

  Snippet.eval = function(code) {
    chrome.devtools.inspectedWindow.eval(
      code,
      function() { console.log('Eval\'d'); }
    );
  };
  
  Snippet.save = function(key, value, callback) {
    snippets[key] = value;
    
    chrome.storage.local.set(snippets, callback);
  };
  
  Snippet.remove = function(name) {
    chrome.storage.local.remove(name);
  };
  
  Snippet.sync = function() {
    Snippet.getAll(function(results) {
      snippets = results;
    });
  };
  
  Snippet.getAll = function(callback) {
    chrome.storage.local.get(callback);
  };
    
}());