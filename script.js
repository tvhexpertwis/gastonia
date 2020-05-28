// algorithm means set of instructions

 function watchSearchForm() {
	$('#js-main-search').submit((e) => {
		e.preventDefault();

		const searchTerm = $('#js-search-term').val();
		console.log(searchTerm);

		// call fetch events with search term
		fetchEvents(searchTerm);
		console.log('watchSearchForm ran');
	});
};

// format the query parameters into string joined by '&'
function formatQueryParams(params) {
	// keyword=searchTerm&apikey=811DB6AHooasuDwqcadNXKrcBHDunzq3&size=20

	const queryItems = Object.keys(params)
	.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);

	console.log('formatQueryParams ran');
	return queryItems.join('&');
};

// fetch events using 'searchTerm' as keyword below
function fetchEvents(searchTerm) {
	// Search parameters to format
	const params = {
		keyword: searchTerm,
    	apikey: '811DB6AHooasuDwqcadNXKrcBHDunzq3',
		size: 20
	};

	const baseUrl = 'https://app.ticketmaster.com/discovery/v2/events.json';
	const queryUrl = formatQueryParams(params);

	// combine first and second half of urls together
	const fullUrl = baseUrl + '?' + queryUrl;
	console.log(fullUrl);

	// built in fetch function calling the full URL
	fetch(fullUrl)
		.then(response => {
			
			if (response) {
				console.log(response);
				return response.json();
			}
		})
		.then(responseJson => {
			displayResults(responseJson, searchTerm);
		})
		.catch(err => {
			console.log(err);
		});

	console.log('fetchGroups ran');
}

function displayResults(eventResults, searchTerm) {

	if (eventResults._embedded === undefined) {
		$('#js-search-results').empty();

		$('#js-search-results').append(`
			<div class="error">
				<p>There are no events coming up for "${searchTerm}". Try again.</p>
			</div>`
		);

		console.log("Your search for " + searchTerm + " didn't work. Try again.");
	}; 

	const potatoes = eventResults._embedded.events;

	console.log(potatoes);

	// Remove old search results
	$('#js-search-results').empty();
	
	potatoes.forEach(function(event) {

		// append means adding on to 
		$('#js-search-results').append(`
			<div class="event">
				<img class="event-image" src=${event.images[0].url}>

				<div class="event-info">
					<h3 class="event-header">${event.name}</h3>
					<p class="event-date">${event.dates.start.localDate}</p>
					<a class="buy-tickets-button" href=${event.url} target="_blank">Buy Tickets</a>
				</div>
			</div>`
		)})
	};

// function handleLoadMoreClick() {
// 	$('#js-loadmore-button').on('click', function() {
// 		for (let i = 11; i < 20; i = i + 1) {
// 			$('#js-search-results').append(
// 				`<div class="event">
// 					<img src=${results[i].images[0].url}>
// 					<h1>${results[i].name}</h1>
// 					<p>${results[i].dates.start.localDate}</p>
// 				</div>`
// 			)
// 		}
// 	})
// }

$(watchSearchForm);
