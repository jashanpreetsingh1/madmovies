// main.js
// routing for MMDB

// Common function for a movie card 
function commonMovieCards(movie_name, cover_id, cover_name, rating, date_me) {
    let content = ``;
    return content += `
        <div class="cell large-3 small-12">
            <div class="callout height-1 gray4 click-movies pointer" data-name="${movie_name}">
                <div class="movie-poster">
                    <img src="./uploads/${cover_id}/${cover_name}" alt="${movie_name}">
                    <div class="movie-circle">${rating}</div>
                </div>
                <h4>${movie_name}</h4>
                <h5>${date_me}</h5>
            </div>
        </div>`;
}

// HOME 

function getHome() {
    $(".hideAll").hide();
    window.scrollTo(0, 0);

    // call movie XHR
    let getHome = $.ajax({
        url: './assets/services/home.php',
        type: 'POST',
        dataType: 'json'
    });

    getHome.fail(function (jqXHR, textStatus) {
        alert('Something went wrong! (getHome) ' + textStatus);
    });

    getHome.done(function (data) {

        let content = ``;
        $.each(data, function (i, item) {
            let movie_id = item.movie_id;
            let movie_name = item.movie_name;
            let rating = item.rating;
            let date_me = item.date_me;
            let cover_id = item.cover_id;
            let cover_name = item.cover_name;

            content += commonMovieCards(movie_name, cover_id, cover_name, rating, date_me);
        });

        $(".home-container").html(content);
        $(".home-show").show();
    });

}

//  MOVIE DETAILS 

function getMovies(myText) {
    $(".hideAll").hide();
    window.scrollTo(0, 0);
    stopMovieActors();

    // AJAX to get one movies data
    let getMovies = $.ajax({
        url: './assets/services/movie.php',
        type: 'POST',
        data: {
            movie_name: myText
        },
        dataType: 'json'
    });

    getMovies.fail(function (jqXHR, textStatus) {
        alert('Something went wrong! (getMovies) ' + textStatus);
    });

    getMovies.done(function (data) {

        let movie_name      = data.movie_name;
        let description     = data.description;
        let youtube         = data.youtube;
        let cover_image_id  = data.cover_image_id;
        let cover_image_name= data.cover_image_name;
        let movie_date_me   = data.movie_date_me;
        let genre           = data.genre;
        let cast            = data.cast;

        // Main information
        $(".movie-name").html(movie_name);
        $(".movie-description").html(description);

        // iframe src 
        $(".movie-youtube").attr("src", `https://www.youtube.com/embed/${youtube}`);

        $(".movie-image").attr("src", `./uploads/${cover_image_id}/${cover_image_name}`);
        $(".movie-image").attr("alt", movie_name);

        $(".movie-release-date").html(movie_date_me);

        // Genre
        let content = ``;

        if (genre === null) {
            $(".movie-genre-container").hide();
        } else {
            genre.forEach((value, key) => {
                if (key == 0) {
                    content = `${value}`;
                } else {
                    content = `${content}, ${value}`;
                }
            });

            $(".movie-genre").html(content);
            $(".movie-genre-container").show();
        }

        //  actors slider content
        // actors (CAST) — null property check
        content = ``;

        if (cast === null) {
        $(".movie-actors").hide();
        } else {
        cast.forEach((value) => {
            content += `
            <div class="height-1 gray4 click-people pointer" data-name="${value.name}">
                <div class="movie-poster">
                <img src="./uploads/${value.image_id}/${value.image_name}" alt="${value.name}">
                </div>
                <h4>${value.name}</h4>
                <h5>${value.character_name}</h5>
            </div>
            `;
        });

        $(".movie-actors").html(content).show();
        }

        // Load  movies
    function loadMoviesUnderDetails() {

        // call the  home.php service
        let ajaxMovies = $.ajax({
            url: './assets/services/home.php',
            type: 'POST',
            data: {
                movie_count: 8      
            },
            dataType: 'json'
        });

        ajaxMovies.fail(function (jqXHR, textStatus) {
            alert('Something went wrong! (loadMoviesUnderDetails) ' + textStatus);
        });

        ajaxMovies.done(function (data) {

            let content = ``;

            $.each(data, function (i, item) {
                let movie_name = item.movie_name;
                let rating     = item.rating;
                let date_me    = item.date_me;
                let cover_id   = item.cover_id;
                let cover_name = item.cover_name;

                content += commonMovieCards(movie_name, cover_id, cover_name, rating, date_me);
            });

            // put these cards into the movie page container
            $(".movie-related-movies").html(content);
        });
    }

    // load  movies 
    loadMoviesUnderDetails();


        startMovieActors();
        $(".movies-show").show();
    });
}


// PEOPLE PAGE 

function getPeople(personName) {
    $(".hideAll").hide();
    window.scrollTo(0, 0);

    let ajaxPeople = $.ajax({
        url: './assets/services/people.php',
        type: 'POST',
        data: {
            name: personName   // matches $_POST["name"] in people.php
        },
        dataType: 'json'
    });

    ajaxPeople.fail(function (jqXHR, textStatus) {
        alert('Something went wrong! (getPeople) ' + textStatus);
    });

    ajaxPeople.done(function (data) {

        // info from people.php
        $(".people-name").html(data.people_name);
        $(".people-biography").html(data.people_biography);
        $(".people-born").html(data.born);
        $(".people-died").html(data.died);

        // people image
        $(".people-image").attr(
            "src",
            `./uploads/${data.cover_image_id}/${data.cover_image_name}`
        );
        $(".people-image").attr("alt", data.people_name);

        //extra images (people_images)
        let content = ``;
        if (data.people_images) {
            data.people_images.forEach(function (img) {
                content += `
                    <div class="cell large-3 small-12">
                        <div class="callout height-1 gray4">
                            <div class="movie-poster">
                                <img src="./uploads/${img.id}/${img.name}" alt="${data.people_name}">
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        $(".people-images").html(content);

        
        function loadMoviesUnderDetails() {

            // call the home.php service
            let ajaxMovies = $.ajax({
                url: './assets/services/home.php',
                type: 'POST',
                data: { 
                    movie_count: 8 
                },
                dataType: 'json'
            });
    
            ajaxMovies.fail(function (jqXHR, textStatus) {
                alert('Something went wrong! (loadMoviesUnderDetails) ' + textStatus);
            });
    
            ajaxMovies.done(function (data) {
    
                let content = ``;
    
                $.each(data, function (i, item) {
                    let movie_name = item.movie_name;
                    let rating     = item.rating;
                    let date_me    = item.date_me;
                    let cover_id   = item.cover_id;
                    let cover_name = item.cover_name;
    
                    content += commonMovieCards(movie_name, cover_id, cover_name, rating, date_me);
                });
    
                // put cards into the movie page container
                $(".movie-related-movies").html(content);
            });
        }
    
        // load extra movies 
        loadMoviesUnderDetails();

        $(".people-movies").html(content);

        $(".people-show").show();
    });
}

// SLIDERS 

function startMovieActors() {
    $(".movie-actors").slick({
        dots: true,
        arrows: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000
    });
}

function stopMovieActors() {
    if ($(".movie-actors").hasClass("slick-initialized")) {
        $(".movie-actors").slick("unslick");
    }
}

//  SEARCH 
const getSearch = (searchText) => {

    // If empty hide 
    if (!searchText.trim()) {
        $(".search-results").hide().empty();
        return;
    }
    // call movie XHR
    let ajaxSearch = $.ajax({
        url: './assets/services/search.php',
        type: 'POST',
        data: {
            search_text: searchText,
            movie_count: 10     
        },
        dataType: 'json'
    });

    ajaxSearch.fail(function (jqXHR, textStatus) {
        alert('Something went wrong! (getSearch) ' + textStatus);
    });

    ajaxSearch.done(function (data) {

        let moviesObj = data.movies || {};
        let error     = data.error || {};
        let keys      = Object.keys(moviesObj);
        let content   = ``;

        // No results  hide dropdown
        if (error.error_id === 1 || keys.length === 0) {
            $(".search-results").hide().empty();
            return;
        }

        // moviesObj OBJECT
        keys.forEach(function (key) {
            let item = moviesObj[key];

            if (item.type == "1") {
                // movie result
                content += `
                    <li class="click-movies" data-name="${item.name}">
                        <div>
                            <img src="./uploads/${item.image_id}/${item.image_name}" alt="${item.name}">
                        </div>
                        <div>
                            ${item.name}
                        </div>
                    </li>
                `;
            } else if (item.type == "2") {
                // person result
                content += `
                    <li class="click-people" data-name="${item.name}">
                        <div>
                            <img src="./uploads/${item.image_id}/${item.image_name}" alt="${item.name}">
                        </div>
                        <div>
                            ${item.name}
                        </div>
                    </li>
                `;
            }
        });

        $(".search-results").html(content).show();
    });
};



// ON LOAD + ROUTING

$(window).on("load", function () {

    // Start sliders 
    // startMovieActors();

    // Search 
    $("#search").keyup(function () {
        let search = $(this).val();
        getSearch(search);
    });

    // Click handlers 
    $(document).on('click', 'body .click-home', function () {
        location.href = `#/home/`;
    });

    $(document).on('click', 'body .click-movies', function () {
        let myText = $(this).attr("data-name");
        location.href = `#/movies/${myText}`;
    });

    $(document).on('click', 'body .click-people', function () {
        let myText = $(this).attr("data-name");
        // alert(myText);
        location.href = `#/people/${myText}`;

    });

    // SAMMY ROUTING 
    var app = $.sammy(function () {

        this.get('#/home/', function () {
            getHome();
        });

        this.get('#/movies/:myText', function () {
            let myText = this.params["myText"];
            getMovies(myText);
        });

        this.get('#/people/:myText', function () {
            let myText = this.params["myText"];
            getPeople(myText);
        });

    });

    // default page
    $(function () {
        app.run('#/home/');
    });
});
