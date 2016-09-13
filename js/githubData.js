$(function(){

	$(window).keydown(function(event){
		if(event.keyCode == 13) {
			event.preventDefault();
			if($('#github-username').is(':focus') || $('#add-user-btn').is(':focus')){
				$('#add-user-btn').trigger('click');
			}
			else{
				return false;				
			}
		}
	});

	$('#add-user-btn').on('click', function(e) {

		e.preventDefault();
		$('#loader').css("display","inline-block");

		var username = $('#github-username').val();
		var requri   = 'https://api.github.com/users/'+username;

		var userData;
		$.getJSON(requri, function(returnData){

			if (username == '')
			{
				$('.alert.alert-danger').show();
			}
			else
			{
				$('.alert.alert-danger').hide();
				userData = returnData;
				prepareUserCard(userData);
			}
		})
		.fail(function() {
			$('#loader').css("display","none");
			$('.alert.alert-danger').show();
			console.clear();
		});

		function prepareUserCard(userData){
			var userDataObj = {
				fullname : userData.name,
				username : userData.login,
				profilepic : userData.avatar_url,
				profileurl : userData.html_url,
				location : userData.location,
				followersCount : userData.followers
			};

			if(userDataObj.fullname == undefined) { 
				userDataObj.fullname = username;
			}				

			var source   = $("#entry-template").html();
			var template = Handlebars.compile(source);
			var result = template(userDataObj);

			$('#loader').css("display","none");
			$('#user-deck').append(result);
			
			$('.deleteUserBtn').on('click', function(){
				$(this).closest('.user-card').remove();
			});
		}
	});

	$('.sortNameBtn').on('click', sortByName);
	$('.sortLocationBtn').on('click', sortByLocation);
	$('.sortFlwrsBtn').on('click', sortByFlwrs);

	function setSortOrder(sortBtn){
		var sortOrder;

		$('.sort-opt').not(sortBtn).removeClass('asc').removeClass('desc');

		if(!sortBtn.hasClass('asc')){
			sortBtn.removeClass('desc').addClass('asc');
			return sortOrder = 'asc';
		}
		else {
			sortBtn.removeClass('asc').addClass('desc');
			return sortOrder = 'desc';
		}		
	}

	function sortByName(e){
		var sortOrder = setSortOrder($(e.target));

		var users = $('#user-deck');
		var userCardItem = users.find('.user-card');

		userCardItem.sort(function(a,b){
			var an = a.getAttribute('data-name').toLowerCase();
			var	bn = b.getAttribute('data-name').toLowerCase();

			if(an > bn) {
				return sortOrder === 'asc' ? 1 : -1;
			}
			if(an < bn) {
				return sortOrder === 'desc' ? 1 : -1;
			}
			return 0;
		});

		userCardItem.detach().appendTo(users);
	}

	function sortByLocation(e){
		var sortOrder = setSortOrder($(e.target));

		var users = $('#user-deck');
		var userCardItem = users.find('.user-card');

		userCardItem.sort(function(a,b){
			var an = a.getAttribute('data-location').toLowerCase();
			var	bn = b.getAttribute('data-location').toLowerCase();

			if(an > bn) {
				return sortOrder === 'asc' ? 1 : -1;
			}
			if(an < bn) {
				return sortOrder === 'desc' ? 1 : -1;
			}
			return 0;
		});

		userCardItem.detach().appendTo(users);
	}

	function sortByFlwrs(e){
		var sortOrder = setSortOrder($(e.target));

		var users = $('#user-deck');
		var userCardItem = users.find('.user-card');

		userCardItem.sort(function(a,b){
			var an = a.getAttribute('data-flwrcount');
			var	bn = b.getAttribute('data-flwrcount');

			if(sortOrder === 'asc') {
				return an-bn;
			}
			else if(sortOrder === 'desc') {
				return bn-an;
			}
			else {
				return 0;
			}
		});

		userCardItem.detach().appendTo(users);
	}

});
