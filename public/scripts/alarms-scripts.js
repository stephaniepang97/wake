
$(window).on('load', function(){

	// on new alarm click, add an alarm to the current user
	var username = $("#username").text();

	$(".button").click(function(){

		var time = $("#time").val();
		var f_name = $("#friend").find(":selected").text();
		var f_username = $("#friend").find(":selected").val();

		// update db with new alarm
		$.ajax({
			url: "/user",
			type: "POST",
			data: {
				find: `{"username": "${username}"}`,
				update: `{"$push":{"alarms": {"time": "${time}", "friend": {"name":"${f_name}", "username":"${f_username}"}}}}`
			}, 
			success:function(){
				window.location.href = "/alarms";
			}
		});
	});

});