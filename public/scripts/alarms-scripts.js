
$(window).on('load', function(){

	// on new alarm click, add an alarm to the current user
	var username = $("#username").text();

	$(".button").click(function(){

		var time = $("#time").val();
		var friend = $("#friend").find(":selected").val();

		// update db with new alarm
		$.ajax({
			url: "/user",
			type: "POST",
			data: {
				find: `{"username": "${username}"}`,
				update: `{"$push":{"alarms": {"time": "${time}", "friend": "${friend}"}}}`
			}, 
			success:function(){
				window.location.href = "/alarms";
			}
		});
	});

});