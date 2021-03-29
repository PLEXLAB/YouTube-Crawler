var express 	= require('express');
var router 		= express.Router();
var mailer		= require('nodemailer');
var transporter = mailer.createTransport({
	host: 'smtp.dreamhost.com',
	//service: 'gmail',
	port: 465,
	secure: true, 
	auth: {
		user: 'youtubestudy@plexlab.net',
		pass: '.Tc:,7?sp,X9Qh:]#fR_'
		//adamsosaadam@gmail.com',
		//pass: 'meelaS236868782'
	}
});

//================================================================================
// Home page of the db portal
router.get('/home', function(req, res, next) {
	if(!req.session.username) // Unauthorized
		res.render('index', { title: 'YouTube Crawler Extension: Database Portal', loginStat: 'login', welcome: req.session.username});
	else
		res.render('index', { title: 'YouTube Crawler Extension: Database Portal', loginStat: 'logout', welcome: "Welcome "+req.session.username});
});

//================================================================================
// Home page of the db portal
router.get('/', function(req, res, next) {
	if(!req.session.username) // Unauthorized
		res.render('index', { title: 'YouTube Crawler Extension: Database Portal', loginStat: 'login', welcome: req.session.username});
	else
		res.render('index', { title: 'YouTube Crawler Extension: Database Portal', loginStat: 'logout', welcome: "Welcome "+req.session.username});
});

//================================================================================
// Restore account page of the db portal
router.get('/restoreAccount', function(req, res, next) {
	if(!req.session.username) // Unauthorized
		res.render('restorePass', 	{ title: 'YouTube Crawler Extension: Database Portal', loginStat:'login', error1: "", success:""});
});

//================================================================================
// Restore action of the db portal
router.get('/restore', function(req, res, next) {
	console.log(req.query.email);
	console.log(req.query.username);
	var usdb 				= req.db;
	var usCollection 		= usdb.get('users');
	var cFormsCollection 	= usdb.get('forms');
	// Search if the user is useres collection
	usCollection.find({username: req.query.username}).then(function(user1){
		if(user1.length == 0){
			console.log("Not a user");
			res.render('restorePass', 	{title: 'YouTube Crawler Extension: Database Portal', loginStat:'login', error1: "Account does not exist: Invalid email/username", success: ""});
		}
		else{
			cFormsCollection.find({email: req.query.email, _id: user1[0].cFormID}).then(function(user){
				if(user.length == 0){
					console.log(user[0].email);
					res.render('restorePass', 	{title: 'YouTube Crawler Extension: Database Portal', loginStat:'login', error1: "Account Does not exist: Invalid email/username", success: ""});
				}
				var mailOptions = {
					from: 	'youtubestudy@plexlab.net',
					to: 	req.query.email,
					subject:'Account Recovery',
					html: "<div>Dear " + user1[0].firstname + " " + user1[0].lastname + ",<br> You recently requested to reset your password for Creators DB Portal. Please use this link to reset it: <a href='https://plexweb.cs.nmsu.edu/resetPassword?username=" + user1[0].username + "'>Reset Password.</a><br>Thanks<br>PLEX lab team</div>"
				};
				transporter.sendMail(mailOptions, function(error, info){
					if (error)	{console.log(error);} 
					else 		{console.log('Email sent: ' + info.response);}
				});
				res.render('restorePass',		{title: 'YouTube Crawler Extension: Database Portal', loginStat:'login', error1: "", success:"Account retrived successfully: An email has sent to the provided email to reset your password"});	
			});
		}
	
	});
});

//================================================================================
// Restore action of the db portal
router.get('/resetPassword', function(req, res, next) {
	if(!req.session.username) // Unauthorized
		res.render('setPass', 	{ title: 'YouTube Crawler Extension: Database Portal', loginStat:'login', error1: "", success:"", userVal: req.query.username});
});

//================================================================================
// Restore action of the db portal
router.post('/resetPass', function(req, res, next) {
	console.log(req.body.pass);
	console.log(req.body.repass);
	var rpdb 				= req.db;
	var reCollection 		= rpdb.get('users');
	
	// check if there is a password match
	if((req.body.pass).length > 0){
		if(req.body.pass !== req.body.repass){
			console.log("Passwords in reset form does not match");
			res.render('setPass',		{title: 'YouTube Crawler Extension: Database Portal', loginStat:'login', error1: "Passwords Does not match, Please re-enter them again.", success:"", userVal: req.body.username});	
		}
		else{
			console.log("Passwords in reset form match");
			console.log(req.body.username);
			if(req.body.username !== '' && req.body.username !== undefined){
				reCollection.update(
					{username: req.body.username},
					{$set: {"pswd": req.body.pass}}, 
					function(err, doc) {
						if (err) return handleError(err);
						res.render('setPass',		{title: 'YouTube Crawler Extension: Database Portal', loginStat:'login', error1: "", success:"Password has been reset successfully", userVal: req.body.username});	
					}
				);
			}
			else{
				res.render('setPass', {title: 'YouTube Crawler Extension: Database Portal', loginStat:'login', error1: "You have to use the reset link sent to your email address.", success:"", userVal: req.body.username});	
			}
		}
	}
});

//================================================================================
// Register page of the db portal
router.get('/register', function(req, res){
	if(!req.session.username) // Unauthorized
	{
		console.log(req.query.cFormID);
		res.render('registerUser', { title: 'YouTube Crawler Extension: Database Portal', error1: "", success:"", cfVal: req.query.cFormID});
	}
	else
		res.render('find', { title: 'YouTube Crawler Extension: Database Portal', error1: "", videosMetadata: "", Value1: "", welcome: "Welcome " + req.session.username});
});

//================================================================================
// Register page of the db portal
router.post('/registerUser', function(req, res){
	var usrdb 			= req.db;
	var userCollection 	= usrdb.get('users');
	var formsCollection = usrdb.get('forms');
	var todayDateVal 	= Date.now();
	console.log("-----" + req.body.cFormID);
	var newUserRec 		={
		cFormID		:	req.body.cFormID	,
		username	:	req.body.username	,
		pswd		:	req.body.pswd		,
		firstname	:	req.body.firstname	,
		lastname	:	req.body.lastname	,
		todayDate	:	Date(todayDateVal)
	}
	// Search if the consent form id is in forms collection
	formsCollection.find({_id: req.body.cFormID}).then(function(cform){
		if(cform.length !== 0)
		{
			// Search if user already created an acount 
			userCollection.find({cFormID: req.body.cFormID}).then(function(v){
				if(v.length === 0){
					userCollection.find({username: req.body.username}).then(function(u){
						if(u.length === 0)
						{
							console.log("Not a user");
							userCollection.insert(newUserRec, function(err, doc){
								if (err) return handleError(err)
								var mailOptions = {
									from: 	'youtubestudy@plexlab.net',
									to: 	cform[0].email,
									subject:'Registration confirmation',
									html: "<div>Dear " + doc.firstname + " " + doc.lastname + ",<br> This is a confirmation that your registration is successful.<br>Please use this link to access your account: <a href='https://plexweb.cs.nmsu.edu/login'>YouTube Crawler: DB Portal</a><br>Thanks<br>PLEX lab team</div>"
								};
								transporter.sendMail(mailOptions, function(error, info){
									if (error) {console.log(error);} 
									else {		console.log('Email sent: ' + info.response);}
								});
							});
							res.render('registerUser', {title: 'YouTube Crawler Extension: Database Portal', error1: "", success: "User account has created successfully. Please proceed to login page", cfVal:""});
						}
						else{
							res.render('registerUser', {title: 'YouTube Crawler Extension: Database Portal', error1: "", success: "Username exists for this channel, please try to restore it or choose new one", cfVal:""});
						}
					});
				}else{
					console.log('Similar User Found');
					res.render('registerUser', { title: 'YouTube Crawler Extension: Database Portal', error1: "Existing user account is found for this channel!", success:"", cfVal: ""});	
				}
			});
		}
		else{
			res.render('registerUser', {title: 'YouTube Crawler Extension: Database Portal', error1: "Consent Form ID is not correct or it is not signed yet", success: "", cfVal: ""});
		}
	});
})

//================================================================================
// Login page of the db portal
router.get('/login', function(req, res){
	if(!req.session.username) // Unauthorized
		res.render('login', { title: 'YouTube Crawler Extension: Database Portal', error1: "", loginStat: 'login'});
	else
		res.render('find', { title: 'YouTube Crawler Extension: Database Portal' , "videosMetadata": [], Value1: "", welcome: "Welcome "+req.session.username });
});

//================================================================================
// Logout of the db portal
router.get('/logout', function(req, res){
	req.session.destroy();
	res.render('login', { title: 'YouTube Crawler Extension: Database Portal', error1: "", loginStat: "login"});
});

//================================================================================
// Login page of the db portal
router.post('/uLogin', function(req, res, next) {
	var ldb = req.db;
    var lcollection = ldb.get('users');
	var cformcollection = ldb.get('forms');
	lcollection.find({username: req.body.username, pswd: req.body.pswd}, function(err, uObj){
		if (err) throw err; 
		if (uObj.length === 0)
		{	
			res.render('login', { title: 'YouTube Crawler Extension: Database Portal', error1: "Invalid username/password", loginStat: "login"});
			console.log(uObj);
		}
		else
		{	
			req.session.username = uObj[0].username;
			req.session.cFormID  = uObj[0].cFormID;
			cformcollection.find({_id: req.session.cFormID}).then(function(cform){
				if(cform.length !== 0)
				{
					req.session.chID = cform[0].chID;
					console.log(req.session.chID);
					res.render('find', { title: 'YouTube Crawler Extension: Database Portal' , "videosMetadata": [], Value1: "", welcome: "Welcome "+req.session.username});
				}
			});				
		}
	});
	
});

//================================================================================
// About page of the db portal
router.get('/about', function(req, res, next) {
	if(!req.session.username) // Unauthorized
		res.render('about', { title: 'YouTube Crawler Extension: Database Portal', loginStat: "login", welcome: req.session.username});
	else
		res.render('about', { title: 'YouTube Crawler Extension: Database Portal', loginStat: "logout", welcome: "Welcome "+req.session.username});
});

//================================================================================
// Search page of the db portal 
router.get('/searchBy', function(req, res, next) {
	if(!req.session.username) // Unauthorized
		res.render('login', { title: 'YouTube Crawler Extension: Database Portal', error1: "", loginStat: "login"});
	else
	{
		res.render('find', { title: 'YouTube Crawler Extension: Database Portal', "videosMetadata": [], Value1: "", welcome: "Welcome "+ req.session.username});
	}
});

//================================================================================
// Search channel metadata
router.post('/find', function(req, res, next) {
	if(!req.session.username) // Unauthorized
		//return res.status(401).send("You cannot access this page, you need to login first");
		res.render('login', { title: 'YouTube Crawler Extension: Database Portal', error1: "", loginStat: "login"});
	else
	{
		console.log("Welcome to DB portal");
		var qdb = req.db;
		var todayDate = Date.now;
		var qcollection = qdb.get('videos');
		var field = req.body.radioField.toString();
		if(field.indexOf('vTitle') > -1)
			qcollection.find({chID: req.session.chID, vTitle:  {$regex: ".*"+req.body.Value+".*", $options:"i"}}, {}, function(e, docs) {
				res.render('find', {title: 'YouTube Crawler Extension: Database Portal' ,"videosMetadata": docs, Value1: "", welcome: req.session.username});
			});
		if(field.indexOf('vVis') > -1)
			qcollection.find({chID: req.session.chID, vVis:  {$regex: ".*"+req.body.Value+".*", $options:"i"}}, {}, function(e, docs) {
				res.render('find', {title: 'YouTube Crawler Extension: Database Portal' ,"videosMetadata": docs, Value1: "", welcome: req.session.username});
			});	
		//res.render('index', { title: 'YouTube Crawler Extension: Database Portal' });
	}
  });
  
//================================================================================
// List the channel metadata
router.get('/videosMetadata', function(req, res) {
    var db = req.db;
    var collection = db.get('videos');
    collection.find({},{},function(e, docs){
        res.render('videolist', {"videosMetadata" : docs});
    });
});

//================================================================================
// Delete the channel metadata
router.get('/delete/:vID', function(req, res, next) {
	console.log(req.params.vID);
	console.log(req.params);
	console.log(req.body);
	console.log(req);
	var ddb = req.db;
    var dcollection = ddb.get('videos');
	
	dcollection.remove({vID: req.params.vID}, {}, function(e, docs) {
		res.render('find', {title: 'YouTube Crawler Extension: Database Portal', "videosMetadata": docs, Value1: "IMG", welcome: req.session.username});
	});
});

//================================================================================
// Check if the consent form is found for a particular channel
router.get('/conFormMatch/:chID', function(req, res){
	var fdb = req.db;
    var fcollection = fdb.get('forms');
	console.log("===================");
	console.log(req.params.chID);
	fcollection.find({chID: req.params.chID}, {}, function(err, cformOBJ){
		if (err) throw err; 
		if (cformOBJ.length === 0)
		{	
			console.log(cformOBJ);
			res.status(201).send("not found");
		}
		else
		{	
			console.log(cformOBJ);
			res.status(201).send("found");
		}
	});
});

//================================================================================
// Show the consent form html page
router.get('/consentForm', function(req, res){
	console.log(req); 
	res.sendFile(__dirname + "/conForm.html");
});

//================================================================================
// Save the consent form to forms collection
router.post('/addConsentForm', function(req, res){
	var cfdb = req.db;
    var cfcollection = cfdb.get('forms');
	var todayDate1 = Date.now();
	var cfRec = {
		pfullname		: 	req.body.pfullname,
		rfullname		:	req.body.rfullname,
		rpdescription	:	req.body.rpdescription,
		chID			:	req.body.chID,
		email			:	req.body.email,
		monitization	:	req.body.montization_field.toString(),
		todayDate		: 	Date(todayDate1)
	};
	if(req.body.chID !== "undefined"){
		cfcollection.find({pfullname: req.body.pfullname, rfullname: req.body.rfullname, chID: req.body.chID, email: req.body.email}).then(function(cform){
			console.log(req.body);
			if(cform.length === 0)
			{	
				cfcollection.insert(cfRec, function(err, doc) {
					if (err) 
						return handleError(err);
					console.log(doc);
					var mailOptions = {
						from: 	'youtubestudy@plexlab.net',
						to: 	doc.email,
						subject:'Consent Form Confirmation',
						html: "<head>Dear " + doc.pfullname + ",</head><body><br>Thank you for singing the consent form. Please click on this link: <a href='https://plexweb.cs.nmsu.edu/register?cFormID="+doc._id+"'> Sign Up </a> to create an account on the creators' database portal (<a href='https://plexweb.cs.nmsu.edu/home'>DB Portal</a>) which will allow you to access the crawled metadata from your YouTube channel. <br><br>Thank you<br>PLEX lab team</body>",
						attachments:[
							{filename: "consent_form.pdf", path: __dirname + "/consent_form.pdf" }
						]
					};
					transporter.sendMail(mailOptions, function(error, info){
						if (error) {console.log(error);} 
						else {		console.log('Email sent: ' + info.response);} 
					});
				});
				res.status(201).send("Your consent Form has been saved");
			}else{
				res.status(201).send("You have signed your consent form before");
			}
		});
	}
	else
		res.status(201).send("You CANNOT sign your consent form without running the extension");
});
//================================================================================
// Save the videos metadata sent from chrome extension (double check the date to avoid duplicate saving)
router.post('/SaveWatchHistory', function(req, res){
	var vdb = req.db;
	var vcollection = vdb.get('WatchHistory');
	var vRec = {
		todayDate: Date(req.body.todayDate),
		vURL: 	req.body.vURL
	};
	// Search if the video record does exist before adding it to the videos collection
	vcollection.find({vURL: 	req.body.vURL}).then(function(v){
		if(v.length !== 0)
		{	
			//console.log(v);
			console.log('Similar Record Found');
			return res.status(201).send('Similar Record Found');
		}
		else{
			console.log("not found");
			vcollection.insert(vRec, function(err, doc) {
				if (err) return handleError(err)});
			return res.status(201).send("newRecord");
		}
	});
});

//================================================================================
// Save the videos metadata sent from chrome extension (double check the date to avoid duplicate saving)
router.post('/SaveRecVideos', function(req, res){
	var vdb = req.db;
	var vcollection = vdb.get('videoAndRec');
	var vRec = {
		url: 	req.body.url,
		todayDate: Date(req.body.todayDate),
		vTitle: req.body.vTitle,
		vViews: 	req.body.vViews,
		vDuration: req.body.vDuration,
    rec_url_1: req.body.rec_url_1,
    rec_url_2: req.body.rec_url_2,
    rec_url_3: req.body.rec_url_3,
    rec_url_4: req.body.rec_url_4,
    rec_url_5: req.body.rec_url_5 
	};
	// Search if the video record does exist before adding it to the videos collection
	vcollection.find({url: 	req.body.url}).then(function(v){
		if(v.length !== 0)
		{	
			//console.log(v);
			console.log('Similar Record Found');
			return res.status(201).send('Similar Record Found');
		}
		else{
			console.log("not found");
			vcollection.insert(vRec, function(err, doc) {
				if (err) return handleError(err)});
			return res.status(201).send("newRecord");
		}
	});
});

//================================================================================
// Save the videos metadata sent from chrome extension (double check the date to avoid duplicate saving)
router.post('/VideosSaveRoute', function(req, res){
	var vdb = req.db;
	var vcollection = vdb.get('videos');
	var vRec = {
		chID: 	req.body.chID,
		todayDate: Date(req.body.todayDate),
		vTitle: req.body.vTitle,
		vURL: 	req.body.vURL,
		vID: 	req.body.vID,
		vDate: 	req.body.vDate,
		vStatus:req.body.vStatus,
		vVis: 	req.body.vVis,
		vDesc: 	req.body.vDesc,
		vView: 	req.body.vView,
		vNoComm:req.body.vNoComm,
    vvisOuterH: req.body.vvisOuterH,
		vmonOuterH: req.body.vmonOuterH,
		vristOuterH: req.body.vristOuterH       
	};
	// Search if the video record does exist before adding it to the videos collection
	vcollection.find({chID: req.body.chID, vID: req.body.vID, vDate: req.body.vDate, vStatus:req.body.vStatus, vView: req.body.vView, vNoComm: req.body.vNoComm, vvisOuterH: req.body.vvisOuterH,	vmonOuterH: req.body.vmonOuterH, vristOuterH: req.body.vristOuterH}).then(function(v){
  if(v.length !== 0)
		{	
			//console.log(v);
			console.log('Similar Record Found');
			return res.status(201).send('Similar Record Found');
		}
		else{
			console.log("not found");
			vcollection.insert(vRec, function(err, doc) {
				if (err) return handleError(err)});
			return res.status(201).send("newRecord");
		}
	});
});

//================================================================================
// Save the videos analytics sent from chrome extension (double check it is wrong)
router.post('/saveVanalytics', function(req, res){
	var va_db = req.db;
	var va_collection = va_db.get('videos_analytics');
	var va_Rec = {
		vID: 			req.body.vID,
		overviewAna: 	req.body.overviewAna,
		reachAna: 		req.body.reachAna,
		engAna: 		req.body.engAna,
		audAna: 		req.body.audAna
	}
	// Search if the video analytics have changed before adding a new record the video analytics collection
	va_collection.find(req.body).then(function(video){
		if(video.length !== 0)
		{	
			console.log('Similar Record Found');
			return res.status(201).send('Similar Record Found');
		}
		else{
			console.log("not found");
			va_collection.insert(va_Rec, function(err, doc) {
				if (err) return handleError(err)});
			return res.status(201).send("newRecord");
		}
	});
});

//================================================================================
// Save the videos analytics sent from chrome extension (if it is done at one time, ok)
router.post('/saveCHexpAnalytics', function(req, res){
	var chEx_db = req.db;
	var chEx_collection = chEx_db.get('channel_analytics');
	if(req.body.anaCategory === "genderAna"){
		chEx_collection.update(
			{period: req.body.period, chID: req.body.chID, genderAna: null},
			{$set: {"genderAna": req.body.tableList}}, 
			function(err, doc) {
				if (err) return handleError(err)});
			return res.status(201).send("newRecord");
	}
	if(req.body.anaCategory === "videoAna"){
		chEx_collection.update(
			{period: req.body.period, chID: req.body.chID, videoAna: null},
			{$set: {"videoAna": req.body.tableList}}, 
			function(err, doc) {
				if (err) return handleError(err)});
			return res.status(201).send("newRecord");
	}
	if(req.body.anaCategory === "ageAna"){
		chEx_collection.update(
			{period: req.body.period, chID: req.body.chID, ageAna: null},
			{$set: {"ageAna": req.body.tableList}}, 
			function(err, doc) {
				if (err) return handleError(err)});
			return res.status(201).send("newRecord");
	}
	if(req.body.anaCategory === "geoAna"){
		chEx_collection.update(
			{period: req.body.period, chID: req.body.chID, geoAna: null},
			{$set: {"geoAna": req.body.tableList}}, 
			function(err, doc) {
				if (err) return handleError(err)});
			return res.status(201).send("newRecord");
	}
	if(req.body.anaCategory === "traficAna"){
		chEx_collection.update(
			{period: req.body.period, chID: req.body.chID, traficAna: null},
			{$set: {"traficAna": req.body.tableList}}, 
			function(err, doc) {
				if (err) return handleError(err)});
			return res.status(201).send("newRecord");
	}
});
//================================================================================
// Save the videos analytics sent from chrome extension
router.post('/saveCHanalytics', function(req, res){
	var cha_db = req.db;
	var cha_collection = cha_db.get('channel_analytics');
	var cha_Rec = {
		period:			req.body.period,
		chID: 			req.body.chID,
		overviewAna: 	req.body.overviewAna,
		reachAna: 		req.body.reachAna,
		engAna: 		req.body.engAna,
		audAna: 		req.body.audAna,
		genderAna:		null,
		videoAna:		null,
		geoAna:			null, 
		traficAna:		null,
		ageAna:			null
	}
	// Search if the channel analytics have changed before adding a new record the channel analytics collection
	cha_collection.find({period: req.body.period, chID: req.body.chID,}).then(function(ch){
		if(ch.length !== 0)
		{	
			//console.log(ch);
			console.log('Similar Record Found');
			return res.status(201).send('Similar Record Found');
		}
		else{
			console.log("not found");
			cha_collection.insert(cha_Rec, function(err, doc) {
				if (err) return handleError(err)});
			return res.status(201).send("newRecord");
		}
	});
});
//================================================================================
module.exports = router;
