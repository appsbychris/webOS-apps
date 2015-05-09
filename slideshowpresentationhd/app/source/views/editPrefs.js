var STORAGE = {
	set: function(prop, setting) {
      try {
        localStorage.setItem(prop, setting);
      }
      catch (e) {
        console.log("Locale storage error");
      }

    },
    get: function(prop) {
      var x = localStorage.getItem(prop);
      if (x == "true") {x = true;}
      if (x == "false") {x = false;}
      return x;
    },
    del: function(prop) {
      localStorage.removeItem(prop);
    }
}

enyo.kind({
	kind: "Pane", 
	name:"editPrefs",
	className: "editWindowPane", 
	lazy: true, 
	published: {
		selectedRow: -1,
		thePaths: "",
		currentFile: "",
		projectNameList: [],
		fullProjects: [],
		projectSettings: {},
		bCancel: false

	},
	events: {
		onPrefChanged: "",
		onRequestDataInfo: "",
		onShutDown: "",
		onChangeExhib: "",
		onWritePref: "",
		onRequestHelpPop: ""
	},
	layoutKind: "VFlexLayout",
	components: [
		{kind: "VFlexBox", flex:1, components: [
			{kind: "HFlexBox", style: "height:80px", className: "editListSubItem", components: [
               	{kind: "MyCustomButton", defaultClassName:"backButton", clickClassName: "backButtonClicked", name:"backPrefs", onButtonClicked: "shutDown"},                            
               	{kind: "HFlexBox",flex:1, components: [
		            {name: "prefsHeaderContent", content: "Preferences"},
		            {flex: 1},
		            {kind: "HelpButton", helpID: "prefs", onHelpRequested: "doRequestHelpPop"}
	            ]}
            ]},
	        
	        {kind: "VFlexBox", flex:1,className:"editWindowPane", components:[
	            {kind: "VFlexBox",style: "font-size:90%;", className:"editWindowPane",flex:1, components:[ 
	                {kind: "HFlexBox", className:"editListSubItem",height: "100%", width: "100%",components:[
	                    {kind: "VFlexBox", components:[
	                		{content: "Exhibition Settings:", style: "font-weight:bold;font-size:120%;"},
	                        {content: "Use this project for exhibition:",style:"margin-top:5px;margin-left:10px;"}, 

	                		{kind: "DataSpinner", showing:false, name: "spin2", style: ""},
	                		{kind: "VFlexBox", name: "exhibProjectContainer", showing: false,components:[
	                        	{kind: "projectItem", name: "selectedProject", layoutKind: "VFlexLayout"}
	                        ]},
	                        {flex:1},
	                        //{name: "exhibCaption",style:"margin-bottom:10px;font-weight:bold;margin-top:5px;margin-left:10px;", content:"none"},
	                        {kind: "HFlexBox",style:"margin-top:5px;", components:[ 
	                            {kind: "MyCustomButton", name: "exhibPlayMusic", buttonType:"check", defaultClassName:"checkOffSmall",checkedClassName:"checkOnSmall", onButtonClicked: "writePref", preference: "explaymusic"},
	                            {content: "Play Music",style:"width:100px",className:"wordWrap"}
	                        ]}  
	                    ]},
	                    {kind: "VFlexBox",flex:1,components:[
	                    	{kind: "HFlexBox", components: [

								{kind: "DataSpinner", name: "spin", style: ""},
								{name: "statusMsg", showing: false}
							]},
		                    {kind: "VirtualList", name: "exhibitionFiles",width: "100%", height: "100%", onSetupRow: "loadExhibFiles", components:[
		                    	{kind: "Item",name:"fileItem",className: "editListItemList", tapHighlight: true,onclick: "exhibClick", layoutKind: "HFlexLayout", components: [
				                    {kind: "projectItem", name: "pItem", layoutKind: "HFlexLayout"}
				                ]}
		            	    ]} 
	            	    ]}
	                ]}        	      
	                
	           	]}
	        ]},
	        {kind: "VFlexBox", className:"editWindowPane",height: "275px", components:[ 
	            {kind: "VFlexBox", style: "font-size:90%;",flex:1, className:"editListSubItem", components: [
	                {content: "General Settings", style: "font-weight:bold;font-size:120%;"},
	                {kind: "HFlexBox", flex:1,components:[
	                    {kind: "VFlexBox", flex:1,components:[
	                        {kind: "HFlexBox", components:[                                          
	                            {kind: "MyCustomButton", name: "showNav", buttonType:"check", defaultClassName:"checkOffSmall",checkedClassName:"checkOnSmall", onButtonClicked: "prefChangedCheck", preference: "shownav"},
	                            {content: "Show Arrow Buttons",style:"margin-top:5px;"}
	                        ]},
	                        {kind: "HFlexBox",style:"margin-top:10px;", components:[ 
	                            {kind: "MyCustomButton", name: "autoHideAudio", buttonType:"check", defaultClassName:"checkOffSmall",checkedClassName:"checkOnSmall", onButtonClicked: "prefChangedCheck", preference: "autohideaudio"},
	                                {content: "Auto-hide Audio Popup",style:"margin-top:10px;"}
	                            ]},
	                        {kind: "HFlexBox",style:"margin-top:10px;", components:[ 
	                            {kind: "MyCustomButton", name: "hideMenuButton", buttonType:"check", defaultClassName:"checkOffSmall",checkedClassName:"checkOnSmall", onButtonClicked: "prefChangedCheck", preference: "hidemenubutton"},
	                            {content: "Hide \"Open Menu\" Button Unless Paused",style:"width:175px",className:"wordWrap"}
	                        ]}
	                    ]},
	                    {kind: "VFlexBox", flex:1,components:[
	                        {kind: "HFlexBox", components:[ 
								{kind: "MyCustomButton", name: "useSwipe", buttonType:"check", defaultClassName:"checkOffSmall",checkedClassName:"checkOnSmall", onButtonClicked: "prefChangedCheck", preference: "useswipe"},
								{content: "Enable Swipe to Change Picture",style:"width:175px",className:"wordWrap"}
							]},
							{kind: "HFlexBox",style:"margin-top:5px;", components:[ 
	                            {kind: "MyCustomButton", name: "autoStart", buttonType:"check", defaultClassName:"checkOffSmall",checkedClassName:"checkOnSmall", onButtonClicked: "prefChangedCheck", preference: "autostart"},
	                            {content: "Auto-start From Last Position",style:"width:175px",className:"wordWrap"}
	                        ]},
	                        {kind: "HFlexBox",style:"margin-top:5px;", components:[ 
	                            {kind: "MyCustomButton", name: "loadBlank", buttonType:"check", defaultClassName:"checkOffSmall",checkedClassName:"checkOnSmall", onButtonClicked: "writePref", preference: "loadblank"},
	                            {content: "Always Load Blank Project",style:"width:175px",className:"wordWrap"}
	                        ]}  
	                    ]}
	                ]},
	                {kind: "HFlexBox",style:"margin-top:5px;", components:[ 
                        {kind: "MyCustomButton", name: "timeoutShow", buttonType:"check", defaultClassName:"checkOffSmall",checkedClassName:"checkOnSmall", onButtonClicked: "prefChangedCheck", preference: "timeoutshow"},
                        {content: "Sleep at",style:"",className:"wordWrap"},
                        {kind: "TimePicker",style:"margin-left: 7px", name: "sleepTimePicker", label: "", 
							onChange:"prefChangedPicker", preference:"sleeptime"
						},
                        {content: ", Wake at",style:"",className:"wordWrap"},
						{kind: "TimePicker",style:"margin-left: 7px", name: "wakeTimePicker", label: "", 
							onChange:"prefChangedPicker", preference:"waketime"
						}
                    ]}   	      
	            ]}
	        ]}
        ]}
    ],
    startUp: function() {
    	this.$.showNav.setChecked(this.thePaths.getSetting(this.currentFile, "shownav"));
		this.$.autoHideAudio.setChecked(this.thePaths.getSetting(this.currentFile, "autohideaudio"));
		this.$.useSwipe.setChecked(this.thePaths.getSetting(this.currentFile, "useswipe"));
		this.$.autoStart.setChecked(this.thePaths.getSetting(this.currentFile, "autostart"));
		this.$.hideMenuButton.setChecked(this.thePaths.getSetting(this.currentFile, "hidemenubutton"));
		this.$.exhibPlayMusic.setChecked(this.projectSettings.ExPlayMusic);
		this.$.loadBlank.setChecked(this.projectSettings.LoadBlank);

		var sleep = STORAGE.get("timeoutshow");
		if (!sleep) {sleep = false;}
		this.$.timeoutShow.setChecked(sleep);
		var time = STORAGE.get("sleeptime");
		if (!time) {time = new Date();}
		this.$.sleepTimePicker.setValue(time);
		var wake = STORAGE.get("waketime");
		if (!wake) {wake = new Date();}
		this.$.wakeTimePicker.setValue(wake);

		this.bCancel = false
		//ExPlayMusic
		this.fullProjects = [];
		this.projectNameList = [];
		this.projectIndex = 0;
		this.projectNameList = this.thePaths.getListOfProjects();
		this.$.spin.showMe();
		this.$.spin2.showMe();
		this.$.exhibProjectContainer.setShowing(false);
		
		this.$.statusMsg.setShowing(true);
		this.generateAndRequestSql();
			/*for (var i = 0;i < this.fileNames.length;i++) {
				if (this.fileNames[i] == this.ExhibFile) {
					x = i
					break;
				}
			}
			window.setTimeout(enyo.bind(this,function(){
				this.scrollTo(x+2, 2)
			}),800)*/
    },
    shutDown: function() {
    	this.bCancel = true;
    	STORAGE.set("sleeptime", this.$.sleepTimePicker.getValue());
    	STORAGE.set("waketime", this.$.wakeTimePicker.getValue());
		this.doShutDown()
	},
	prefChangedCheck: function(iS, iE) {
		if (iS.preference == "timeoutshow") {
			STORAGE.set(iS.preference, iS.getChecked());
		}
		else {
			var obj = {}
			obj.preference = iS.preference
			obj.val = iS.getChecked()
			this.doPrefChanged(obj)
		}
	},
	prefChangedPicker: function(iS, iE) {
		var p = iS.preference;
		STORAGE.set(p, iS.getValue());
	},
	writePref: function(iS, iE) {
		var obj = {}
		obj.preference = iS.preference
		obj.val = iS.getChecked()
		this.doWritePref(obj)
	},
	exhibClick: function(iS, iE) {
		var x = iE.rowIndex;
		this.selectedRow = x
		var s = this.fullProjects[x].projectName;
		this.doChangeExhib(s);
		this.$.exhibitionFiles.refresh();
		this.$.selectedProject.feedInfo(this.fullProjects[x])
	},
	loadExhibFiles: function(inSender, inIndex) {
		if (inIndex >= 0) {
		    if (inIndex < this.fullProjects.length) {
		    	this.log()
		    	
		    	var isRowSelected = (inIndex == this.selectedRow);
		    	if (isRowSelected) {
		    		this.$.fileItem.addClass("editListItemSelected")
		    	}
		    	else {
		    		this.$.fileItem.removeClass("editListItemSelected")
		    	}
		    	this.$.pItem.feedInfo(this.fullProjects[inIndex])

		    	//this.$.fileHandlerItemContent.applyStyle("background", isRowSelected ? "#9BA6B1" : null);
		    	//this.$.fileHandlerItemContent.setContent(this.fileNames[inIndex]);
		    	return true;
		    }
		}
	},
	loadCurrentExhib: function() {
		//if (this.fullProjects.length > 0) {
			for (var i = 0; i < this.fullProjects.length; i++) {
				if (this.fullProjects[i].projectName == this.projectSettings.ExhibFile) {
					this.$.selectedProject.feedInfo(this.fullProjects[i])
					this.selectedRow = i;
					this.$.spin2.hideMe();
					this.$.exhibProjectContainer.setShowing(true);
					return;
					break;
				}
			};
			//If there wasn't a selected file...
			this.$.selectedProject.feedInfo(this.fullProjects[0])
			this.$.spin2.hideMe();
			this.$.exhibProjectContainer.setShowing(true);
			this.doChangeExhib(this.fullProjects[0].projectName);
		/*}
		else {

		}*/
	
	},
	projectIndex: 0,
	generateAndRequestSql: function() {
		this.log("generating sql")
		if (this.bCancel === true) {return;};
		var sql = []
		this.$.statusMsg.setContent("Loading projects " + (this.projectIndex + 1) + " of " + (this.projectNameList.length) + "...")
		if (this.thePaths.getSetting(this.projectNameList[this.projectIndex], "projectpreviewcheck") == true) {
			this.log("TRUE")
			this.fullProjects.push(this.thePaths.getSetting(this.projectNameList[this.projectIndex], "projectpreview"))
			this.projectIndex++
			if (this.projectIndex < this.projectNameList.length) {
				this.generateAndRequestSql()
			}
			else {
				//got all data
				
				this.$.spin.hideMe();
				this.$.statusMsg.setShowing(false);
				this.log(enyo.json.stringify(this.fullProjects))
				this.loadCurrentExhib();
				this.$.exhibitionFiles.refresh()
			}
		}
		else {
			sql.push("SELECT max(picorder) FROM picPathsTable WHERE filename = '" + this.projectNameList[this.projectIndex] + "';")
			sql.push("SELECT picpath, picorder FROM picPathsTable WHERE filename = '" + this.projectNameList[this.projectIndex] + "' AND picorder = '0';")
			sql.push("SELECT picpath, picorder FROM picPathsTable WHERE filename = '" + this.projectNameList[this.projectIndex] + "' AND picorder = '1';")
			sql.push("SELECT picpath, picorder FROM picPathsTable WHERE filename = '" + this.projectNameList[this.projectIndex] + "' AND picorder = '2';")
			sql.push("SELECT max(audorder) FROM audPathsTable WHERE filename = '" + this.projectNameList[this.projectIndex] + "';")
			this.doRequestDataInfo(sql)
		};

		
	},
	giveSqlResults: function(data) {
		if (this.bCancel === true) {return;};
		var obj = function() {
			return {photos: [
				        {src: ""},
				        {src: ""},
				        {src: ""}
				    ],
				    picCount: 0,
				    audCount: 0,
				    projectName: ""
				}
		};
		this.log(data.length)
		var tmp = new obj()
		tmp.projectName = this.projectNameList[this.projectIndex]
			this.log("====>>" + data[0].rows.length)
			if (data[0].rows.length > 0) {
				tmp.picCount = parseInt(data[0].rows.item(0)["max(picorder)"]) || 0;
			};
			if (data[4].rows.length > 0) {
				tmp.audCount = parseInt(data[4].rows.item(0)["max(audorder)"]) || 0;
			};
			if (tmp.picCount > 0) {tmp.picCount++}
			if (tmp.audCount > 0) {tmp.audCount++}
			for (var i = 1; i < 4; i++) {
				try {
					var x = parseInt(data[i].rows.item(0)["picorder"])
				}
				catch (e) {
					break;
				}
				
				if (x == 0 || x == 1 || x == 2) {
					tmp.photos[x].src = data[i].rows.item(0)["picpath"];
					
					
				}
			};

		this.fullProjects.push(tmp)
		this.thePaths.setSetting(this.projectNameList[this.projectIndex], "projectpreviewcheck", true)
		this.thePaths.setSetting(this.projectNameList[this.projectIndex], "projectpreview", tmp)
		this.projectIndex++
		if (this.projectIndex < this.projectNameList.length) {
			this.$.exhibitionFiles.refresh()
			enyo.nextTick(this,this.generateAndRequestSql)
		}
		else {
			//got all data
			this.$.spin.hideMe();
			this.$.statusMsg.setShowing(false);
			this.log(enyo.json.stringify(this.fullProjects))
			this.loadCurrentExhib();
			this.$.exhibitionFiles.refresh()
		}


		
	},
});

enyo.kind({
	name: "PictureAddSettings", 
	kind:"Toaster",
	flyInFrom: "top",
	//className:"stdBackground", 
	style: "width:500px;height:500px;",
	//flex:1,
	published: {
		thePaths: "",
		currentFile: ""
	},
	events: {
		//onFilePicker: "",
		//onEditView: ""
		//onNewFontColor: ""
		onPrefChanged: "",
		onDataToSave: "",
		onRequestScrim: "",
		onScrimChanged: "",
		onRequestHelpPop: ""
	},
	components: [
		{kind: "VFlexBox", style: "font-size:90%;", className:"editListItem", components: [
           	{kind: "HFlexBox",  components: [
	           	{content: "Picture Add Settings", style: "font-weight:bold;font-size:120%", flex: 1},
	           	{kind: "Button", className: "enyo-button-affirmative",caption: "Apply to current project", onclick: "reApplySettings"}
	        ]},
	        {kind: "HFlexBox",  components: [
	        	{kind: "HelpButton", helpID: "addsettings", onHelpRequested: "doRequestHelpPop"},
           		{content:"These settings are used each time you add pictures.", style:""}
           	]},
           	{kind:"VFlexBox", components:[
               	{kind: "HFlexBox",className:"editListSubItem",  components: [
	                {content: "Caption Color:"},
	                {flex:1},
        	        {kind: "Picker", name: "addPictureColor", value: "Random", items: ["Random", "Use the Global Over-ride color", "White", "Black"], onChange:"prefChanged", preference:"addpicturecolor"},
        	    ]},
    	        {kind: "HFlexBox",className:"editListSubItem", components: [
        	        {content: "Caption Location:"},
        	        {flex:1},
		        	{kind: "Picker", name: "captionLocation", value: "Random", items: ["Random", "Top", "Bottom"], onChange:"prefChanged", preference:"captionlocation"},
		        ]},
		        {kind: "HFlexBox",className:"editListSubItem",  components: [
	    	        {content: "Font Size:"},
	    	        {flex: 1},
                    {kind: "Picker", name: "addFontSetting", value: "Use just one:", items: ["Random", "Use just one:"], onChange:"prefChanged", preference:"addfontsetting"},                                        
	        	        {kind: "IntegerPicker", name: "addFont",showing:false, value: 32, min:8,max:72,label:"", onChange:"prefChanged", preference:"addfontsize"},
	        	        {name: "labeladd1",showing: false, content: "pt", style:"padding-top:10px;margin-right:10px;"},
        	            {kind: "RangePicker",name:"rangePicker", onMinChanged:"prefMin", onMaxChanged:"prefMax", showing: false}
	        	    ]}
        	    ]},
        	    {kind: "HFlexBox",className:"editListSubItem", components: [
                    {content: "Transition To Use:"},
                    {flex:1},
                    {kind: "SuperPickerBase", useRandom: true, name: "addTPicker", onChange: "prefAddTrans", style: ""},
                ]},
        	    {kind: "HFlexBox",className:"editListSubItem", components: [
    	        	{content:  "Cinematic Mode:"},
    	        	{flex:1},
    	        	{kind: "PanAndZoomSuperPickerBase",useRandom: true, name: "addPanPicker", onChange: "prefAddPan"}
                   /* {kind: "Picker", name: "picPanSetting", style: "max-width:100px;overflow:hidden;max-height:40px;",value: "Use just one:", items: ["Random", "Use just one:"], onChange:"prefChanged", preference:"picpansetting"},                                     
        	        {kind: "PanAndZoomPicker",style:"max-width:130px;overflow:scroll;max-height:40px;margin-right: 5px;",value:"-1", showing:false, name: "panAddPicker", onChange:"prefChanged", preference: "panmode"},
        	        {kind: "RadioGroup", showing:false, value: "0",style: "margin-right: 10px;",onclick: "prefChanged", preference: "pandir", name: "panAddLocation", components: [
						{name: "dir1", caption: "", icon: "images/left.png", value: "-1", flex:1},
						{name: "dir2", caption: "", icon: "images/right.png", value: "0", flex:1}
					]}*/
    	    	]},
        	    {kind: "HFlexBox", components:[
        	    	
        	    	{kind: "Button", caption: "Done", flex: 1, onclick: "shutDown", className: "enyo-button-affirmative"}
        	    ]}
       	]},
       	{kind: "ModalDialog", name: "addConfirm",className:"msgBox",contentClassName:"msgBoxIn", lazy: false, components: [
			      {name: "addConfirmContent", className: "msgBoxContent", content:"This will re-apply all picture settings to this project.<br />This <b>CAN NOT</b> be undone. Proceed?", allowHtml: true},                                                                            
               {layoutKind: "HFlexLayout", components: [
                  {kind: "Button", caption: "Cancel",className: "msgBoxCancelAdd", onclick: "cancelAdd"},
                  {kind: "Button", caption: "Proceed", className: "enyo-button-affirmative msgBoxDeleteAdd", onclick: "reDoAdd"}
               ]}
        ]},
        //{kind: "scrimSpinner", name: "spin", showing:false}
	],
	prefChanged: function(iS, iE) {
		var pref = iS.preference
		var val = iS.getValue()
		var obj = {}
		obj.preference = pref
		obj.val = val
		this.doPrefChanged(obj)
		/*if (pref == "picpansetting") {
			if (val == "Use just one:") {
				this.$.panAddPicker.show();
				setPanPicker(this.$.panAddPicker, this.$.panAddLocation, this.$.dir1, this.$.dir2)
			}
			else {
				this.$.panAddPicker.hide();
				this.$.panAddLocation.hide();
			}
		}
		else if (pref == "panmode") {
			setPanPicker(this.$.panAddPicker, this.$.panAddLocation, this.$.dir1, this.$.dir2)
		}
		else */if (pref == "addfontsetting") {
			if (val == "Use just one:") {
				this.$.addFont.show();
				this.$.labeladd1.show();
				this.$.rangePicker.hide();
			}
			else {
				this.$.addFont.hide();
				this.$.labeladd1.hide();
				this.$.rangePicker.show();
			}
		}

	},
	prefAddPan: function() {
		var obj = this.$.addPanPicker.getSettings()
		var s = {}
		var t = {}
		var x = {}
		if (obj.value == "Random") {
			s = {
				preference: "picpansetting",
				val: obj.value
			}
		} 
		else {
			s = {
				preference: "picpansetting",
				val: "Use just one:"
			}
			
		};
		x = {
			preference: "pandir",
			val: obj.dir
		}
		t = {
			preference: "panmode",
			val: obj.value	
		}
		this.doPrefChanged(s)
		this.doPrefChanged(t)
		this.doPrefChanged(x)
	},
	loadSettings: function() {
		var t = {
			value: this.thePaths.getSetting(this.currentFile, "pictrans"),
	        speed: this.thePaths.getSetting(this.currentFile, "addtransspeed"),
	        firstSrc: "",
	        secondSrc: ""
		};
		this.$.addTPicker.setSettings(t)
		var x = {}
		// this.$.picPanSetting.setValue(this.thePaths.getSetting(this.currentFile, "picpansetting"));
		this.log("=================PanAndZoom>>>" + this.thePaths.getSetting(this.currentFile, "panmode"))
		x.value = this.thePaths.getSetting(this.currentFile, "panmode");
		x.dir = parseInt(this.thePaths.getSetting(this.currentFile, "pandir"));
		x.firstSrc = ""
		x.secondSrc = ""
		this.$.addPanPicker.setSettings(x)
		/*if (this.$.picPanSetting.getValue() == "Use just one:") {
			this.$.panAddPicker.show();
			setPanPicker(this.$.panAddPicker, this.$.panAddLocation, this.$.dir1, this.$.dir2);
			if (parseInt(this.$.panAddPicker.getValue()) > -1) {
				this.$.panAddLocation.show()
			}
		}
		else {
			this.$.panAddPicker.hide();
			this.$.panAddLocation.hide();
		} */
		this.$.addFontSetting.setValue(this.thePaths.getSetting(this.currentFile, "addfontsetting"));
		if (this.$.addFontSetting.getValue() == "Use just one:") {
			this.$.addFont.show();
			this.$.labeladd1.show();
			this.$.rangePicker.hide();
		}
		else {
			this.$.addFont.hide();
			this.$.labeladd1.hide();
			this.$.rangePicker.show();
		}
		this.$.addFont.setValue(this.thePaths.getSetting(this.currentFile, "addfontsize"));
		this.$.rangePicker.setMinVal(parseInt(this.thePaths.getSetting(this.currentFile, "fontmin")));
		this.$.rangePicker.setMaxVal(parseInt(this.thePaths.getSetting(this.currentFile, "fontmax")));
		
		var apc = this.thePaths.getSetting(this.currentFile, "addpicturecolor")
		if (apc == "#ffffff") {apc = "White"}
		if (apc == "#000000") {apc = "Black"}
		this.$.addPictureColor.setValue(apc);
		
		this.$.captionLocation.setValue(this.thePaths.getSetting(this.currentFile, "captionlocation"));


	},
	prefAddTrans: function() {
		var obj = this.$.addTPicker.getSettings()
		var s = {}
		var t = {}
		var x = {}
		if (obj.value == "Random") {
			s = {
				preference: "pictranssetting",
				val: obj.value
			}
		} 
		else {
			s = {
				preference: "pictranssetting",
				val: "Use just one:"
			}
			
		};
		x = {
			preference: "addtransspeed",
			val: obj.speed
		}
		t = {
			preference: "pictrans",
			val: obj.value	
		}
		this.doPrefChanged(s)
		this.doPrefChanged(t)
		this.doPrefChanged(x)
	},
	shutDown: function() {
		this.close()
	},
	reApplySettings: function () {
		this.$.addConfirm.openAtCenter();
	},
	cancelAdd: function() {
		this.$.addConfirm.close();
	},
		
	reDoAdd: function() {
		this.$.addConfirm.close();
		/*this.$.spin.start("Re-applying add settings...")
		this.$.spin.setProgMax(this.thePaths.getPictureCount() -1)
		this.$.spin.setProgPos(0);*/
		this.doRequestScrim(true)
		this.doScrimChanged({pos: 0, max: this.thePaths.getPictureCount() -1, msg: "Re-applying add settings..."})
		var sql = []
		enyo.nextTick(this,this.reDoAddSettings,0, sql)
	},
	reDoAddSettings: function(i, sql) {

		

		if (i < this.thePaths.getPictureCount()) {
			for (var k = 0; k < 35; k++) {
				if (i >= this.thePaths.getPictureCount()) {
					break;
				}
				var s = BuildPictureString(this.thePaths.getPictureInfo(i,"path"), i, "REPLACE", this.thePaths, this.currentFile)
				//"INSERT INTO picPathsTable (" + this.picColumnsShort + ") VALUES (\"" + sPath + "\", \"\", \""
				var t = s.indexOf("(",s.indexOf(")"))
				var y = s.indexOf(")", t)
				var cols = PicColumnsShort.split(", ")
				var v = s.substr(t+1,y - t - 1)
				var vals = v.split(", ")
				s = "UPDATE picPathsTable SET "
				for (var j = 0; j < cols.length; j++) {
					////////////
					if (cols[j] != "picpath" && 
						cols[j] != "filename" && 
						cols[j] != "piccaption" && 
						cols[j] != "stretch" && 
						cols[j] != "delay" && 
						cols[j] != "picorder"
					   ) 
						{
							
							s = s +  cols[j] + " = " + vals[j] + ", "
					}
					//////////////////////////
				}
				s = s.substr(0,s.length - 2)
				//this.log(i)
				//this.log("************=======================>>" + this.thePaths.getPictureInfo(5, "pkey"))
				s = s + " WHERE pkey = " + this.thePaths.getPictureInfo(i, "pkey") + ";";
				sql.push(s)  
				this.log(s)
				this.doScrimChanged({pos: i, max: this.thePaths.getPictureCount() -1, msg: "Editing File...(" + i + " of " + this.thePaths.getPictureCount() + ") " + this.thePaths.getPictureInfo(i, "path")})
				/*this.$.spin.setStatusMsg("Editing File...(" + i + " of " + this.thePaths.getPictureCount() + ") " + this.thePaths.getPictureInfo(i, "path"));
				this.$.spin.setProgPos(i);  	*/
				i++		
			};
			enyo.nextTick(this,this.reDoAddSettings, i, sql);
		}
		else {
			this.doDataToSave(sql);
			//this.$.spin.stop()
			this.doRequestScrim(false);
			enyo.windows.addBannerMessage("Settings Applied!", "{}");
			this.close();
		}
	},
})