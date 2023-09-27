$(document).ready(function () {
  const API_KEY = "36abe3e54bmshc8a9cc11352fa46p1a991cjsnd004769b0c8b";

  // Oznacavamo polje za unos glumaca
  const personSearchInput = document.getElementById("person-search");
  const personDropdown = document.createElement("div");
  personDropdown.classList.add("dropdown-results");
  personSearchInput.parentElement.appendChild(personDropdown);

  personSearchInput.addEventListener("input", function () {
    // Čistimo prethodni debounce timeout
    clearTimeout(debounceTimeout);

    // Postavljamo novi debounce timeout
    debounceTimeout = setTimeout(() => {
      // Uzimamo trenutni tekst iz polja za unos
      const searchTerm = personSearchInput.value;
      if (!searchTerm.trim()) return;
      const settings = {
        async: true,
        crossDomain: true,
        url: `https://unogs-unogs-v1.p.rapidapi.com/search/titles?person=${encodeURIComponent(
          searchTerm
        )}&order_by=date&limit=5&type=movie`,
        method: "GET",
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "unogs-unogs-v1.p.rapidapi.com",
        },
      };

      // Pozivamo API
      $.ajax(settings).done(function (response) {
        // Čistimo prethodne rezultate
        personDropdown.innerHTML = "";

        // Dodajemo nove rezultate u padajući izbor
        response.results.forEach((movie) => {
          const movieItem = document.createElement("div");
          movieItem.classList.add("movie-item");
          movieItem.textContent = movie.title;
          personDropdown.appendChild(movieItem);
        });
      });
    }, 300); // Debounce vrijeme od 300ms
  });

  // Funkcija za prikaz filmova na osnovu imena glumca
  function displayMoviesByActor(actorName) {
    const settings = {
      async: true,
      crossDomain: true,
      url: `https://unogs-unogs-v1.p.rapidapi.com/search/titles?person=${encodeURIComponent(
        actorName
      )}&order_by=date&type=movie`,
      method: "GET",
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "unogs-unogs-v1.p.rapidapi.com",
      },
    };

    $.ajax(settings).done(function (response) {
      const moviesContainer = $("#movies-container");
      moviesContainer.empty();

      response.results.forEach((movie) => {
        let ratingHtml = "";
        if (movie.rating) {
          ratingHtml = `<p class="card-text">Rating: ${movie.rating}</p>`;
        }

        const movieCard = `
            <div class="col-md-3 mb-4">
            <div class="card" style="background-color: #8e8e8e; height:100%;">
                <img src="${movie.img}" alt="${movie.title}" class="card-img-top">
                <div class="card-body d-flex flex-column justify-content-between"> <!-- Dodane klase za flexbox -->
                    <div> <!-- Ovaj div će sadržavati sve osim dugmeta, omogućavajući dugmetu da bude na dnu -->
                        <h5 class="card-title">${movie.title}</h5>
                        ${ratingHtml}
                    </div>
                    <button class="btn btn-details" style="background-color: #767676;" data-toggle="modal" data-target="#movie-details-modal" data-netflix-id="${movie.netflix_id}">Detalji</button>
                </div>
            </div>
        </div>
    `;

        moviesContainer.append(movieCard);
        personDropdown.innerHTML = "";
      });
    });
  }

  // Kada korisnik klikne na gumb "Pretraži" za glumce
  $("#btn-search").click(function () {
    const searchTerm = personSearchInput.value;
    if (searchTerm.trim()) {
      displayMoviesByActor(searchTerm);
    }
  });

  // Kada korisnik klikne na film u padajućem izborniku za glumce
  personDropdown.addEventListener("click", function (event) {
    if (event.target.classList.contains("movie-item")) {
      const selectedMovieTitle = event.target.textContent;
      personSearchInput.value = selectedMovieTitle; // Postavljamo naslov filma u polje za pretragu
      personDropdown.innerHTML = ""; // Sakrivamo padajući izbornik
    }
  });

  $("#showTop20").click(function () {
    const settings = {
      async: true,
      crossDomain: true,
      url: "https://unogs-unogs-v1.p.rapidapi.com/search/titles?order_by=date&limit=20&top250=20&type=movie",
      method: "GET",
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "unogs-unogs-v1.p.rapidapi.com",
      },
    };

    $.ajax(settings).done(function (response) {
      const moviesContainer = $("#movies-container");
      moviesContainer.empty();

      response.results.forEach((movie) => {
        let ratingHtml = "";
        if (movie.rating) {
          ratingHtml = `<p class="card-text">Rating: ${movie.rating}</p>`;
        }

        const movieCard = `
                <div class="col-md-3 mb-4">
                <div class="card" style="background-color: #8e8e8e; height:100%;">
                    <img src="${movie.img}" alt="${movie.title}" class="card-img-top">
                    <div class="card-body d-flex flex-column justify-content-between"> <!-- Dodane klase za flexbox -->
                        <div> <!-- Ovaj div će sadržavati sve osim dugmeta, omogućavajući dugmetu da bude na dnu -->
                            <h5 class="card-title">${movie.title}</h5>
                            ${ratingHtml}
                        </div>
                        <button class="btn btn-details" style="background-color: #767676;" data-toggle="modal" data-target="#movie-details-modal" data-netflix-id="${movie.netflix_id}">Detalji</button>
                    </div>
                </div>
            </div>
        `;

        moviesContainer.append(movieCard);
      });
    });
  });

  // Kada korisnik klikne na gumb "Pretraži"
  $("#btn-search").click(function () {
    const searchTerm = movieSearchInput.value;
    if (searchTerm.trim()) {
      displayMoviesMatchingSearchTerm(searchTerm);
    }
  });




  // Funkcija za prikaz svih filmova koji sadrže uneseni tekst u naslovu
  function displayMoviesMatchingSearchTerm(movieTitle) {
    const settings = {
      async: true,
      crossDomain: true,
      url: `https://unogs-unogs-v1.p.rapidapi.com/search/titles?order_by=date&title=${encodeURIComponent(
        movieTitle
      )}&type=movie`,
      method: "GET",
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "unogs-unogs-v1.p.rapidapi.com",
      },
    };

    $.ajax(settings).done(function (response) {
      const moviesContainer = $("#movies-container");
      moviesContainer.empty();

      response.results.forEach((movie) => {
        let ratingHtml = "";
        if (movie.rating) {
          ratingHtml = `<p class="card-text">Rating: ${movie.rating}</p>`;
        }

        const movieCard = `
                <div class="col-md-3 mb-4">
                <div class="card" style="background-color: #8e8e8e; height:100%;">
                    <img src="${movie.img}" alt="${movie.title}" class="card-img-top">
                    <div class="card-body d-flex flex-column justify-content-between"> <!-- Dodane klase za flexbox -->
                        <div> <!-- Ovaj div će sadržavati sve osim dugmeta, omogućavajući dugmetu da bude na dnu -->
                            <h5 class="card-title">${movie.title}</h5>
                            ${ratingHtml}
                        </div>
                        <button class="btn btn-details" style="background-color: #767676;" data-toggle="modal" data-target="#movie-details-modal" data-netflix-id="${movie.netflix_id}">Detalji</button>
                    </div>
                </div>
            </div>
        `;
        dropdown.innerHTML = "";
        moviesContainer.append(movieCard);
      });
    });
  }




  // Selektujemo polje za unos filma
  const movieSearchInput = document.getElementById("movie-search");
  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown-results");
  movieSearchInput.parentElement.appendChild(dropdown);

  let debounceTimeout;

  movieSearchInput.addEventListener("input", function () {
    // Čistimo prethodni debounce timeout
    clearTimeout(debounceTimeout);

    // Postavljamo novi debounce timeout
    debounceTimeout = setTimeout(() => {
      // Uzimamo trenutni tekst iz polja za unos
      const searchTerm = movieSearchInput.value;

      // Ako je polje prazno, ne radimo ništa
      if (!searchTerm.trim()) return;

      // Podešavamo URL za pretragu na osnovu unesenog teksta
      const settings = {
        async: true,
        crossDomain: true,
        url: `https://unogs-unogs-v1.p.rapidapi.com/search/titles?order_by=date&limit=5&title=${encodeURIComponent(
          searchTerm
        )}&type=movie`,
        method: "GET",
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "unogs-unogs-v1.p.rapidapi.com",
        },
      };

      // Pozivamo API
      $.ajax(settings).done(function (response) {
        // Čistimo prethodne rezultate
        dropdown.innerHTML = "";

        // Dodajemo nove rezultate u padajući izbor
        response.results.forEach((movie) => {
          const movieItem = document.createElement("div");
          movieItem.classList.add("movie-item");
          movieItem.textContent = movie.title;
          dropdown.appendChild(movieItem);
        });
      });
    }, 300); // Debounceod 300ms
  });

  // Stilovi za padajući izbor
  const style = document.createElement("style");
  style.textContent = `
    .dropdown-results {
        position: absolute;
        width: 300px;
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #ccc;
        background-color: #fff;
        z-index: 1000;
    }
    .movie-item {
        padding: 10px;
        cursor: pointer;
    }
    .movie-item:hover {
        background-color: #f5f5f5;
    }
`;
  document.head.appendChild(style);

  // Kada korisnik klikne na film u padajućem izborniku
  dropdown.addEventListener("click", function (event) {
    if (event.target.classList.contains("movie-item")) {
      const selectedMovieTitle = event.target.textContent;
      movieSearchInput.value = selectedMovieTitle; // Postavljamo naslov filma u polje za pretragu
      dropdown.innerHTML = ""; // Sakrivamo padajući izbornik
    }
  });



  // Kada korisnik klikne na gumb "Pretraži"
  $("#btn-search").click(function () {
    const searchTerm = movieSearchInput.value;
    if (searchTerm.trim()) {
      displaySelectedMovieDetails(searchTerm);
    }
  });





  // Funkcija za prikaz odabranog filma
  function displaySelectedMovieDetails(movieTitle) {
    const settings = {
      async: true,
      crossDomain: true,
      url: `https://unogs-unogs-v1.p.rapidapi.com/search/titles?order_by=date&limit=1&title=${encodeURIComponent(
        movieTitle
      )}&type=movie`,
      method: "GET",
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "unogs-unogs-v1.p.rapidapi.com",
      },
    };

    $.ajax(settings).done(function (response) {
      const moviesContainer = $("#movies-container");
      moviesContainer.empty();

      const movie = response.results[0];
      if (movie) {
        let ratingHtml = "";
        if (movie.rating) {
          ratingHtml = `<p class="card-text">Rating: ${movie.rating}</p>`;
        }

        const movieCard = `
                <div class="col-md-3 mb-4">
                <div class="card" style="background-color: #8e8e8e; height:100%;">
                    <img src="${movie.img}" alt="${movie.title}" class="card-img-top">
                    <div class="card-body d-flex flex-column justify-content-between"> <!-- Dodane klase za flexbox -->
                        <div> <!-- Ovaj div će sadržavati sve osim dugmeta, omogućavajući dugmetu da bude na dnu -->
                            <h5 class="card-title">${movie.title}</h5>
                            ${ratingHtml}
                        </div>
                        <button class="btn btn-details" style="background-color: #767676;" data-toggle="modal" data-target="#movie-details-modal" data-netflix-id="${movie.netflix_id}">Detalji</button>
                    </div>
                </div>
            </div>
        `;

        moviesContainer.append(movieCard);
      }
    });
  }

  $(document).ready(function () {
    $("#homeLink").on("click", function (e) {
      e.preventDefault(); // Sprječava defaultno ponašanje linka
      location.reload(); // Ponovno učitava trenutnu stranicu
    });
  });




  // Funkcija za prikaz filmova
  function showMovies() {
    const settings = {
      async: true,
      crossDomain: true,
      url: "https://unogs-unogs-v1.p.rapidapi.com/search/titles?order_by=rating&limit=12&type=movie",
      method: "GET",
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "unogs-unogs-v1.p.rapidapi.com",
      },
    };

    $.ajax(settings).done(function (response) {
      const moviesContainer = $("#movies-container");
      for (let i = 0; i < response.results.length; i++) {
        const movie = response.results[i];

        if (!movie) {
          break;
        }


        // Kreiranje HTML za prikaz ocjene (rating) ako postoji
        let ratingHtml = "";
        if (movie.rating) {
          ratingHtml = `<p class="card-text">Rating: ${movie.rating}</p>`;
        }

        const movieCard = `
                <div class="col-md-3 mb-4">
                <div class="card" style="background-color: #8e8e8e; height:100%;">
                    <img src="${movie.img}" alt="${movie.title}" class="card-img-top">
                    <div class="card-body d-flex flex-column justify-content-between"> <!-- Dodane klase za flexbox -->
                        <div> <!-- Ovaj div će sadržavati sve osim dugmeta, omogućavajući dugmetu da bude na dnu -->
                            <h5 class="card-title">${movie.title}</h5>
                            ${ratingHtml}
                        </div>
                        <button class="btn btn-details" style="background-color: #767676;" data-toggle="modal" data-target="#movie-details-modal" data-netflix-id="${movie.netflix_id}">Detalji</button>
                    </div>
                </div>
            </div>
        `;
        moviesContainer.append(movieCard);
      }
    });



    // Obrada klika na dugme "Detalji"
    $("#movies-container").on("click", ".btn-details", function () {
      const netflixId = $(this).data("netflix-id");
      const detailsSettings = {
        async: true,
        crossDomain: true,
        url: `https://unogs-unogs-v1.p.rapidapi.com/title/details?netflix_id=${netflixId}`,
        method: "GET",
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "unogs-unogs-v1.p.rapidapi.com",
        },
      };

      $.ajax(detailsSettings).done(function (response) {
        const movieDetailsContent = $("#movie-details-content");

        // Dodatni AJAX poziv za dohvatanje imena direktora
        const directorSettings = {
          async: true,
          crossDomain: true,
          url: `https://unogs-unogs-v1.p.rapidapi.com/search/people?netflix_id=${netflixId}&person_type=Director`,
          method: "GET",
          headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": "unogs-unogs-v1.p.rapidapi.com",
          },
        };
        $.ajax(directorSettings).done(function (directorResponse) {
          console.log(directorResponse.results[0].full_name);
          directorName = directorResponse.results[0].full_name || "N/A";

          
          movieDetailsContent.html(`
                    <p>${response.synopsis}</p>
                    <p>Godina: ${response.year}</p>
                    <p>Režiser: ${directorName}</p>
                    <!-- Dodajte ostale detalje koje želite prikazati -->
                `);
        });
      });
    });
  }
  // Pozivamo funkciju za prikaz filmova odmah pri učitavanju stranice
  showMovies();



  // Obrada klika na dugme "Prikaži glumce"
  $("#btn-show-actors").click(function () {
    showTop10Actors();
  });


});
