(function() {
  SnippetFoo.App = function() {
    this.checkPermissions(['storage'], this.onPermissionsGranted.bind(this));    
    this.hasPermissions = false;
  };
  
  SnippetFoo.App.prototype.onPermissionsGranted = function() {
    this.initializeEvents();
  };
  
  SnippetFoo.App.prototype.checkPermissions = function(perms, callback) {
    var self = this;

    if (perms && perms.length) {
      chrome.permissions.contains({
        permissions: perms,
      }, function(result) {
        if (result) {
          self.hasPermissions = true;
          callback();
        } else {
          self.hasPermissions = false;
          self.requestPermissions(perms, callback);
        }
      });
    }
  };
  
  SnippetFoo.App.prototype.requestPermissions = function(perms, callback) {
    var self = this;

    chrome.permissions.request({
        permissions: perms,
      }, function(granted) {
        // The callback argument will be true if the user granted the permissions.
        if (granted) {
          callback();
        } else {
          document.writeln('<h1>Permissions denied</h1>');
        }
      });
  };

  SnippetFoo.App.prototype.initializeEvents = function() {
    window.addEventListener('load', this.onDomReady.bind(this));
  };
  
  SnippetFoo.App.prototype.onDomReady = function() {
    this.snippetsContainer = document.getElementById('snippets');
    this.getSnippets(this.drawSnippets.bind(this));

    document.getElementById('save_snippet').addEventListener('click', this.onSaveSnippet.bind(this));
    this.snippetsContainer.addEventListener('click', this.onSnippetClick.bind(this));
  };
  
  SnippetFoo.App.prototype.onSnippetClick = function(e) {
    var node = e.target;
    
    if (node.getAttribute('rel') === 'snippet') {
      SnippetFoo.Snippet.eval(node.innerHTML);
    }
  };

  SnippetFoo.App.prototype.onSaveSnippet = function(e) {
    var k = document.getElementById('snippet_label').value,
        v = document.getElementById('snippet_text').value;

    e.preventDefault();

    document.writeln(JSON.stringify(permission.contains()));
    chrome.experimental.devtools.console.addMessage('DEBUG', 'Key: ' + k + ', Value: ' + v);
    SnippetFoo.Snippet.save(k, v, this.onSnippetSaved.bind(this));
  };
  
  SnippetFoo.App.prototype.onSnippetSaved = function() {
    this.snippetsContainer.innerHTML = '';

    document.getElementById('snippet_label').value = '';
    document.getElementById('snippet_text').value = '';

    this.getSnippets(this.drawSnippets.bind(this));
  };

  SnippetFoo.App.prototype.getSnippets = function(callback) {
    SnippetFoo.Snippet.getAll(callback);
  };
  
  SnippetFoo.App.prototype.drawSnippets = function(snippets) {
    var s,
        snippet,
        snode;
    
    for (s in snippets) {
      if (!snippets.hasOwnProperty(s)) continue;
      
      snippet = snippets[s];
      snode = document.createElement('div');
      snode.setAttribute('rel', 'snippet');
      snode.innerText = snippet;

      this.snippetsContainer.appendChild(snode);
    }
  };
  
  SnippetFoo.app = new SnippetFoo.App();
  
}());