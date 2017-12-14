$(window).on('load', function(){

	// refresh token, update the user in db and update html
	$(".tokens .button").click(function(){
		var refresh_token = $(".refresh").text();
		var username = $(".username").text();

		// make request to refresh-token
		$.ajax({
			url: "/refresh-token?refresh_token="+refresh_token,
			type: "GET",
			success: function(data){
				var access_token = data.access_token;

				// update html with new access token
				$(".access").text(access_token);

				// update db with new access token
				$.ajax({
					url: "/user",
					type: "POST",
					data: {
						find: `{"username": "${username}"}`,
						update: `{"$set":{"access_token": "${access_token}"}}`
					}
				});
			}
		});
	});
});