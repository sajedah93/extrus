
var uploadToIMGUR = function(client_id, imgData, callback) {

	$.ajax({
		url: 'https://api.imgur.com/3/image',
		headers: {
			'Authorization': 'Client-ID ' + client_id,
			'Accept': 'application/json'
		},
		type: 'POST',
		data: {
			'image': imgData,
			'type': 'base64'
		},
		success: function success(res) {

			if (callback) {
				callback(res.data);
			}
		}
	});
};

window.uploadToIMGUR = uploadToIMGUR;