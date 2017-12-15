$(window).on('load', function(){
	var username = $(".username").text();
	$(".ring").hide();

	// refresh token, update the user in db and update html
	$(".tokens .button").click(function(){
		var refresh_token = $(".refresh").text();

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


	// converts an alarm to a Date object so we can compare them
	function alarmToDate(a){
    date = new Date();
    hr_min = a.time.split(":");
    date.setHours(hr_min[0]);
    date.setMinutes(hr_min[1]);
    date.setSeconds(0);
    return date;
	}

	// converts a Date object back to a time string HH:MM AM/PM
	function dateToTime(d){
		time = d.toLocaleTimeString();
		return time.substring(0,4)+time.substring(7,);
	}

	// find the next alarm 
	$.ajax({
		url: "/user",
		type: "GET",
		data: {"username": username},
		success: function(user){
			user = user[0];
			var alarms = user.alarms.map(a => alarmToDate(a));
			var now = new Date();

			// want to sort so that we get the closest times to now first
			alarms.sort(function(a,b){
		    distancea = now - a;
		    distanceb = now - b;
				if (distancea > 0 && distanceb < 0){
					return 1;
				}
		    return distanceb - distancea;
			});

			// update the home page with latest alarm
			var nextTime = alarms[0];
			$("#next-alarm").text(dateToTime(nextTime));
			$("#to-ring").text(dateToTime(nextTime));

			// calculates difference in time and updates home page 
			function updateCountdown(){
				// diff from now til next alarm in milliseconds
				var updateNow = new Date();
				var diff  = nextTime.getTime() - updateNow.getTime();
				var diffSeconds = diff/1000;
				var diffToHours   = Math.floor(diffSeconds/3600);
				var diffToMinutes = Math.floor(diffSeconds%3600/60);

				// pad with zeros
				function pad(n) {
			    return (n < 10) ? ("0" + n) : n;
				}

				// update countdown
				$("#countdown").text(pad(diffToHours)+":"+pad(diffToMinutes));
				console.log(pad(diffToHours)+":"+pad(diffToMinutes));
			}

			// set interval for countdown every minute
			updateCountdown();
			var countdown = setInterval(updateCountdown, 60000);
			
			// when alarm ring
			setTimeout(function(){
				$(".ring").show();
				$(".countdown").hide();
				clearInterval(countdown);
				Materialize.toast("Refresh for next alarm", 10000);
			}, nextTime.getTime() - now.getTime());

		}
	});


	// search for song and play it on Spotify
	$(".send-song").click(function(){
		var toSearch = $(".search").val();
		var access_token = $(".access").text();
		console.log(toSearch);

		$.ajax({
			url: "https://api.spotify.com/v1/search",
			type: "GET",
			data: {
				q: toSearch,
				type: "track",
				limit: 1
			},
			headers: { 'Authorization': 'Bearer ' + access_token },
			success: function(data, status){
				console.log(data);
				console.log([data.tracks.items[0].uri]);

				// play the song found on spotify
				$.ajax({
					url: "https://api.spotify.com/v1/me/player/play",
					type: "PUT",
					data: `{"uris": ["${data.tracks.items[0].uri}"]}`,
					headers: { 'Authorization': 'Bearer ' + access_token },
					success: function(result, status){
						console.log(result);
						console.log(status);
						Materialize.toast("Playing on Spotify!", 3000);
					}
				});
			}, 
			error: function(){
				Materialize.toast("No song found", 3000);
			}
		});
	});


});