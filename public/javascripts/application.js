$(document).ready(function(){
	tweets();   
});

function tweets () {
	$("#tweets_submit").click(function(){
		load_tweets();
		return false;
	})
	$("#load_new").click(function(){
		load_tweets();
		return false;
	})
	$("#other_users").click(function(){
		$("input[type=text]").val("")
		$(".initial").removeClass("hidden");
		$(".timeline").addClass("hidden")
		$(".timeline h1 span").html(json.valid_users)
		return false;
	})
}

function load_tweets() {
	$.ajax({
	  url: '/tweets',
	  async:false,
	  data: $("#tweets_form").serialize(),
	  dataType: "JSON",				
	  success: function (json) {
		if (json.valid_users !=""){
			$("#messages").html("")
			if (json.tweets_list != "")
				$("#tweets_list").prepend(json.tweets_list);
			else{
				$("#messages").html("There are not new tweets to pull.").addClass("error")
			}
			$("#tweets_last_id1").val(json.last_ids[0])
			$("#tweets_last_id2").val(json.last_ids[1])
			$("#tweets_last_id3").val(json.last_ids[2])
			$(".initial").addClass("hidden");
			$(".timeline").removeClass("hidden")
			$(".timeline h1 span").html(json.valid_users)
			if (json.error){
				$("#messages").html("Please, check the usernames given. Some of them were not found.").addClass("error")
			}
		}else{
			$("#messages").html("Please, add at least one valid username.").addClass("error")		
		}
	  },
	});
}