


enyo.kind({
	name: "SlideShowApp",
	kind: "VFlexBox",
	published: {
		exhibition: false,
		exhibFileName:-1,
		fileNames: [],
		fileNameSelectedRow: -1,
		picIndex: 0,
		audIndex: 0,
		timeIndex: 0,
		reindexing:-1,
		isRunning: 0,
		activeIndex: 0,
		beSilent: 0,
		exifData: [],
		buttonOpen:0,
		buttonTimer: 0,
		overRide: 0,
		isLoading: 0,
		showPaused: 0,
		audioTypes: [".mp3", ".wav", ".ogg", ".flac", ".aac", ".amr", ".3g2", ".m4a"],
		currentFile: "",
		picColumns: "pkey INTEGER PRIMARY KEY ASC AUTOINCREMENT, picpath TEXT NOT NULL DEFAULT 'nothing', piccaption TEXT NOT NULL DEFAULT 'nothing', piccaploc TEXT NOT NULL DEFAULT '0', " +
				"picorder INTEGER NOT NULL DEFAULT '0', filename TEXT NOT NULL DEFAULT 'basic', transition  TEXT NOT NULL DEFAULT 'fadeOut', " +
				"captioncolor  TEXT NOT NULL DEFAULT 'black', captionstyle  TEXT NOT NULL DEFAULT '0', stretch TEXT NOT NULL DEFAULT '0', delay TEXT NOT NULL DEFAULT '15s'",
		
		audColumns: "pkey INTEGER PRIMARY KEY ASC AUTOINCREMENT, audpath TEXT NOT NULL DEFAULT 'nothing', audorder INTEGER NOT NULL DEFAULT 0, filename TEXT NOT NULL DEFAULT 'basic'",
		
		setColumns: "filename TEXT NOT NULL DEFAULT 'nothing', mainsettings TEXT NOT NULL DEFAULT 'nothing', globalsettings TEXT NOT NULL DEFAULT 'nothing', " +
				"addsettings TEXT NOT NULL DEFAULT 'nothing', projectsettings TEXT NOT NULL DEFAULT 'nothing', exhibition TEXT NOT NULL DEFAULT 'nothing'," +
				" extra1 TEXT NOT NULL DEFAULT 'nothing', extra2 TEXT NOT NULL DEFAULT 'nothing', extra3 TEXT NOT NULL DEFAULT 'nothing'",
		//"audpick", "picpick", "dateshow", "songshow", "fullscreen", "change", "duration", "scale", 
		//"textcolor", "firstrun", "firstfile", "transsetting", "transoverride", "overridecolor", 
		//"usetransoverride", "stretchall","addpicturecolor","pictrans", "pictranssetting",
		//"captionlocation","fontsize","usesizeoverride", "cinematic", "picpansetting", 
		//"panmode", "pandir","fontmin", "fontmax","addfontsize", "addfontsetting"
		setColumnsShort: "filename, mainsettings, globalsettings, addsettings, projectsettings, exhibition, extra1, extra2, extra3",
		//settingsColumns: "filename TEXT NOT NULL DEFAULT 'nothing', color TEXT NOT NULL DEFAULT 'black', transition TEXT NOT NULL DEFAULT 'fadeOut'",
		exifObj: {
          "Make": true,
          "Model": true,
          "Size": true,
          "DateTime": true,
          "ImageDescription": true,
          "UserComment": true,
          "LightSource": true,
          "FocalLength": true,
          "ExposureTime": true,
          "ApertureValue": true,
          "ISOSpeedRatings": true,
          "Flash": true,
          "FocalLength": true,
          "ExposureMode": true,
          "WhiteBalance": true,
          "DigitalZoomRation": true,
          "GainControl": true,
          "Contrast": true,
          "Saturation": true,
          "Sharpness": true,
          "SubjectDistanceRange": true,
          "SceneCaptureType": true
          

		},
		audioPopIsOpen: false
	},
	components: [
	    {kind: "AppMenu",name:"myMenu",/*className: "menuBack",openClassName: "menuBack", onClose: "closeAppMenu",*/ components: [
            {kind: "EditMenu"/*, className: "menuItemGeneralTop"*/},
  		    {caption: "Delete Data...", name: "menuDeleteData", disabled: true, components:[
                {caption: "Delete All Picture Data"/*, className: "menuItemGeneral"*/, onclick:"clearClicked", preference:"picture"},
  		        {caption: "Delete All Audio Data"/*, className: "menuItemGeneral"*/, onclick:"clearClicked", preference:"audio"}
  		    ]},
  		    {caption: "New Project", disabled: true, name: "menuNewFile", onclick: "makenew"/*, className: "menuItemItalic"*/},
  		    {caption: "Save Project As...", disabled: true,name: "menuSave", onclick: "savedata"/*, className: "menuItemGeneral"*/},
  		    {caption: "Load Project..", disabled: true,name: "menuLoad", onclick: "loaddata"/*, className: "menuItemGeneral"*/},
  		    {caption: "Preferences",name: "menuPrefs", disabled: true, onclick: "openPrefs"/*, className: "menuItemBold"*/},
  		    {caption: "Help"/*, className: "menuItemGeneralBottom"*/, onclick: "openHelpDialog"}
  		]},
		{name: "getPreferencesCall",
		 kind: "PalmService",
		 service: "palm://com.palm.systemservice/",
		 method: "getPreferences",
		 onSuccess: "getPreferencesSuccess",
		 onFailure: "getPreferencesFailure"
		},
		{name: "setPreferencesCall",
		 kind: "PalmService",
		 service: "palm://com.palm.systemservice/",
		 method: "setPreferences",
		 onSuccess: "setPreferencesSuccess",
		 onFailure: "setPreferencesFailure"
		},
		{kind: "ApplicationEvents", onWindowRotated: "windowRotated", onWindowActivated: "checkex",onWindowDeactivated: "shutdown",onOpenAppMenu: "openAppMenu", onCloseAppMenu: "closeAppMenu", onUnload: "unload"},
		{kind: "GlowRing", name:"glowRing"},
		{kind: "PathsArray", name: "thePaths"},
		
		{kind: "Menu",name:"startMenu",className: "editListSubItem",style: "width: 250px;",openClassName: "editListSubItem", components: [
		    {caption: "Start From Last Position", onclick: "startShowFromPrev",style: "margin-left:10px;width: 240px;", className: "editListImgList"},
		    {caption: "Start From Begining",sender: "forceBegin", onclick: "startShowFromBegin",style: "margin-left:10px;width: 240px;", className: "editListImgList"},
		]},
		{name: "sound", kind: "audiocontrol", onPlayEnded: "stopPreview"},
		
		{kind: "Toaster", dismissWithClick: false, dismissWithEscape: false,lazy:false,className: "musicPop", name: "audioPop",style: "opacity: 0.8;width:100%;height:115px;", flyInFrom: "top",onBeforeOpen: "audioPopOpen", onClose: "audioPopClose", className: "editListItemList",components:[
            {kind: "HFlexBox",flex:1,components: [
			    {kind: "HFlexBox",components: [
				    {kind: "MyCustomButton", defaultClassName:"backSongButton", name:"backSong", clickClassName: "backSongButtonClicked", disabledClassName: "backSongButtonDisabled", onButtonClicked: "changeToBackSong"},
				    {kind: "MyCustomButton",defaultClassName:"playButton", name:"playPause", buttonType: "dual", clickClassName: "playButtonClicked", disabledClassName: "playButtonDisabled", dualDefault: "pauseButton", dualClick: "pauseButtonClicked", onButtonClicked: "playPauseSong"},
				    {kind: "MyCustomButton",  defaultClassName:"nextSongButton", clickClassName:"nextSongButtonClicked", disabledClassName: "nextSongButtonDisabled", name:"nextSong", onButtonClicked: "changeToNextSong"},
				]},
			    {kind: "VFlexBox", components:[
				    {kind: "HFlexBox", components:[
					    {name: "cTime", style: "margin-right: 5px;",content: "0:00"},
					    {name: "space", style: "margin-right: 5px;",content: "  of"},
					    {name: "tTime", style: "",content: "0:00"}
				    ]},
				    {kind: "Slider",name: "audioPosition",style:"", flex:1, onChanging: "previewChanging", onChange: "previewChange"}
			    ]},
			    {name: "songName",flex:1, style: "font-size:80%;font-weight:bold;margin-left: 5px;max-width:300px;height:73px;overflow:hidden;"},
			    {kind: "HFlexBox", pack: "end",flex:1,components: [
			    	{kind: "HelpButton", helpID: "musicpopup", onHelpRequested: "helpPopHandler", style: "margin-right:15px;margin-top: 8px;"},
			        {kind: "MyCustomButton", defaultClassName:"hideAudioButton", clickClassName: "hideAudioButtonClicked", name:"hideAudio", onButtonClicked: "hideAudioPop"},
			    ]}
			]}
		]},
		{kind: "ModalDialog", name: "dialWnd", className:"msgBox",contentClassName:"msgBoxIn", lazy: false, components: [
		    {name: "dialContent", className: "msgBoxContent"},                                                                            
            {layoutKind: "HFlexLayout", pack: "right", components: [
                {kind: "Button", caption: "OK",className:"enyo-button-affirmative msgBoxButton", onclick: "confirmClick"}
            ]}
        ]},
        {kind: "ModalDialog", name: "confirmWnd",className:"msgBox",contentClassName:"msgBoxIn", lazy: false, components: [
			{name: "confirmContent", className: "msgBoxContent"},                                                                          
            {kind: "HFlexBox", components: [
                {kind: "Button", caption: "Cancel",className: "msgBoxCancel", onclick: "cancelClick"},
                {kind: "Button", caption: "Delete", className: "enyo-button-negative msgBoxDelete", onclick: "clearFile"}
            ]}
        ]},
        {kind: "ModalDialog", name: "exhibNote", className:"msgBox",contentClassName:"msgBoxIn", lazy: false, components: [
		    {name: "exhibContent", className: "msgBoxExhibContent", style: "", allowHtml: true, content: "<b>Note:</b><br />Exhibition performance is worse then standard card mode. Exhibition mode uses an alternate display mechanism that does not work with all 3D hardware that card mode offers.<br />If you want performance, it would be best to just run the app in card mode.<br />Not all transitions work in exhibition, and they will be substiuted for a similar one."},   
			{kind: "HFlexBox", components:[		    
		    	{kind: "MyCustomButton",style: "position: absolute;top: 210px;left: 38px;", name: "exhibNoteShow", buttonType:"check", defaultClassName:"checkOffSmall",checkedClassName:"checkOnSmall"},                                                                         
		    	{content: "Show this message again.", className: "msgBoxExhibSubContent"}
		    ]},
            {layoutKind: "HFlexLayout", pack: "right", components: [
                {kind: "Button", caption: "OK",className:"enyo-button-affirmative msgBoxExhibButton", onclick: "confirmExhibNote"}
            ]}
        ]},       
        {kind: "MyCustomButton", name:"buttonRight", defaultClassName:"rightButton",clickClassName: "rightButtonClicked", showing:false, onButtonClicked:"rightClicked"},
        {kind: "MyCustomButton", name:"buttonLeft", defaultClassName:"leftButton",clickClassName: "leftButtonClicked", showing:false, onButtonClicked:"leftClicked"},
        {kind: "MyCustomButton", defaultClassName:"showAudioButton",showing:false, clickClassName: "showAudioButtonClicked", name:"showAudio", onButtonClicked: "showAudioPop"},
        {kind: "MyCustomButton", defaultClassName:"pauseOverlayButton",showing:false,buttonType:"check", checkedClassName: "pauseOverlayButtonClicked", name:"pauseOverlay", onButtonClicked: "pauseShow"},
        {kind: "MyCustomButton", defaultClassName:"showMenuButton",showing:false, clickClassName: "showMenuButtonClicked", name:"showMenu", onButtonClicked: "openLeftMenu"},
        {kind: "MyCustomButton", defaultClassName:"previewButton",showing:false, clickClassName: "previewButtonClicked", name:"zoomPic", onButtonClicked: "openPictureZoom"},
        {kind: "Toaster", lazy: false,onClose: "zoomPopClosed", name: "zoomPop", flyInFrom: "top", className: "runSettingPopup editListItem", style: "width: 100%;height:100%;", components:[
        	{kind: "Scroller", style: "width:100%;height:100%;", components:[
        		{kind: "SizeableImage", name: "sizeCanvas", maxZoomRatio: 3}
        	]},
        	{kind: "MyCustomButton",style: "width:40px;height:40px;position:absolute;top:0;right:10px;", defaultClassName:"hideAudioButton", clickClassName: "hideAudioButtonClicked", onButtonClicked: "closeZoomPop"},
        ]},
        {kind: "Toaster",lazy:false, name: "runMenu", flyInFrom: "left", className: "runSettingPopup", style: "width: 500px;height: 100%;opacity:.7;", onClose: "restoreAudioPopup", components: [
        	{kind: "RunSettings", name: "runSettings",runMode: true,onRequestHelpPop: "helpPopHandler",onRequestStopShow: "startShow", onPrefChanged: "prefChanged", onRequestExif: "loadExifOptions"}
        ]},
        {kind: "EXIFInfo", className: "runSettingPopup", name:"exifInfo", onClose: "setExifOptions"},
        {kind: "HelpDialog",className: "editListItem", onWritePref: "writePrefHandler", style: "width:500px;height: 100%;", name: "helpDialog",onRequestInternalHelp: "openInternalHelp"},
		{name: "contain", kind: "Pane", style: "background: black;", flex: 1, components: [
			{kind: "Pane", style: "background: black;"},
			{kind: "WelcomePage", name: "welcomePage", onComplete: "startUpApp", onWritePref: "writePrefHandler" },
			{kind: "mainView", name: "main",onRequestHelpPop: "helpPopHandler", onRequestStartMenu: "showStartMenu", onRequestStartShow: "startShowFromBegin", onRequestScrim: "scrimRequestHandler", onScrimChanged: "scrimChangedHandler", onDataToSave: "saveDataToDatabase", onFilePicker: "outputPaths", onEditView: "changeView", onPrefChanged: "prefChanged", onRequestExif: "loadExifOptions"},
			{kind: "ImageSwitcher" ,
				name: "set", 
				//onClicked: "openNavButtons", 
				//slidingHandler:true, 
				onPicLoaded: "imageLoaded", 
				onExifData: "feedExif",
				onDragStarted: "hideOverlayButtons",
				onDragCompleted: "setOverride",
				onDragStoped: "hideOverlayButtons",
				onRequestNavButtons: "openNavButtons"
			},
			{kind: "editPics", name: "picEdit",onRequestHelpPop: "helpPopHandler", onDataToSave: "saveDataToDatabase", onShutDown: "loadMainView"},
			{kind: "editAud", name: "audEdit",onRequestHelpPop: "helpPopHandler", onDataToSave: "saveDataToDatabase", onShutDown: "loadMainView"},
			{kind: "editPrefs",name: "prefs",onRequestHelpPop: "helpPopHandler", onWritePref: "writePrefHandler", onShutDown: "loadMainView", onRequestDataInfo: "getSqlInfo",onPrefChanged: "prefChanged", onChangeExhib: "changeExhibHandler"},
			{kind: "bulkAdd", name: "bulk",onRequestHelpPop: "helpPopHandler",onDataToSave: "saveDataToDatabase", onShutDown: "loadMainView", onRequestMsgBox: "showMsgBox", onPrefChanged: "prefChanged"},
			{kind: "ProjectHandler",name: "projectHand",onRequestSaveAs: "saveAsProjectHandler",onRequestHelpPop: "helpPopHandler",onRequestMsgBox: "showMsgBox",onRequestDeleteProject: "deleteProjectHandler", onShutDown: "loadMainView", onRequestDataInfo: "getSqlInfo", onRequestNewProject: "createNewProject", onRequestLoadProject: "loadProjectHandler"},
			{kind: "InternalHelp",name: "internalHelp", onShutDown: "loadMainView"}			
		]},
		{kind: "scrimSpinner", name: "spin", showing: false},
		{kind: "dataControl", name: "db",onDataStarted:"dataStartHandler",onDataFinish:"dataFinishHandler", onLoaded: "finishLoading", onDataCompleted: "parseResults", onDataCompletedCustom: "returnResults", onFinishSaveAs: "queryDatabase"},
		{kind: "DataSpinner", name: "dbSpin"},
		{kind: "InternalHelpPopup", name: "helpPop", style: "width:500px;height: 100%;"},
		{kind: "VFlexBox", style: "position:absolute;z-index:99999;background: black;width:100%;height:100%;top:0;left:0;right:0;bottom:0;", name: "sleepCover", showing: false}
			                                                     
	],
	helpPopHandler: function(iS, iE) {
		this.$.helpPop.openAndScroll(iE);
	},
	dataStartHandler: function() {
		if (this.$.dbSpin.getIsOpen() == false) {
			this.log()
			this.$.dbSpin.showMe();
		}
	},
	dataFinishHandler: function() {
		this.log()
		this.$.dbSpin.hideMe();
	},
	openHelpDialog: function() {
		this.$.helpDialog.open();
		this.$.helpDialog.setChecks(this.projectSettings.welcome, this.projectSettings.exhibnote);
	},
	openInternalHelp: function() {
		this.$.contain.selectViewByName("internalHelp");
	},
	loadProjectHandler: function(iS,iE) {
		this.currentFile = iE;
		
		this.$.setPreferencesCall.call(
			      {
			          "firstfile" : this.currentFile
			      });
		this.$.spin.start("Loading project...")
		this.queryDatabase(true);
	},
	setOverride: function(iS, iE) {
		this.overRide = iE;
		enyo.nextTick(this,this.changePic);
	},
	saveAsProjectHandler: function(iS, iE) {
		var s = iE
		this.log("SAVEASHANDLER" + iE)
		if (s.length > 0) {
			var sql = []
			sql.push("UPDATE picPathsTable SET filename = '" + s + "' WHERE filename = '" + this.currentFile + "';");
			sql.push("UPDATE audPathsTable SET filename = '" + s + "' WHERE filename = '" + this.currentFile + "';");
			sql.push("UPDATE settingsTable SET filename = '" + s + "' WHERE filename = '" + this.currentFile + "';");
			this.currentFile = s;
			this.$.setPreferencesCall.call(
								      {
								          "firstfile" : s
								      });
			
			this.$.spin.start("Saving...");         
			this.$.db.updateRecordSaveAs(sql);
			enyo.windows.addBannerMessage("Project saved as " + s + "!", "{}");
		}
		else {
			this.$.dialContent.setContent("You must enter a project name.");
			this.$.dialWnd.openAtCenter();
		}
	},
	deleteProjectHandler: function(iS, iE) {
		var sql = []
		sql.push("DELETE FROM picPathsTable WHERE filename = '" + iE + "';");
		sql.push("DELETE FROM audPathsTable WHERE filename = '" + iE + "';");
		sql.push("DELETE FROM settingsTable WHERE filename = '" + iE + "';");
		this.saveDataToDatabase("", sql)
	},
	projectRequestSender: "",
	getSqlInfo: function (iS, iE) {
		this.log("requesting")
		this.projectRequestSender = iS.name
		this.log(this.projectRequestSender)
		this.$.db.getDataBulkCustom(iE)
	},
	returnResults: function(iS, iE) {
		this.log("returning")
		this.log(this.projectRequestSender)
		//try {
			this.$[this.projectRequestSender].giveSqlResults(iE)
		//}
		//catch (e) {
		//	this.log("error")
		//}
	},
	saveDataToDatabase: function(iS,iE) {
		this.$.db.updateRecordBulkNoEvent(iE, this.isRunning)
	},
	loadMainView: function() {
		if (this.isLoading != 1) {
			this.$.contain.selectViewByName("main");
			this.$.main.loadSettings();
		}
		else {
			this.$.contain.selectViewByName("welcomePage");
		}
	},
	scrimRequestHandler: function(iS, iE) {
		//this.log(iE)
		if (iE == true) {
			this.$.spin.start()
		}
		else {
			this.$.spin.stop()
		}
	},
	scrimChangedHandler: function(iS, iE) {
		//this.log(iE)
		this.$.spin.setProgPos(iE.pos)
		this.$.spin.setProgMax(iE.max)
		this.$.spin.setStatusMsg(iE.msg)
	},
	
	confirmExhibNote: function() {
		var s = (this.$.exhibNoteShow.getChecked() == true ? "1" : "0")
		this.projectSettings.exhibnote = s
		this.projectSettings.shownExhibNote = true
		this.$.setPreferencesCall.call(
								      {
								          "exhibnote" : s
								      });
		this.$.exhibNote.close();
		enyo.nextTick(this, this.startUpApp);

	},
	changeView: function(iS, iE) {
		if (iE.sender == "projectHand") {
			this.dataStartHandler();
			return;
		};

		var s = this.$.contain.getViewName();
		if (s == "projectHand" || s == "prefs") {
			this.$[s].setBCancel(true);
		}

		this.checkAudioPreview();
		this.$[iE.sender].setThePaths(this.$.thePaths);
		this.$[iE.sender].setCurrentFile(this.currentFile);
		this.$.contain.selectViewByName(iE.sender);
		this.$[iE.sender].startUp();
	},
	showWasPaused: false,
	openPictureZoom: function() {
		this.$.sizeCanvas.setSrc(this.$.thePaths.getPictureInfo(this.activeIndex, "path"));
		this.IsZooming = true;
		if (this.showPaused != 1) {
			this.pauseShow(true);
			this.showWasPaused = false;
		}
		else {
			this.hideAudioPop();
			this.showWasPaused = true;
		}
		this.hideOverlayButtons();
		this.$.zoomPop.open();
	},
	zoomPopClosed: function() {
		if (this.showWasPaused === true) {
			this.showPauseOverlayButtons();
		}
		else {
			this.pauseShow();
		}
		this.IsZooming = false;
	},
	closeZoomPop: function() {
		this.$.zoomPop.close();
	},
	rendered: function() {
		this.inherited(arguments);
		//enyo.log("onload")
		if (enyo.windowParams.params && enyo.windowParams.params.exhibition) {
			this.exhibition = enyo.windowParams.params.exhibition;
			this.$.set.setExhibition(this.exhibition);
		}
		this.startUpApp();
		
		
	},
	startUpApp: function() {
		this.isLoading = 1
		this.ISDRAGGING = false
		this.DATA_SQL = [];
		this.RELOCATE_DB = false;
		this.RELOCATE_FILL_DB = false;
		this.dataFinishHandler();
		enyo.nextTick(this.$.getPreferencesCall,
			          this.$.getPreferencesCall.call,
					  {"keys": [ "firstrun", 
				                 "firstfile", 
				                 "loadblank", 
				                 "explaymusic", 
				                 "exhibfile",
				                 "exhibnote",
				                 "welcome"
				               ]
					  } 
					)
	},
	getPreferencesSuccess: function(inSender, inResponse) {
		var b = false
		this.projectSettings.exhibnote = inResponse.exhibnote;
		this.projectSettings.welcome = inResponse.welcome;
		if (this.exhibition == true && this.isRunning == 1) {
			if (this.projectSettings.ExhibFile == inResponse.exhibfile) {
				b = true
				this.isLoading = 0
				if (this.showPaused == 1 ) {
					this.pauseShow()
				}
			}
			else {
				this.showPaused = 0;
				this.isRunning = 0;
				this.showPaused = 0;
			}
		}
		if (this.exhibition == true && b == false && this.projectSettings.shownExhibNote == false && (inResponse.exhibnote == "1" || !inResponse.exhibnote)) {
			var s = (inResponse.exhibnote == "1" ? true : false)
			this.$.exhibNoteShow.setChecked(s);
			this.$.exhibNote.openAtCenter();
			this.projectSettings.shownExhibNote = true;
			return;
		}
		if (this.exhibition == false && this.projectSettings.shownWelcomePage == false && (inResponse.welcome == "1" || !inResponse.welcome)) {
			this.log("========> WELCOME=" + inResponse.welcome)
			this.$.contain.selectViewByName("welcomePage");
			this.$.welcomePage.setCheck(inResponse.welcome);
			this.dataStartHandler();
			this.projectSettings.shownWelcomePage = true;
			return;
		}
		this.RELOCATE_DB = false
		if (b == false) {
			//enyo.log("when past b")
			switch (inResponse.firstrun) {
				case "four": {
					this.setCurrentFile(inResponse)
					this.loadDatabase();
					break;
				}
				default: {//"three" : {
					this.RELOCATE_DB = true
					this.$.setPreferencesCall.call(
						      {
						          "firstrun" : "four"
						      });
					this.setCurrentFile(inResponse)
					this.loadDatabase();
					break;
				}
			};
		}
	},
	projectSettings: {
		ExhibFile: "",
		ExPlayMusic: "",
		LoadBlank: "",
		shownExhibNote: false,
		shownWelcomePage: false,
		welcome: "1",
		exhibnote: "1"
	},
	Create_New_Project: false,
	setCurrentFile: function(inResponse) {
		this.projectSettings.ExhibFile = inResponse.exhibfile || "";
		this.projectSettings.ExPlayMusic = inResponse.explaymusic || true;
		this.projectSettings.LoadBlank = inResponse.loadblank || false;
		if (this.exhibition == true) {
			if (this.projectSettings.ExhibFile.length < 1) { 
				this.currentFile = inResponse.firstfile;
				this.projectSettings.ExhibFile = this.currentFile;
			}
			else {
				this.currentFile = this.projectSettings.ExhibFile;
			}
		}
		else {
			this.log("FIRST FILE =======================>>" + inResponse.firstfile)
			if (this.projectSettings.LoadBlank == true || inResponse.firstfile == undefined) {
				this.currentFile = "Untitled Project " + Math.floor(Math.random() * 100000);
				this.Create_New_Project = true;
			}
			else {
				this.currentFile = inResponse.firstfile;
			}
		}
	},
	loadDatabase: function (){
		//this.tracker = this.tracker + "WENT straight to load database ";
		
		//var b = false
		if (this.exhibition == false) {
			this.$.spin.start("Startup...")
			this.$.spin.setStatusMsg("Loading Database...")
		}
		if (this.exhibition == true && this.$.db.getLoaded() == true) {
			this.finishLoading()
		}
		else {
		    var s = "CREATE TABLE IF NOT EXISTS settingsTable (" + this.setColumns + ");";
		    var string = "CREATE TABLE IF NOT EXISTS picPathsTable (" + this.picColumns + ");";
		    var string1 = "CREATE TABLE IF NOT EXISTS audPathsTable (" + this.audColumns + ");";
		    if (this.RELOCATE_DB == true) {
		    	this.$.db.loadDatabase("Paths", "1.0", "filepaths", 200000, s, string, string1);
		    }
		    else {
				this.$.db.loadDatabase("ext:Paths", "1.0", "filepaths", 200000, s, string, string1);
			}
		}
	},
	finishLoading: function() {
		this.STARTUP = 1
		//this.loadPaths(0);
		this.queryDatabase()
	},
	queryDatabase: function(noSettings) {
		this.log()
		var sql = []
		if (this.RELOCATE_FILL_DB == true) {
			this.$.spin.setStatusMsg("Converting database...(This may take a few minutes)");
			this.RELOCATE_FILL_DB = false;
			this.$.db.updateFullData(this.DATA_SQL);
			return;
		}
		if (this.Create_New_Project == true) {
			this.createNewProject("", this.currentFile, true);
			return;
		}
		if (noSettings != true) {
			sql.push("SELECT * FROM settingsTable;");
		};
		if (this.RELOCATE_DB == false) {
			sql.push("SELECT * FROM audPathsTable WHERE filename = '" + this.currentFile + "';");
			sql.push("SELECT * FROM picPathsTable WHERE filename = '" + this.currentFile + "';");
			sql.push("SELECT max(pkey) FROM picPathsTable")
			sql.push("SELECT max(pkey) FROM audPathsTable")
		}
		else {
			sql.push("SELECT * FROM audPathsTable;");
			sql.push("SELECT * FROM picPathsTable;");
		}
		this.$.db.getDataBulk(sql)
	},
	parseResults: function(iS, data) {
		
		//this.loadSettings();
		this.log();
		if (this.RELOCATE_DB == false) {
			//Check if we are reloading settings or not.
			if (data.length > 4) {
				this.$.thePaths.clearSettings();
			}
			this.$.thePaths.clearAudio();
			this.$.thePaths.clearPictures();

			this.$.spin.setProgPos(0);
			this.$.spin.setProgMax(data[0].rows.length)
			this.parseSettings(0, data[0], data);
		}
		else {
			var sql = []
			this.relocatedDatabase(0,0,data, sql)
		}
		
	},
	relocatedDatabase: function(i, j, data, sql) {
		this.$.spin.setProgMax(data[j].rows.length)
		if (i < data[j].rows.length) {
			for (var k = 0; k < 25; k++) {
				if (i < data[j].rows.length) {
					this.$.spin.setStatusMsg("Scanning " + data[j].rows.item(i)["filename"] + ", item " + i);
					this.$.spin.setProgPos(i)
					sql.push(this.buildSQL(data[j], i, j))
				}
				else {
					break;
				}
				i++
			};
			enyo.nextTick(this, this.relocatedDatabase, i, j, data, sql)
		}
		else {
			j++
			if (j < data.length) {
				enyo.nextTick(this, this.relocatedDatabase, 0, j, data, sql)		
			}
			else {
				this.DATA_SQL = sql;
				this.RELOCATE_DB = false;
				this.RELOCATE_FILL_DB = true;
				this.loadDatabase();
			}
		}
	},
	buildSQL: function(data,i, sqlType) {
		var s = ""
		switch (sqlType) {
			case 0: {
				s = "INSERT INTO settingsTable (" + this.setColumnsShort + ") VALUES ('";
				s = s + data.rows.item(i)["filename"] + "','";
				s = s + data.rows.item(i)["mainsettings"] + "','";
				s = s + data.rows.item(i)["globalsettings"] + "','";
				s = s + data.rows.item(i)["addsettings"] + "','";
				s = s + data.rows.item(i)["projectsettings"] + "','";
				s = s + data.rows.item(i)["exhibition"] + "','";
				s = s + data.rows.item(i)["extra1"] + "','";
				s = s + data.rows.item(i)["extra2"] + "','";
				s = s + data.rows.item(i)["extra3"] + "');";
				break;
			};
			case 1: {
				s = "INSERT INTO audPathsTable (" + AudColumnsShort + ") VALUES ('" + data.rows.item(i)["audpath"] + "', " + data.rows.item(i)["audorder"] + ", '" + data.rows.item(i)["filename"] + "');";
				break;
			};
			case 2: {
				//picpath, piccaption, piccaploc, picorder, filename, transition, captioncolor, captionstyle, stretch, delay
				s = "INSERT INTO picPathsTable (" + PicColumnsShort + ") VALUES ('" + data.rows.item(i)["picpath"] + "', '";
				s = s +	data.rows.item(i)["piccaption"] +  "', '";
				s = s +	data.rows.item(i)["piccaploc"] +  "', ";
				s = s +	data.rows.item(i)["picorder"] +  ", '";
				s = s +	data.rows.item(i)["filename"] +  "', '";
				s = s +	data.rows.item(i)["transition"] +  "', '";
				s = s +	data.rows.item(i)["captioncolor"] +  "', '";
				s = s +	data.rows.item(i)["captionstyle"] +  "', '";
				s = s +	data.rows.item(i)["stretch"] +  "', '";
				s = s +	data.rows.item(i)["delay"] +  "');";
				break;
			};
		}
		return s;
	},
	parseSettings: function(i, data, fullData) {
		//this is to check to make sure we don't reload settings
		if (fullData.length < 5) {
			var a = []
			a.push({nothing: false})
			fullData = a.concat(fullData)
			this.$.spin.setProgPos(0);
			this.$.spin.setProgMax(fullData[1].rows.length)
			this.parseAudio(0, fullData[1], fullData);
			return;
		}

		if (i < data.rows.length) {
			this.$.spin.setStatusMsg("Loading Settings...")
			this.$.thePaths.feedSetting(data.rows.item(i)["filename"], 
										data.rows.item(i)["mainsettings"] + "|+|{" +
					 					data.rows.item(i)["globalsettings"] + "|+|{" + 
					 					data.rows.item(i)["addsettings"] + "|+|{" + 
					 					data.rows.item(i)["projectsettings"] + "|+|{" + 
					 					data.rows.item(i)["exhibition"] + "|+|{" + 
					 					data.rows.item(i)["extra1"], 
					 					data.rows.item(i)["extra2"]
					 				   ) 
					 					//+ "|+|{" + results.rows.item(i)["extra3"])
			i++;
			enyo.nextTick(this,this.parseSettings,i, data, fullData);	
		}
		else {
			var tmp = this.$.thePaths.getListOfProjects()
			var b = false
			this.log ("FILE TO LOAD ==================>>" + this.currentFile)
			for (var i = 0; i < tmp.length;i++){
				if (tmp[i] == this.currentFile) {
					this.log("FILE IN LIST ==============>>" + tmp[i])
					b = true
					break;
				}
			}
			if (b == true) {
				this.$.spin.setProgPos(0);
				this.$.spin.setProgMax(fullData[1].rows.length)
				this.parseAudio(0, fullData[1], fullData);
			}
			else {
				this.$.spin.setStatusMsg("Current Project Not Found...Creating New Project")
				this.Create_New_Project = true
				this.queryDatabase()
			}
		}
	},
	parseAudio: function(i, data, fullData) {
		if (i < data.rows.length) {
			for (var j = 0;j < 25;j++) {
				if (i > data.rows.length - 1) {break;}
				this.$.spin.setStatusMsg("Scanning Audio ... " + i.toString() + "/" + data.rows.length.toString()   + " (" + data.rows.item(i)["audpath"] + ")")
				this.$.thePaths.feedAudioItem(data.rows.item(i)["audpath"],
											  data.rows.item(i)["audorder"],
											  data.rows.item(i)["filename"],
											  data.rows.item(i)["pkey"]
											 );
				i++;
			}
			enyo.nextTick(this,this.parseAudio,i, data, fullData);
		}
		else {
			this.$.spin.setProgPos(0);
			this.$.spin.setProgMax(fullData[2].rows.length)
			this.parsePictures(0, fullData[2], fullData);
		};
	},
	parsePictures: function(i, data, fullData) {
		if (i < data.rows.length) {
			for (var j = 0;j < 25;j++) {
				if (i > data.rows.length - 1) {break;}
				this.$.spin.setProgPos(i);
				this.$.spin.setStatusMsg("Scanning Pictures..." + i.toString() + "/" + data.rows.length.toString()   + "<br /> (" + data.rows.item(i)["picpath"] + ")")
				
				this.$.thePaths.feedPictureItem(data.rows.item(i)["picpath"],
												data.rows.item(i)["picorder"], 
												data.rows.item(i)["piccaption"],
												data.rows.item(i)["piccaploc"], 
												data.rows.item(i)["filename"],
												data.rows.item(i)["transition"],
												data.rows.item(i)["captioncolor"],
												data.rows.item(i)["captionstyle"],
												data.rows.item(i)["stretch"],
												data.rows.item(i)["delay"],
												data.rows.item(i)["pkey"]
											   );

				i++;
			}
			enyo.nextTick(this,this.parsePictures,i, data, fullData);
		}
		else {
			this.getMaxKey(fullData)
		}
	},
	getMaxKey: function(data) {
		MaxPic_PRIMARY_KEY = data[3].rows.item(0)["max(pkey)"];
	    MaxAud_PRIMARY_KEY = data[4].rows.item(0)["max(pkey)"];
	    this.endLoad();
	},
	endLoad: function() {
	
		//var x = this.$.thePaths.getZeroIndex();
		this.loadSettings();
		//this.reDoSettings();
		//this.setAllButtons();
		if (this.STARTUP == 1) {
			this.STARTUP = 0
		}
		if (this.exhibition == false) {
			
			this.$.contain.selectViewByName("main");
			this.$.main.setThePaths(this.$.thePaths);
			this.$.main.setCurrentFile(this.currentFile);
			this.$.main.loadSettings();
			window.setTimeout(enyo.bind(this,function() {
				this.$.spin.stop();
				this.isLoading = 0;	
			}), 500);
			
		}
		else {
			this.isLoading = 0
			this.isRunning = 0
			this.showPaused = 0
			this.startShowFromBegin()
		}
		/*this.$.progress.setMessage("Loading Pictures...");

		
		if (this.$.thePaths.getPictureCount() == 0) {
			this.$.set.clearImages();
			this.$.set.feedPicture("images/basic.png", "canvasBasicHiding", "0", "-1", "0","0","0")
			this.$.set.loadFirstImage();
			this.setPicLabel();
		}
		this.$.progress.setMessage("Checking settings....");*/
			
		/*if (this.STARTUP == 1) {
			this.$.containPane.selectViewByName("set");
			if (this.exhibition == false) {
				this.$.settingsHeader.setContent("Project: " + this.currentFile);
			}
			else {
				this.$.textField.setShowing(true)
			}
			if (this.REDOSETTINGS != 1) {
				this.loadFileNamesNew(9999);
				this.log(this.currentFile)
				if (this.AddTransSpeed == "NO_SETTINGS") {
					this.currentFile = "MyFirstProject"
					this.$.setPreferencesCall.call(
						      {
						          "firstfile" : this.currentFile,
							      "exhibfile" : this.currentFile,
						          "explaymusic" : true
						      });
					this.defaultSettings()
					this.reDoSettings()
				}
			}
			else {
				this.loadFileNames(9999);
			}
				
			this.STARTUP = 0;
			
		}*/
		
	},
	
	
	

	loadExifOptions: function() {
		this.$.exifInfo.setExifObj(this.exifObj)
		this.$.exifInfo.openMe()
	},
	setExifOptions: function() {
		this.log("closed")
		this.exifObj = this.$.exifInfo.getExifObj()
		this.saveExifSettings()
	},
	feedExif: function(iS, iE) {
		this.log("***********EXIF==================>>>>>" + iE.PATH_SRC)
		this.exifData.push(iE)
	},
	deleteExif: function(src) {
		this.log(src)
		var tmp = [];
		for (var i = 0; i < this.exifData.length; i++) {
			if (this.exifData[i].PATH_SRC == src) {
				this.log("true~!");
				//this.exifData.splice(i,1)
				//break;
			}
			else {
				tmp[tmp.length] = this.exifData[i];
			}; 
		};	
		this.exifData = tmp;
	},
	restoreAudioPop: false,
	openLeftMenu: function() {
		this.buttonOpen = 0;
		if (this.audioPopIsOpen == true) {
			this.restoreAudioPop = true;
			this.hideAudioPop();
		}
		else {
			this.restoreAudioPop = false;
		}
		this.hideOverlayButtons();
		this.$.runMenu.open();
	},
	restoreAudioPopup: function() {
		if (this.restoreAudioPop == true) {
			this.showAudioPop();
			this.restoreAudioPop = false;
		}
	},
	showStartMenu: function() {
		this.$.startMenu.openAt({bottom: 0, right: 0});
	},
	
	
	/*rendered: function() {
		this.inherited(arguments);
		//this.loadDatabase()
		this.ISDRAGGING = false
		//if (enyo.windowParams && enyo.windowParams.windowType == "dockModeWindow" && enyo.windowParams.dockMode == true) {
		//	this.exhibition = true
		//}
	},*/
	checkex: function() {
		enyo.log("window activated")
		if (this.exhibition == true && this.isLoading == 0) {
			//if (!this.db) 
			//	{ this.onload() }
			//else 
			//	{
			this.isLoading = 1;
			
			this.$.getPreferencesCall.call(
				      {
				          "keys": [ "firstrun", "firstfile", "loadblank", "explaymusic", "exhibfile", "exhibnote"]
				      });
			//if (this.exhibition == true) {this.$.slidingPane.selectViewByName("right")}
				/*if (this.isLoading == 0 && this.exhibition == true && this.showPaused == 1) {
					window.PalmSystem.setWindowProperties({blockScreenTimeout : true});
					this.pauseShow()
				}*/
				}
		
	},
	shutdown: function() {
		enyo.log("shutdown function" + this.exhibition + ", " + this.showPaused)
		if (this.exhibition == true && this.showPaused == 0) {
			this.log("PAUSING")
			window.PalmSystem.setWindowProperties({blockScreenTimeout : false});
			this.pauseShow();
		}
		else {
			/*var winRoot = enyo.windows.getRootWindow();
			if(winRoot)
    	      {
    	         enyo.windows.setWindowParams(winRoot, {source:this.name, cmd: "unload"});
    	      }*/
		}
	},
	
	unload:function(){
	      this.log();
  	      var winRoot = enyo.windows.getRootWindow();
  	      if(winRoot)
  	      {
  	    	//enyo.log("in " )  
  	         enyo.windows.setWindowParams(winRoot, {source:this.name, cmd: "unload"});
  	      }
			//this.db.close()
	      //this.db.transaction( 
		//	        enyo.bind(this,(function (transaction) { 
		//	        	transaction.executeSql("VACUUM", [], [], []); 
			      	      if (this.exhibition == true) {
			      	    	  if (this.showPaused == 0) {
			      	    		  window.PalmSystem.setWindowProperties({blockScreenTimeout : false});
			      	    		  this.pauseShow()
			      	    	  }
			      	      }
			      	      else {
							this.db = undefined
				        	this.destroy()
				        }
		//	        })));
			  
	   },
	destroy: function() {
	      this.stopTimer();
	      //if ((this.$.sound.getIsplaying() == true) && (this.$.sound.getIspaused() == false)) {
	    //	this.$.sound.pauseSound();  
	     // };
	      this.inherited(arguments);
	},
	windowRotated: function(inSender, inEvent) {
		this.setRunSize();
	},
	clickHandler: function(inSender, inEvent) { 
		if (inEvent.pageY < 20 && inEvent.pageX < 50) {
			this.$.myMenu.toggleOpen();
		}
	},
	openAppMenu: function() {
	    this.$.myMenu.open();
    	if (this.isRunning == 1 || this.isLoading == 1 || this.$.contain.getViewName() == "projectHand" || this.$.contain.getViewName() == "prefs") {
    		this.$.menuDeleteData.setDisabled(true);
	    	this.$.menuNewFile.setDisabled(true);
	    	this.$.menuSave.setDisabled(true);
	    	this.$.menuLoad.setDisabled(true);
	    	this.$.menuPrefs.setDisabled(true);
    	}
    	else {
    		this.$.menuDeleteData.setDisabled(false);
	    	this.$.menuNewFile.setDisabled(false);
	    	this.$.menuSave.setDisabled(false);
	    	this.$.menuLoad.setDisabled(false);
	    	this.$.menuPrefs.setDisabled(false);	
    	}
	    	
	},
	closeAppMenu: function() {
	    this.$.myMenu.close();
	},
//////////////Functions
	setAllButtons: function() {
		if (this.isRunning == 1 && this.showPaused == 0) {
			
			
			/*this.$.nextSong.setButtonEnabled(false);
			
			this.$.backSong.setButtonEnabled(false);
			
			this.$.playPause.setButtonEnabled(false);*/
			
			
			
			if ((this.$.thePaths.getSetting(this.currentFile, "audpick") != "No Audio") && (this.$.thePaths.getAudioCount() > 0)) {
				/*if (this.$.playPause.getButtonDual() == 0) {
					this.$.playPause.switchDual();
				}*/
				this.$.playPause.setButtonEnabled(true);
				this.$.nextSong.setButtonEnabled(true);
				this.$.backSong.setButtonEnabled(true);
				enyo.nextTick(this.$.playPause,this.$.playPause.setToDualDefault);
			}
			else {
				/*if (this.$.playPause.getButtonDual() == 1) {
					this.$.playPause.switchDual();
				}*/
				this.$.playPause.setButtonEnabled(false);
				this.$.nextSong.setButtonEnabled(false);
				this.$.backSong.setButtonEnabled(false);
				this.$.playPause.setToDefault();
			}
		}
		else if (this.isRunning == 1 && this.showPaused == 1) {
			
			
			
			/*if (this.$.playPause.getButtonDual() == 1) {
				this.$.playPause.switchDual();
			}*/
			this.$.playPause.setToDefault();
			this.$.nextSong.setButtonEnabled(false);
			this.$.backSong.setButtonEnabled(false);
			this.$.playPause.setButtonEnabled(false);
			
			
		}
		else if (this.isRunning == 0) {
			
			/*if (this.$.playPause.getButtonDual() == 1) {
				this.$.playPause.switchDual();
			}*/
			this.$.playPause.setToDefault();
			this.$.playPause.setButtonEnabled(false);
			this.$.nextSong.setButtonEnabled(false);
			this.$.backSong.setButtonEnabled(false);
						
			this.$.tTime.setContent("0:00");
			this.$.cTime.setContent("0:00");
			
		}
	},
	UsePrevPos: false,
	startShowFromPrev: function() {
		this.UsePrevPos = true;
		this.startShow();
	},
	startShowFromBegin: function(iS, iE) {
		this.hideOverlayButtons()
		var b = false
		if (iS && iS.sender) {
			if (iS.sender == "forceBegin") {
				b = true
			}
		}
		this.log("===============>>" + this.$.thePaths.getSetting(this.currentFile,"autostart"))
		if (this.$.thePaths.getSetting(this.currentFile,"autostart") == true && b == false) {
			this.startShowFromPrev()
		}
		else {
			this.UsePrevPos = false;
			this.startShow();
		}
	},
	showAudioPop: function() {
		this.hideOverlayButtons();
		if (this.$.thePaths.getAudioCount() > 0 && this.$.thePaths.getSetting(this.currentFile, "audpick") != "No Audio") {
			//this.$.audioPop.setStyle("position:absolute; top:0; left:-1024; z-index:100000; width: 100%;")
			 if (this.exhibition == true && this.projectSettings.ExPlayMusic == false) {
			  }
			  else {
				  this.$.audioPop.open();
			  }
			//if (this.buttonOpen == 1) {this.$.pauseOverlay.setStyle("position:absolute;z-index:10001;top:130px;left:20px;")}
		}
		else {
			this.$.audioPop.close();
		}
		
		this.buttonOpen = 0 
		if (this.showPaused == 1 && this.audioPopIsOpen == true) {
			this.$.pauseOverlay.setStyle("position:absolute;z-index:10001;top:130px;left:20px;")
			this.$.pauseOverlay.setShowing(true)
			if (this.exhibition == false) {
				var y = this.$.contain.hasNode().clientHeight - 110;
				
				this.$.showMenu.setStyle("position: absolute; top: " + y + "px; left: 10px;z-index:10001");
				this.$.showMenu.setShowing(true);
			}
			//this.$.audioPop.setShowing(true)
		}
		else if (this.showPaused == 1 && this.audioPopIsOpen == false) {
			this.$.pauseOverlay.setStyle("position:absolute;z-index:10001;top:18px;left:80px;")
			this.$.pauseOverlay.setShowing(true)
			this.$.showAudio.setStyle("position:absolute;z-index:10001;top:20px;left:20px;")
			this.$.showAudio.setShowing(true)
			if (this.exhibition == false) {
				var y = this.$.contain.hasNode().clientHeight - 110;
				
				this.$.showMenu.setStyle("position: absolute; top: " + y + "px; left: 10px;z-index:10001");
				this.$.showMenu.setShowing(true);
			}
		}
	},
	audioPopOpen: function() {
		this.audioPopIsOpen = true
	},
	audioPopClose: function() {
		this.audioPopIsOpen = false
	},
	hideAudioPop: function() {
		this.$.audioPop.close();
		if (this.showPaused == 1) {
			this.$.pauseOverlay.setStyle("position:absolute;z-index:10001;top:18px;left:80px;")
			this.$.pauseOverlay.setShowing(true)
			this.$.showAudio.setStyle("position:absolute;z-index:10001;top:20px;left:20px;")
			this.$.showAudio.setShowing(true)
			if (this.exhibition == false) {
				var y = this.$.contain.hasNode().clientHeight - 110;
				
				this.$.showMenu.setStyle("position: absolute; top: " + y + "px; left: 10px;z-index:10001");
				this.$.showMenu.setShowing(true);
			}
		}
		
	},
	hideOverlayButtons: function() {
		
		this.$.zoomPic.setShowing(false);
		this.$.buttonRight.setShowing(false);
		this.$.buttonLeft.setShowing(false);
		this.$.showMenu.setShowing(false);
		this.$.showAudio.setShowing(false)
		this.$.pauseOverlay.setShowing(false)
	},
	getTransAndSpeed: function(i) {
		
		var results = {
				trans: "",
				speed: ""
		};
		var cine = this.$.thePaths.getSetting(this.currentFile, "cinematic")
		if (this.$.thePaths.getSetting(this.currentFile, "usetransoverride") == false && 
			cine == false) {

				results.trans = this.$.thePaths.getPictureInfo(i, "transition");
				results.speed = this.$.thePaths.getPictureInfo(i, "tspeed");
		}
		else {
			var tSpd = this.$.thePaths.getSetting(this.currentFile, "globaltransspeed")
			if (this.$.thePaths.getSetting(this.currentFile, "transsetting") == "Random" || 
				cine == true) {
					
					results.trans = RandomTransition()
					if (tSpd == -1 || 
						cine == true) {
							
							results.speed = Math.floor(Math.random() * 5);
					}
					else {
						results.speed = tSpd;
					};
			} 
			else {
				results.trans = this.$.thePaths.getSetting(this.currentFile, "transoverride");
				if (tSpd == -1) {
					results.speed = Math.floor(Math.random() * 5);
				}
				else {
					results.speed = tSpd;
				};
			};	
			
		};
		//this.log(results.trans + results.speed)
		return results;
	},
	orderPicArray: function() {
		var picpick = this.$.thePaths.getSetting(this.currentFile, "picpick")
		this.log("ORDER BY==========>>" + picpick)
		if (picpick == "Picture Random") {
			this.$.thePaths.shuffle("pictures");
		}
		else if (picpick == "Picture In Index Order") {
			this.$.thePaths.orderArray("pictures");
		}
		else if (picpick == "Picture Ordered By Filename") {
			this.$.thePaths.orderArrayABC("pictures",0);
		}
		else if (picpick == "Picture Ordered By Path") {
			this.$.thePaths.orderArrayABC("pictures", 1);
		}
		else if (picpick == "Picture Ordered By Path With Filename") {
			this.$.thePaths.orderArrayABC("pictures", 2);
		};
	},
	getPictureStretch: function(i) {
		
		if (this.$.thePaths.getSetting(this.currentFile, "stretchall") == true) {
			return "1";
		}
		else {
			return this.$.thePaths.getPictureInfo(i, "stretch");
		};
	},
	getCinematicMode: function(i) {
		
		var results = {
				panmode: "",
				pandir: 0
		};
		this.log("CINMATIC" + this.$.thePaths.getSetting(this.currentFile, "cinematic"))
		if (this.$.thePaths.getSetting(this.currentFile, "cinematic") == true) {
			results.panmode = RandomPan();
			var rndN = Math.floor(Math.random() * 100) ;
			if (rndN > 49) {
				results.pandir = 0;
			}
			else {
				results.pandir = -1;
			};
		}
		else {
			results.panmode = this.$.thePaths.getPictureInfo(i, "pan");
		    results.pandir = this.$.thePaths.getPictureInfo(i, "pandirection");
		};
		return results;
	},
	startShow: function(inSender, inEvent) {
		if (this.isRunning == 0) {
			this.stopTimer();
			this.showPaused = 0;
			//this.$.pauseShowButton.setChecked(false)
			this.$.pauseOverlay.setChecked(false);
			this.isRunning = 1;
			this.$.glowRing.startAni();
			this.$.contain.selectViewByName("set");
			this.$.runSettings.setThePaths(this.$.thePaths);
			this.$.runSettings.setCurrentFile(this.currentFile);
			this.$.runSettings.loadSettings();
			//enyo.nextTick(this.$.slidingPane, this.$.slidingPane.selectViewByName, "right");
			window.setTimeout(enyo.bind(this,function() {
				
			
				this.$.set.clearImages();
				this.$.set.setUseSwipe(this.$.thePaths.getSetting(this.currentFile, "useswipe"));
				
				this.setAllButtons();
				//this.$.textField.show();
				/*this.$.textField.setTextColor("#ff0000");
				this.$.textField.drawText("LOADING...", 200, 200, 30);*/
				if (this.$.thePaths.getSetting(this.currentFile, "fullscreen") == true) {
					enyo.nextTick(enyo, enyo.setFullScreen, true);
					//enyo.setFullScreen(true)
				};
				
				window.setTimeout(enyo.bind(this,function() {
					//enyo.nextTick(this.$.containPane, this.$.containPane.selectViewByName, "set");	
				
					this.log(this.UsePrevPos)
					if (this.UsePrevPos == true) {
						this.picIndex = parseInt(this.$.thePaths.getSetting(this.currentFile, "lastpospic"));
						if (this.picIndex < 0 || this.picIndex > this.$.thePaths.getPictureCount()-1) {this.picIndex = 0};
						this.activeIndex = this.picIndex;
						this.log(this.picIndex)
						this.audIndex = parseInt(this.$.thePaths.getSetting(this.currentFile, "lastposaud"));
						if (this.audIndex < 0 || this.audIndex > this.$.thePaths.getAudioCount()-1) {this.audIndex = 0};
						
						this.UsePrevPos = false
					}
					else {
						this.picIndex = 0;
						this.activeIndex = 0;
						this.audIndex = 0;
					}
					
					this.orderPicArray();
					
					var s = this.getPictureStretch(this.picIndex);
					var transition = this.getTransAndSpeed(this.picIndex);
					var cinematic = this.getCinematicMode(this.picIndex);
	
					this.$.set.feedPicture(this.$.thePaths.getPictureInfo(this.picIndex, "path"), 
						                   transition.trans, 
						                   s, 
						                   cinematic.panmode,
						                   cinematic.pandir,
						                   this.$.thePaths.getPictureInfo(this.picIndex,"rotate"),
						                   transition.speed
						                  );
					
			    	this.setRunSize();
					this.$.set.displayFirstImage();
					
	
					//this.setPicLabel();
					
					var audpick = this.$.thePaths.getSetting(this.currentFile, "audpick")
					if (audpick != "No Audio" && 
						this.$.thePaths.getAudioCount() > 0) {
							if (this.exhibition == true && this.ExPlayMusic == false) {
								this.hideAudioPop();
								//do nothing
							}
							else {
								if (this.$.thePaths.getSetting(this.currentFile, "autohideaudio") == false) {
									enyo.nextTick(this,this.showAudioPop);
								}
								else {
									this.hideAudioPop();
								}
								if (audpick == "Audio Random") {
									this.$.thePaths.shuffle("audio");
								}
								else if (audpick == "Audio In Index Order") {
									this.$.thePaths.orderArray("audio");
									
								};
								this.$.sound.setSrc(this.$.thePaths.getAudioInfo(this.audIndex, "path"));
								this.$.sound.playSound();
							}
					}
					else {
						this.hideAudioPop();
					}
	
					window.setTimeout(enyo.bind(this,(function(){
						
						this.picIndex = this.picIndex + 1;
						if (this.picIndex > this.$.thePaths.getPictureCount()) {
							this.picIndex = 0
						}
						
						var s = this.getPictureStretch(this.picIndex);
						var transition = this.getTransAndSpeed(this.picIndex);
						var cinematic = this.getCinematicMode(this.picIndex);
						
						
						this.$.set.feedPicture(this.$.thePaths.getPictureInfo(this.picIndex, "path"), 
							                   transition.trans, 
							                   s, 
							                   cinematic.panmode,
							                   cinematic.pandir,
							                   this.$.thePaths.getPictureInfo(this.picIndex,"rotate"),
							                   transition.speed
							                  );

						this.$.set.feedNextPic(this.$.thePaths.getPictureInfo(this.picIndex, "path"),
							                   s,
							                   this.$.thePaths.getPictureInfo(this.picIndex,"rotate"),
							                   true
							                  );

						var endP = this.$.thePaths.getPictureCount() - 1
						this.$.set.feedBackPic(this.$.thePaths.getPictureInfo(endP, "path"),
							                   this.$.thePaths.getPictureInfo(endP, "stretch"), 
							                   this.$.thePaths.getPictureInfo(endP, "rotate"), 
							                   true
							                  );
						
						this.$.set.loadFirstTwoImages();
						
						window.PalmSystem.setWindowProperties({blockScreenTimeout : true});
	
						window.setTimeout(enyo.bind(this,(function(){
							this.startTimer();
							this.$.playPause.setToDualDefault();
						    window.setTimeout(enyo.bind(this,(function(){
						    	this.$.glowRing.stopAni();
						    })),500)
						})),1000)
					})),900)
				}), 800)
			}), 700)
		}
		else {
			
			
			this.stopTimer();
			this.$.runMenu.close();
			this.hideAudioPop();
			if (this.$.sound.getIsplaying() == true) {
				if (this.$.sound.getIspaused() == false) {
					this.$.sound.pauseSound();
				}
				
			};
			//this.$.startButton.setToDefault();
			this.$.set.clearImages();
			
			
			
			this.buttonOpen = 0;
			this.showPaused = 0;
			this.activeIndex = 0;
			this.picIndex = 0;
			this.audIndex = 0;
			
			this.hideOverlayButtons();
			this.isRunning = 0;
			this.timeIndex = 0;
			this.setAllButtons();
			window.PalmSystem.setWindowProperties({blockScreenTimeout : false});
			
			enyo.nextTick(enyo, enyo.setFullScreen, false);
			enyo.nextTick(this.$.contain, this.$.contain.selectViewByName, "main");
		};
		
		

	},
	HoldOnCaption: 1,
	IsZooming: false,
	waitingForWake: false,
	changePic: function(){
		if (this.waitingForWake === true) {
			var wakenowD = new Date();
			var wakeD = new Date(Date.parse(STORAGE.get("waketime")));
			if (wakenowD.getHours() >= wakeD.getHours()) {
				if (wakenowD.getMinutes() >= wakeD.getMinutes()) {
					if (this.showPaused == 1) {
						this.pauseShow();
					}
					this.waitingForWake = false;
					this.$.sleepCover.setShowing(false);
					this.stopTimerMinute();
				}
				
			}
		}
		if (this.IsZooming) {return;}
		
		this.timeIndex++;

		var changePicture = false;
		if (this.buttonOpen > 0) {
			this.buttonTimer++;
			if (this.buttonTimer > 5) {
				this.buttonTimer = 0;
				this.buttonOpen = 0;
				this.hideOverlayButtons();
			};
		};
		if (this.overRide > 0) {
			changePicture = true;
			this.buttonOpen = 0;
			this.buttonTimer = 0;
			this.timeIndex = 0;
			this.hideOverlayButtons();
		}
		else {
			var audPick = this.$.thePaths.getSetting(this.currentFile, "audpick");
			var changeMode = this.$.thePaths.getSetting(this.currentFile, "change");
			var audCount = this.$.thePaths.getAudioCount();
			if (audPick != "No Audio" && audCount > 0) {
				if (this.exhibition == false || this.projectSettings.ExPlayMusic == true) {
					//this.log("======================>>" + this.$.sound.getIsplaying())
					if ((this.$.sound.getIsplaying() == false) /*|| (this.$.sound.getMaxSeconds() <= this.$.sound.getCurrentSeconds() && this.$.sound.getMaxSeconds() > 0)*/) {
						this.audIndex++;
						if (this.audIndex > audCount - 1) {
							this.audIndex = 0;
							if (this.$.thePaths.getSetting(this.currentFile, "repeat") == "End With Music" && this.exhibition == false) {
								this.startShow();
								return 0;
							}
							switch (audPick) {
								case "Audio Random": {
									this.$.thePaths.shuffle("audio");
									break;
								}
								case "Audio In Index Order": {
									this.$.thePaths.orderArray("audio");
									break;
								}
							};
						}
						this.$.sound.setSrc(this.$.thePaths.getAudioInfo(this.audIndex, "path"));
					  	enyo.nextTick(this.$.sound,this.$.sound.playSound);
						if (changeMode == "Song Change") {
							  changePicture = true;
						};
						
					};
			    };
		    };
			switch (changeMode) {
				case "Duration:": {
					var duration = parseInt(this.$.thePaths.getSetting(this.currentFile, "duration"));
					switch (this.$.thePaths.getSetting(this.currentFile, "scale")){
						case "seconds": {
							if (duration < 8 || isNaN(duration) || !duration) {duration = 8};
							if (this.timeIndex >= duration) {
								this.timeIndex = 0;
								changePicture = true;
							};
							break;
						};
						case "minutes": {
							if (this.timeIndex >= duration * 60) {
								this.timeIndex = 0;
								changePicture = true;
							};
							break;
						};
					};
					break;
				};
				case "Custom Duration": {
					var delayString = this.$.thePaths.getPictureInfo(this.activeIndex, "delay");
					var duration = parseInt(delayString.substr(0, delayString.length - 1));
					var scale = delayString.substr(delayString.length - 1, 1);
					switch (scale){
						case "s": {
							if (duration < 8 || isNaN(duration) || !duration) {duration = 8};
							if (this.timeIndex >= duration) {
								this.timeIndex = 0;
								changePicture = true;
							};
							break;
						};
						case "m": {
							if (this.timeIndex >= duration * 60) {
								this.timeIndex = 0;
								changePicture = true;
							};
							break;
						};
					};
					break;
				};
			};
		};
		
		var sleepMode = STORAGE.get("timeoutshow");
		if (sleepMode === true) {
			if (this.isRunning == 1 && this.waitingForWake === false && this.showPaused === 0) {
				var nowD = new Date();
				var freezeD = new Date(Date.parse(STORAGE.get("sleeptime")));
				this.log(nowD.getHours(), freezeD.getHours(), nowD.getMinutes(), freezeD.getMinutes())
				if (nowD.getHours() >= freezeD.getHours()) {
					if (nowD.getMinutes() >= freezeD.getMinutes()) {
						this.pauseShow();
						this.waitingForWake = true;
						this.$.sleepCover.setShowing(true);
						this.startTimerMinute();
					}
				}
			}
		}

		if (changePicture == true) {
			var noTransition = false
			var goBackPicture = false;
			var picCount = this.$.thePaths.getPictureCount()
			//overRide: 1 and 4 go back, 2 and 3 go forward
			if (this.overRide == 1 || this.overRide == 4) {
				this.picIndex--;
				if (this.overRide == 4) {
					noTransition = true;
				};
				goBackPicture = true;
			}
			else {
				if (this.overRide == 3) {
					noTransition = true;
				};
				this.picIndex++;
			};
			this.overRide = 0;

			if (this.activeIndex == picCount - 1) {
				if (this.$.thePaths.getSetting(this.currentFile, "repeat") == "Play Once" && this.exhibition == false) {
					this.startShow();
					return 0;
				};
			};

			if (this.picIndex > picCount - 1) {
				this.picIndex = 0;
				this.orderPicArray();
			}
			else if (this.picIndex < 0) {
				this.picIndex = picCount - 1;
			};

			this.activeIndex = this.picIndex - 1;

			if (this.activeIndex < 0) {
				this.activeIndex = picCount - 1;
			};

			var stretch = this.getPictureStretch(this.picIndex);
			var transition = this.getTransAndSpeed(this.picIndex);
			var cinematic = this.getCinematicMode(this.picIndex);
			var picPath = this.$.thePaths.getPictureInfo(this.picIndex ,"path");
			var rotate = this.$.thePaths.getPictureInfo(this.picIndex,"rotate");
			
			if (goBackPicture == false) {
				if (this.activeIndex - 1 >= 0) {
					this.deleteExif(this.$.thePaths.getPictureInfo(this.activeIndex - 1,"path"));	
				}
				else {
					this.deleteExif(this.$.thePaths.getPictureInfo(picCount - 1,"path"));
				}
				/////////////
				this.$.set.feedPicture(picPath, 
					                   transition.trans, 
					                   stretch, 
					                   cinematic.panmode,
					                   cinematic.pandir,
					                   rotate,
					                   transition.speed
					                  );
				//////////////
				enyo.nextTick(this.$.set,this.$.set.changePicture,noTransition);
			}
			else {
				var activeStretch = this.getPictureStretch(this.activeIndex);
				var activeTransition = this.getTransAndSpeed(this.activeIndex);
				var activeCinematic = this.getCinematicMode(this.activeIndex);
				var activePath = this.$.thePaths.getPictureInfo(this.activeIndex ,"path");
				this.deleteExif(picPath);
				this.deleteExif(activePath);

				var backPicIndex = this.activeIndex  - 1;
				if (backPicIndex < 0) {
					backPicIndex = picCount - 1;
				};
				this.$.set.feedBackPic(this.$.thePaths.getPictureInfo(backPicIndex, "path"),
					                   this.$.thePaths.getPictureInfo(backPicIndex, "stretch"), 
					                   this.$.thePaths.getPictureInfo(backPicIndex, "rotate"), 
					                   true,
					                   true
					                  );

				this.$.set.feedNextPic(picPath,
					                   stretch,
					                   rotate,
					                   true
					                  );
				////////
				this.$.set.forcechangeCurrentAndNext(activePath, 
					                                 activeTransition.trans, 
						                             activeStretch,
						                             activeCinematic.panmode,
						                             activeCinematic.pandir,
						                             this.$.thePaths.getPictureInfo(this.activeIndex,"rotate"),
						                             activeTransition.speed, 
						                             picPath, 
						                             transition.trans, 
						                             stretch,
						                             cinematic.panmode, 
						                             cinematic.pandir,
						                             rotate,
						                             transition.speed
						                            );
				/////////
				
			};
			this.saveCurrentPosition();
			this.HoldOnCaption = 0
		}
		else {
			if (this.HoldOnCaption <= 0) {
				var caption = ""
				this.HoldOnCaption = 0
				var returnChecker = function(inVar) {
					if (inVar.length > 0) {
						inVar = inVar + "\r\n";
					}
					return inVar
				}

				//Captions....

				//Date and Time
				if (this.$.thePaths.getSetting(this.currentFile, "dateshow") == true) {
					caption = this.formatTheDate(new Date(), "dddd, mmmm dd, yyyy, hh:nn a/p");
				};

				//Song name
				if (audCount > 0 && audPick != "No Audio" && this.$.sound.getIsplaying() == true) {
				 	var songFile = this.$.thePaths.getAudioInfo(this.audIndex,"path");
					songFile = songFile.substr(songFile.lastIndexOf("/") + 1);
					for (var i = 0; i < this.audioTypes.length; i++) {
						songFile = songFile.replace(this.audioTypes[i],"");
					};
					songFile = songFile.replace(/_/gi," ");
					songFile = songFile.replace(/ - /gi,"-");
					songFile = songFile.replace(/-/gi," - ");
					songFile = this.capString(songFile);
					this.$.songName.setContent(songFile);
					var soundPos = this.$.sound.showCurrentPosition();
					if (this.$.thePaths.getSetting(this.currentFile, "songshow") == true) {
						caption = returnChecker(caption);
						caption = caption + songFile + soundPos;
					};
					if (soundPos != "") {
						//setup audo popup
						var tmpArray = soundPos.split("/");
						this.$.cTime.setContent(tmpArray[0]);
						this.$.tTime.setContent(tmpArray[1]);
						this.$.audioPosition.setMaximum(this.$.sound.getMaxSeconds());
						this.$.audioPosition.setPosition(this.$.sound.getCurrentSeconds());
					};
				};

				//Global caption
				if (this.$.thePaths.getSetting(this.currentFile, "useglobalcaption") == true) {
					var globalCaption = this.$.thePaths.getSetting(this.currentFile, "globalcaption");
					if (!globalCaption || globalCaption == "NO_SETTINGS") {globalCaption = "";};
					if (globalCaption.length > 0){
						caption = returnChecker(caption);
						caption = caption + globalCaption;
					};
				}

				//File info
				var usePicIndex = this.activeIndex//(goBackPicture == false ? this.activeIndex : this.picIndex)

				if (this.$.thePaths.getSetting(this.currentFile, "showfileinfo") == true) {
					caption = returnChecker(caption);
					caption = caption + this.getPathInfo(usePicIndex,0);
				};
				
				//Pictures Caption
				var picCaption = this.$.thePaths.getPictureInfo(usePicIndex, "caption");
				if (picCaption.length > 0){
					caption = returnChecker(caption);
					caption = caption + picCaption;
				};

				//EXIF info
				if (this.$.thePaths.getSetting(this.currentFile, "showexif") == true) {
					var exifInfo = this.getExifIndex(this.$.thePaths.getPictureInfo(usePicIndex, "path"));

					//this.log("@@@@================>>>" + this.activeIndex + "," + usePicIndex)
					
					if (exifInfo >= 0) {
						var strPretty = this.formatExif(exifInfo)
						if (strPretty.length > 0) {
							strPretty = strPretty.substr(0,strPretty.length - 2)
							if (strPretty.length > 0){
								caption = returnChecker(caption);
								caption = caption + strPretty;
							};
						};
					};
				};

				if (caption.length > 0) {
					if (this.$.thePaths.getSetting(this.currentFile, "textcolor") == true) {
						this.$.set.setTextColor(this.$.thePaths.getSetting(this.currentFile, "overridecolor")); 
					}
					else {
						this.$.set.setTextColor(this.$.thePaths.getPictureInfo(usePicIndex, "captioncolor"));
					};
					var captionPos =  parseInt(this.$.thePaths.getPictureInfo(usePicIndex, "captionlocation"));
					if (this.$.thePaths.getSetting(this.currentFile, "usesizeoverride") == true) {
						var fontSize = parseInt(this.$.thePaths.getSetting(this.currentFile, "fontsize"));
					}
					else {
						var fontSize = parseInt(this.$.thePaths.getPictureInfo(usePicIndex, "fontsize"));
					}; 
					if (isNaN(fontSize) || !fontSize) {fontSize = 30};
					if (isNaN(captionPos) || !captionPos) {captionPos = 0};
					this.$.set.setTextFont(fontSize + "pt Prelude");

					var textSize = this.$.set.getStringHeight(caption, fontSize + 8);
					if (this.$.contain.hasNode()) {
						var viewHeight = this.$.contain.node.clientHeight;
					};
					
					if (!viewHeight) {viewHeight = 768};
					var x = 0;
					if (captionPos == 0) {
						x = viewHeight - (textSize.height);
						if (x <= 10) {
							do {
								fontSize = fontSize - 5;
								this.$.set.setTextFont(fontSize + "pt Prelude");
								textSize = this.$.set.getStringHeight(caption, fontSize + 8);
								x = viewHeight - (textSize.height);
							}
							while (x < 10 || fontSize <= 8)
						};
					}
					else {
						if (this.audioPopIsOpen == true) {
							x = 145;
						}
						else {
							x = 10 + fontSize;
						};
						if (x + textSize.height >= viewHeight - 10) {
							do {
								fontSize = fontSize - 5
								this.$.set.setTextFont(fontSize + "pt Prelude");
								textSize = this.$.set.getStringHeight(caption,fontSize + 8);
								if (this.$.audioPop.getOpened() == true) {
									x = 145;
								}
								else {
									x = 10 + fontSize;
								};
							}
							while (x + textSize.height > viewHeight - 10 || fontSize <= 8)
						};
					};
					//this.log("============================>>textSize =" + textSize.height + ", x=" + x + ", viewheight=" + viewHeight)
					this.$.set.drawText( caption, 15, x, fontSize + 8);
				}
				else {
					this.$.set.drawText( "", 0, 0, 1);
				}
			}
			else {
				this.HoldOnCaption--
			}
		};
	},
	formatExif: function(TS) {
		
		var strPretty = "";
		var tmp = ""
		if (TS >= 0) {
			var oData = this.exifData[TS];
			for (var a in oData) {
				if (oData.hasOwnProperty(a)) {
					switch (a) {
						case "Make": case "LightSource": case "FocalLength": case "ExposureTime": case "ApertureValue":  case "ISOSpeedRatings":   case "Flash": case "FocalLength": case "ExposureMode": case "WhiteBalance": case "DigitalZoomRation": case "GainControl": case "Contrast": case "Saturation": case "Sharpness": case "SubjectDistanceRange": {
							//this.log(this.exifObj[a] + "," + a)
							if (this.exifObj[a] == true) {
								if (typeof oData[a] == "object") {
									strPretty += a + ": [" + oData[a].length + " values]\r\n";
								} else {
									if (Number(oData[a]) != 0 && oData[a] != "None" && oData[a] != "Unknown" && oData[a] != "Normal") {
										strPretty += a + ": " + oData[a] + "\r\n";
									}
								}
							}
							break;
						}
						case "DateTime": {
							if (this.exifObj[a] == true) {
								var dArr = oData[a].split(" ");
								if (dArr.length > 1) {
									
									var dAr = dArr[0].split(":");
									var tAr = dArr[1].split(":");
									try {
										var lastDate = new Date(Number(dAr[0]),Number(dAr[1])-1,Number(dAr[2]),Number(tAr[0]),Number(tAr[1]),tAr[2],0);	
										lastDate = this.formatTheDate(lastDate, "mm/dd/yyyy hh:nn a/p");
										strPretty += "Date/Time: " + lastDate + "\r\n";
									}
									catch (e) {
										
									};
									
								};
							}
							break;
						}

						case "SceneCaptureType": {
							if (this.exifObj[a] == true) {
								if (oData[a] != "Standard") {
									strPretty += "Scene Type: "  + oData[a] + "\r\n";
								};
							}
							break;
						}
						case "ImageDescription": {
							if (this.exifObj[a] == true) {
								try {
									var des = enyo.string.trim(oData[a]);
									if (des.length > 0) {
										strPretty = "Description: " + des + "\r\n";
									}
								}
								catch (e) {
									
								};
							}
							break;
						}
						case "UserComment": {
							if (this.exifObj[a] == true) {
								try {
									var des = enyo.string.trim(oData[a]);
									if (des.length > 0) {
										strPretty = "Comments: " + des + "\r\n";
									};
								}
								catch (e) {
									
								}
							}
							break;
						}
						case "Model": {
							if (this.exifObj[a] == true) {
								try {
									var s = enyo.string.trim(oData[a]);
									var t = "";
									s = s.toLowerCase();
									var Arr = s.split(" ");
									s = "";
									for (var i = 0;i < Arr.length; i++) {
										t = Arr[i].substr(0,1);
										t = t.toUpperCase();
										s = s + t + Arr[i].substr(1) + " ";
									}
									strPretty += "Camera: " + s + "\r\n";
								}
								catch (e) {
									
								}
							}
							break;
						}
						case "PixelXDimension": case "PixelYDimension": {
							if (this.exifObj["Size"] == true) {
								if (tmp.length == 0) {
									tmp = a;
									tmp = tmp.replace("Pixel","");
									tmp = tmp.replace("Dimension","");
									tmp += oData[a];
								}
								else {
									strPretty += "Size: "
									if (tmp.substr(0,1) == "X") {
										strPretty += tmp.substr(1) + " x " + oData[a];
									}
									else {
										strPretty += oData[a] + " x " + tmp.substr(1); 
									}
									strPretty += " px\r\n";
								};
							}
							break;
						}
					}
					if (strPretty.length > 0) {
						var o = strPretty
						o = o.replace("DateTime", "Date/Time");
						o = o.replace("ISOSpeedRatings", "ISO");
						o = o.replace("ApertureValue", "Aperture");
						o = o.replace("FocalLength", "Focal Length");
						o = o.replace("SceneType", "Scene Type");
						o = o.replace("WhiteBalance", "White Balance");
						o = o.replace("GainControl", "Gain");
						o = o.replace("SubjectDistanceRange", "Focus Mode");
						o = o.replace("ExposureTime", "Exposure");
						o = o.replace("ExposureMode", "Exposure Mode");
						o = o.replace("DigitalZoomRation", "Digital Zoom");
						o = o.replace("LightSource", "Light Source");
						strPretty = o;
					}
				}
			}
			
		};
		return strPretty;
	},
	getExifIndex: function(src) {

		for (var i = 0; i < this.exifData.length; i++) {
			//this.log(this.exifData[i].PATH_SRC)
			if (this.exifData[i].PATH_SRC == src) {
				return i;
				break;
			};
		};
		return -1;
	},
	getPathInfo: function(i,which) {
		var x = 0
		if (this.$.thePaths.getSetting(this.currentFile, "showfileinfo") == true) {
			if (which == 0) {
				var s = this.$.thePaths.getPictureInfo(i,"path")
			}
			else {
				var s = this.$.thePaths.getAudioInfo(i,"path")
			}
			/*//case "audpick": case "picpick": case "showexif": case "showfileinfopicker": case "showfileinfo": case "change": case "dateshow": case "songshow": case "textcolor": case "fullscreen": case "duration": case "scale": case "usetransoverride": case "usesizeoverride": case "stretchall": case "cinematic": case "repeat": case "useglobalcaption" : {
			case "transsetting": case "transoverride": case "overridecolor": case "fontsize": case "globaltransspeed": case "globalcaption": {

			case "addpicturecolor": case "pictranssetting": case "pictrans": case "captionlocation": case "picpansetting": case "panmode": case "pandir": case "addfontsetting": case "addfontsize": case "addtransspeed": case "fontmin": case "fontmax": {

			case "shownav": case "autohideaudio": case "useswipe": case "autostart": case "hidemenubutton":{*/
			switch (this.$.thePaths.getSetting(this.currentFile, "showfileinfopicker")) {
				case "File Name": {
					 x = s.lastIndexOf("/");
					 s =  s.substr(x+1)
					break;
				}
				case "Path": {
					x = s.lastIndexOf("/");
					s =  s.substr(0,x)
					break;
				}
			}
			////enyo.log(s)
			return s
		}
		return ""
	},
	saveCurrentPosition: function() {
		var sql = []
		if (this.$.thePaths.setSetting(this.currentFile, "lastpospic", this.activeIndex) != true) {
			this.$.thePaths.insertSettingInSet(this.currentFile,"lastpospic:" + this.activeIndex + "{", 3)
		}
		if (this.$.thePaths.setSetting(this.currentFile, "lastposaud", (this.audIndex)) != true) {
			this.$.thePaths.insertSettingInSet(this.currentFile,"lastposaud:" + (this.audIndex) + "{", 3)
		}
		var s = this.$.thePaths.getSettingSet(this.currentFile, 3)
		sql.push("UPDATE settingsTable SET projectsettings = '" + s + "' WHERE filename = '" + this.currentFile + "'")
		this.saveDataToDatabase("", sql)
	},
	
	capString: function (val) {
        var newVal = '';
        val = val.split(' ');
        for (var c=0; c < val.length; c++) {
            newVal += val[c].substring(0,1).toUpperCase() +	val[c].substring(1,val[c].length) + ' ';
	    };
	    return newVal;
	},
	formatTheDate: function (inDate, inFormat) {
		var gsMonthNames = new Array(
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December'
				);
		var gsDayNames = new Array(
				'Sunday',
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday'
				);
		var s = inFormat;
		var d = inDate;
	    s = s.replace('yyyy',  d.getFullYear());
	    s = s.replace('mmmm',  gsMonthNames[d.getMonth()]);
	    s = s.replace('mm',  d.getMonth() + 1);
	    s = s.replace('dddd',  gsDayNames[d.getDay()]);
	    s = s.replace('dd',  this.zeroPadder(d.getDate()));
	    s = s.replace('hh',  this.zeroPadder((h = d.getHours() % 12) ? h : 12));
	    s = s.replace('nn', this.zeroPadder(d.getMinutes()));
	    s = s.replace('a/p',  d.getHours() < 12 ? 'am' : 'pm');
	    return s;
	    // "dddd, mmmm dd, yyyy, hh:nn a/p"
	},
	zeroPadder: function(inValue) {
		var s = inValue.toString();
		if (s.length < 2) {
			s = "0" + s;
		};
		return s;
	},
	openNavButtons: function () {
		if (this.isRunning == 1 || this.showPaused == 1) {
			var y = this.$.contain.hasNode().clientHeight - 110;
			var x = this.$.contain.hasNode().clientWidth;
			if (this.exhibition == false) {
				if (this.$.thePaths.getSetting(this.currentFile,"hidemenubutton") == false || this.showPaused == 1) {
					this.$.showMenu.setStyle("position: absolute; top: " + y + "px; left: 10px;z-index:10001");
					this.$.showMenu.setShowing(true);
				}
			}
			if (this.$.thePaths.getSetting(this.currentFile,"shownav") == true && this.isRunning == 1) {
				x = x - 95;
				this.$.buttonRight.setStyle("left: " + x + "px;");
				this.$.buttonRight.setShowing(true);
				this.$.buttonLeft.setShowing(true);
			}
			this.buttonOpen = 1;
			this.buttonTimer = 0;
			this.$.zoomPic.setShowing(true);
			this.$.zoomPic.setStyle("position:absolute;z-index:10001;bottom:0;right:0;");
			if (this.audioPopIsOpen == false && this.$.thePaths.getAudioCount() > 0) {
				
				this.$.showAudio.setStyle("position:absolute;z-index:10001;top:20px;left:20px;");
				this.$.showAudio.setShowing(true);

				this.$.pauseOverlay.setStyle("position:absolute;z-index:10001;top:18px;left:85px;");
				this.$.pauseOverlay.setShowing(true);
			}
			else {
				if (this.audioPopIsOpen == true) {
					this.$.pauseOverlay.setStyle("position:absolute;z-index:10001;top:130px;left:20px;");
				}
				else {
					this.$.pauseOverlay.setStyle("position:absolute;z-index:10001;top:18px;left:20px;");
				}
				this.$.pauseOverlay.setShowing(true);
			}
		};
	},
	setRunSize: function() {
		var can = this.$.contain.hasNode()
		if (can) {
			var y = can.clientWidth;
			var x = can.clientHeight;
			this.$.set.setCanvasWidth(y);
			this.$.set.setCanvasHeight(x);

			this.$.set.setWidthAndHeight(y, x);
		   	enyo.nextTick( this.$.set,  this.$.set.refreshSize);	
		}
	},
	setPicLabel: function() {
		/*var y = this.$.containPane.hasNode().clientWidth;
		var x = this.$.containPane.hasNode().clientHeight;
		//this.$.set.pausePan();
		this.$.audioPop.setWidth(y)
		if (this.isRunning == 1) {
			this.$.textField.show();
			
			enyo.nextTick(this.$.textField,this.$.textField.setWidthAndHeight,y, x);
			
		}
		else {
			this.$.textField.hide();
		}
		var b = false;
		if ((this.$.set.getCanvasWidth() == y) && (this.$.set.getCanvasHeight() == x)) {
			b = true;
		}
		if  (b == false ){
			this.$.set.setCanvasWidth(y);
			this.$.set.setCanvasHeight(x);
	   		enyo.nextTick( this.$.set,  this.$.set.refreshSize);	
		}
		if (this.$.thePaths.getSetting(this.currentFile,"shownav") == "true") {
			if (this.buttonOpen == 1 && this.$.buttonRight.getShowing() == true) {
				
				//this.$.showMenu.setShowing(true);
			   y =  y - 95;
			   this.$.buttonRight.setStyle("left: " + y + "px;");
		    }
		}*/
		//else {this.$.showMenu.setShowing(false);};
		
		//x = this.$.middle.hasNode().clientHeight
		//x = x - 506
		//this.$.hideMusic.setStyle("position: relative; top: " + x + "px;")
		//if (this.isRunning == 1) {window.setTimeout(enyo.bind(this, (function () {this.$.set.panPicture();})),3000)}
	},
	startTimer : function () {
		this.start_date = new Date();
		this.job = window.setInterval(enyo.bind(this, "changePic"), 1000);
	},
	stopTimer: function () {
		window.clearInterval(this.job);
	},
	startTimerMinute: function () {
		this.start_date = new Date();
		this.jobMinute = window.setInterval(enyo.bind(this, "changePic"), 60000);
	},
	stopTimerMinute: function () {
		window.clearInterval(this.jobMinute);
	},
	
	
	showMsgBox: function(is, s) {
		this.$.dialContent.setContent(s);
		this.$.dialWnd.openAtCenter();
	},
	
	
	//////////// List Handlers
/////////////File List
	
	createNewProject: function(iS, iE, forceIt) {
		if (iE.length <= 0 && forceIt != true) {
			this.showMsgBox("","Enter a project name.");
			return;
		}
		var tmp = this.$.thePaths.getListOfProjects();
		var b = false;
		for (var i = 0; i < tmp.length; i++) {
			if (tmp[i] == iE) {
				b = true;
				break;
			}
		};
		var sql = []
		if (b == false || forceIt == true) {
			this.currentFile = iE;
			var s1 = "INSERT INTO settingsTable (" + this.setColumnsShort + ") VALUES ('";
			s1 = s1 + iE + "', '";
			s1 = s1 + this.getDefaultSettings();
			sql.push(s1);
			this.$.setPreferencesCall.call(
			      {
			          "firstfile" : this.currentFile
			      });;
			this.saveDataToDatabase("", sql);
			if (forceIt != true) {
				this.$.thePaths.clearPictures();
				this.$.thePaths.clearAudio();
				this.feedDefaultSettings();
				this.endLoad();
				enyo.nextTick(enyo.windows,enyo.windows.addBannerMessage,"Project " + this.currentFile + " created!", "{}");
			}
			else {
				this.Create_New_Project = false
				window.setTimeout(enyo.bind(this,function() {
					this.queryDatabase()
				}), 500);
			}
		}
		else {
			this.showMsgBox("","Project Already Exist.");
		}
	},

	getDefaultSettings: function() {
		var s = enyo.string.toBase64(enyo.json.stringify(this.exifObj))
		var s1 = "audpick:Audio Random{" + 
		         "picpick:Picture Random{" +
		         "showexif:false{" + 
		         "showfileinfo:false{"+
		         "showfileinfopicker:File Name{"+
		         "dateshow:false{"+
		         "songshow:false{"+
		         "fullscreen:false{" +
				 "change:Duration:{"+
				 "duration:15{"+
				 "scale:seconds{"+
				 "stretchall:false{"+
				 "usesizeoverride:false{" +
				 "usetransoverride:false{"+
				 "cinematic:false{"+
				 "textcolor:false{"+
				 "repeat:Repeat{"+
				 "', '" +
				 "overridecolor:#ffffff{"+
				 "transsetting:Random{"+
				 "transoverride:fadeOut{"+
				 "globaltransspeed:0{"+
				 "fontsize:32{"+
				 "globalcaption: {"+
				 "useglobalcaption:false{"+
				 "', '" +
				 "addpicturecolor:#ffffff{"+
				 "captionlocation:Bottom{"+
				 "pictranssetting:Random{" +
				 "pictrans:fadeOut{"+
				 "picpansetting:Use just one:{"+
				 "panmode:-1{"+
				 "pandir:-1{"+
				 "addtransspeed:0{"+
				 "addfontsetting:Random{" +
				 "addfontsize:32{"+
				 "fontmin:20{"+
				 "fontmax:40{"+
				 "', '"+
				 "shownav:false{"+
				 "autohideaudio:false{"+
				 "useswipe:true{"+
				 "autostart:false{"+
				 "lastpospic:0{"+
				 "lastposaud:0{"+
				 "hidemenubutton:false{"+
				 "picturedrawer:false{"+
				 "audiodrawer:false{"+
				 "changedrawer:false{"+
				 "repeatdrawer:false{"+
				 "miscdrawer:false{"+
				 "captiondrawer:false{"+
				 "overridedrawer:false{"+
				 "', " +
				"'0','"+
				"bulksortpicker:Picture Ordered By Filename{"+
				"showhidden:false{"+
				"addsubfolder:false{"+
				"bulkradio:pic{" +
				"','" + 
				s +  
				"','0');"
		return s1;
	},
	feedDefaultSettings: function() {
		/*data.rows.item(i)["mainsettings"] + "|+|{" +
					 					data.rows.item(i)["globalsettings"] + "|+|{" + 
					 					data.rows.item(i)["addsettings"] + "|+|{" + 
					 					data.rows.item(i)["projectsettings"] + "|+|{" + 
					 					data.rows.item(i)["exhibition"] + "|+|{" + 
					 					data.rows.item(i)["extra1"], */
		var s = this.getDefaultSettings();
		var Arr = s.split(",");
		s = "";
		for (var i = 0; i < 5; i++) {
			s = s + Arr[i].replace(/'/gi, "") + "|+|{";
		};
		s = s.substr(0, s.length - 4);	
		this.$.thePaths.feedSetting(this.currentFile, s, Arr[Arr.length - 2]);
	},
	
	
	
	changeExhibHandler: function(iS,iE) {
		var val = iE;
	    this.$.setPreferencesCall.call({
	    	"exhibfile" : val
	    });
	    this.projectSettings.ExhibFile = val;
	    var winRoot = enyo.windows.getRootWindow();
	    if (winRoot) {
	        enyo.windows.setWindowParams(winRoot, {source:"ExhibitionView", cmd: "unload"});
	    }
	    
	},
	
	//////////// Database
	clearFile: function() {
		var whichTBL = this.$.confirmContent.getContent();
		if (whichTBL == "Clear all data for pictures in this project?") {
			whichTBL = "pic";
		}
		else {
			whichTBL = "aud";
		};
		var sql = []
		sql.push("DELETE FROM " + whichTBL + "PathsTable WHERE filename = '" + this.currentFile + "';");
		/*this.db.transaction( 
		        enyo.bind(this,(function (transaction) { 
		            transaction.executeSql(s, [], [], []); 
		        }))
		    );*/
		if (whichTBL == "pic") {
			whichTBL = "picture";
			this.$.thePaths.clearPictures();
			
			
			/*this.$.set.clearImages();
			this.$.set.feedPicture("images/basic.png", "canvasBasicHiding", "0", "-1", "0","0","0");
			this.$.set.loadFirstImage();*/
			
		}
		else {
			whichTBL = "audio";
			this.$.thePaths.clearAudio();
			
		};
		
		this.saveDataToDatabase("", sql)
		this.$.confirmWnd.close();
		this.$.main.updatePreview();
		this.$.main.checkButtons();
		this.$.dialContent.setContent("All " + whichTBL + " data erased in project " + this.currentFile );
		this.$.dialWnd.openAtCenter();

		//};
	},
	/*clearData: function() {
		var s = 'DROP TABLE IF EXISTS picPathsTable';
		var s1 = 'DROP TABLE IF EXISTS audPathsTable';
		var s2 = 'CREATE TABLE picPathsTable' + ' (' + this.picColumns + ');';
		var s3 = 'CREATE TABLE audPathsTable' + ' (' + this.audColumns +');';
		this.db.transaction( 
		        enyo.bind(this,(function (transaction) { 
		            transaction.executeSql(s, [], [], []); 
		            transaction.executeSql(s1, [], [], []);
		            transaction.executeSql(s2, [], [], []);
		            transaction.executeSql(s3, [], [], []);
		        }))
		    );

		
	},*/
	
	
	outputPaths: function(iS, iE) {
		this.$.spin.start("Inserting Pictures...")
		var vCount = 0;
		var string = "";
		var i = 0;
		if (iE[0].sender == "imageFilePicker") {
			if (this.$.thePaths.getPictureCount() > 0) {
				vCount = Number(this.$.thePaths.getPictureCount()); 
			}; 
		}
		else {
			if (this.$.thePaths.getAudioCount() > 0) {
				vCount = Number(this.$.thePaths.getAudioCount());
			};
		}
		var sql = []
		if (iE[0].fullPath) {
			for (i = 0; i < iE.length; i++) {
        		if (iE[0].sender == "imageFilePicker") {
        			if (this.$.thePaths.doesPictureExist(iE[i].fullPath) == false) {
        				sql.push(BuildPictureString(iE[i].fullPath, vCount.toString(), true, this.$.thePaths, this.currentFile))
        			}
        		}
        		else {
        			if (this.$.thePaths.doesAudioExist(iE[i].fullPath) == false) {
        				sql.push("INSERT INTO audPathsTable (" + AudColumnsShort + ") VALUES ('" + iE[i].fullPath + "', '" + vCount.toString()+ "', '" + this.currentFile + "');");
        				this.$.thePaths.feedAudioItem(iE[i].fullPath, vCount)
        			}	
        		}
    			this.$.spin.setStatusMsg("Adding " + vCount + " - " + iE[i].fullPath + "...");
				vCount++;
			}
			this.$.db.updateRecordBulkNoEvent(sql);

			this.$.spin.stop();
		}
		else {
			this.$.spin.stop();
		}
		this.$.main.updatePreview();
		this.$.main.checkButtons();
	},
	



	
	
	errorHandler: function(transaction, error) { 
		//this.$.selectedFiles.setContent('Error was '+error.message+' (Code '+error.code+')'); 
		//this.tracker = this.tracker + "error " + error.message + " "
		//this.tracker = error.message
		//if ( error.message.indexOf("Table already exists") < 0) {
			/*this.$.progress.setMessage(error.message)
			this.$.progress.stopAni();
			this.$.progress.close();*/
		//}
		//this.$.selectedFiles.setContent(error.message);
	},
	
	//////////// Preference Settings
	writePrefHandler: function(iS, iE) {
		if (iS.name == "welcomePage") {
			var val = iE
			var pref = "welcome"
		}
		else {
			var val = iE.val
			var pref = iE.preference
		}
		switch (pref) {
			case "loadblank": {//loadblank,explaysound
				this.$.setPreferencesCall.call(
		        {
		            "loadblank" : val
		        });
		        this.projectSettings.LoadBlank = val
				break;
			}
			case "explaymusic": {
				this.$.setPreferencesCall.call(
		        {
		            "explaymusic" : val
		        });
		        this.projectSettings.ExPlayMusic = val
				break;
			}
			case "welcome": {
				this.$.setPreferencesCall.call(
		        {
		            "welcome" : val
		        });
		        this.projectSettings.welcome = val
				break;
			}
			case "exhibnote": {
				this.$.setPreferencesCall.call(
		        {
		            "exhibnote" : val
		        });
		        this.projectSettings.exhibnote = val
				break;	
			}
		}
	},	
	
	prefChanged: function(inSender, inEvent){
		
		var pref = inEvent.preference;
		var val = inEvent.val
		var string = ""
		var s = ""
		var sql = []
//this.$.testing.setContent(val)
		this.log(pref)
		switch (pref) {
			case "audpick": case "picpick": case "showexif": case "showfileinfopicker": case "showfileinfo": case "change": case "dateshow": case "songshow": case "textcolor": case "fullscreen": case "duration": case "scale": case "usetransoverride": case "usesizeoverride": case "stretchall": case "cinematic": case "repeat": case "useglobalcaption" : {
				
				if (this.$.thePaths.setSetting(this.currentFile, pref, val) == true) {
					s = this.$.thePaths.getSettingSet(this.currentFile, 0);
				}
				else {
					s = this.$.thePaths.getSettingSet(this.currentFile, 0);
					this.$.thePaths.insertSettingInSet(this.currentFile,pref + ":" + val + "{", 0)
					s = s + pref + ":" + val + "{"
				}
				sql.push("UPDATE settingsTable SET mainsettings = '" + s + "' WHERE filename = '" + this.currentFile + "'")
				if (pref == "fullscreen") {
					if (this.isRunning == 1) {
						enyo.nextTick(enyo, enyo.setFullScreen, val);
						enyo.nextTick(this,this.setRunSize);
					};
						
				}
				else if (pref == "stretchall") {
					if (val == true) {
						if (this.isRunning == 1) {
							this.$.set.forceToggleStretch("1")
						}
					}
					else {
						if (this.isRunning == 1) {
							this.$.set.forceToggleStretch("0")
						}
					};
				}
				else if (pref == "cinematic") {
					if (val == true) {
						if (this.isRunning == 1) {
							var s = RandomTransition();
							var s1 = RandomTransition();
							this.$.set.forceToggleCinematic(true,s, s1,0,0,0,0)
							if (this.showPaused == 1) {window.setTimeout(enyo.bind(this,function() {
								this.$.set.pausePan()}),500)
							}
						}
					}
					else {
						if (this.isRunning == 1) {
							var s = this.$.thePaths.getPictureInfo(this.activeIndex, "transition");
							var s1 =  this.$.thePaths.getPictureInfo(this.picIndex, "transition");
							var s2 = this.$.thePaths.getPictureInfo(this.activeIndex, "pan");
							var s3 =  this.$.thePaths.getPictureInfo(this.picIndex, "pan");
							var s4 = this.$.thePaths.getPictureInfo(this.activeIndex, "pandirection");
							var s5 =  this.$.thePaths.getPictureInfo(this.picIndex, "pandirection");
							this.$.set.forceToggleCinematic(false,s, s1,s2,s3,s4,s5)
							//if (this.showPaused == 1) {this.$.set.pausePan()}
						}
					};
				};
				break;
			};

			case "transsetting": case "transoverride": case "overridecolor": case "fontsize": case "globaltransspeed": case "globalcaption": {
				this.log(val)
				if (this.$.thePaths.setSetting(this.currentFile, pref, val) == true) {
					s = this.$.thePaths.getSettingSet(this.currentFile, 1);
				}
				else {
					s = this.$.thePaths.getSettingSet(this.currentFile, 1);
					this.$.thePaths.insertSettingInSet(this.currentFile,pref + ":" + val + "{", 1)
					s = s + pref + ":" + val + "{"
				}
				sql.push("UPDATE settingsTable SET globalsettings = '" + s + "' WHERE filename = '" + this.currentFile + "'")
				this.log(this.$.thePaths.getSetting(this.currentFile, "overridecolor"))
				break;
			};

			case "addpicturecolor": case "pictranssetting": case "pictrans": case "captionlocation": case "picpansetting": case "panmode": case "pandir": case "addfontsetting": case "addfontsize": case "addtransspeed": case "fontmin": case "fontmax": {
				this.log(val)
				if (this.$.thePaths.setSetting(this.currentFile, pref, val) == true) {
					s = this.$.thePaths.getSettingSet(this.currentFile, 2);
				}
				else {
					s = this.$.thePaths.getSettingSet(this.currentFile, 2);
					this.$.thePaths.insertSettingInSet(this.currentFile,pref + ":" + val + "{", 2)
					s = s + pref + ":" + val + "{"
				}
				sql.push("UPDATE settingsTable SET addsettings = '" + s + "' WHERE filename = '" + this.currentFile + "'")
				
				break;
			}; 
									
			case "shownav": case "autohideaudio": case "useswipe": case "autostart": case "hidemenubutton": case "picturedrawer": case "audiodrawer": case "changedrawer": case "repeatdrawer": case "miscdrawer": case "captiondrawer": case "overridedrawer": {
				if (this.$.thePaths.setSetting(this.currentFile, pref, val) == true) {
					s = this.$.thePaths.getSettingSet(this.currentFile, 3);
				}
				else {
					s = this.$.thePaths.getSettingSet(this.currentFile, 3);
					this.$.thePaths.insertSettingInSet(this.currentFile,pref + ":" + val + "{", 3)
					if ( s== "0") { s= ""};
					s = s + pref + ":" + val + "{"
				}
				sql.push("UPDATE settingsTable SET projectsettings = '" + s + "' WHERE filename = '" + this.currentFile + "'")
				break;
			};
			case "bulksortpicker": case "showhidden": case "addsubfolder": case "bulkradio": {
				if (this.$.thePaths.setSetting(this.currentFile, pref, val) == true) {
					s = this.$.thePaths.getSettingSet(this.currentFile, 5);
				}
				else {
					s = this.$.thePaths.getSettingSet(this.currentFile, 5);
					this.$.thePaths.insertSettingInSet(this.currentFile,pref + ":" + val + "{", 5)
					if ( s== "0") { s= ""};
					s = s + pref + ":" + val + "{"
				}
				sql.push("UPDATE settingsTable SET extra1 = '" + s + "' WHERE filename = '" + this.currentFile + "'")
				
				break;
			};

		};
		//this.tracker = this.tracker + string + pref + val
		//this.$.selectedFiles.setContent(this.tracker)
		this.saveDataToDatabase("", sql)
	},
	saveExifSettings: function() {
		var s = enyo.string.toBase64(enyo.json.stringify(this.exifObj))
		var sql = []
		sql.push("UPDATE settingsTable SET extra2 = '" + s + "' WHERE filename = '" + this.currentFile + "'")
		this.saveDataToDatabase("", sql)
		
	},
	loadSettings: function() {

		/*this.AddTransSpeed = this.$.thePaths.getSetting(this.currentFile, "addtransspeed");
		this.GlobalTransSpeed = this.$.thePaths.getSetting(this.currentFile, "globaltransspeed");
		this.OverRideColor = this.$.thePaths.getSetting(this.currentFile, "overridecolor");
		this.TransOverRide = this.$.thePaths.getSetting(this.currentFile, "transoverride");
		this.TransSetting = this.$.thePaths.getSetting(this.currentFile, "transsetting");
		this.PicTransSetting = this.$.thePaths.getSetting(this.currentFile, "pictranssetting");
		this.PicTrans = this.$.thePaths.getSetting(this.currentFile, "pictrans");
		this.AddPictureColor = this.$.thePaths.getSetting(this.currentFile, "addpicturecolor");
		this.CaptionLocation =this.$.thePaths.getSetting(this.currentFile, "captionlocation");
		this.GlobalFontSize = this.$.thePaths.getSetting(this.currentFile, "fontsize");
		this.AddPicPanSetting = this.$.thePaths.getSetting(this.currentFile, "picpansetting");
		this.AddPanMode = this.$.thePaths.getSetting(this.currentFile, "panmode");
		this.AddPanDir = this.$.thePaths.getSetting(this.currentFile, "pandir");
		this.AddFontSetting = this.$.thePaths.getSetting(this.currentFile, "addfontsetting");
		this.AddFontSize = this.$.thePaths.getSetting(this.currentFile, "addfontsize");
		this.AddFontMin = Number(this.$.thePaths.getSetting(this.currentFile, "fontmin"));
		this.AddFontMax = Number(this.$.thePaths.getSetting(this.currentFile, "fontmax"));
		this.checkForUndefined()*/


		
		try {
			var eO = this.$.thePaths.getSettingExif(this.currentFile)
			eO = enyo.string.fromBase64(eO)
			this.log(eO)
			if (eO.length > 0 && eO != "0") {
				this.exifObj = enyo.json.parse(eO);
			}
		}
		catch (e) {
			
		}
		
	},
	

	reDoSettings: function() {
		//"audpick", "picpick", "dateshow", "songshow", "fullscreen", "change", "duration", "scale", 
		//"textcolor"//"usetransoverride", "stretchall""usesizeoverride", "cinematic"
	// "transsetting", "transoverride", "overridecolor", 
	//,"addpicturecolor","pictrans", "pictranssetting",
	//"captionlocation","fontsize",, "picpansetting", 
	//"panmode", "pandir","fontmin", "fontmax","addfontsize", "addfontsetting"
	
		
	
	//"filename, mainsettings, globalsettings, addsettings, projectsettings, exhibition, extra1, extra2, extra3"
	
		/*this.db.transaction( 
		        enyo.bind(this,(function (transaction) {*/
		        	var s = ""
		        if (this.fileNames.length > 0) {
			        	for (var i = 0; i < this.fileNames.length; i++) {
			    			s = "INSERT INTO settingsTable (" + this.setColumnsShort + ") VALUES ('"
			    			s = s + this.fileNames[i] + "','"
			    			s = s + this.getDefaultSettings();
			    		    
			    			//transaction.executeSql(s, [], [], enyo.bind(this,this.errorHandler)); 
			    		}
		        }
		        else {
		        	s = "INSERT INTO settingsTable (" + this.setColumnsShort + ") VALUES ('"
	    			s = s + "MyFirstProject','"
	    			s = s + this.getDefaultSettings();
	    		    var sql = []
	    		    sql.push(s)
	    		    this.saveDataToDatabase("", sql)
	    			//transaction.executeSql(s, [], [], enyo.bind(this,this.errorHandler)); 
		        }
		        	//this.loadPaths(8888)
		        	//this.loadSettings();
		       // })));
	
		
	},

	
	getPreferencesFailure: function(inSender, inResponse) {
	      //enyo.log("got failure from getPreferences");
	},
	setPreferencesSuccess: function(inSender, inResponse) {
	      console.log("got success from setPreferences");
	},
	setPreferencesFailure: function(inSender, inResponse) {
	      console.log("got failure from setPreferences");
	},
	
	showPauseOverlayButtons: function() {
		if (this.audioPopIsOpen == false) {

			if (this.$.thePaths.getAudioCount() > 0) {
				this.$.pauseOverlay.setStyle("position:absolute;z-index:10001;top:18px;left:80px;");
				this.$.pauseOverlay.setShowing(true);
				this.$.showAudio.setStyle("position:absolute;z-index:10001;top:20px;left:20px;");
				this.$.showAudio.setShowing(true);
			}
			else {
				this.$.pauseOverlay.setStyle("position:absolute;z-index:10001;top:18px;left:20px;");
				this.$.pauseOverlay.setShowing(true);
			}
		}
		else {
			this.$.pauseOverlay.setStyle("position:absolute;z-index:10001;top:130px;left:20px;")
			this.$.pauseOverlay.setShowing(true)
		}
		//this.$.pauseShowButton.setChecked(true)
		var y = this.$.contain.hasNode().clientHeight - 110;
		if (this.exhibition == false) {
			this.$.showMenu.setStyle("position: absolute; top: " + y + "px; left: 10px;z-index:10001;");
			this.$.showMenu.setShowing(true);
		}
		this.$.zoomPic.setShowing(true);
		this.$.zoomPic.setStyle("position: absolute; bottom: 0; right: 0;z-index:10001;");
	},
	//////////// Button Clicks
	
	pauseShow: function(noButtons) {
		
		if (this.showPaused == 0) {
			this.buttonOpen = 0
			this.hideOverlayButtons()
			this.stopTimer();
			//this.$.buttonLeft.hide();
			//this.$.buttonRight.hide();
			//this.$.showAudio.setShowing(false);
			if (!noButtons || noButtons.name) {
				this.showPauseOverlayButtons();
			}
			else {
				this.hideAudioPop();
			}
			this.showPaused = 1;
			if (this.exhibition == true && this.ExPlayMusic == false) {
				  this.$.playPause.setToDefault()
			  }
			  else {

				  if (this.$.sound.getIsplaying() == true) {
						if (this.$.sound.getIspaused() == false) {
							this.$.sound.pauseSound();
							
						}
					};
			  }
			
			this.$.set.pausePan();
			this.setAllButtons();
		}
		else {
			this.$.pauseOverlay.setChecked(false)
			this.hideOverlayButtons()
			//this.$.pauseShowButton.setChecked(false)
			
			if (this.$.thePaths.getPictureCount() < 2) {
				this.$.dialContent.setContent("You must add 2 or more pictures to continue the show!");
				this.$.dialWnd.openAtCenter();
			}
			else {
				this.startTimer();
				this.$.set.panPicture();
				this.$.showMenu.setShowing(false);

				this.showPaused = 0;
				
				if (this.$.sound.getIsplaying() == true) {
					if (this.$.sound.getIspaused() == true) {
						this.$.sound.pauseSound();
					}
					
				};

				this.setAllButtons();
			};
		};
	},

	previewChanging: function(iS,iE) {
		this.previewChange(iS,iE)
	},
	previewChange: function(iS,iE) {
		this.$.sound.setCurrentSeconds(iS.getPosition())
		this.$.cTime.setContent(this.$.sound.secondsToTime(iS.getPosition()))
		
	},
	playPauseSong: function() {
		
		this.$.sound.pauseSound();
	},
	
	changeToBackSong: function() {
		this.audIndex = this.audIndex - 2;
		if (this.audIndex < -1) {
			this.audIndex = this.$.thePaths.getAudioCount() - 2;
		}
		//if (this.audIndex < 0) {this.audIndex = 0;};
		if (this.$.thePaths.getSetting(this.currentFile, "audpick") == "Song Change") {
			this.overRide = 1;
		};
		this.$.sound.pauseSound();
		this.$.sound.setIsplaying(false);
		this.$.sound.setIspaused(false);
		this.$.playPause.setToDualDefault();
	},
	rightClicked: function () {
			//this.$.buttonRight.addClass("rightButtonClicked")
			if (this.$.set.getPreventDrag() == false) {
				this.$.set.setPreventDrag(true);
				this.hideOverlayButtons();
				this.overRide = 2;
				this.changePic();
			};
	},
	leftClicked: function () {
			//this.$.buttonLeft.addClass("leftButtonClicked")
			if (this.$.set.getPreventDrag() == false) {
				this.$.set.setPreventDrag(true);
				this.hideOverlayButtons();
				this.overRide = 1;
				this.changePic();
			};
	},
	makenew: function() {
		if (this.isRunning != 1 && this.exhibition == false) {
			this.$.contain.selectViewByName("projectHand");
			this.checkAudioPreview()
			this.$.projectHand.setCurrentFile(this.currentFile);
			this.$.projectHand.setThePaths(this.$.thePaths);
			this.$.projectHand.startUp("new");
		};
	},
	savedata: function () {
		if (this.isRunning != 1 && this.exhibition == false) {
			this.$.contain.selectViewByName("projectHand");
			this.checkAudioPreview()
			this.$.projectHand.setCurrentFile(this.currentFile);
			this.$.projectHand.setThePaths(this.$.thePaths);
			this.$.projectHand.startUp("save");
		};
	},
	loaddata: function() {
		if (this.isRunning != 1 && this.exhibition == false) {
			this.$.contain.selectViewByName("projectHand");
			this.checkAudioPreview()
			this.$.projectHand.setCurrentFile(this.currentFile);
			this.$.projectHand.setThePaths(this.$.thePaths);
			this.$.projectHand.startUp("load");
		};
	},
	openPrefs: function() {
		if (this.isRunning != 1 || this.showPaused == 1 && this.exhibition == false) { 
			this.$.contain.selectViewByName("prefs");
			this.checkAudioPreview()
			this.$.prefs.setCurrentFile(this.currentFile);
			this.$.prefs.setThePaths(this.$.thePaths);
			this.$.prefs.setProjectSettings(this.projectSettings);
			this.$.prefs.startUp();
		};
	},
	
	checkAudioPreview: function() {
		if (this.$.audEdit) {
			this.$.audEdit.stopPreviewSound();
		}
	},
	
	clearClicked: function(inSender, inEvent){
		var s = "";
		if (this.isRunning != 1) {
			if (inSender.preference == "picture") {
				this.$.confirmContent.setContent("Clear all data for pictures in this project?");
				this.$.confirmWnd.openAtCenter();
			}
			else {
				this.$.confirmContent.setContent("Clear all data for audio in this project?");
				this.$.confirmWnd.openAtCenter();
			};
		};
	},
	cancelClick: function() {
	      this.$.confirmWnd.close();
	},
	confirmClick: function() {
	      this.$.dialWnd.close();
	},
	
	
	changeToNextSong: function() {
		this.$.sound.pauseSound();
		this.$.sound.setIsplaying(false);
		this.$.sound.setIspaused(false);
		this.$.playPause.setToDualDefault();
	},
	hideMusicPanel: function () {
		if (this.isRunning == 1 && this.showPaused == 0) {
			this.$.set.pausePan()
			this.hideOverlayButtons();
			window.setTimeout(enyo.bind(this,(function(){
				enyo.nextTick(this.$.set,this.$.set.panPicture)
			})),750)
		}
		enyo.nextTick(this.$.slidingPane,this.$.slidingPane.selectViewByIndex,1);
	},
	  
	//////////// mousedown/mouseup handlers
	/*hideMouseDown: function() {
		this.$.hideMusic.addClass("hideButtonClicked");
	},
	hideMouseUp: function() {
		this.$.hideMusic.removeClass("hideButtonClicked");
	},
	backBulkMouseDown: function() {
		this.$.backBulk.addClass("backButtonClicked");
	},
	backBulkMouseUp: function() {
		this.$.backBulk.removeClass("backButtonClicked");
	},
	backFolderMouseDown: function() {
		this.$.backFolder.addClass("backFolderButtonClicked");
	},
	backFolderMouseUp: function() {
		this.$.backFolder.removeClass("backFolderButtonClicked");
	},
	backPrefsMouseDown: function() {
		this.$.backPrefs.addClass("backButtonClicked");
	},
	backPrefsMouseUp: function() {
		this.$.backPrefs.removeClass("backButtonClicked");
	},
	backPicsMouseDown: function() {
		this.$.backPics.addClass("backButtonClicked");
	},
	backPicsMouseUp: function() {
		this.$.backPics.removeClass("backButtonClicked");
	},
	backAudMouseDown: function() {
		this.$.backAud.addClass("backButtonClicked");
	},
	backAudMouseUp: function() {
		this.$.backAud.removeClass("backButtonClicked");
	},
	addAudioMouseDown: function() {
		this.$.addAudio.addClass("addAudioButtonClicked");
	},
	addAudioMouseUp: function() {
		this.$.addAudio.removeClass("addAudioButtonClicked");
	},
	/*addPictureMouseDown: function() {
		this.$.addPicture.addClass("addPictureButtonClicked");
	},
	addPictureMouseUp: function() {
		this.$.addPicture.removeClass("addPictureButtonClicked");
	},
	editAudioMouseDown: function() {
		this.$.editAudio.addClass("editAudioButtonClicked");
	},
	editAudioMouseUp: function() {
		this.$.editAudio.removeClass("editAudioButtonClicked");
	},
	editPictureMouseDown: function() {
		this.$.editPicture.addClass("editPictureButtonClicked");
	},
	editPictureMouseUp: function() {
		this.$.editPicture.removeClass("editPictureButtonClicked");
	},
	pauseShowMouseDown: function() {
		this.$.pauseShowButton.addClass("pauseShowButtonClicked");
	},
	pauseShowMouseUp: function() {
		//this.$.pauseShowButton.removeClass("pauseShowButtonClicked");
	},
	deleteAudioMouseDown: function() {
		this.$.deleteAudio.addClass("deleteAudioButtonClicked");
	},
	deleteAudioMouseUp: function() {
		this.$.deleteAudio.removeClass("deleteAudioButtonClicked");
	},
	deletePictureMouseDown: function() {
		this.$.deletePicture.addClass("deletePictureButtonClicked");
	},
	deletePictureMouseUp: function() {
		this.$.deletePicture.removeClass("deletePictureButtonClicked");
	},
	nextSongMouseDown: function() {
		this.$.nextSong.addClass("nextSongButtonClicked");
	},
	nextSongMouseUp: function() {
		this.$.nextSong.removeClass("nextSongButtonClicked");
	},
	backSongMouseDown: function() {
		this.$.backSong.addClass("backSongButtonClicked");
	},
	backSongMouseUp: function() {
		this.$.backSong.removeClass("backSongButtonClicked");
	},
	startMouseDown: function() {
		if (this.isRunning == 0) {
			this.$.startButton.addClass("startButtonClicked");
		}
		else {
			this.$.startButton.addClass("stopButtonClicked");
		};
	},
	startMouseUp: function() {
		if (this.isRunning == 0) {
			this.$.startButton.removeClass("startButtonClicked");
			
		}
		else {
			this.$.startButton.removeClass("stopButtonClicked");
		};
	},
	playPauseMouseDown: function() {
		if (this.playPauseValue == 0) {
			this.$.playPause.addClass("playButtonClicked");
		}
		else {
			this.$.playPause.addClass("pauseButtonClicked");
		};
	},
	playPauseMouseUp: function() {
		if (this.playPauseValue == 0) {
			this.$.playPause.removeClass("playButtonClicked");
			
		}
		else {
			this.$.playPause.removeClass("pauseButtonClicked");
		};
	}*/
});


var VerifyHexColor = function(inStr) {
	if (inStr) {
		inStr = inStr.substr(1);
		if (inStr.length < 6) {
			while (inStr.length < 6) {
				inStr =  "0" + inStr;
				
			};
		};
		return "#" + inStr;
	}
	else {
		return "#000000"
	}
};


var	MaxPic_PRIMARY_KEY = 0;
var	MaxAud_PRIMARY_KEY = 0;
var PicColumnsShort = "picpath, piccaption, piccaploc, picorder, filename, transition, captioncolor, captionstyle, stretch, delay";
var AudColumnsShort = "audpath, audorder, filename";

var BuildPictureString = function(sPath,sCount,bInsert, thePaths, currentFile) {
		var sCaptionLocation, sFileName, sTransition, sCaptionColor, sCaptionStyle, sStretch, sDelay
		var string = "INSERT INTO picPathsTable (" + PicColumnsShort + ") VALUES ('" + sPath + "', '', '"

		sCaptionLocation = thePaths.getSetting(currentFile, "captionlocation");	
		if (sCaptionLocation == "Random") {
			var rn = Math.floor(Math.random() * 1000);
			if (rn <= 500) {
				string = string + "1";
				sCaptionLocation = 1;
			}
			else {
				string = string + "0";
				sCaptionLocation = 0;
			};
		}
		else if (sCaptionLocation == "Top") {
			string = string + "1";
			sCaptionLocation = 1;
		}
		else {
			string = string + "0";
			sCaptionLocation = 0;
		};

		string = string + "', '" + sCount + "', '" + currentFile + "', '";
		
		
		if (thePaths.getSetting(currentFile, "pictranssetting") == "Random") {
			sTransition = RandomTransition();
			string = string + sTransition + "', ";
		}
		else {
			sTransition = thePaths.getSetting(currentFile, "pictrans");
			string = string + sTransition + "', ";
			
		};
		sCaptionColor = thePaths.getSetting(currentFile, "addpicturecolor");
		if (sCaptionColor == "Random") {
			var cR = Math.floor(Math.random() * 256); 
			var cG = Math.floor(Math.random() * 256); 
			var cB = Math.floor(Math.random() * 256);
			var dColor = cR + 256 * cG + 65536 * cB;
			sCaptionColor = VerifyHexColor("#" + dColor.toString(16));
		}
		else if (sCaptionColor == "White" || sCaptionColor == "#ffffff") {
			sCaptionColor = "#ffffff";
		}
		else if (sCaptionColor == "Black"|| sCaptionColor == "#000000") {
			sCaptionColor = "#000000";
		}
		else {
			sCaptionColor = thePaths.getSetting(currentFile, "overridecolor");
		};
		string = string + "'" + sCaptionColor + "', ";

		var c = "";
		var x = 0;
		if (thePaths.getSetting(currentFile, "picpansetting") == "Random") {
			x = RandomPan();
			c = "pan:" + x + "{";
			x = Math.floor(Math.random() * 100); 
			if (x > 49) {
				x = 0;
			}
			else {
				x = -1;
			}
			c = c + "dir:" + x + "{";
		}
		else {
			c = "pan:" + thePaths.getSetting(currentFile, "panmode") + "{";
			c = c + "dir:" + thePaths.getSetting(currentFile, "pandir") + "{";
		}


		if (thePaths.getSetting(currentFile, "addfontsetting") == "Random") {
			var nMin, nMax
			nMin = parseInt(thePaths.getSetting(currentFile, "fontmin"))
			nMax = parseInt(thePaths.getSetting(currentFile, "fontmax"))
			if (nMin > nMax) {
				x = nMin
				nMin = nMax
				nMax = x
			}
			x = Math.floor(Math.random() * (nMax - nMin + 1)) + nMin;
			c = c + "siz:" + x + "{"
		}
		else {
			c = c + "siz:" + thePaths.getSetting(currentFile, "addfontsize"); + "{"
		}

		if (thePaths.getSetting(currentFile, "addtransspeed") == "-1") {
			x = Math.floor(Math.random() * 5)
			c = c + "tsp:" + x + "{"
		}
		else {
			c = c + "tsp:" + thePaths.getSetting(currentFile, "addtransspeed") + "{"
		}
		c = c + "rot:0{"
		if (c == "") {c = "0";};

		sCaptionStyle = c
		sStretch = 0
		sDelay = "15s"
		string = string + "'" + c + "', '0', '15s');"
		if (bInsert == true) {
			MaxPic_PRIMARY_KEY++
			thePaths.feedPictureItem(sPath, sCount, "", sCaptionLocation, sFileName, sTransition, sCaptionColor, sCaptionStyle, sStretch, sDelay, MaxPic_PRIMARY_KEY)
		}
		else if (bInsert == "REPLACE") {
			thePaths.replacePictureItem(sPath, sCount, "", sCaptionLocation, sFileName, sTransition, sCaptionColor, sCaptionStyle, sStretch, sDelay, thePaths.getPictureInfo(sCount, "pkey"))			
		}
		//console.log(string)
		return string
	};