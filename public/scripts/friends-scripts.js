 $(window).on('load', function(){

	// on new alarm click, add an alarm to the current user
	var username = $("#username").text();

	$("#new-friend").click(function(){

		var f_username = $("#new-friend-username").val();

		// check if username exists and add user as friend if so
		$.ajax({
			url: "/user",
			type: "GET",
			data: {
				"username": f_username
			}, 
			success:function(friendData){
				var friend = friendData[0];
				var fields = ["username", "firstname", "lastname", "phonenum"];
				friendData = {};
				fields.forEach(function(field){
					friendData[field] = friend[field];
				});
				
				// if username found, then add user to friends array of current user
				$.ajax({
					url: "/user",
					type: "POST",
					data: {
						find: `{"username": "${username}"}`,
						update: `{"$push":{"friends": ${JSON.stringify(friendData)}}}`
					}, 
					success:function(){
						location.reload();
					}
				});
			},
			error: function(){
				Materialize.toast("Username not found", 3000);
			}
		});

	});

});