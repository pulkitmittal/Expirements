var github = '';
var myRepos = [];
var today = Date.parse('9am');
var yesterday = Date.parse('yesterday');//new Date(today-(3600*24*1000));
var showAll = false;
var showDates = false;
var showReversed = false;

$(function() {
	
	github = new Github({
		token: 'a57f4810ae0e7de0dd5426e56fa43b92c417b65c',
		auth: 'oauth'
	});
	
	var repo = github.getRepo("hasingh", "mmo");
	
	getCommits(repo);
	
	$('#show-date').on("click", function() {
		showDates = $(this).is(':checked');
		getCommits(repo);
	});
	
	$('#show-all-commits').on("click", function() {
		showAll = $(this).is(':checked');
		getCommits(repo);
	});
	
	$('#show-reversed').on("click", function() {
		showReversed = $(this).is(':checked');
		getCommits(repo);
	});
});

function getCommits(repo) {
	$('#content').html('Loading...');
	repo.getCommits({author:"kvtm-pulkit", since: showAll?null:yesterday, per_page: 100}, function(err, res) {
		if(!res || res.length==0) {
			$('#content').html('No commits found!');
		}
		else {
			$('#content').html('<ol></ol>');
		}
		$.each(showReversed?res.reverse():res, function(i,r) {
			var date = new Date(r.commit.author.date);
			var message = r.commit.message;
			if(message.indexOf("Merge branch 'master'")==-1) {
				$('#content ol').append('<li>'+(showDates?(date.toString('MM/dd/yyyy hh:mm tt')+': '):'')+message+'</li>');
			}
		});
	});
}