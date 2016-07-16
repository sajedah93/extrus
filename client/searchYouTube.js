var searchYouTube = (options, callback) => {
	$.get('https://www.googleapis.com/youtube/v3/search',{
		part: 'snippet',
		key: options.key,
		q: options.query,
		maxResults: options.max,
		type: 'video',
   		videoEmbeddable: 'true'
	})

	.done(({items})=>{
		if(callback){
			callback(items);
		}
	})

	.fail(({responsJSON}) => {
		responseJSON.error.errors.forEach((err) =>
			console.error(err)
		);
	});
};

window.searchYouTube = searchYouTube;
