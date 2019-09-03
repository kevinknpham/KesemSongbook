(function() {
  "use strict";

  window.addEventListener("load", init);

  function init() {
    fetch("songs.php")
      .then(checkStatus)
      .then(JSON.parse)
      .then(display)
      .catch(console.error);
  }

  function display(resp) {
    let cont = document.querySelector("ul");
    for (let i = 0; i < resp.songs.length; i++) {
      let li = document.createElement("li");
      li.innerText = resp.songs[i].lyrics;
      cont.appendChild(li);
    }
  }

  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300 || response.status === 0) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }
})();
