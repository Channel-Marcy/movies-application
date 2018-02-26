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
        $('#movieDisplay').html('<h3>Here are all the movies:</h3> ' + '<table id="ourTable" class="table"><thead><tr><th>ID</th><th>Movie</th><th>Rating</th><th>Delete</th></tr></thead><tbody>');
        movies.forEach(({title, rating, id}) => {
            $('#ourTable').append(`<tr><td>${id}</td><td>${title}</td><td>${rating}</td><td><button class="remove">Delete</button></td></tr>`);
        });
        $('#movieDisplay').append('</tbody></table>');
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

// ###################    Check values for input  ##########################
$('.searchMovie').keyup(function(){
  if($('#movieTitle').val()!=='' && $('#movieRating').val()!==''){
    $('#addMovie').prop('disabled',false);
  }else{
      $('#addMovie').prop('disabled',true);
  }
});


//#################    Add movie button  #####################################
$('#addMovie').click(function(){
  event.preventDefault();
  let newMovie = {
    title: $('#movieTitle').val(),
    rating: $('#movieRating').val()
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

});

$("#getMovie").click(function() {
    event.preventDefault();
    console.log("hello");
    getMovies().then((movies) => {
        let changeMovie = singleMovie(movies);
        $('#editMovieTitle').val(changeMovie[0].title);
        $('#editMovieRating').val(changeMovie[0].rating);
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
        id: $("#editMovieID").val()
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
});


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
