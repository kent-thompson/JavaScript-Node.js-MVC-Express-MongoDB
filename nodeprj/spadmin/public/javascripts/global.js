function getBasepath() {
	var loc = window.location.hostname;
	if( loc.indexOf('local') != -1 ) {
		return "http://localhost:4000";
	} else {
		return "http://xx.xxx.xxx.xxx:4000";
	}
}

function gClearForm(ele) {
    $(ele).find(':input').each(function() {
        switch(this.type) {
            case 'password':
            case 'select-multiple':
            case 'select-one':
            case 'text':
            case 'textarea':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
        }
    });
}
