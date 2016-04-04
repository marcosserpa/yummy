/**
 * Gets page dimensions
 */
function get_page_dims()
{
	return {
		top: function() { return document.documentElement.scrollTop || document.body.scrollTop },
		width: function() { return self.innerWidth || document.documentElement.clientWidth || document.body.clientWidth },
		height: function() { return self.innerHeight || document.documentElement.clientHeight || document.body.clientHeight },
		total: function(d) {
			var b = document.body, e = document.documentElement;
			return d 
				? Math.max(Math.max(b.scrollHeight, e.scrollHeight), Math.max(b.clientHeight, e.clientHeight))
				: Math.max(Math.max(b.scrollWidth, e.scrollWidth), Math.max(b.clientWidth, e.clientWidth))
		}
	}
}

/**
 * Displays the signup form
 */
function show_signup(email_field)
{
	
	add_esc_handler();
	
	// Dynamically create the mask
	var mask = document.createElement('DIV');
	mask.setAttribute('id', 'mask');
	document.body.appendChild(mask);
	
	// Mask dimensions
	var dims = get_page_dims();
	mask.style.width = ''; 
	mask.style.width= dims.total(0) + 'px'
	mask.style.height= dims.total(1) + 'px';
	
	// Display the mask
	mask.style.display = 'block';

	var box = document.getElementById('signup-response');
	document.body.appendChild(box);
	
	// Do signup call
	do_signup(email_field);
	
	box.style.display = 'block';
	center_box();
}

function center_box() {
	var
		dialog = $('div#signup-response'),
		viewportWidth  = $(window).width(),
		viewportHeight = $(window).height(),
		viewportOffset = $(window).scrollTop();
		
	dialogTopOffset = (viewportHeight / 2) - (dialog.outerHeight() / 2);
	dialogLeftOffset = (viewportWidth / 2) - (dialog.outerWidth() / 2);

	dialog.css(
		{
			top : dialogTopOffset,
			left: dialogLeftOffset
		}
	)
}

/**
 * Hides the signup form
 */
function hide_signup()
{
	// Hide the mask and box
	document.getElementById('signup-response').style.display = 'none';
	document.body.removeChild(document.getElementById('mask'));
	document.onkeydown = function() {};
}

/**
 * AJAX signup call
 */
function do_signup(email_field) {
	var xmlhttp;
	var statusDiv = document.getElementById('signup-status');
	var status = document.getElementById('signup-status-msg');
	
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	} else {
		return;
	}
	
	var signup_email = document.getElementById(email_field).value;

	params = 'email=' + signup_email;


	xmlhttp.onreadystatechange = function() {
		// Request in progress
		if (xmlhttp.readyState < 4) {
			statusDiv.className = 'alert';
			status.innerHTML = 'Loading... Please wait';
		}
		
		// Request comleted
		if (xmlhttp.readyState == 4) {
			timeout = clearTimeout(timeout);
	
			if (xmlhttp.responseText == 'OK') {
				statusDiv.className = 'alert alert-success';
				status.innerHTML = 'You have been sent an email to confirm your subscription to the mailing list.  Click the link in the email to confirm your subscription.';
			} else if (xmlhttp.responseText == 'EMAIL_INVALID') {
				statusDiv.className = 'alert alert-error';
				status.innerHTML = 'The email address you supplied is invalid. Please enter a valid email address and try again...';
			} else if (xmlhttp.responseText == 'EMAIL_ON_LIST') {
				statusDiv.className = 'alert alert-error';
				status.innerHTML = 'The email address you supplied is already on our list.';
			} else {
				// 'BAD' and any other response
				statusDiv.className = 'alert alert-error';
				status.innerHTML = 'An error has occurred and your email address has not been added to our mailing list, please try again...';
			}
			center_box();
		}
	};

	xmlhttp.open("POST","/newsletter/ajax_signup.php", true);

	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.setRequestHeader("Content-length", params.length);
	xmlhttp.setRequestHeader("Connection", "close");

	xmlhttp.send(params);

	function requestTimeout() {
		xmlhttp.abort();
		statusDiv.className = 'alert';
		status.innerHTML = 'Problem talking to server, please try again...';
	}
	timeout = setTimeout(requestTimeout, 10000);
}

function add_esc_handler()
{
	document.onkeydown = function handle_key(e) {
		var key  = (window.event) ? event.keyCode : e.keyCode;
		var esc = (window.event) ? 27 : e.DOM_VK_ESCAPE;
		if (key == esc) {
			hide_signup();
		}
	}
}

window.onresize = function resize() {
	center_box();
}