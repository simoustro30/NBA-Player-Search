const searchURL = 'https://www.balldontlie.io/api/v1/players';
const secondSearchUrl = `https://www.balldontlie.io/api/v1/season_averages?player_ids[]=`
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
    $('#results-list').empty();
    $('.response-title').empty();
    const searchTerm = $('#js-search-term').val();
    getPlayers(searchTerm);
  });
}
//FUNCTIONS TO DISPLAY PLAYERS AND STATS//
function loopPlayers(responseJson){
    if(responseJson.data.length == 0)
      {$('.response-title').html(`<h2> No players with that name were found</h2>`);}
    else{
    for (let i = 0; i < responseJson.data.length; i++){;
      if (responseJson.data[i].position === null || responseJson.data[i].height_feet === null || responseJson.data[i].height_inches === null || responseJson.data[i].weight_pounds === null) {
        $('#results-list').append("");}
      else {
        $('.response-title').append(`<h2>NBA Players Found :</h2>`)
        $('#results-list').append(`
            <li><button class="dropdown">${responseJson.data[i].first_name} ${responseJson.data[i].last_name}</button>
            <div class="panel">
                <p><strong>Position:</strong> ${responseJson.data[i].position}</p>
                <p><strong>Height:</strong> ${responseJson.data[i].height_feet},${responseJson.data[i].height_inches}</p>
                <p><strong>Weight:</strong> ${responseJson.data[i].weight_pounds}</p>
                <p><strong>Team:</strong> ${responseJson.data[i].team.full_name}</p>
                <div class="more-info">
                    <button class="player-info" id= "${responseJson.data[i].id}">Stats</button>           
                </div>
            </div>
          `);
        };
    };
    };
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
  if(responseJson.data === undefined || responseJson.data.length == 0){
      $('#myNav').append(`<div class="overlay-content">
      <h3 class="title-more-info no-stats">Sorry we couldn't find the stats for this player!</h3>
      </div>`)
    }
    else{
  for (let i = 0; i < responseJson.data.length; i++){
    $('#myNav').append(`
        <div class="overlay-content">
        <h3 class="title-more-info" >Season Averages: ${responseJson.data[i].season}</h3>
        <div class="content-flex">
          <p data-tool-tip="Games Played">GP: ${responseJson.data[i].games_played}</p>
          <p data-tool-tip="Minutes Played">Min: ${responseJson.data[i].min}</p>
          <p data-tool-tip="Field Goals Made and Attempted">FG: ${responseJson.data[i].fgm} - ${responseJson.data[i].fga}</p>
          <p data-tool-tip="Field Goal Percentage">FG%: ${responseJson.data[i].fg_pct*100}</p>
          <p data-tool-tip="Three Points Made and Attempted">3PT: ${responseJson.data[i].fg3m} - ${responseJson.data[i].fg3a}</p>
          <p data-tool-tip="Three Points Percentage">3P%: ${responseJson.data[i].fg3_pct*100}</p>
          <p data-tool-tip="Free Throws Made and Attempted">FT: ${responseJson.data[i].ftm} - ${responseJson.data[i].fta}</p>
          <p data-tool-tip="Free Throw Percentage">FT%: ${Math.trunc(responseJson.data[i].ft_pct*100)}</p>
          <p data-tool-tip="Offensive Rebound">OR: ${responseJson.data[i].oreb}</p>
          <p data-tool-tip="Defensive Rebound">DR: ${responseJson.data[i].dreb}</p>
          <p data-tool-tip="Rebounds">REB: ${responseJson.data[i].reb}</p>
          <p data-tool-tip="Assists">AST: ${responseJson.data[i].ast}</p>
          <p data-tool-tip="Blocks">BLK: ${responseJson.data[i].blk}</p>
          <p data-tool-tip="Steals">STL: ${responseJson.data[i].stl}</p>
          <p data-tool-tip="Personal Fouls">PF: ${responseJson.data[i].pf}</p>
          <p data-tool-tip="Turnovers">TO: ${responseJson.data[i].turnover}</p>
          <p data-tool-tip="Points">PTS: ${responseJson.data[i].pts}</p> 
        </div>
        </div>`)
      }
    }
}

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