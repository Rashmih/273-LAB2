var connect = require('connect');
var login = require('./login');

var app = connect();

app.use(connect.json()); // Parse JSON request body into `request.body`
app.use(connect.urlencoded()); // Parse form in request body into `request.body`
app.use(connect.cookieParser()); // Parse cookies in the request headers into `request.cookies`
app.use(connect.query()); // Parse query string into `request.query`

app.use('/', main);

function main(request, response, next) {
	switch (request.method) {
		case 'GET': get(request, response); break;
		case 'POST': post(request, response); break;
		case 'DELETE': del(request, response); break;
		case 'PUT': put(request, response); break;
	}
};

function get(request, response) {
	var cookies = request.cookies;
	console.log(cookies);
	if ('session_id' in cookies) {
		var sid = cookies['session_id'];
		if ( login.isLoggedIn(sid) ) {
			response.setHeader('Set-Cookie', 'session_id=' + sid);
			response.end(login.hello(sid));	
		} else {
			response.end("Invalid session_id! Please login again\n");
		}
	} else {
		response.end("Please login via HTTP POST\n");
	}
};

function post(request, response) {
	name = request.body.name;// TODO: read 'name and email from the request.body'
	email = request.body.email;
	
	var newSessionId =login.login(name,email);        // var newSessionId = login.login('xxx', 'xxx@gmail.com');
	response.setHeader('Set-Cookie','session_id = ' + newSessionId);                           // TODO: 	set new session id to the 'session_id' cookie in the response
	response.end(login.hello(newSessionId));                     // replace "Logged In" response with response.end(login.hello(newSessionId));

	
};

function del(request, response) {
	console.log("DELETE:: Logout from the server");
var cookies = request.cookies;
console.log(cookies);
if('session_id' in cookies){
var sid = cookies['session_id'];
}
login.logout(sid);// TODO: remove session id via login.logout(xxx)

 	// No need to set session id in the response cookies since you just logged out!

  	response.end('Logged out from the server\n');
};

function put(request, response) {
	console.log("PUT:: Re-generate new seesion_id for the same user");
//var cookies = request.cookies;	// TODO: refresh session id; similar to the post() function

//console.log(cookies);
//if ('session_id' in cookies)
//   var sid = cookies['session_id'];
name = request.body.name;
email=request.body.email;
var newsessionId=login.login(name,email);
response.setHeader('Set-Cookie','session_id = ' + newsessionId);
	response.end("Re-freshed session id\n");
};

app.listen(8000);

console.log("Node.JS server running at 8000...");
