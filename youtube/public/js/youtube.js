var giCount = 0, maxRating = 0, maxVotes = 0, maxViews = 0;

$(function() {
	
	$('#table').dataTable({
		"bProcessing": true,
		"iDisplayLength": 50,
		"sDom": 'T<"clear">lfrtip',
		"oTableTools": {
            "sSwfPath": "/datatable/swf/copy_csv_xls_pdf.swf"
        }
	});
	
	$('#button').click(function() {
		
		giCount = 0, maxRating = 0, maxVotes = 0, maxViews = 0;
		
		$('#table').dataTable().fnClearTable();
		var username = $.trim($('#text-box').val());
		if(username.length==0) {
			$('title').text('Youtube Uploads');
			return;
		}
		
		$('title').text('Youtube Uploads - '+username);
		
		loadFeeds('https://gdata.youtube.com/feeds/users/'+username+'/uploads');
		
	});
	
	function loadFeeds(URL) {
		$.get(URL, function(res) {
			console.log(res);
			$(res).find('entry').each(function() {
				var duration = $(this).find("media\\:group, group").find("yt\\:duration, duration").attr("seconds");
				var rating = $(this).find('[average]');
				var statistics = $(this).find('[viewCount]');
				var average = parseFloat(rating.attr('average'));
				var numRaters = rating.attr('numRaters');
				var viewCount = statistics.attr('viewCount');
				//console.log(average, rating.attr('numRaters'), viewCount);
				var id = $(this).find('id').html().split('videos/')[1];
				var link = 'https://www.youtube.com/watch?v='+id;
				var published = new Date($(this).find('published').html());
				var time = new Date($(this).find('updated').html());
				var title = $(this).find('title').html();
				
				var hours = (Math.floor(duration/3660)).toString();
				hours = hours.length<2 ? '0'+hours : hours;
				var minutes = (Math.floor(duration/60)).toString();
				minutes = minutes.length<2 ? '0'+minutes : minutes;
				var seconds = (duration%60).toString();
				seconds = seconds.length<2 ? '0'+seconds : seconds;
				
				$('#table').dataTable().fnAddData( 
						[++giCount, 
						 '<a id="'+id+'" href="'+link+'">'+title+'</a>',
						 hours + ':' + minutes + ':' + seconds,
						 published.toString('MM/dd/yyyy hh:mm tt'),
						 time.toString('MM/dd/yyyy hh:mm tt'),
						 average.toFixed(3),
						 numRaters,
						 viewCount,
						 (viewCount/(average*numRaters)).toFixed(3)] );
				
			});
			var next = $(res).find('link[rel="next"]').attr("href");
			if(next) {
				loadFeeds(next);
			}
		});
	}
	
});