
function getBasepath() {
	var loc = window.location.hostname;
	if( loc.indexOf('local') != -1 ) {
		return "http://localhost:3000";
	} else {
		return "http://xx.xxx.xxx.xxx:3000";
	}
}