$(window).on('load', function(){
	$("#get-user").on('click', function(){
		var username = $("#username").val();

		$.ajax({
			url: "user/",
			type: "GET",
			data: "username="+username,
			dataType: "html",
			success: function(result){
				$("#response").html(result);
			}
		});
	});

	$("#post-user").click(function(){
		var username = $("#username").val();
		var firstname = $("#first-name").val();
		var lastname  = $("#last-name").val();
		var phonenum = $("#phone-number").val();

		$.ajax({
			url: "user",
			type: "POST",
			data: {
				find: `{"username": "${username}"}`,
				update: `{"$set":{"username": "${username}","firstname":"${firstname}","lastname": "${lastname}","phonenum": "${phonenum}"}}`
			},
			dataType: "html",
			success: function(result){
				$("#response").html(result);
			}
		});
	});

	$("#put-user").click(function(){
		var username = $("#username").val();
		var firstname = $("#first-name").val();
		var lastname  = $("#last-name").val();
		var phonenum = $("#phone-number").val();

		$.ajax({
			url: "user",
			type: "PUT",
			data: {
				"username": username,
				"firstname": firstname,
				"lastname": lastname,
				"phonenum":phonenum
			},
			dataType: "html",
			success: function(result){
				$("#response").html(result);
			}
		});
	});

	$("#delete-user").click(function(){
		var username = $("#username").val();

		$.ajax({
			url: "user",
			type: "DELETE",
			data: {
				"username":username
			},
			success: function(result){
				$("#response").html(result);
			}
		});
	});
});