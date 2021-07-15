/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  try {
    const res = await axios.get('https://api.tvmaze.com/search/shows',
      { params: {q: query}, 
        timeout: 10000}
      );
    console.log(res);
    const result = [];
    for (let obj of res.data){
      const {id, name, summary, image} = obj.show;
      result.push({id, name, summary, image});
    }
    return result;
  } catch (err) {
    alert(`Could not reach TV Maze API at this time. Error: ${err.message}`)
    return [];
  }
}


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
async function getEpisodes(showID){
  const url = `https://api.tvmaze.com/shows/${showID}/episodes`;
  try {
    const res = await axios.get(url, {timeout: 10000});
    console.log(res);
    const result = [];

    for (let obj of res.data){
      const {id, name, season, number} = obj;
      result.push({id, name, season, number});
    }
    console.log('Episode Array', result);
    return result;
  } catch (err) {
    alert(`Could not reach TV Maze API at this time. Error: ${err.message}`)
    return [];
  }
}


function populateEpisodes(episodes){
  console.log('Populating episodes...')
  const $episodeList = $('#episodes-list');
  $episodeList.empty();
  $('#episodes-area').show();
  for (let episode of episodes){
    const $li = $(
      `<li data-episode-id="${episode.id}">S${episode.season}.E${episode.number} - "${episode.name}"</li>`
    )
    $episodeList.append($li);
  }

}


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  const missingImg = 'https://tinyurl.com/tv-missing';
  for (let show of shows) {
    let imgSrc;
    try{
      imgSrc = show.image.medium;
    } catch {
      imgSrc = missingImg;
    }
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src="${imgSrc}">
             <p class="card-text">${show.summary}</p>
             <button>Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();
  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


// Handle User Clicks in the show list area
// Used for clicking on the Episodes button of each show card

$('#shows-list').on('click', 'button', async function(e){
  e.preventDefault();
  const showID = $(this).parent().parent().attr('data-show-id');
  let episodes = await getEpisodes(showID);

  populateEpisodes(episodes);

})



/* Testing */

async function testSearch (query='Better Call Saul'){
  let results = await searchShows(query);
  console.log(results);
  let outcome = 'All data present';
  let count = 0;
  for (let obj of results){
    console.log(obj);
    for (let key of Object.keys(obj)){
      console.log(key, obj[key]);
      if (obj[key] === undefined){
        count++;
        outcome = (`Missing ${count} keys in objs`)
      }
    }
  }

  console.log('All data retrieved intact')
}

function testDisplayShow(){

  let sampleShow = {
    id : 1,
    name : 'Ice Guys',
    summary : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed sint et ab inventore reprehenderit assumenda nobis numquam asperiores! Molestiae deserunt reprehenderit officiis obcaecati asperiores mollitia vitae est at aperiam cupiditate!',
    image : null
  }

  populateShows([sampleShow, sampleShow, sampleShow, sampleShow]);

}

function testDisplayEpisode(){
  let sampleEpisode = {
    name : 'Pilot',
    season: 1,
    number: 1,
    id: 1
  }
  populateEpisodes([sampleEpisode, sampleEpisode, sampleEpisode])
}