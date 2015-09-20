function authorization(){
	jQuery.ajax({
			type:"GET",
			url:"https://api.github.com"
			headers:{
				Authorization:"token 6fab4509adf43325493e73ad71a92ef15ec68659"
			}
			//url: "http://codehuntr.herokuapp.com/issues"
		}).done(
			function(data){
				//console.log(data);
				//console.log(data[0].id);
				for(var i = 0; i < data.length; i++){
					//addMarker(data[i]);
					console.log(data[i].id);
				}
				var input_data = data;
			}
		).fail(
			function(data){
				console.log('err');
				console.log(JSON.stringify(data));
				console.log(data.status);
				console.log(data.statusMessage);
			}
		);
}
