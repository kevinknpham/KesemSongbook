// This file adds the songs to index.html and adds functionality such as displaying
// full song lyrics and filtering by category.
// For use with index.html and songs.js.

(function() {

  const SONG_API = "songs.php";

  // When window loads, add functionality to the close button on the modal,
  // create song cards that can open and modify the modal, and create categories
  // to filter through songs.
  window.addEventListener("load", init);

  function init() {
    fetch(SONG_API)
      .then(checkStatus)
      .then(JSON.parse)
      .then(populate)
      .catch(function(err) {
        console.error(err);
        alert("Can't load songs at the moment.  Try again later.");
      });
    $("nav-btn").addEventListener("click", toggleNavBar);
  }
  
  function openSongFromUrl() {
    // parse query
    let query = window.location.search;
    if (query.length > 0) {
      query = query.substring(1);
      let querySplit = query.split("&");
      let queryMap = {};
      for (let i = 0; i < querySplit.length; i++) {
        let strSplit = querySplit[i].split("=");
        queryMap[strSplit[0]] = strSplit[1];
      }
      
      let songname = queryMap.song;
      let songCardId = songname.toLowerCase().replace(/\W/g, '');
      let songCard = $(songCardId);
      songCard.click();
    }

  }

  function toggleNavBar() {
    let nav = $("categories");
    nav.classList.toggle("nav-hidden");
    nav.classList.toggle("nav-shown");
  }

  function populate(resp) {
    let songs = resp.songs;
    let visibleTags = resp.tags;
    $("close").addEventListener("click", function() {
      $("modal").classList.add("hidden");
    });

  	songs.sort(function(a,b) {
        let aName = a.name;
        let bName = b.name;
        let c = aName.substring(0, 4).toLowerCase() === "the " ? aName.substr(4) : aName;
        let d = bName.substring(0, 4).toLowerCase() === "the " ? bName.substr(4) : bName;
  		return c.localeCompare(d);
  	});

    // Combine all tags arrays
    for (let i = 0; i < songs.length; i++) {
      let song = songs[i];
      $("songlist").appendChild(createSongBox(song));
    }

    for (let i = 0; i < visibleTags.length; i++) {
      $("categories").appendChild(createCategory(visibleTags[i]));
    }

    openSongFromUrl();
  };

  /**
  * Function that creates category buttons for filtering for a single category.
  * @param name: name of the category. name should not contain whitespace.
  * @return: DOM of category button with onclick functionality and
  * category class.
  */
  function createCategory(name) {
    let result = document.createElement("span");
    result.classList.add("category");
    result.innerText = name;
    result.addEventListener("click", function() {
      filterSongs(name);
    });
    result.addEventListener("click", toggleNavBar);
    return result;
  }

  /**
  * Handler for category buttons. Hides all song cards without the tag passed in
  * the name parameter.
  * @param name: name of category. Should not contain whitespace. Not case sensitive.
  */
  function filterSongs(name) {
    let songs = qsa(".song");
    for (let i = 0; i < songs.length; i++) {
      let song = songs[i];
      if (song.classList.contains(name)) {
        song.classList.remove("hidden");
      } else {
        song.classList.add("hidden");
      }
    }
  }

  /**
  * Creates a song card for an individual song.
  * @param song: object with song title, lyrics, and categories/tags.
  * @return: DOM for a single song that includes title, preview of lyrics, and
  * can be filtered.
  */
  function createSongBox(song) {
    let result = document.createElement("section");
    result.classList.add("song");

    let title = document.createElement("h2");
    title.classList.add("title");
    title.innerText = song.name;

    let lyrics = document.createElement("p");
    lyrics.classList.add("lyrics");
    let lines = song.lyrics.split("\n", 2);
    lyrics.innerText = lines[0] + "\n" + lines[1] + "...";

    result.appendChild(title);
    result.appendChild(lyrics);
    for (let i = 0; i < song.tags.length; i++) {
      result.classList.add(song.tags[i]);
    }
    result.addEventListener("click", function() {
      revealLyrics(song.name, song.lyrics);
    });

    let songId = song.name.toLowerCase().replace(/\W/g, '');
    result.id = songId;

    return result;
  }

  /**
  * Reveals modal containing full lyrics for a song.
  * @param title: title of the song
  * @param lyrics: lyrics for the song to be displayed
  */
  function revealLyrics(title, lyrics) {
    qs("#modal h2").innerText = title;
    qs("#modal p").innerText = lyrics;
    $("modal").classList.remove("hidden");
  }

  //============================Helper Functions===============================//
  /**
  * @param id: id of desired object
  * @return: DOM with given id
  */
  function $(id) {
    return document.getElementById(id);
  }

  /**
  * @param selector: selector for desired object
  * @return: first DOM matching the query
  */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
  * @param selector: selector for desired objects
  * @return: NodeList object with all DOM matching given selector
  */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
  * @param response: response from a fetch request
  * @return: text of response
  */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300 || response.status === 0) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }
})();
