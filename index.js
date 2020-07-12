const searchURL = 'https://www.balldontlie.io/api/v1/players';
//FUNCTIONS TO OBTAIN PLAYERS//
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}
function getPlayers(query) {
  const params = {
    page: 0,
    per_page: 100,
    search: query
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
  console.log(url);
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(function(responseJson){
        loopPlayers(responseJson);
    })
    .catch(err => {
      $('#results').removeClass('hide')
      $('.response-title').text('No results :(')
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    getPlayers(searchTerm);
  });
}
//FUNCTIONS TO DISPLAY PLAYERS AND STATS//
function loopPlayers(responseJson){
    $('#results-list').empty();
    for (let i = 0; i < responseJson.data.length; i++){
        $('#results-list').append(
            `<li><button class="dropdown id${responseJson.data[i].id}">${responseJson.data[i].first_name} ${responseJson.data[i].last_name}</button>
            <div class="panel">
                <p>Position: ${responseJson.data[i].position}</p>
                <p>Height: ${responseJson.data[i].height_feet},${responseJson.data[i].height_inches}</p>
                <p>Weight: ${responseJson.data[i].weight_pounds}</p>
                <p>Team: ${responseJson.data[i].team.full_name}</p>
                <div class="more-info">
                    <button class="player-info" id= "${responseJson.data[i].id}">More Stats</button>           
                </div>
            </div>
          `)
        }
    $('#results').removeClass('hide');
  };
function playerInfoClick(){
  $(`#results-list`).on('click', '.dropdown', function(event){
      $( this ).siblings( '.panel' ).slideToggle('active');
  });
};
function moreStatsButton(){
    $('#results-list').on('click', '.player-info', function(event){
       const playersId = $(this).attr('id');
       secondFetch(playersId);
      $('#myNav').addClass( 'displayOverlay' );
        $('#myNav').html(`
            <a href="javascript:void(0)" class="closebtn">&times;</a>
            `);
  
      });    
}

function displayMoreStats(responseJson){
  for (let i = 0; i < responseJson.data.length; i++){
    $('#myNav').append(`
        <div class="overlay-content">
        <h3 class="title-more-info" >Season Averages: ${responseJson.data[i].season}</h3>
          <p>GP: ${responseJson.data[i].games_played}</p>
          <p>Min: ${responseJson.data[i].min}</p>
          <p>FG: ${responseJson.data[i].fgm} - ${responseJson.data[i].fga}</p>
          <p>FG%: ${responseJson.data[i].fg_pct*100}</p>
          <p>3PT: ${responseJson.data[i].fg3m} - ${responseJson.data[i].fg3a}</p>
          <p>3P%: ${responseJson.data[i].fg3_pct*100}</p>
          <p>FT: ${responseJson.data[i].ftm} - ${responseJson.data[i].fta}</p>
          <p>FT%: ${Math.trunc(responseJson.data[i].ft_pct*100)}</p>
          <p>OR: ${responseJson.data[i].oreb}</p>
          <p>DR: ${responseJson.data[i].dreb}</p>
          <p>REB: ${responseJson.data[i].reb}</p>
          <p>AST: ${responseJson.data[i].ast}</p>
          <p>BLK: ${responseJson.data[i].blk}</p>
          <p>STL: ${responseJson.data[i].stl}</p>
          <p>PF: ${responseJson.data[i].pf}</p>
          <p>TO: ${responseJson.data[i].turnover}</p>
          <p>PTS: ${responseJson.data[i].pts}</p> 
        </div>`)
    }
}

const secondSearchUrl = `https://www.balldontlie.io/api/v1/season_averages?player_ids[]=`

function secondFetch(playersId){

  const secondUrl = secondSearchUrl + playersId
  console.log(secondUrl);
  fetch(secondUrl)
  .then(response => {
    if (response.ok) {
      return response.json();
      
    }
    throw new Error(response.statusText);
  })
  .then(function(responseJson){
      displayMoreStats(responseJson);
  })
  .catch(err => {
    $('#myNav').append(`<p>Something went wrong: ${err.message}</p>`);
  });
};

  /* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    $("#myNav").on( 'click', '.closebtn', function(event){
      $( "#myNav" ).removeClass( 'displayOverlay' );
    });
}
function nbaFunctions(){
    watchForm();
    playerInfoClick();
    moreStatsButton();
    closeNav();
}
$(nbaFunctions);