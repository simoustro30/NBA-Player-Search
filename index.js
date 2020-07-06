
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
        playerInfoClick(responseJson);
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
  });
}
//FUNCTIONS TO DISPLAY PLAYERS AND STATS//
function loopPlayers(responseJson){
    $('#results-list').empty();
    for (let i = 0; i < responseJson.data.length; i++){
        $('#results-list').append(
            `<li><button class="dropdown" id="payerName">${responseJson.data[i].first_name} ${responseJson.data[i].last_name}</button>
            <div class="panel">
            <p>Position: ${responseJson.data[i].position}</p>
            <p>Height: ${responseJson.data[i].height_feet},${responseJson.data[i].height_inches}</p>
            <p>Weight: ${responseJson.data[i].weight_pounds}</p>
            <p>Team: ${responseJson.data[i].team.full_name}</p>
            </div>
          `)

        }
    $('#results').removeClass('hide');
  };

function playerInfoClick(){
        $('.dropdown').click(function(event){
            $('.panel').slideToggle('active');
        });
};

function nbaFunctions(){
    watchForm();
    playerInfoClick();
}
$(nbaFunctions);
