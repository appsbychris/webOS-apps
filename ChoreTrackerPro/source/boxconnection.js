enyo.kind({
	kind: "Component", 
	name: "SyncManager", 
	published: {
		boxAPI: "cgam9lrhnqnykvpn0dsyy1kglir7si0v",
		ticketURL: "https://www.box.net/api/1.0/rest?action=get_ticket&api_key=", //+this.boxAPI,
		authURL: "https://www.box.net/api/1.0/auth/",
		authTokenURL: "https://www.box.net/api/1.0/rest?action=get_auth_token&api_key=cgam9lrhnqnykvpn0dsyy1kglir7si0v&ticket=",
		makeFolderURL:"https://www.box.net/api/1.0/rest?action=create_folder&api_key=cgam9lrhnqnykvpn0dsyy1kglir7si0v&auth_token=",
		directoryURL:"https://www.box.net/api/1.0/rest?action=get_account_tree&api_key=cgam9lrhnqnykvpn0dsyy1kglir7si0v&auth_token=",
		userTicket:"",
		syncFolderID:0,
		login:"",
		auth:"",
		toBeSynced: [],
		hasSyncFile: false,
		currentFileID: 0,
		currentData: 0,
		setDescCount: 0,
		syncFolderID: 0,
		syncFiles: [],
		fileCounter:0,
		uploadCounter: 0,
		processFlag: "",
		uploadSegment: [],
		timeOut: 0,
		timeOutJob:0,
		timedOut: false,
		deviceID: 0,
		syncRetry: 0,
		syncObj: {
			enableSync: false,
			userName: "",
			passWord: "",
			syncDown: true,
			syncUp: true,
			deleteConfirm: true
		},
		lastDate: ""
	},
	events: {
		onGotSyncCommands: "",
		onSyncError: ""
			
	},
	lazy: false, 
	components: [
	    {kind: "syncDialog", name:"msg", onOKed: "doSyncError",lazy:false},         
	    {kind:"fDates", name:"fd"},
		{name: "uploadSrvc", kind: enyo.PalmService,
			service: "palm://com.palm.downloadmanager/",
			method: 'upload',
			onSuccess: "uploadSrvc_Success",
			onFailure: "uploadSrvc_Failure",
			subscribe: true
		},
		 {
	         name: "downloadManager",
	         kind: "PalmService",
	         service: "palm://com.palm.downloadmanager/",
	         method: "download",
	        	 onSuccess: "onDownloadSuccess",
	             onFailure: "onDownloadFailure"
	      },
	      { kind: enyo.WebService, name: "checkFile",
	    	  url: "/media/internal/.app-storage/com.chrisvanhooser.choretrackerpro/choretrackersync.txt", handleAs: "text",
	    	  onSuccess: "yesSyncFile",
	    	  onFailure: "noSyncFile"},
	    	  {
	    		    name : "queryDownloadFile",
	    		    kind : "PalmService",
	    		    service : "palm://com.palm.downloadmanager/",
	    		    method : "downloadStatusQuery",
	    		    onResponse : "verifyDownload"
	    		}
    ],
    /*
     * 
     * Sync process:
     * check if choretrackersync.txt exist (this.checkForSyncFile)
     * if not, download it.
     * box log in and verify logged in (this.logIntoBox)
     * Get a directory listing
     * Check for "Chore Tracker Pro Sync" folder
     * if it exist, get the folder ID #
     * if not, create it and then store the folder ID#
     * If it existed, get file listing from folder.
     * Scan files and sync
     * 
     * 
     * For uploading:
     * Make sure user is logged in (this.logIntoBox)
     * Make sure choretrackersync.txt. exist (this.checkForSyncFile)
     * if not, download it
     * Delete sync folder if exist
     * create sync folder
     * Parse through text to upload, 
     * separate it into 300* character chunks
     * upload file for each chunk
     * after each upload, get new file ID#
     * set the description to the appropiate chunk
     * Loop until all chunks uploaded
     * 
     * 
     * each file uploaded will have a sessionID and file ID, date, and device id
     * format: [sessionid:123456789,fileid:1/3,date:03/04/11,id:12234567890]
     * 
     * */
    timeOutCallBack: function() {
    	if (this.timedOut == false) {
			this.timeOut++;
			this.log(this.timeOut);
			if (this.timeOut >= 60) {
				this.timeOut = 0;
				this.timedOut = true;
				window.clearInterval(this.timeOutJob);
				this.setError("time_out");
			};
		};
	},
    yesSyncFile: function(iS,iE0) {
    	this.log("Sync file exist");
    	this.hasSyncFile = true;
    },
    noSyncFile: function(iS,iE0) {
    	this.log("No Sync file");
    	this.hasSyncFile = false;
    	this.downloadSyncFile();
    },
    checkForSyncFile: function() {
    	this.$.checkFile.call();
    },
    downloadSyncFile: function() {
		this.log("downloading sync file")
		if (this.syncRetry == 0) {
			
		    this.$.downloadManager.call(
		         {  target: "http://spike.spikey.home.comcast.net/~spike.spikey/choretrackersync.txt",
		            targetDir : "/media/internal/.app-storage/com.chrisvanhooser.choretrackerpro", 
		            targetFilename : "choretrackersync.txt",
		            keepFilenameOnRedirect: true,
		            subscribe: true
		         }
		    );
		}
		else if (this.syncRetry == 1) {
			this.log("retry new server");
			this.$.downloadManager.call(
				         {  target: "http://www.fileden.com/files/2012/1/30/3257324/choretrackersync.txt",
				            targetDir : "/media/internal/.app-storage/com.chrisvanhooser.choretrackerpro", 
				            targetFilename : "choretrackersync.txt",
				            keepFilenameOnRedirect: true,
				            subscribe: true
				         }
				    );
		}
		else {
			this.syncRetry = 0;
			//this.$.msg.openAtCenter()
			//this.setError("Could not download critical sync file. Upload sync will not be available.")
		};
	},
	//
	onDownloadSuccess: function(iS, iR) {
		   this.log("Downloaded File" + enyo.json.stringify(iR));
		   
		   window.setTimeout(enyo.bind(this,function(){
			   this.$.queryDownloadFile.call({"ticket" : iR.ticket})
		   }),5000);
		   
	},
	onDownloadFailure: function(iS, iR) {
		  console.log("failure: download - " + enyo.json.stringify(iR));
		  this.hasSyncFile = false;
		  if (this.syncRetry == 0) {
			  this.syncRetry = 1;
			  this.log("retry new server");
			  this.$.downloadManager.call(
				         {  target: "http://www.fileden.com/files/2012/1/30/3257324/choretrackersync.txt",
				            targetDir : "/media/internal/.app-storage/com.chrisvanhooser.choretrackerpro", 
				            targetFilename : "choretrackersync.txt",
				            keepFilenameOnRedirect: true,
				            subscribe: false
				         }
				    );
		  }
		  else if (this.syncRetry == 1) {
			  this.syncRetry = 0;
			 // this.$.msg.openAtCenter()
			  //this.setError("Could not download critical sync file. Upload sync will not be available.")
		  };
		  
	},
	verifyDownload: function(iS,iE) {
		this.log(enyo.json.stringify(iE) );
		if  (iE.returnValue == true) {
			if (iE.completionStatusCode && iE.completionStatusCode == 200) {
				this.hasSyncFile = true;
			}
			else if (this.syncRetry == 0) {
				this.syncRetry = 1;
				this.downloadSyncFile();
			}
			else {
				this.syncRetry = 0;
				this.hasSyncFile = false;
			};
		};
	},
	logIntoBox: function (o) {
		//this.checkForSyncFile()
		if (o.enableSync == true) {
			if (this.hasSyncFile == true || this.processFlag == "get_files") {
				this.timedOut = false;
				this.timeOut = 0;
				this.timeOutJob = window.setInterval(enyo.bind(this,this.timeOutCallBack),1000);
				this.$.msg.opendialog();
				this.$.msg.hideButton();
				this.$.msg.setHead("Syncing...");
				this.$.msg.setMsg("Starting login...");
				this.log("Starting login process");
				this.syncObj = o;
				var url = this.ticketURL + this.boxAPI;
				this.syncFolderID = 0;
				this.getCall (url, this, "loginSetup");
			}
			else if (this.processFlag == "sync_upload"){
				
				this.$.msg.showButton();
				this.$.msg.setHead("Error");
			 	this.$.msg.setMsg("The upload sync file can not be found. Please make sure you are connected to the internet and restart the app. The app will attempt to download the sync file.");
			 	this.$.msg.opendialog();
			};
		};
	},
	loginSetup: function (xhr) {
		this.log("Logging In");
		this.$.msg.setMsg("Logging In...");
		var results = this.setupTicket (xhr.responseXML);
		this.timeOut = 0;
		if (results.status == "get_ticket_ok" && this.timedOut == false) {
			this.userTicket = results.ticket;
			
			var loginCommands = {
				login: this.syncObj.userName,
				password: this.syncObj.passWord,
				login_or_register_mode: "login",
				dologin: "1",
				__login: "1",
				submit1: "1",
				reg_step: "",
				folder: "",
				skip_framework_login: "",
				new_login_or_register_mode: ""
			};
			loginCommands = enyo.objectToQuery(loginCommands);
			this.postCall (this.authURL + this.userTicket, loginCommands, this, "verifyLogin");	
		} 
		else {
		 	this.log(results.status);
		 	this.setError(results.status);
		}
	},
	setError: function (e) {
		window.clearInterval(this.timeOutJob)
		this.$.msg.showButton();
		this.$.msg.setHead("Error");
	 	if (this.timedOut == false) {this.$.msg.setMsg(e + "...Please check your Internet connection, username and password.");};
	},
	setupTicket: function (x) {
		var results = {};
		if (!x) {
			results.status = "error_no_connection";
			return results;
		};
		var element = x.getElementsByTagName("response")[0];
		var status = element.getElementsByTagName("status")[0];
		results.status = status.childNodes[0].nodeValue;
		if (results.status == "get_ticket_ok") {
			var ticket = element.getElementsByTagName("ticket")[0];
			results.ticket = ticket.childNodes[0].nodeValue;
		};
		return results;
	},
	verifyLogin: function (xhr) {		
		this.log("verifying log-in");
		this.$.msg.setMsg("Verifying login...");
		this.timeOut = 0;
		this.getCall("https://www.box.net/api/1.0/rest?action=get_auth_token&api_key=" + this.boxAPI + "&ticket=" + this.userTicket, this, "finishVerifyLogin");
	},
	finishVerifyLogin: function (xhr) {
		var results = this.setupLoginDetails(xhr.responseXML);
		if (results.status == "get_auth_token_ok" && this.timedOut == false) {
			this.auth = results.authToken;
			this.login = results.loginId;
			this.$.msg.setMsg("Logged In...");
			this.log("logged in");
			this.getFolderID();
		} 
		else {
			this.setError(results.status);
		}				;
	},
	setupLoginDetails: function(x) {
		var results = {};
		if (!x) {
			results.status = "error_no_connection";
			return results;
		};
		var element = x.getElementsByTagName("response")[0];
		var status = element.getElementsByTagName("status")[0];		
		results.status = status.childNodes[0].nodeValue;
		if (results.status == "get_auth_token_ok") {	
			var authElement = element.getElementsByTagName("auth_token")[0];		
			results.authToken = authElement.childNodes[0].nodeValue;
			var userElement = element.getElementsByTagName("user")[0];
			var loginElement = userElement.getElementsByTagName("login")[0];
			results.loginId = loginElement.childNodes[0].nodeValue;
		}
		return results;
	},
	getFolderID: function() {
		this.timeOut = 0;
		var api = "https://www.box.net/api/1.0/rest?action=get_account_tree&api_key=" + this.boxAPI + "&auth_token=" + this.auth + "&folder_id=" + this.syncFolderID + "&params[]=nozip&params[]=onelevel";
		this.log(api);
		this.$.msg.setMsg("Checking Sync Folder...");
		this.getCall(api, this, "checkFolders" );
	},
	checkFolders: function(xhr) {
		var results = this.getSyncFolder(xhr.responseXML);
	    //this.log("response:" +enyo.json.stringify(results));
	   	if (results.status == "listing_ok" && this.timedOut == false) {
			if (this.syncFolderID == 0) {
				if (results.folder.syncFolder.name && results.folder.syncFolder.name == "Chore Tracker Pro Sync") {
					this.syncFolderID = results.folder.syncFolder.id;
					this.determineProcess();
					//this.log("Sync Folder ID:" + this.syncFolderID);
					this.$.msg.setMsg("Found sync folder...");
				}
				else {
					if (this.processFlag == "sync_upload") {
						this.createSyncFolder();
						this.$.msg.setMsg("Preparing to sync...");
					}
					else {
						this.timedOut = true
						window.clearInterval(this.timeOutJob);
						var o = [];
						o[0] = {};
						o[0].syncBlock = "NO_FILES";
						this.$.msg.setMsg("Nothing to sync...");
						this.$.msg.close();
						this.doGotSyncCommands(o);
					};
				};
			}
			else {
				this.$.msg.setMsg("Getting sync information...");
				this.syncFiles = results.folder.files;
				//this.log(this.syncFiles);
				this.fileCounter = 0;
				this.getFullFileDescriptions();
			};
			
		}
	   	else {
	   		//error
	   		this.setError(results.status);
	   	};
	},
	getSyncFolder: function(x) {
		var results = {};
		if (!x) {
			results.status = "error_no_connection";
			return results;
		}
		var element = x.getElementsByTagName("response")[0];
		var status = element.getElementsByTagName("status")[0];
		results.status = status.childNodes[0].nodeValue;
		if (results.status == "listing_ok") {	
			var treeElement = element.getElementsByTagName("tree") [0];
			var folderElement = treeElement.getElementsByTagName("folder");	
			if (folderElement && folderElement.length > 0) {
				results.folder = this.scanForSyncFolder(folderElement[0]);
			};
		};
		
		return results;
	},
	scanForSyncFolder: function(folderElement) {
		var folder = {};
		if (folderElement.attributes["id"].value == 0 || folderElement.attributes["name"].value == "Chore Tracker Pro Sync") {
			folder.id = folderElement.attributes["id"].value;
			folder.name = folderElement.attributes["name"].value;
			folder.syncFolder = {};
			folder.files = [];
			for (var i = 0; i < folderElement.childNodes.length; i++) {
				if (folderElement.childNodes[i].nodeType != 1 || folderElement.childNodes[i].tagName != "folders") {
					continue;
				};
				var foldersElement = folderElement.childNodes[i];
				for (var j = 0; j < foldersElement.childNodes.length; j++) {
					if (foldersElement.childNodes[j].nodeType == 1 || foldersElement.childNodes[j].tagName != "folder") {
						var subFolderElement = foldersElement.childNodes[j];
						var subFolder = this.scanForSyncFolder(subFolderElement);
						if (subFolder != -1) {
							folder.syncFolder = subFolder;
						};
					};
				};
				break;
			};
			for (var i = 0; i < folderElement.childNodes.length; i++) {
				if (folderElement.childNodes[i].nodeType != 1 || folderElement.childNodes[i].tagName != "files") {
					continue;		
				};
				var filesElement = folderElement.childNodes[i];
				for (var j=0; j < filesElement.childNodes.length; j++) {
					var fileElement = filesElement.childNodes[j];
					if (fileElement.nodeType != 1 || fileElement.tagName != "file") {
						continue;
					};
					var file = {};
					file.id = fileElement.attributes["id"].value;
					file.name = fileElement.attributes["file_name"].value;
					file.description = fileElement.attributes["description"].value;
					folder.files[folder.files.length] = file;
					if (!file.description) {file.description = "";};
				};
				break;				
			};
			return folder;
		}	
		else {
			return -1;
		};
	},
	createSyncFolder: function() {	
		var api = "https://www.box.net/api/1.0/rest?action=create_folder&api_key=" + this.boxAPI + "&auth_token=" + this.auth + "&parent_id=" + "0" + "&name=Chore Tracker Pro Sync&share=0";
		this.log(api);
		this.timeOut = 0;
		this.$.msg.setMsg("Creating Sync Folder...");
		this.getCall(api, this, "verifySyncFolderCreated");
	},
	verifySyncFolderCreated: function(xhr) {
		var results = this.setupFolder(xhr.responseXML);
		if (results.status == "create_ok" && this.timedOut == false) {
			this.$.msg.setMsg("Sync Folder Created...");
			this.log("Folder created");
			this.log(results.id);
			this.syncFolderID = results.id;
			this.processFlag = "upload_now";
			this.determineProcess();
		}
		else {
			this.setError(results.status);
		};
	},
	setupFolder: function(x) {
		var results = {};
		if (!x) {
			results.status = "error_no_connection";
			return results;
		};
		var element = x.getElementsByTagName("response")[0];
		var status = element.getElementsByTagName("status")[0];
		results.status = status.childNodes[0].nodeValue;
		if (results.status == "create_ok") {
			var folder = element.getElementsByTagName("folder")[0];
			var folderid = folder.getElementsByTagName("folder_id")[0];
			results.id = folderid.childNodes[0].nodeValue;
		}
		return results;
	},
	getFullFileDescriptions: function() {
		if (this.fileCounter == 1) {
			var d = this.extractSessionAndFileID(this.syncFiles[0]);
			if (d.deviceid == this.deviceID) {
				var results = this.$.fd.timeSpan(this.lastDate,d.sDate,"minutes");
				if (this.lastDate == d.sDate || results.negative == 1) {
					//already up to date
					this.timedOut = true
					window.clearInterval(this.timeOutJob);
					var o = [];
					o[0] = {};
					o[0].syncBlock = "NO_FILES";
					this.$.msg.setMsg("Nothing to sync...");
					this.$.msg.close();
					this.doGotSyncCommands(o);
					return;
				}
				
			}
		}
		if (this.fileCounter < this.syncFiles.length) {
			//more files, keep pulling data
			this.timeOut = 0;
			this.getFileDescription(this.syncFiles[this.fileCounter].id);
		}
		else {
			//files complete, parse and return
			this.log(this.syncFiles);
			this.parseFilesAndBuildCommands();
		}
	},
	getFileDescription: function(fileID) {
		var api = "https://www.box.net/api/1.0/rest?action=get_file_info&api_key=" + this.boxAPI + "&auth_token=" + this.auth +"&file_id=" + fileID.toString();
		this.$.msg.setMsg("Getting sync info...(" + fileID.toString() + ")");
		this.log(api);
		this.getCall(api, this, "extractDescription");
	},
	extractDescription: function(xhr) {
		if (xhr.responseXML) {
			var results = this.setupDescription(xhr.responseXML);
			if (results.status == "s_get_file_info"){
				this.log("GotFile Description");
				this.log(enyo.json.stringify(results));
				this.syncFiles[this.fileCounter].description = results.description;
				this.fileCounter++;
				this.getFullFileDescriptions();
			}
			else {
				this.log(enyo.json.stringify(results));
				this.setError(results.status);
				//error
			};
		}
		else {
			//retry on this one until it times out
			this.getFullFileDescriptions();
		};
	},
	setupDescription: function(x) {
		var results = {};
		if (!x) {
			results.status = "error_no_connection";
			return results;
		};
		var element = x.getElementsByTagName("response")[0];
		var status = element.getElementsByTagName("status")[0];
		results.status = status.childNodes[0].nodeValue;
		if (results.status == "s_get_file_info") {
			var item = element.getElementsByTagName("info")[0];
			var description = item.getElementsByTagName("description")[0];
			if (description.childNodes && description.childNodes.length > 0) {
				results.description = description.childNodes[0].nodeValue;
			};
		};
		return results;			
	},
	parseFilesAndBuildCommands: function() {
		var results = [];
		var s = "";
		var sID = 0;
		var b = false;
		var finalResults = [];
		this.timeOut = 0;
		this.$.msg.setMsg("Parsing sync files...");
		if (this.syncFiles.length > 0) {
			for (var i = 0; i < this.syncFiles.length; i++) {
				this.syncFiles[i].syncStats = this.extractSessionAndFileID(this.syncFiles[i]);
				results[results.length] = this.syncFiles[i];
			};
			results.sort(enyo.bind(this,this.compareByDate));
			do {
				var tmp = [];
				tmp[0] = results[0];
				for (var i = 1; i < results.length; i++) {
					this.log(results[i].syncStats.sessionID);
					this.log(tmp[0].syncStats.sessionID);
					if (results[i].syncStats.sessionID == tmp[0].syncStats.sessionID) {
						tmp[tmp.length] = results[i];
					};
				};
				this.log(tmp.length);
				if (tmp.length == Number(tmp[0].syncStats.fileCount)) {
					results.splice(0,tmp.length );
					var sss = "";
					var ids = "";
					tmp.sort(this.compareByID);
					for (i = 0;i < tmp.length;i++){
						sss = sss + tmp[i].description.substr(tmp[i].description.indexOf("]") + 1);
						enyo.log(tmp[i].description.substr(tmp[i].description.indexOf("]") + 1));
						ids = ids + tmp[i].id + ",";
					};
					finalResults[finalResults.length] = {};
					finalResults[finalResults.length-1].syncBlock = sss;
					finalResults[finalResults.length-1].deviceid = tmp[0].syncStats.deviceid;
					finalResults[finalResults.length-1].ids = ids;
					finalResults[finalResults.length-1].sessionID = tmp[0].syncStats.sessionID;
					finalResults[finalResults.length-1].syncDate = tmp[0].syncStats.sDate;
				}
				else {
					//error file count
					this.setError("file_count_mis_match");
				}
				if (results.length <= 0) {b = true;};
			}
			while (b == false);
			this.log(enyo.json.stringify(finalResults));
			this.$.msg.setMsg("Scanning...");
			window.clearInterval(this.timeOutJob);
			this.doGotSyncCommands(finalResults);
		}
	},
	closeMsg: function() {
		this.$.msg.close();
	},
	setMsg: function(s) {
		this.$.msg.setMsg(s);
	},
	extractSessionAndFileID: function(s) {
		this.$.msg.setMsg("Building sync document...");
		var results = {
				sessionID: 0,
				fileID: 0,
				sDate: "",
				deviceid: 0,
				fileCount: 0
		};
		if (!s.description) {s.description = ""};
		s = s.description;
		if (s.length > 0) {
			var m = s.substr(1,s.indexOf("]")-1);
			var Arr = m.split(",");
			results.sessionID = Arr[0].replace("session:","");
			tmp = Arr[1].replace("fileid:","");
			tmp = tmp.split("/");
			results.fileID = tmp[0];
			results.fileCount = tmp[1];
			results.sDate = Arr[2].replace("date:","");
			results.deviceid = Arr[3].replace("id:","");
			this.log(enyo.json.stringify(results));
		}
		return results;
	},
	compareByDate: function(a,b) {
		var x = this.$.fd.getPercent(a.syncStats.sDate,0, 1);
		var y = this.$.fd.getPercent(b.syncStats.sDate, 0, 1);
		if (x < y) {
	       return -1;
	    };
	    if (x > y) {
	       return 1;
	    };
	    return 0;
	},
	compareByID: function(a,b) {
		var x = a.syncStats.fileID;
		var y = b.syncStats.fileID;
		if (Number(x) < Number(y)) {
	       return -1;
	    };
	    if (Number(x) > Number(y)) {
	       return 1;
	    };
	    return 0;
	},
	determineProcess: function() {
		this.log(this.processFlag);
		if (this.processFlag == "get_files") {
			this.$.msg.setMsg("Getting Sync Files...");
			this.getFolderID();
		}
		else if (this.processFlag == "sync_upload") {
			this.$.msg.setMsg("Syncing...");
			this.deleteFolder();
		} //upload_now
		else if (this.processFlag == "upload_now") {
			this.$.msg.setMsg("Uploading...");
			this.uploadSyncItems();
		};
	},
    getCall: function(api, callT, callM) {
    	this.log("in get call")
		var apiCall = {
			callTarget: callT,
			callMethod: callM,
			call: function (inResponse, inXhr) {
				this.callTarget[this.callMethod](inXhr);
			}
		};
	    enyo.xhr.request ({
			url: api,
			method: "GET",
			callback: enyo.bind(apiCall, apiCall.call)
		});	
	},
	postCall: function (api, body, callT, callM) {
		var apiCall = {
			callTarget: callT,
			callMethod: callM,
			call: function (inResponse, inXhr) {
				this.callTarget[this.callMethod](inXhr);
			}
		};
		
		enyo.xhr.request ({
			url: api,
			method: "post",
			headers: {"Content-type": "application/x-www-form-urlencoded"},
			body: body,
			callback: enyo.bind(apiCall, apiCall.call)
		});
	},
	feedSyncItem: function(s) {
		this.toBeSynced[0] = s
	},
	deleteFolder: function() {
		//https://www.box.net/api/1.0/rest?action=delete&api_key=rrc1d3ntb53tt6b2vhail6rdtrsxov3v&auth_token=tkm1l2ojyhgrf86zzvdqvoa6zcqss6pf&target=folder&target_id=738
		this.timeOut = 0;
		var api = "https://www.box.net/api/1.0/rest?action=delete&api_key=" + this.boxAPI + "&auth_token=" + this.auth + "&target=folder&target_id=" + this.syncFolderID; 
		this.log("DELETEING" + api);
		this.getCall(api, this, "verifyDelete");
	},
	verifyDelete: function(xhr) {
		//this.log(xhr.responseXML.toString());
		var results = this.setupDelete(xhr.responseXML);
	    this.log("response:" +enyo.json.stringify(results));
	   	if (results.status == "s_delete_node" && this.timedOut == false) {
	   		this.log("deleted");
	   		this.$.msg.setMsg("Preparing Upload Sync...");
	   		this.createSyncFolder();
	   	}
	   	else {
	   		//failed deleteing
	   		this.setError(results.status);
	   	};
	},
	setupDelete: function(x) {
		var results = {};
		if (!x) {
			results.status = "error_no_connection";
			return results;
		};
		var element = x.getElementsByTagName("response")[0];
		var status = element.getElementsByTagName("status")[0];
		results.status = status.childNodes[0].nodeValue;	
		return results;
	},
	uploadSyncItems: function() {
		if (this.toBeSynced.length > 0) {
			this.$.msg.setMsg("Uploading...");
			var s = this.toBeSynced[0];
			var i = s.length;
			var d = new Date();
			sessionID = Math.floor(Math.random() * d.getTime()) ;
			var sDate = this.lastDate;
			var fC = s.length / 500;
			if (fC < 1) {
				fC = 1;
			}
			else {
				if (fC - Math.floor(fC) > 0) {
					fC = Math.floor(fC) + 1;
				};
			};
			this.uploadSegment = [];
			if (s.length > 500) {
				do {
					if (s.length > 500) {
						this.uploadSegment[this.uploadSegment.length] ="[session:" + sessionID.toString() + ",fileid:" + (this.uploadSegment.length + 1) + "/" + fC.toString() + ",date:" + sDate + ",id:" + this.deviceID + "]" + s.substr(0,500);
						s = s.substr(500);
					}
					else {
						this.uploadSegment[this.uploadSegment.length] = "[session:" + sessionID.toString() + ",fileid:" + (this.uploadSegment.length + 1 ) + "/" + fC.toString() +  ",date:" + sDate + ",id:" + this.deviceID + "]" + s;
						s = "";
					};
				}
				while (s.length > 0);
			}
			else {
				this.uploadSegment[0]  = "[session:" + sessionID.toString() + ",fileid:" + this.uploadSegment.length + "/" + fC.toString() +  ",date:" + sDate + ",id:" + this.deviceID + "]" + s;
			};
			this.uploadCounter = 0;
			this.syncUpload();
		}
	},
	syncUpload: function() {
		if (this.uploadCounter < this.uploadSegment.length) {
			this.timeOut = 0;
			this.$.msg.setMsg("Uploading segment " + (this.uploadCounter + 1) + "/" + (this.uploadSegment.length ) + "...");
			this.uploadSegmentFile();
		}
		else {
			this.$.msg.setMsg("Upload Complete...");
			this.log("completed upload sync");
			this.toBeSynced = [];
			window.clearInterval(this.timeOutJob)
			window.setTimeout(enyo.bind(this,function(){
				this.$.msg.close();
			}), 1000);
			//complete
		};
	},
	uploadSegmentFile: function() {
		var api = "https://upload.box.net/api/1.0/upload/" + this.auth + "/" + this.syncFolderID + "?new_copy=" + "1";
		this.log("starting upload: " + api);
		this.$.uploadSrvc.call ({
			fileName:	"/media/internal/.app-storage/com.chrisvanhooser.choretrackerpro/choretrackersync.txt",
			url:		api,
			fileLabel: "choretrackersync"
		});
	},
	uploadSrvc_Success: function(iS, iR) {
		this.log ("uploadSrvc_Success" + enyo.json.stringify(iR) );
		if (iR.completed && iR.completed == true){
			this.$.msg.setMsg("Completed segment " + this.uploadCounter.toString() + "/" + (this.uploadSegment.length ) + "...");
			this.log("completed");
			var x = new DOMParser().parseFromString(iR.responseString, "text/xml");				
			var results = this.getNewFileID(x);
			if (results.status == "upload_ok" && this.timedOut == false) {
				this.setDescription(results.id,this.uploadSegment[this.uploadCounter]);
			} 
			else {
				this.log( results.status);
				this.setError(results.status);
			};
		};
	},	
	getNewFileID: function(x) {
		var results = {};
		var element = x.getElementsByTagName("response");
		if (element.length != 1) {
			results.status = "e_no_response";
			return results;
		};
		element = element[0];
		var status = element.getElementsByTagName("status");
		if (status.length != 1) {
			results.status = "e_no_response";
			return results;
		};
		if (status.length == 1) {
			var statusElemVal = " ";
			status = status[0];
			if(status.childNodes.length == 1) {
				status = status.childNodes[0].nodeValue;
			}		 			
			results.status = status;
		}
		if (results.status == "upload_ok") {
			
			var file = element.getElementsByTagName("files");
			if (file.length !=1) {
				results.status = "e_no_response";
				return results;
			}
			file = file[0];
			
			var fileElement = file.getElementsByTagName ("file");
			results.id = fileElement[0].attributes["id"].value;
		}
		return results;
	},
	uploadSrvc_Failure: function (iS, iR) {
		var res = enyo.json.stringify(iR);
		this.log ("uploadSrvc_Failure" + res);
		this.setError(res);
	},
	setDescription: function (fileID, s) {
		this.currentFileID = fileID
		this.currentData = s
		this.timeOut = 0;
		var api = "https://www.box.net/api/1.0/rest?action=set_description&api_key=" + this.boxAPI + "&auth_token=" + this.auth + "&target=file&target_id=" + fileID.toString() + "&description=";
		api = api + s;
		this.log(api);
		this.$.msg.setMsg("Setting data...");
		this.getCall(api, this, "continueUpload");
		
	},
	continueUpload: function(xhr){
		var results = this.confirmDescription(xhr.responseXML);
		if (results.status = "s_set_description") {
			this.uploadCounter++;
			this.syncUpload();
		}
		else {
			//Error
			if (this.currentFileID == 0) {
				this.setError("error_upload");
			}
			else {
				if (this.setDescCount <= 3) {
					this.setDescCount++;
					this.setDescription(this.currentFileID, this.currentData);
				}
				else {
					this.setDescCount = 0;
					this.currentData = "";
					this.currentFileID = 0;
					this.setError("fail_data_connect");
				};
			};
		};
	},
	confirmDescription: function(x) {
		var results = {};
		if (!x) {
			results.status = "error_no_connection";
			return results;
		};
		var element = x.getElementsByTagName("response")[0];
		var status = element.getElementsByTagName("status")[0];
		results.status = status.childNodes[0].nodeValue;	
		return results;
	}
});
