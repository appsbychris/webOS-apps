

enyo.kind({
	kind: "Pane", 
	name: "bulkAdd", 
	className: "editWindowPane", 
	lazy: true, 
	published: {
		selectedRow: -1,
		thePaths: "",
		currentFile: "",
		currentPath: "/media/internal/",
		bulkFolders: [],
		USEFILES: false,
		imageTypes: [".jpg", ".jpeg", ".bmp", ".png" , ".gif"],
        audioTypes: [".mp3", ".wav", ".ogg", ".flac", ".aac", ".amr", ".3g2", ".m4a"]
	},
	events: {
		onDataToSave: "",
		onShutDown: "",
		onRequestMsgBox: "",
		onPrefChanged: "",
		onRequestHelpPop: ""
	},
	components: [
		{
			name: "getDirectoryTree",
			kind: "PalmService",
			timeout: 25000,
			service: "palm://com.chrisvanhooser.slideshowpresentationhd.service/",
			method: "readdir",
			onSuccess: "getDirSuccess",
			onFailure: "getDirFailure"
		},
		{
			name: "getAllFiles",
			kind: "PalmService",
			service: "palm://com.chrisvanhooser.slideshowpresentationhd.service/",
			method: "readdir",
			onSuccess: "getFilesSuccess",
			onFailure: "getDirFailure"
		},						
        {layoutKind: "VFlexLayout", className:"editWindowPane", components: [
    		{kind: "HFlexBox", style: "height:80px", className: "editListSubItem", components: [
               	{kind: "MyCustomButton", defaultClassName:"backButton", clickClassName: "backButtonClicked", name:"backBulk", onButtonClicked: "shutDown"},                            
				{name: "bulkHeaderContent", content: "Bulk Add", flex: 1},
				{kind: "Button", caption: "Add This Folder",className:"enyo-button-affirmative", onclick:"addFolder"}
            ]},
            {kind: "HFlexBox",flex:1, components:[ 
            	{kind: "VFlexBox",flex: 1,components:[ 
	            	{kind: "VFlexBox",className:"editListSubItem",components:[ 
	            		{kind: "HFlexBox",components:[ 
							{kind: "MyCustomButton", defaultClassName:"backFolderButton", clickClassName: "backFolderButtonClicked", disabledClassName: "backFolderButtonDisabled", name:"backFolder",  onButtonClicked: "goBackFolder"},
							{kind: "Button",name: "refreshButton", className: "enyo-button-blue", caption: "Refresh", onclick: "startUp", showing: false}
						]},
	                    {kind: "HFlexBox",components:[ 
		                    {kind: "DataSpinner", name: "activity", style: ""},
		                    {name: "curPath", content: "Current Path: /media/internal/", className: "wordWrapBulk"}
		                ]}
	                ]},
	                {kind:"VFlexBox",className:"editListSubItem",flex: 1, components: [
                        {kind: "VirtualList",height: "100%",width: "100%", name: "bulkFolderList", onSetupRow: "getDirTree", components: [
    	                    {kind: "Item",className: "editListItemList", tapHighlight: true,onclick: "bulkItemClick", layoutKind: "HFlexLayout", components: [
	            	            {name: "theIcon", kind:"Image", className:"bulkImage"},
	            	            {name: "bulkFolderName", flex: 1}
	            	        ]}
    	                ]}
                    ]}
                ]},
	            {kind:"VFlexBox",className:"editListSubItem",flex: 1, components: [
	            	{kind: "HFlexBox", components:[
	            		{content: "Settings:", style: "font-weight:bold;font-size:110%;"},
	            		{flex: 1},
	            		{kind: "HelpButton", helpID: "bulkadding", onHelpRequested: "doRequestHelpPop"}
	            	]},
	                
	                {content: "Add which types of files:",style:"margin-left:10px;"},
	                {kind: "HFlexBox",className: "editListSubItem", components:[
						{kind: "RadioGroup",flex:1, onChange: "prefChangedPicker", preference: "bulkradio", value: "pic", name: "addOptions", components: [
						    {caption: "Pictures", icon: "images/pictureicon.png", value: "pic"},
						    {caption: "Music", icon: "images/musicicon.png", value: "aud"},
						    {caption: "Both", icon: "images/picandmusicicon.png", value: "both"}
						]}
					]},
					{kind: "MyLabeledContainer", className:"editListSubItem",caption: "Sort", components: [
						{kind: "Picker", name: "bulkSortPicker", value: "Picture Ordered By Filename", 
					    	items: [{caption: "No Order", value: "No Order"}, 
					    	        {caption: "Ordered By Filename", value: "Picture Ordered By Filename"}, 
					    	        {caption: "Ordered By Path", value: "Picture Ordered By Path"}, 
					    	        {caption: "Ordered By Path With Filename", value: "Picture Ordered By Path With Filename"}
					    	       ], 
					    	onChange:"prefChangedPicker", 
					    	preference:"bulksortpicker"
					    }
					]},
				    {kind: "MyLabeledContainer", className:"editListSubItem",style: "height:85px;",caption: "Show Hidden", components: [
						{kind: "MyCustomButton", name: "showHidden",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "prefChangedCheck", preference: "showhidden"}
					]},
					{kind: "MyLabeledContainer", className:"editListSubItem",style: "height:85px;",caption: "Add Folders And Subfolders", components: [
 						{kind: "MyCustomButton", name: "addSubFolders",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "prefChangedCheck", preference: "addsubfolder"}
 					]},
				]}
            ]}                                            
        ]},
        {kind: "scrimSpinner", name: "spin"}
	],
	working: false,
	startUp: function() {
    	enyo.setAllowedOrientation("landscape");
		this.selectedRow = -1;
		this.$.refreshButton.setShowing(false);
		this.$.curPath.setContent("Please wait...");
		this.$.activity.showMe();
		this.working = true;
		this.$.getDirectoryTree.call({
			"path" : this.currentPath
		});
		enyo.setAllowedOrientation("landscape");
		this.selectedRow = -1;
		
		//this.$.bulkFolderList.punt();
		this.$.bulkHeaderContent.setContent("Add by folder: " + this.currentPath);
		//this.$.curPath.setContent("Current Path: " + this.currentPath);
		this.$.bulkSortPicker.setValue(this.thePaths.getSetting(this.currentFile, "bulksortpicker"))
		this.$.showHidden.setChecked(this.thePaths.getSetting(this.currentFile, "showhidden"))
		this.$.addSubFolders.setChecked(this.thePaths.getSetting(this.currentFile, "addsubfolder"))

		//new setting, need to check incase it hasn't been set yet.
		var x = this.thePaths.getSetting(this.currentFile, "bulkradio")
		if (x != "NO_SETTINGS") {
			this.$.addOptions.setValue(x)	
		}
		//this.log("@@@=============>>>" + this.thePaths.getPictureCount())
		
    },
    shutDown: function() {
		enyo.setAllowedOrientation("free");
		
		this.doShutDown();
	},
	prefChangedCheck: function(iS, iE) {
		var obj = {};
		obj.preference = iS.preference;
		obj.val = iS.getChecked();
		this.doPrefChanged(obj);
		if (obj.preference == "showhidden") {
			this.$.curPath.setContent("Please wait...");
			this.$.activity.showMe();
			this.working = true;
			this.$.getDirectoryTree.call({
				"path" : this.currentPath
			});
		}
	},
	prefChangedPicker: function(iS, iE) {
		var obj = {};
		obj.preference = iS.preference;
		obj.val = iS.getValue();
		this.doPrefChanged(obj);
	},
	goBackFolder: function() {
		
		this.currentPath = this.currentPath.substr(0,this.currentPath.lastIndexOf("/",this.currentPath.length - 2)+1)
		this.$.curPath.setContent("Please wait...");
		this.$.activity.showMe();
		this.working = true;
		this.$.getDirectoryTree.call({
			"path" : this.currentPath
		});
		
	},
	bulkItemClick: function(inSender, inEvent) {
		if (this.bulkFolders[inEvent.rowIndex].indexOf("FILE: ") < 0 && this.working == false) {
			
			
			var x = this.bulkFolders[inEvent.rowIndex];
			this.currentPath= this.currentPath + x + "/";
			this.$.curPath.setContent("Please wait...");
			this.$.activity.showMe();
			this.working = true;
		    this.$.getDirectoryTree.call({
				"path" : this.currentPath
			});
		}
	},
	getDirTree: function (inSender, inIndex) {
		if (inIndex >= 0) {
		    if (inIndex <= this.bulkFolders.length - 1 ) {
		    	//var isRowSelected = (inIndex == this.audSelectedRow);
		    	//this.$.bulkFolderName.applyStyle("background", isRowSelected ? "#9BA6B1" : null);
		    	if (this.bulkFolders[inIndex].substr(0,6) == "FILE: ") {
		    		this.$.theIcon.setSrc("images/file.png")
		    	}
		    	else {
		    		this.$.theIcon.setSrc("images/folder.png")
		    	}
		    	this.$.bulkFolderName.setContent(this.bulkFolders[inIndex]);
		    	return true;
		    }
		}
	},
	compareFileName: function (a,b) {
		if (a.substr(a.length -1, 1) == "/") {
			var s = a.substr(0,a.length-1)
		}
		else {
		    var s = a
		}
		  var x = s.lastIndexOf("/");
		  s =  s.substr(x+1)
		  s = s.toLowerCase()
		if (b.substr(b.length -1, 1) == "/") {
			var s1 = b.substr(0,b.length-1)
		}
		else {
		    var s1 = b
		}
		  x = s1.lastIndexOf("/");
		  s1 =  s1.substr(x+1)
		  s1 = s1.toLowerCase()
		  if (s < s1) {
		     return -1;
		  }
		  if (s > s1) {
		     return 1;
		  }
		  return 0;
	},
	comparePaths: function (a,b) {
		if (a.substr(a.length -1, 1) == "/") {
			var s = a.substr(0,a.length-1)
		}
		else {
		    var s = a
		}
		  var x = s.lastIndexOf("/");
		  s =  s.substr(0,x)
		  s = s.toLowerCase()
	    if (b.substr(b.length -1, 1) == "/") {
			var s1 = b.substr(0,b.length-1)
		}
		else {
		    var s1 = b
		}
		  x = s1.lastIndexOf("/");
		  s1 =  s1.substr(0,x)
		  s1 = s1.toLowerCase()
		  if (s < s1) {
		     return -1;
		  }
		  if (s > s1) {
		     return 1;
		  }
		  return 0;
	},
	Files_Started: false,
	addFolder: function() {

		/*this.$.progress.openAtCenter();
		this.$.progress.startAni();
		this.$.progress.setMessage("Adding...");*/

		this.$.spin.start("Adding...");
		//enyo.log(this.USEFILES)
		if (this.$.addSubFolders.getChecked() == true && this.USEFILES == false) {
			this.getSubFolders()
		}
		if (this.Files_Started == false && (this.$.addSubFolders.getChecked() == false || this.USEFILES == true)) {
			if (this.$.addSubFolders.getChecked() == false) {this.USEFILES = false}
			this.Files_Started = true
			switch (this.$.addOptions.getValue()) {
				case "pic": {
					//this.log("adding pics")
					this.addBulkPics(0)
					break;
				}
				case "aud": {
					this.addBulkAud([], 0, 0)
					break;
				}
				case "both": {
					this.addBulkPics(1)
					break;
				}
			}
		}
	},
	addBulkPics: function (doAud) {
		var string1 = ""
		var string = ""
		var c = false
		var vCount = this.thePaths.getPictureCount();
		var fs = []
		if (this.USEFILES == true) {
			fs = this.FILES
		}
		else {
			fs = this.bulkFolders
			this.FILES = []
			for (var i = 0; i < fs.length;i++) {
				if (fs[i].substr(0,6) == "FILE: ") {
					this.FILES[this.FILES.length] =this.currentPath + fs[i].substr(6)
					
				}
			}
			fs = this.FILES
		}
		this.$.spin.setProgMax(fs.length)
		if (this.$.bulkSortPicker.getValue() == "Picture Ordered By Filename") {
			fs.sort(this.compareFileNames)
		}
		else if (this.$.bulkSortPicker.getValue() == "Picture Ordered By Path") {
			fs.sort(this.comparePaths)
		}
		else if (this.$.bulkSortPicker.getValue() == "Picture Ordered By Path With Filename") {
			fs.sort()
		}
		var sql = []
		//this.log("starting...")
		this.startPictureAdd(0, fs, sql,vCount, doAud,0,0)
	},
	startPictureAdd: function(i, fs, sql, vCount, doAud, numF, noF) {
		var b = false
    	var s= ""
    	var s1 = ""
		for (var k = 0; k < 25; k++) {
			if (i > fs.length - 1) {break;}
			s = fs[i]
			s1 = s.toLowerCase()
			b = false
			for (var j = 0; j< this.imageTypes.length; j++){
				if (s1.indexOf(this.imageTypes[j]) >= 0 ) {
					b = true
					break;
				}
			}
			//enyo.log(b )
			if (b == true) {
				if (this.thePaths.doesPictureExist(s) ==  false) {
					//this.log(i + "added"  + fs.length + "add" + numF)
				    this.$.spin.setStatusMsg("Adding " + s + "...")
					sql.push(BuildPictureString(s,vCount.toString(), true, this.thePaths, this.currentFile))
					//string1 = string1 + string
					vCount++
					numF++
				}
				else {
					//this.log(i + "already"  + fs.length + "exist" + noF)
					this.$.spin.setStatusMsg(s + " already exist...")
					noF++
				}
				this.$.spin.setProgPos(i)
			}
		
			i++
		}
		if (i < fs.length) {
			//this.log(i + "," + fs.length)
			enyo.nextTick(this,this.startPictureAdd,i,fs,sql,vCount,doAud, numF, noF)
		}
		else {
			//this.log(doAud)
			if (doAud == 0) {
				//this.log("1")
				if (sql.length > 0) {
					//var Arr = string1.split(";")
					/*for (i = 0; i < Arr.length - 1; i++) {
						transaction.executeSql(Arr[i],[],[enyo.bind(this,(function (transaction, result) {this.$.testing.setContent(result.message)}))],[])
					}*/
					//this.log(2)
					this.USEFILES = false
					this.Files_Started = false
					this.FILES = []
					this.FOLDERS = []
					this.doRequestMsgBox("Added " + numF.toString() + " pictures.")
					this.doDataToSave(sql) 
				}
				else {
					var ex = ""
					if (noF > 0) {
						ex = noF.toString() + " pictures already exist in project."
					}
					this.Files_Started = false
					this.USEFILES = false
					this.FILES = []
					this.FOLDERS = []
					this.doRequestMsgBox("No pictures added. " + ex)
				}
				this.$.spin.stop()
			}
			else {
				this.addBulkAud(sql, numF, noF);
			}
		}
	},
	addBulkAud: function(sql, cCount, igPics) {
		var string1 = ""
		var string = ""
		var c = false
		var vCount = this.thePaths.getAudioCount();
		var fs = []
		if (this.USEFILES == true) {
			fs = this.FILES
		}
		else {
			fs = this.bulkFolders
			this.FILES = []
			for (var i = 0; i < fs.length;i++) {
				if (fs[i].substr(0,6) == "FILE: ") {
					this.FILES[this.FILES.length] =this.currentPath + fs[i].substr(6)
				}
			}
			fs = this.FILES
		}
		if (this.$.bulkSortPicker.getValue() == "Picture Ordered By Filename") {
			fs.sort(this.compareFileNames)
		}
		else if (this.$.bulkSortPicker.getValue() == "Picture Ordered By Path") {
			fs.sort(this.comparePaths)
		}
		else if (this.$.bulkSortPicker.getValue() == "Picture Ordered By Path With Filename") {
			fs.sort()
		}
		this.$.spin.setProgMax(fs.length)
		this.$.spin.setProgPos(0)
		this.startAudioAdd(0, fs, sql, vCount, cCount, igPics,0,0)

	},
	startAudioAdd: function(i, fs, sql, vCount, cCount, igPics, numF, noF) {
			var string = ""
			var ex = ""
			var ex1 = ""
		for (var k = 0; k < 25; k++) {
			if (i > fs.length - 1) {break;}
			var s = fs[i]
			var s1 = s.toLowerCase()
			var b = false
			for (var j = 0; j< this.audioTypes.length; j++){
				
				if (s1.indexOf(this.audioTypes[j]) >= 0 ) {
					b = true
					
					break;
				}
			}
			if (b == true) {
				
				if (this.thePaths.doesAudioExist(s) ==  false) {
						//string = this.buildPictureString(s,vCount.toString())
					 	this.$.spin.setStatusMsg("Adding " + s + "...")
					 	sql.push("INSERT INTO audPathsTable (" + AudColumnsShort + ") VALUES ('" + s + "', " + vCount.toString()+ ", '" + this.currentFile + "');");
					 	this.thePaths.feedAudioItem(s, vCount);
					 	vCount++
						numF++
				}
				else {
					noF++
					this.$.spin.setStatusMsg( s + " already exist...")
				}
				this.$.spin.setProgPos(i)
			}
			
			i++
		}
		if (i < fs.length) {
			this.startAudioAdd(i, fs, sql, vCount, cCount, igPics, numF, noF)
		}	
		else {
			if (sql.length > 0) {
				if (cCount > 0) {
					string = ", and " + cCount.toString() + " pictures."
				}
				else if (cCount == 0 && igPics > 0) {
					string = " No pictures Added,  " + igPics.toString() + " pictures already exist in project."
				}
				this.USEFILES = false
				this.Files_Started = false
				this.FILES = []
				this.FOLDERS = []
				this.doRequestMsgBox("Added " + numF.toString() + " tracks" + string)
				this.doDataToSave(sql)
				
			}
			else {
				if (cCount == 0 && igPics > 0 ) {
					if (noF > 0) {
						ex = noF.toString() + " tracks already exist in project. "
					}
					if (igPics > 0) {
						ex1 = igPics.toString() + " pictures already exist in project."
					}
					this.USEFILES = false
					this.Files_Started = false
					this.FILES = []
					this.FOLDERS = []
					this.doRequestMsgBox("No tracks or pictures added. " + ex + ex1)
				}
				else {
					if (noF > 0) {
						ex = noF.toString() + " tracks already exist in project."
					}
					this.USEFILES = false
					this.Files_Started = false
					this.FILES = []
					this.FOLDERS = []
					this.doRequestMsgBox("No tracks added. " + ex)
				}
			}
			this.$.spin.stop()
		}
	},
	
	

	getDirSuccess: function (inSender, results) {
		var a = [];
		var tmp = [];
		var s= results;
		var c = s.substr(0,s.indexOf("|"));
		s = s.substr(s.indexOf("|") +1);
		var t = s.split("}|{");
		s = t[0];
		if (s.length > 0) {
			s = s.substr(0,s.length-1)
			var b = s.split("|");
			a = a.concat(b);
			
		}
		if (this.$.showHidden.getChecked() == false ) {
			for (var i = 0;i < a.length;i++) {

				if (a[i].substr(0,1) != "." ) {
					//a.splice(i,1)
					tmp[tmp.length] = a[i]
				}
			}
			
			a = []
			a = a.concat(tmp)
		}
		s = t[1]
		var b = false
		if (s.length > 0) {
			tmp = []
			s = s.substr(0,s.length-1);
			var d = s.split("|");
			for (var i = 0; i < d.length; i++) {
				b = false
				var sF = d[i].toLowerCase()
				if (b == false) {
					for (var j = 0; j< this.audioTypes.length; j++){
						
						if (sF.indexOf(this.audioTypes[j]) >= 0 ) {
							b = true
							
							break;
						}
					}
				}
				if (b == false) {
					for (var j = 0; j< this.imageTypes.length; j++){
						
						if (sF.indexOf(this.imageTypes[j]) >= 0 ) {
							b = true
							break;
						}
					}
				}

				if (d[i].substr(0,1) == "." && this.$.showHidden.getChecked() == false) {
					b = false
				}
				if (b == true) {
					tmp[tmp.length] = "FILE: " + d[i];
				}
				else {
					//d.splice(i,1)
					c = c - 1
				}
				//this.$.progress.setMessage("Scanning " + d[i] + "...")
			}
			a = a.concat(tmp);
			
		}
		if (this.currentPath == "/media/internal/") {
			this.$.backFolder.setButtonEnabled(false);
		}
		else {
			this.$.backFolder.setButtonEnabled(true);
		}
		this.bulkFolders = a;
		//this.$.progress.setMessage("Loading...")
		this.$.bulkHeaderContent.setContent("Add by Folder: " + this.currentPath + "   (" + c + " files)");
		this.$.curPath.setContent("Current Path: " + this.currentPath + "   (" + c + " files)");
		this.$.bulkFolderList.punt();
		this.$.activity.hideMe();
		this.working = false;
		/*this.$.progress.stopAni();
		this.$.progress.close()*/
		
	},
	getDirFailure: function (inSender, results) {
		this.currentPath = "/media/internal/"
			//if (this.$.containPane.getViewName() == "bulkAdd") {
				this.$.bulkHeaderContent.setContent("Add by Folder: " + this.currentPath + "   (error)");
				this.$.curPath.setContent("Current Path: " + this.currentPath + "   (error)");
				this.$.bulkFolderList.punt();
			//};
			//this.$.progress.stopAni();
			//this.$.progress.close()
			this.$.spin.stop()
			this.$.activity.hideMe();
			this.$.backFolder.setButtonEnabled(false);
			this.working = false;
			this.$.refreshButton.setShowing(true);
			this.$.curPath.setContent("File system service not responding. A device restart may be needed. Click the \"Refresh\" button to try again")
	},
	getSubFolders: function() {
		//bulkFolders
		//this.$.progress.openAtCenter()
		//this.$.progress.startAni()
		this.$.spin.start("Adding all folders and subfolders...")
		this.BulkII = 0
		this.FOLDERS = []
		this.FILES = []
		this.SUBPATH = this.currentPath
		for (var i = 0; i < this.bulkFolders.length; i++) {
			if (this.bulkFolders[i].substr(0,6) == "FILE: ") {
				this.FILES[this.FILES.length] =this.currentPath + this.bulkFolders[i].substr(6)
			}
			else {
				this.FOLDERS[this.FOLDERS.length] = this.currentPath + this.bulkFolders[i] + "/"
			}
		}
		if (this.FOLDERS.length > 0) {
			this.$.getAllFiles.call({
				"path" : this.FOLDERS[0]
			});
		}
		else {
			this.USEFILES = true
			//var b = true
			//enyo.log(this.USEFILES )//+"," + b )
			this.addFolder()
		}
	},
	getFilesSuccess: function(inSender, results) {
		//this.$.fileresults.setContent(enyo.json.stringify(results))
		var a = [];
		var tmp = [];
		var s= results;
		var c = s.substr(0,s.indexOf("|"));
		s = s.substr(s.indexOf("|") +1);
		var t = s.split("}|{");
		s = t[0];
		if (s.length > 0) {
			s = s.substr(0,s.length-1)
			var b = s.split("|");
			a = a.concat(b);

			for (var i = 0;i < a.length;i++) {

				if (a[i].substr(0,1) != "." && this.$.showHidden.getChecked() == false) {
					//a.splice(i,1)
					this.FOLDERS[this.FOLDERS.length] = this.FOLDERS[this.BulkII] + a[i] + "/"
				}
				else if (this.$.showHidden.getChecked() == true) {
					this.FOLDERS[this.FOLDERS.length] = this.FOLDERS[this.BulkII] + a[i] + "/"
				}
			}
		}
		
		s = t[1]
		var b = false
		if (s.length > 0) {
			tmp = []
			s = s.substr(0,s.length-1);
			var d = s.split("|");
			for (var i = 0; i < d.length; i++) {
				b = false
				var sF = d[i].toLowerCase()
				if (b == false) {
					for (var j = 0; j< this.audioTypes.length; j++){
						
						if (sF.indexOf(this.audioTypes[j]) >= 0 ) {
							b = true
							
							break;
						}
					}
				}
				if (b == false) {
					for (var j = 0; j< this.imageTypes.length; j++){
						
						if (sF.indexOf(this.imageTypes[j]) >= 0 ) {
							b = true
							break;
						}
					}
				}

				if (d[i].substr(0,1) == "." && this.$.showHidden.getChecked() == false) {
					b = false
				}
				if (b == true) {
					this.FILES[this.FILES.length] = this.FOLDERS[this.BulkII] + d[i];
				}
				else {
					//d.splice(i,1)
					c = c - 1
				}
				this.$.spin.setStatusMsg("Scanning " + d[i] + "...")
			}
			
		}
		this.BulkII++
		if (this.BulkII < this.FOLDERS.length) {
			this.$.getAllFiles.call({
				"path" : this.FOLDERS[this.BulkII]
			});
		}
		else {
			//this.$.fileresults.setContent(this.FILES.length + "," + this.FILES.join(","))
			//this.log("adding")
			this.USEFILES = true
			this.addFolder()
		}
	},
})