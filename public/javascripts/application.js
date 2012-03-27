$(document).ready(function(){
	tweets();   
});

function tweets () {
	$(".container-fluid .alert").hide();
	$('.progress').hide();
	$(".timeline").hide();
	$("#tweets_submit").click(function(){
		$('.progress').show();
		load_tweets();
		return false;
	});
	$("#load_new").click(function(){
		$('.progress').show();
		load_tweets();
		return false;
	});
	$("#other_users").click(function(){
		$("input[type=text], input[type=hidden]").val("");
		$(".initial").show();
		$(".timeline").hide();
		$(".timeline h1 span").html("");
		$("#tweets_list").html("");
		
		return false;
	});
	$(".close").click(function () {
		manageFlashes("hidden", "")
	})
}

function load_tweets() {
	$.ajax({
	  url: '/tweets',
	  async:false,
	  data: $("#tweets_form").serialize(),
	  dataType: "JSON",		
	  complete: function(){
			$('.progress').fadeOut("slow");
	  },		
	  success: function (json) {
		if (json.valid_users !=""){
			manageFlashes("hidden", "")
			if (json.tweets_list != "")
				$("#tweets_list").prepend(json.tweets_list);
			else{
				manageFlashes("alert-info","There are not new tweets to pull.");
			}
			$("#tweets_last_id1").val(json.last_ids[0]);
			$("#tweets_last_id2").val(json.last_ids[1]);
			$("#tweets_last_id3").val(json.last_ids[2]);
			$(".initial").hide();
			$(".timeline").show();
			$(".timeline h1 span").html(json.valid_users);
			if (json.error){
				manageFlashes("alert-info","Please, check the usernames given. Some of them were not found.");
			}
		}else{
			manageFlashes("alert-error","Please, write at least one valid username.");
		}
	  },
	});
}

function manageFlashes(type, message){
	if (type == "hidden"){
		$(".container-fluid .alert").slideUp("fast",function () {
			$(this).removeClass("alert-error").removeClass("alert-info").removeClass("alert-success");
		})
		$(".container-fluid .alert span").html("");
	}else{
		$(".container-fluid .alert").addClass(type).slideDown("fast")
		$(".container-fluid .alert span").html(message);
	}
}