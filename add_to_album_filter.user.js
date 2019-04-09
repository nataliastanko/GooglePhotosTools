// ==UserScript==
// @name         Google photos add to album filter
// @version      0.1
// @description  Filter through list of albums when adding to album action
// @author       nataliastanko
// @namespace    https://github.com/nataliastanko/
// @contactURL   https://nataliastanko.com
// @copyright    2019, nataliastanko (https://github.com/nataliastanko/)
// @match        https://photos.google.com
// @include      https://photos.google.com/*
// @updateURL    https://raw.githubusercontent.com/nataliastanko/GooglePhotosTools/master/add_to_album_filter.user.js
// @downloadURL  https://raw.githubusercontent.com/nataliastanko/GooglePhotosTools/master/add_to_album_filter.user.js
// @homepage     https://github.com/nataliastanko/GooglePhotosTools/
// @supportURL   https://github.com/nataliastanko/GooglePhotosTools/issues
// @grant        none
// @license      MIT
// @run-at context-menu

// ==/UserScript==

(function() {
  'use strict';

  function getAlbumsModal() {
    const headings = document.querySelectorAll('[role="heading"]')
    const match = Array.prototype.find.call(headings, function(node) {
      return node.textContent === 'Add to';
    })

    return match;
  }

  function initObserver() {
    var targetNode = document.querySelector('body');
    // Options for the observer (which mutations to observe)
    
    // Callback function to execute when mutations are observed
    var callback = function(mutationsList, observer) {
      for(var mutation of mutationsList) {
        if (mutation.type == 'childList') {
          const modalHeading = getAlbumsModal();
          if (modalHeading) {
            insertSearchForm(modalHeading);
            return;
          }
        }
      }
    };
    
    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);
    var config = { attributes: false, childList: true, subtree: false };
    
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  }

  function insertSearchForm (el) {
 
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('value', '');
    input.setAttribute('placeholder', 'album name');
    input.setAttribute('style', 'margin: 0 5px; padding: 5px;');

    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('content', '');
    button.innerHTML = 'Search';
    button.setAttribute('style', 'padding: 5px;');

    // add event
    button.onclick = function() {
      var albumPhrase = input.value;
      var albumList = document.querySelectorAll('content li');
      for (var album of albumList) {
        var albumName = album.children[1].children[0].innerHTML;

        var reg = new RegExp(albumPhrase,'i');
        var found = albumName.match(reg);
          
        if (found) {
          // jump to first
          album.scrollIntoView();
          return;
        }
      }
    };
      
    el.appendChild(input);
    el.appendChild(button);
  }

  initObserver();

})();