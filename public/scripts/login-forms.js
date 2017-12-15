$(window).on('load', function(){

	$(".login").hide();
	$(".register").hide();
	$(".desc").show();
	$(".button-wrapper").show();

	$(".login-link").click(function(){
		$(".login").show();
		$(".register").hide();
		$(".button-wrapper").hide();
		$(".desc").hide();
	});

	$(".register-link").click(function(){
		$(".register").show();
		$(".login").hide();
		$(".button-wrapper").hide();
		$(".desc").hide();
	});

	// reload
	$("h1").click(function(){
		$(".login").hide();
		$(".register").hide();
		$(".desc").show();
		$(".button-wrapper").show();
	});

	// handle registration
	$( ".register" ).submit(function(e) {
		var registerData = formToObj(this);

		// create new user
	  $.ajax({
			url: "user",
			type: "PUT",
			data: registerData,
			dataType: "text",
			success: function(result){
				$("#response").html(result);
				Materialize.toast(result, 3000);
				$(".login-link").click();
			},
			error: function(){
				Materialize.toast("Error in registering user", 3000);
			}
		});

	  e.preventDefault();
	});

});

// convert form data to javascript object
//https://stackoverflow.com/questions/1184624/convert-form-data-to-javascript-object-with-jquery?page=1&tab=votes#tab-top
function formToObj(form){
	return $(form).serializeArray().reduce(function(m,o){ m[o.name] = o.value; return m;}, {})
}