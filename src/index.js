/**
 * es6 modules and imports
 */
// import sayHello from './hello';
// sayHello('World');

/**
 * require style imports
 */
const {getMovies} = require('./api.js');
const $ = require('jquery');

function showMovies() {
    getMovies().then((movies) => {
        $('#movieDisplay').html('<h3>Here are all the movies:</h3> ' + '<table id="ourTable" class="table table-hover"><thead><tr><th id="iD">ID</th><th id="title">Movie</th><th id="rating">Rating</th><th id="genre">Genre</th><th>Delete</th></tr></thead><tbody id="tableBody">');
        displayMovies(movies);

        $("#rating").click(function(){
            numSorter(1, "rating");
        });
        $('#rating').hover(function(){
          $(this).toggleClass('diffFont');
        },function(){
          $(this).toggleClass('diffFont');
        });

        $("#iD").click(function(){
          displayMovies(movies);
        });
        $('#iD').hover(function(){
            $(this).toggleClass('diffFont');
        },function(){
            $(this).toggleClass('diffFont');
        });

        $("#title").click(function(){
           alphaSorter("title", 1);
        });
        $('#title').hover(function(){
            $(this).toggleClass('diffFont');
        },function(){
            $(this).toggleClass('diffFont');
        });

        $("#genre").click(function(){
           alphaSorter("genre", 3);
        });
        $('#genre').hover(function(){
            $(this).toggleClass('diffFont');
        },function(){
            $(this).toggleClass('diffFont');
        });
        $('#movieGenre').change(function(){
            if($('#movieTitle').val()!=='' && $('#movieRating').val()!=='' && $('#movieGenre').val() !== null){
                $('#addMovie').prop('disabled',false);
            }else{
                $('#addMovie').prop('disabled',true);
            }
        })

        $('.remove').click(function(){
          event.preventDefault();
            let a =$(this).parent().parent()[0].innerText;
            let idNum = parseFloat(a.match(/\d/g)[0]);
            removeMovie(idNum);
        });
        niceTable();
    }).catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.')
        console.log(error);
    });
}
showMovies();

function displayMovies(arr) {

      let html = "";
        arr.forEach(({title, rating, id, genre}) => {
        html += `<tr><td>${id}</td><td>${title}</td><td>${rating}</td><td>${genre}</td><td><button class="remove">Delete</button></td></tr>`;
});
    html += '</tbody></table>';
    $("#tableBody").html(html);
}

// ###################    Check values for input  ##########################
$('.searchMovie').keyup(function(){
  if($('#movieTitle').val()!=='' && $('#movieRating').val()!=='' && $('#movieGenre').val() !== null){
    $('#addMovie').prop('disabled',false);
  }else{
      $('#addMovie').prop('disabled',true);
  }
});


$('#editMovieTitle,#editMovieRating').keyup(function(){
    if($('#editMovieTitle').val()!=='' && $('#editMovieRating').val()!==''){
        $('#editMovie').prop('disabled',false);
    }else{
        $('#editMovie').prop('disabled',true);
    }
});





//#################    Add movie button  #####################################
$('#addMovie').click(function(){
  event.preventDefault();
  let newMovie = {
    title: $('#movieTitle').val(),
    rating: $('#movieRating').val(),
    genre: $('#movieGenre').val()
  };
  const url = ('/api/movies');
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      },
    body: JSON.stringify(newMovie)
  };
  fetch(url,options)
      .then(showMovies);
    $('#movieTitle').val('');
    $('#movieRating').val('');
    $("#movieGenre").val('');

});

$("#getMovie").click(function() {
    event.preventDefault();
    console.log("hello");
    getMovies().then((movies) => {
        let changeMovie = singleMovie(movies);
        $('#editMovieTitle').val(changeMovie[0].title);
        $('#editMovieRating').val(changeMovie[0].rating);
        $('#editMovieGenre').val(changeMovie[0].genre);
        console.log(changeMovie);
    });
});

function singleMovie(movies){
    let changeMovie = movies.filter((movie) =>
        movie.id === parseFloat($("#editMovieID").val())
    );
    return changeMovie;
}


//################ Edit movie info ##############################################

$("#editMovie").click(function() {
    event.preventDefault();
    let updatedMovie = {
        title: $('#editMovieTitle').val(),
        rating: $('#editMovieRating').val(),
        id: $("#editMovieID").val(),
        genre: $('#editMovieGenre').val()
    };
    const url = ('/api/movies/' + parseFloat($("#editMovieID").val()));
    // const url = ("/api/movies");
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMovie)
    };
    fetch(url, options)
        .then(showMovies);
    $('#editMovieTitle').val("");
    $('#editMovieRating').val("");
    $("#editMovieID").val("");
    $('#editMovieGenre').val("");
});


$('#editMovieRating').keyup(function(){
    let rating = parseFloat($('#editMovieRating').val());
    if(rating >0 && rating < 11){
        $('#editMovie').prop('disabled',false);
        $('.ratingError2').css('display','none')
    } else{
        $('#editMovie').prop('disabled',true);
        $('.ratingError2').css('display','block');
    }
})




//#######################   DELETE Movie      #####################################

function removeMovie(idNum){
      console.log('hello from testing');

      const url = ('/api/movies/' + idNum);
      const options = {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          }

      };
      fetch(url, options)
          .then(showMovies);

}


//################# Check for valid ID input  #############################

$('#editMovieID').keyup(function(){

  let idHolder =[];
  $('tbody tr').each(function(index,element){idHolder.push((element.innerText).match(/\d/g)[0])})

    if(idHolder.includes($('#editMovieID').val())){
        $('#getMovie').prop('disabled',false);
    }else{
        $('#getMovie').prop('disabled',true);
    }
});

function niceTable(){
  $('table').addClass('table');
}


//#####################  Check for Valid ID for adding movie   #######################################

$('#movieRating').keyup(function(){
  let rating = parseFloat($('#movieRating').val());
  if(rating >0 && rating < 11){
      $('#addMovie').prop('disabled',false);
      $('.ratingError').css('display','none')
  } else{
      $('#addMovie').prop('disabled',true);
      $('.ratingError').css('display','block');
  }
})



//####################### Sorting Features #######################################
function numSorter(number, key) {
    getMovies().then(function(movies) {
        var numberHolder = [];
        $('tbody tr').each(function (index, element) {
            numberHolder.push((element.innerText).match(/\d{1,}/g)[number])
        });
        numberHolder.sort((a, b)=>{return a-b});
        numberHolder = numberHolder.filter(function(ele, ind, arr) {
           return arr.indexOf(ele) == ind;
        });
        let newData = [];
        numberHolder.forEach(function (num){
            movies.forEach(function(movie) {
               if (movie[key] === num) {
                   newData.push(movie);
               }
            });
        });
        displayMovies(newData);
        });
}

function alphaSorter(key, num) {
    getMovies().then(function(movies) {
      var alphaHolder = [];
      for (let i = num; i < $("td").length; i += 5){
          alphaHolder.push($("td")[i].innerText.toLowerCase());
      }
      alphaHolder.sort();
       alphaHolder = alphaHolder.filter(function(ele, ind, arr) {
            return arr.indexOf(ele) == ind;
        });
      let newData = [];
      alphaHolder.forEach(function(element) {
          movies.forEach(function(movie){
             if (movie[key].toLowerCase() === element){
                 newData.push(movie);
             }
          });
      });
    displayMovies(newData);
    });

}
$('#searchBar').keyup(function(){
  searchAll();
});

function searchAll(){
  let text = $('#searchBar').val().toLowerCase();
    $('tbody tr').each(function(index,element){
      if($('#searchBar').val()===''){
          $(element).css('display','table-row');
      }
      else if(!element.innerText.toLowerCase().includes(text)){
        $(element).css('display','none');
      }
      else{
          $(element).css('display','table-row');
      }
    });
}


