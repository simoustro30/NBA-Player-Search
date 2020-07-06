 
const searchURL = 'https://www.balldontlie.io/api/v1/players';
var playersIds;
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
        playersIds = responseJson
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    getPlayers(searchTerm);
    loopPlayers(playersIds);
  });
}
//FUNCTIONS TO DISPLAY PLAYERS AND STATS//
function loopPlayers(playersIds){
    for (let i = 0; i < playersIds.data.length; i++){
        $('#results-list').append(
            `<li><h3 id="payerName">${playersIds.data[i].first_name} ${playersIds.data[i].last_name}</h3>
          `)
    }
    $('#results').removeClass('hide');
  };
 

$(watchForm);
