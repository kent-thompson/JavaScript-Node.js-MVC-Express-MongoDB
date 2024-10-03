
function getBasepath() {
	var loc = window.location.hostname;
	if( loc.indexOf('local') != -1 ) {
		return "http://localhost:3000";
	} else {
		return "http://74.208.242.240:3000";
	}
}