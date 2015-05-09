

enyo.kind({
	name: "mainView", 
	kind:"Pane",
	className:"editListSubItem", 
	published: {
		thePaths: "",
		currentFile: ""
	},
	events: {
		onFilePicker: "",
		onEditView: "",
		onPrefChanged: "",
		onRequestExif: "",
		onDataToSave: "",
		onRequestScrim: "",
		onScrimChanged: "",
		onRequestStartShow: "",
		onRequestStartMenu: "",
		onRequestHelpPop: ""
	},
	components: [
		
		{kind: "VFlexBox", components:[
			{kind: "HFlexBox",flex:1, components:[
				{kind: "VFlexBox", flex:1, components:[
					{kind: "RunSettings", name: "runSettings", onPrefChanged: "doPrefChanged", onRequestExif: "doRequestExif", onRequestHelpPop: "doRequestHelpPop"}
				]},
				{kind: "VFlexBox", width: "350px", components:[
					{kind: "Scroller", flex: 1,className:"editListItem", horizontal: false, autoHorizontal:false, components: [
						{kind: "VFlexBox",components:[
							{kind: "HFlexBox", style: "", components:[
								{kind: "projectItem", name: "currentProject", layoutKind: "VFlexLayout"},
								{kind: "HelpButton", helpID: "gettingstarted", onHelpRequested: "doRequestHelpPop", style:"position: relative;left:-43px;"}
							]},
							{kind: "HFlexBox", className: "editListSubItem",components: [
								{kind: "VFlexBox",flex:1, components: [
									{kind: "MyCustomButton",name: "addPictureSettings", defaultClassName: "pictureAddSettingsButton", clickClassName: "pictureAddSettingsButtonClicked",  onButtonClicked:"openPictureAdd"},
									{content: "Picture Add Settings", className: "buttonCaptionSettings"}								
								]},
								{kind: "VFlexBox", components: [
									{kind: "MyCustomButton", defaultClassName:"addFolderButton", name:"addFolderButton",clickClassName: "addFolderButtonClicked", onButtonClicked: "changeView", viewName: "bulk"},
									{content: "Add By Folder", className: "buttonCaptionSettings"}								
								]}
							]},
							{kind: "VFlexBox", className: "editListSubItem",components: [
								{kind:"HFlexBox", components:[        
									{kind: "VFlexBox",flex:1, components: [                                                                      
								    	{kind: "MyCustomButton",name: "addPicture", defaultClassName: "addPictureButton", clickClassName: "addPictureButtonClicked",  onButtonClicked:"showPictureChoice"},
								    	{content: "Choose Photos", className: "buttonCaptionSettings"}	
								    ]},		
								    {kind: "VFlexBox", components: [     
		                            	{kind: "MyCustomButton", defaultClassName:"editPictureButton", name:"editPicture", clickClassName: "editPictureButtonClicked", disabledClassName: "editPictureButtonDisabled", onButtonClicked: "changeView", viewName: "picEdit"},
		                            	{content: "Edit Pictures", className: "buttonCaptionSettings"}	
								    ]}
								]},
								{kind:"HFlexBox", components:[
									{kind: "VFlexBox",flex:1, components: [					
								    	{kind: "MyCustomButton", defaultClassName:"addAudioButton", name:"addAudio",clickClassName: "addAudioButtonClicked",  onButtonClicked: "showAudioChoice"},
								    	{content: "Choose Music", className: "buttonCaptionSettings"}	
		                            ]},
		                            {kind: "VFlexBox", components: [ 
		                            	{kind: "MyCustomButton", defaultClassName:"editAudioButton", name:"editAudio",clickClassName: "editAudioButtonClicked", disabledClassName: "editAudioButtonDisabled", onButtonClicked: "changeView", viewName: "audEdit"},
		                            	{content: "Edit Music", className: "buttonCaptionSettings"}
		                            ]}
								]}
							]},
							{flex:1},
							{kind: "HFlexBox", components:[
								{kind: "VFlexBox", components:[
									{flex:1},
									{kind: "HelpButton", helpID: "running", onHelpRequested: "doRequestHelpPop"},
								]},
								{flex:1},
								{kind: "MyCustomButton", defaultClassName:"startButton",style:"margin-left:10px;", name:"startButton", canTapAndHold: true,onTapAndHold:"doRequestStartMenu", clickClassName: "startButtonClicked", disabledClassName: "startButtonDisabled",  onButtonClicked: "doRequestStartShow"}
							]}
							//{kind: "PanAndZoomSuperPickerBase"}
						]}	
					]}
				]}
			]},
			{name:"imageFilePicker", kind: "FilePicker", fileType:["image"], allowMultiSelect:true, onPickFile: "filePicked"},
			{name:"audioFilePicker", kind: "FilePicker", fileType:["audio"], allowMultiSelect:true, onPickFile: "filePicked"}
		]},
		{kind: "PictureAddSettings",className: "addSettingsPopupPosition", name: "picAddSettings",onRequestHelpPop: "doRequestHelpPop", onPrefChanged: "doPrefChanged", onDataToSave: "doDataToSave", onRequestScrim: "doRequestScrim", onScrimChanged: "doScrimChanged"}
	],
	changeView: function(iS, iE) {
		var s = {}
		s.sender = iS.viewName
		this.doEditView(s)
	},
	openPictureAdd: function() {
		this.$.picAddSettings.open()

		this.$.picAddSettings.setThePaths(this.thePaths)
		this.$.picAddSettings.setCurrentFile(this.currentFile)
		this.$.picAddSettings.loadSettings();
	},
	filePicked: function(iS, iE) {
		if (iE.length > 0) {
			iE[0].sender = iS.name
			this.doFilePicker(iE)
		}
	},
	loadSettings: function() {
		this.$.runSettings.setThePaths(this.thePaths);
		this.$.runSettings.setCurrentFile(this.currentFile);
		this.$.runSettings.loadSettings();
		this.updatePreview();
		this.checkButtons();
	},
	updatePreview: function() {
		this.thePaths.orderArray("pictures");
		var tmp = {photos: [
				        {src: this.thePaths.getPictureInfo(0, "path")},
				        {src: this.thePaths.getPictureInfo(1, "path")},
				        {src: this.thePaths.getPictureInfo(2, "path")}
				    ],
				    picCount: this.thePaths.getPictureCount(),
				    audCount: this.thePaths.getAudioCount(),
				    projectName: this.currentFile
				}
		this.$.currentProject.feedInfo(tmp)
	},
	checkButtons: function() {
		if (this.thePaths.getPictureCount() < 2) {
			this.$.startButton.setButtonEnabled(false);
		}
		else {
			this.$.startButton.setButtonEnabled(true);
		}
		if (this.thePaths.getPictureCount() > 0) {
			this.$.editPicture.setButtonEnabled(true);
		}
		else {
			this.$.editPicture.setButtonEnabled(false);
		};
		if (this.thePaths.getAudioCount() > 0) {
			this.$.editAudio.setButtonEnabled(true);
		}
		else {
			this.$.editAudio.setButtonEnabled(false);
		};
	},
	showPictureChoice: function(inSender, inEvent) {
		this.$.imageFilePicker.pickFile();
	},
	showAudioChoice: function(inSender, inEvent) {
		this.$.audioFilePicker.pickFile();
	},
});

enyo.kind({
	name: "RunSettings", 
	kind:"VFlexBox",
	className:"stdBackground", 
	style: "width:100%;height:100%;background: transparent;",
	flex:1,
	published: {
		thePaths: "",
		currentFile: "",
		runMode: ""
	},
	events: {
		//onFilePicker: "",
		//onEditView: ""
		onDataToSave: "",
		onPrefChanged: "",
		onRequestExif:"",
		onRequestStopShow: "",
		onRequestHelpPop: ""
	},
	components: [
		{kind: "GlobalCaptionPopup", name: "globalCaptionPop", onNewCaption: "prefGlobalCaption"},
		{kind: "GlobalFontSizePopup", name: "globalFontSizePop", onNewFontSize: "prefFontSize"},
		{kind: "ColorSelector", className: "fontColorPosition", name: "colorSelector", onNewFontColor: "prefFontColor"},
		{kind: "VFlexBox",flex:1, className:"editListItem", components: [        
			{kind: "Scroller", flex:1, components:[
				{kind: "HFlexBox", className: "editListSubItem", components:[
					{content: "Show Settings:", style: "font-weight:bold;font-size:110%;", flex: 1}, 
					{kind: "VFlexBox", components: [
						{kind: "HFlexBox", components:[
							{flex:1},
							{kind: "HelpButton", helpID: "showsettings", onHelpRequested: "doRequestHelpPop"}
						]},
						
						{kind: "MyCustomButton", showing: false, defaultClassName:"stopButton", name:"stopButton", clickClassName: "stopButtonClicked", onButtonClicked: "doRequestStopShow"}
					]}
					
				]},
				
				/*
				*
				* Drawer / Radio select name pattern
				* drawers need to end in "Drawer"
				* radio's need to end in "Picker"
				* the first word needs to be the same, (picDrawer, picPicker)
				* checkedClassNames need to have same name as the .png file
				*/
				{kind: "DividerDrawer",name: "picDrawer", preference: "picturedrawer",onOpenChanged: "prefChangedDrawer", className: "editListSubItem"/*, style: "min-height:156px;"*/, caption: "Pictures:", components:[   
				    //{content: "Pictures:", style: "font-weight:bold;font-size:90%;"}, 

				    {kind: "VFlexBox", style: "min-height:120px;", components:[
					    {kind: "CustomRadioSelect", style: "height:156px;", name: "picPicker", onClicked: "prefChangedPicker", preference: "picpick", defaultVal: "Picture Random", items:[
					    	{defaultClassName: "pictureRandomOff",
					    	 checkedClassName: "pictureRandomOn",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: "Picture Random",
							 caption: "Picture<br />Random"
							},
							{defaultClassName: "pictureOrderOff",
					    	 checkedClassName: "pictureOrderOn",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: "Picture In Index Order",
							 caption: "Picture<br />In Order"
							},
							{defaultClassName: "pictureOrderFileNameOff",
					    	 checkedClassName: "pictureOrderFileNameOn",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: "Picture Ordered By Filename",
							 caption: "Picture<br />Ordered By<br />Filename"
							},
							{defaultClassName: "pictureOrderPathOff",
					    	 checkedClassName: "pictureOrderPathOn",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: "Picture Ordered By Path",
							 caption: "Picture<br />Ordered By<br />Path"
							},
							{defaultClassName: "pictureOrderBothOff",
					    	 checkedClassName: "pictureOrderBothOn",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: "Picture Ordered By Path With Filename",
							 caption: "Picture<br />Ordered By<br />Full Path"
							},
						]}
					]}
				]},
				{kind: "DividerDrawer",name: "audDrawer", preference: "audiodrawer", onOpenChanged: "prefChangedDrawer", className: "editListSubItem"/*, style: "min-height:126px;"*/,caption: "Music:", components:[        
					/*{kind: "Picker", name: "audPicker",style:"margin-right:5px;", value: "Audio Random", 
				    	items: ["Audio Random", "Audio In Index Order" , "No Audio"], 
				    	onChange:"prefChangedPicker", preference:"audpick"
				    },*/
				    //{content: "Music:", style: "font-weight:bold;font-size:90%;"}, 
				    {kind: "VFlexBox", style: "min-height:100px;", components:[
					    {kind: "CustomRadioSelect", style: "height:126px;", name: "audPicker", onClicked: "prefChangedPicker", preference: "audpick", defaultVal: "Audio Random", items:[
					    	{defaultClassName: "audioRandomOff",
					    	 checkedClassName: "audioRandomOn",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: "Audio Random",
							 caption: "Music Random"
							},
							{defaultClassName: "audioOrderOff",
					    	 checkedClassName: "audioOrderOn",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: "Audio In Index Order",
							 caption: "Music In Order"
							},
							{defaultClassName: "noAudioOff",
					    	 checkedClassName: "noAudioOn",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: "No Audio",
							 caption: "No Music"
							}
					    ]}
				    ]}
				]},
					/*{kind: "Picker", name: "picPicker", value: "Picture Random", 
						items: ["Picture Random","Picture In Index Order", "Picture Ordered By Filename", "Picture Ordered By Path", "Picture Ordered By Path With Filename"], 
						onChange:"prefChangedPicker", preference:"picpick", style:"margin-right:5px;"
					},*/
				{kind: "DividerDrawer",name: "changeDrawer", preference: "changedrawer", onOpenChanged: "prefChangedDrawer", className: "editListSubItem"/*, style: "min-height:126px;"*/,caption: "Picture Switch", components:[        
					{kind: "VFlexBox", style: "min-height:140px;",components:[
						{kind: "CustomRadioSelect", style: "height:105px;", name: "changePicker", onClicked: "prefChangedPicker", preference: "change", defaultVal: "Duration:", items:[
					    	{defaultClassName: "changeDurationOff",
					    	 checkedClassName: "changeDurationOn",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: "Duration:",
							 caption: "Duration"
							},
							{defaultClassName: "changeSongChangeOff",
					    	 checkedClassName: "changeSongChangeOn",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: "Song Change",
							 caption: "Song Change"
							},
							{defaultClassName: "changeManualOff",
					    	 checkedClassName: "changeManualOn",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: "Manual",
							 caption: "Manual"
							},
							{defaultClassName: "changeCustomDurationOff",
					    	 checkedClassName: "changeCustomDurationOn",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: "Custom Duration",
							 caption: "Custom<br />Duration"
							}

						]},
						//{name: "durheader", content: "Change Picture on:", style:""},
						{kind: "HFlexBox", style: "position: relative;top:40px;", components: [
							/*{kind: "Picker", name: "changePicker", value: "Manual", 
								items: ["Duration:", "Song Change", "Manual", "Custom Duration"], onChange:"prefChangedPicker", preference:"change"
							},*/
							{kind: "IntegerPicker", name: "durPicker", label: "", min: 5, max: 60,value:15, onChange: "prefChangedPicker", preference:"duration"},
							{kind: "Picker",style:"margin-left: 7px", name: "scalePicker", value: "seconds", 
								items: ["seconds", "minutes"], onChange:"prefChangedPicker", preference:"scale"
							}
						]}
					]}
				]},
				{kind: "DividerDrawer",name: "repeatDrawer", preference: "repeatdrawer", onOpenChanged: "prefChangedDrawer", className: "editListSubItem"/*, style: "min-height:126px;"*/,caption: "Show Duration", components:[        
					{kind: "VFlexBox", style: "min-height:100px;",components:[
						{kind: "CustomRadioSelect", style: "height:75px;", name: "repeatPicker", onClicked: "prefChangedPicker", preference: "repeat", defaultVal: "Repeat", items:[
					    	{defaultClassName: "repeatRepeatOff",
					    	 checkedClassName: "repeatRepeatOn",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: "Repeat",
							 caption: "Repeat"
							},
							{defaultClassName: "repeatPlayOnceOff",
					    	 checkedClassName: "repeatPlayOnceOn",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: "Play Once",
							 caption: "Play Once"
							},
							{defaultClassName: "repeatEndWithMusicOff",
					    	 checkedClassName: "repeatEndWithMusicOn",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: "End With Music",
							 caption: "End With<br />Music"
							}
						]}
					]}
				]},
				/*{kind: "HFlexBox", className:"editListSubItem", components: [
					{content: "Show Duration:"},
					{flex: 1},
	 				{kind: "Picker", name: "repeatPicker", value: "Repeat", 
						items: ["Repeat", "Play Once", "End With Music"], 
						onChange:"prefChangedPicker", preference:"repeat"
					}
	 			]},*/
	 			{kind: "DividerDrawer",name: "miscDrawer", preference: "miscdrawer", onOpenChanged: "prefChangedDrawer", className: "editListSubItem"/*, style: "min-height:126px;"*/,caption: "Misc. Options", components:[        
		 			{kind: "HFlexBox", components:[
		 				{layoutKind: "HFlexLayout",align:"center",flex:1, components:[
		                    {kind: "MyCustomButton", name: "fullScreen",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "prefChangedCheck", preference: "fullscreen"},
		                    {content: "Full Screen", style:"font-size:80%;font-weight:bold;"}
		 				]},
		 				{layoutKind: "HFlexLayout",align:"center",flex:1, components:[
		 					{kind: "MyCustomButton", name: "cinematicMode", buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "prefChangedCheck", preference: "cinematic"},
		 					{content: "Cinematics", style:"font-size:80%;font-weight:bold;"}
		 				]}
		 			]}
		 		]},
		 		{kind: "DividerDrawer",name: "captionDrawer", preference: "captiondrawer", onOpenChanged: "prefChangedDrawer", className: "editListSubItem"/*, style: "min-height:126px;"*/,caption: "Caption Options", components:[        
					{kind: "VFlexBox", components: [
						//{content: "Caption Options:", style: "font-weight:bold;font-size:110%;"},
						{layoutKind: "HFlexLayout",style:"", components:[

		    				{layoutKind: "HFlexLayout",align:"center",flex:1, components:[
		    					{kind: "MyCustomButton", name: "showDate",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "prefChangedCheck", preference: "dateshow"},
		    					{content: "Date/Time", style:"font-size:80%;font-weight:bold;"}
		    				]},
		    				{layoutKind: "HFlexLayout",align:"center",flex:1, components:[
		                        {kind: "MyCustomButton", name: "showSong", buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "prefChangedCheck", preference: "songshow"},
		                        {content: "Song Title", style:"font-size:80%;font-weight:bold;"}
		    				]}
		    			]},
			    		{layoutKind: "HFlexLayout",style:"", components:[
			       			{layoutKind: "HFlexLayout",align:"center",flex:1, components:[
			                    {kind: "MyCustomButton", name: "useGlobalCaption", buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "prefChangedCheck", preference: "useglobalcaption"},
			                    //{content: "Global Caption", style:"font-size:80%;font-weight:bold;position:relative;left:-5px;"},
			                    {kind: "Button",allowHtml: true, className: "enyo-button-affirmative", caption: "Global<br />Caption", onclick: "openGlobalCaptionPop", style:"font-size:80%;font-weight:bold;"}
			       			]},
			       			{layoutKind: "HFlexLayout",align:"center",flex:1, components:[
			       				
			       				
				       				{layoutKind: "HFlexLayout",align:"center",flex:1, components:[
					                    {kind: "MyCustomButton", name: "showExif", buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "prefChangedCheck", preference: "showexif"},
					                    //{content: "EXIF Info", style:"font-size:80%;font-weight:bold;margin-right:8px;"},
					                    {kind: "Button", className: "enyo-button-affirmative",caption:"EXIF Info", onclick:"doRequestExif", style:"font-size:80%;font-weight:bold;"}
					     			]}
				       				//{content: "File Info", style:"position:relative;left:-10px;top:5px;font-size:80%;font-weight:bold;"},
				       				
					       			/*{kind: "Picker", name: "showFileInfoPicker",style: "position:relative;left:-10px;width:90px;height:35px;font-size:80%;",value: "File Name", 
										items: ["File Name", "Path", "Both"], 
										onChange:"prefChangedPicker", preference:"showfileinfopicker"
									}*/
								
			       			]}
			       		]},
			       		{layoutKind: "HFlexLayout",style:"", components:[
				       		{kind: "MyCustomButton", name: "showFileInfo",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "prefChangedCheck", preference: "showfileinfo"},
			       			
		       				{kind: "VFlexBox", style: "min-height:120px;",components:[
		       					{content: "File Info:", style:"font-size:80%;font-weight:bold;"},
								{kind: "CustomRadioSelect", style: "height:75px;", name: "showFileInfoPicker", onClicked: "prefChangedPicker", preference: "showfileinfopicker", defaultVal: "File Name", items:[
							    	{defaultClassName: "captionFileNameOff",
							    	 checkedClassName: "captionFileNameOn",
									 selectedClassName: "radioSelected",
									 unSelectedClassName: "radioUnSelected",
									 value: "File Name",
									 caption: "File Name"
									},
									{defaultClassName: "captionFilePathOff",
							    	 checkedClassName: "captionFilePathOn",
									 selectedClassName: "radioSelected",
									 unSelectedClassName: "radioUnSelected",
									 value: "Path",
									 caption: "Path"
									},
									{defaultClassName: "captionBothOff",
							    	 checkedClassName: "captionBothOn",
									 selectedClassName: "radioSelected",
									 unSelectedClassName: "radioUnSelected",
									 value: "Both",
									 caption: "Both"
									}
								]}
							]},
							{flex:1},
							{kind: "VFlexBox", components:[
								{flex:1},
								{kind: "HelpButton", helpID: "caption", onHelpRequested: "doRequestHelpPop"}
							]}
							
			     			
			     		]}
			     	]}
			    ]},
			    {kind: "DividerDrawer",name: "overrideDrawer", preference: "overridedrawer", onOpenChanged: "prefChangedDrawer", className: "editListSubItem"/*, style: "min-height:126px;"*/,caption: "Over-ride Options", components:[        
					{kind: "VFlexBox", components: [
		                //{content: "Over-ride Settings:", style: "font-weight:bold;font-size:110%;"},
		                {layoutKind: "HFlexLayout",style:"",  components:[
		   					{layoutKind: "HFlexLayout",align:"center",flex:1, components:[
		                        {kind: "MyCustomButton", name: "transOverride", buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "prefChangedCheck", preference: "usetransoverride"},
		                        //{content: "Transition", style:"font-size:80%;font-weight:bold;"},
		                        {kind: "SuperPickerBase", className: "runSettingPopup", useRandom: true, name: "tOverPicker", onChange: "prefOverrideTrans", style: "max-width: 90px;overflow:hidden;"},
		   					]},
		   					{layoutKind: "HFlexLayout",align:"center",flex:1, components:[
		   						{kind: "MyCustomButton", name: "stretchAll",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "prefChangedCheck", preference: "stretchall"},
		   						{content: "Stretch All", style:"font-size:80%;font-weight:bold;"}
		   					]}
		   				]},
			   			{layoutKind: "HFlexLayout",style:"", components:[
							{layoutKind: "HFlexLayout",align:"center",flex:1, components:[
			                    {kind: "MyCustomButton", name: "textColor", buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "prefChangedCheck", preference: "textcolor"},
			                    //{content: "Font Color", style:"font-size:80%;font-weight:bold;"},
			                    {kind: "Button",allowHtml: true, className: "enyo-button-affirmative", caption: "Font<br />Color", onclick: "openColorSelectorPop", style:"font-size:80%;font-weight:bold;"}
							]},
							{layoutKind: "HFlexLayout",align:"center",flex:1, components:[
								{kind: "MyCustomButton", name: "sizeOverride", buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "prefChangedCheck", preference: "usesizeoverride"},
								//{content: "Font Size", style:"font-size:80%;font-weight:bold;"},
								{kind: "Button",allowHtml: true, className: "enyo-button-affirmative", caption: "Font<br />Size", onclick: "openGlobalFontSizePop", style:"font-size:80%;font-weight:bold;"},
								{flex:1},
								{kind: "HelpButton", helpID: "override", onHelpRequested: "doRequestHelpPop"},
							]}
			            ]}

		   			]}
		   		]}
			]}
		]}
	],
	prefFontSize: function(iS, iE) {
		var obj = {}
		obj.preference = "fontsize"
		obj.val = iE
		this.doPrefChanged(obj)
	},
	prefFontColor: function(iS, iE) {
		var obj = {}
		obj.preference = "overridecolor"
		obj.val = iE
		this.doPrefChanged(obj)
	},
	prefGlobalCaption: function(iS, iE) {
		var obj = {}
		obj.preference = "globalcaption"
		obj.val = iE
		this.doPrefChanged(obj)
	},
	prefChangedCheck: function(iS, iE) {
		var obj = {}
		obj.preference = iS.preference
		obj.val = iS.getChecked()
		this.doPrefChanged(obj)
	},
	prefChangedDrawer: function(iS, iE) {
		if (this.LOADING == false) {
			var obj = {};
			obj.preference = iS.preference;
			obj.val = iS.getOpen();
			this.doPrefChanged(obj);
		};
	},
	prefChangedPicker: function(iS, iE) {
		var obj = {}
		obj.preference = iS.preference
		obj.val = iS.getValue()
		this.doPrefChanged(obj)
		switch (iS.name) {
			case "audPicker": case "picPicker": case "changePicker": case "repeatPicker": {
				this.setDrawerIcon(iS);
				break;
			}
		}
		if (iS.name == "changePicker") {
			if (iS.getValue() == "Duration:") {
				this.$.durPicker.setShowing(true)
				this.$.scalePicker.setShowing(true)
			}
			else {
				this.$.durPicker.setShowing(false)
				this.$.scalePicker.setShowing(false)	
			}
		}
		else if (iS.name == "scalePicker") {
			if (obj.val == "seconds") {
				this.$.durPicker.setMin(8);
			}
			else {
				this.$.durPicker.setMin(1);
			};
		}
	},
	setDrawerIcon: function(iS) {
		var s = iS.name.replace("Picker", "Drawer");
		var x = iS.getCheckedClassName();
		x = "images/" + x.toLowerCase() + ".png";
		this.log (s + " " + x);
		this.$[s].setIcon(x);
	},
	prefOverrideTrans: function() {
		var obj = this.$.tOverPicker.getSettings()
		var s = {}
		var t = {}
		var x = {}
		if (obj.value == "Random") {
			s = {
				preference: "transsetting",
				val: obj.value
			}
		} 
		else {
			s = {
				preference: "transsetting",
				val: "Use just one:"
			}
			
		};
		x = {
			preference: "globaltransspeed",
			val: obj.speed
		}
		t = {
			preference: "transoverride",
			val: obj.value	
		}
		this.doPrefChanged(s)
		this.doPrefChanged(t)
		this.doPrefChanged(x)
	},
	openGlobalCaptionPop: function() {
		this.$.globalCaptionPop.open()
		this.$.globalCaptionPop.setCurrentCaption(this.thePaths.getSetting(this.currentFile, "globalcaption"))
	},
	openGlobalFontSizePop: function() {
		this.$.globalFontSizePop.open()
		this.$.globalFontSizePop.setCurrentSize(this.thePaths.getSetting(this.currentFile, "fontsize"))
	},
	openColorSelectorPop: function() {
		this.$.colorSelector.open()
		this.$.colorSelector.setCurrentColor(this.thePaths.getSetting(this.currentFile, "overridecolor"))
		this.$.colorSelector.setOverrideColor("", this.$.colorSelector.getCurrentColor())
	},
	LOADING: false,
	loadSettings: function() {
		this.LOADING = true
		this.$.audPicker.setValue(this.thePaths.getSetting(this.currentFile, "audpick"));
		this.$.picPicker.setValue(this.thePaths.getSetting(this.currentFile, "picpick"));
		this.$.showFileInfo.setChecked(this.thePaths.getSetting(this.currentFile, "showfileinfo"))
		this.$.showFileInfoPicker.setValue(this.thePaths.getSetting(this.currentFile, "showfileinfopicker"))
		
		this.$.repeatPicker.setValue(this.thePaths.getSetting(this.currentFile, "repeat"))
		
		this.$.useGlobalCaption.setChecked(this.thePaths.getSetting(this.currentFile, "useglobalcaption"));
		this.$.showExif.setChecked(this.thePaths.getSetting(this.currentFile, "showexif"));
		this.$.showDate.setChecked(this.thePaths.getSetting(this.currentFile, "dateshow"));
		this.$.showSong.setChecked(this.thePaths.getSetting(this.currentFile, "songshow"));
		this.$.fullScreen.setChecked(this.thePaths.getSetting(this.currentFile, "fullscreen"));
		this.$.textColor.setChecked(this.thePaths.getSetting(this.currentFile, "textcolor"));
		this.$.transOverride.setChecked(this.thePaths.getSetting(this.currentFile, "usetransoverride"));
		this.$.changePicker.setValue(this.thePaths.getSetting(this.currentFile, "change"));
		this.$.stretchAll.setChecked(this.thePaths.getSetting(this.currentFile, "stretchall"));
		this.$.sizeOverride.setChecked(this.thePaths.getSetting(this.currentFile, "usesizeoverride"));
		this.$.cinematicMode.setChecked(this.thePaths.getSetting(this.currentFile, "cinematic"));

		this.$.scalePicker.setValue(this.thePaths.getSetting(this.currentFile, "scale"));
		if (this.$.scalePicker.getValue() == "seconds") {
			this.$.durPicker.setMin(8);
			
		}
		else {
			this.$.durPicker.setMin(1);
		};
		this.$.durPicker.setValue(this.thePaths.getSetting(this.currentFile, "duration"));
		
		if (this.$.changePicker.getValue() == "Duration:") {
			this.$.durPicker.show();
			this.$.scalePicker.show();
		}
		else {
			this.$.durPicker.hide();
			this.$.scalePicker.hide();
		};
		this.$.stopButton.setShowing(this.runMode);
		var s = {
			value: this.thePaths.getSetting(this.currentFile, "transoverride"),
	        speed: this.thePaths.getSetting(this.currentFile, "globaltransspeed"),
	        firstSrc: "",
	        secondSrc: ""
		};
		this.$.tOverPicker.setSettings(s);

		//Need to check for no_settings because this is a new flag
		var x = this.thePaths.getSetting(this.currentFile, "picturedrawer");
		if (x == "NO_SETTINGS") {x = false};
		this.$.picDrawer.setOpen(x);

	    x = this.thePaths.getSetting(this.currentFile, "audiodrawer");
		if (x == "NO_SETTINGS") {x = false};
		this.$.audDrawer.setOpen(x);

		x = this.thePaths.getSetting(this.currentFile, "changedrawer");
		if (x == "NO_SETTINGS") {x = false};
		this.$.audDrawer.setOpen(x);

		x = this.thePaths.getSetting(this.currentFile, "repeatdrawer");
		if (x == "NO_SETTINGS") {x = false};
		this.$.repeatDrawer.setOpen(x);

		x = this.thePaths.getSetting(this.currentFile, "miscdrawer");
		if (x == "NO_SETTINGS") {x = false};
		this.$.miscDrawer.setOpen(x);

		x = this.thePaths.getSetting(this.currentFile, "captiondrawer");
		if (x == "NO_SETTINGS") {x = false};
		this.$.captionDrawer.setOpen(x);

		x = this.thePaths.getSetting(this.currentFile, "overridedrawer");
		if (x == "NO_SETTINGS") {x = false};
		this.$.overrideDrawer.setOpen(x);

		this.setDrawerIcon(this.$.picPicker);
		this.setDrawerIcon(this.$.audPicker);
		this.setDrawerIcon(this.$.changePicker);
		this.setDrawerIcon(this.$.repeatPicker);
		this.LOADING = false
	}
});

var GetControlTopLeft = function (ctrl) {

	var x, y = 0;
	var elm = ctrl.hasNode()
	var h = 0
	var w = 0
	if (elm) {
		//this.log("node exisit")
		h = elm.offsetHeight;
		w = elm.offsetWidth;
		x = elm.offsetLeft;
		y = elm.offsetTop;
		elm = elm.offsetParent;
		while (elm != null) {
			x = parseInt(x) + parseInt(elm.offsetLeft);
			y = parseInt(y) + parseInt(elm.offsetTop);
			elm = elm.offsetParent;
		};
		return {top:y , left: x	, height: h, width: w};
		
	}
	return {top:0, left: 0, height: 0, width: 0};
};

enyo.kind({
	name: "GlobalCaptionPopup", 
	kind:"Toaster",
	flyInFrom: "left",
	className:"editListItem globalCaptionPosition", 
	style: "width:350px;height:400px;",
	//flex:1,
	published: {
		//thePaths: "",
		//currentFile: ""
		currentCaption: ""
	},
	events: {
		//onFilePicker: "",
		//onEditView: ""
		onNewCaption: ""
	},
	components: [
		{kind:"VFlexBox",flex:1,components:[
			
			{kind: "BasicScroller", height: "250px;", components:[
				{kind: "VFlexBox", flex:1, components:[
		            {content: "Global Caption:", style: "font-size:110%;margin-top:5px;margin-left:5px;"},
		            {layoutKind: "HFlexLayout",style: "margin:9px;", components: [
		                {kind: "RichText", name: "globalCaption",flex: 1, changeOnInput : true, style:"width:465px;",onkeypress: "textLimit" ,preference: "globalcaption",alwaysLooksFocused: true, richContent: false, inputClassName: "txtBoxInside"}
		            ]}
	            ]}
            ]},
            {height: "60px"},
            {layoutKind: "HFlexLayout", components:[
	            {kind: "Button", caption: "Cancel", onclick: "closeMe", className: "enyo-button-negative"},
	            {kind: "Button", caption: "OK", className: "enyo-button-affirmative", flex:1, onclick: "sendValue"}
            ]}
        ]},
	],
	rendered: function() {
		this.inherited(arguments)
		this.currentCaptionChanged()
	},
	closeMe: function() {
		this.close()
	},
	sendValue: function() {
		this.doNewCaption(this.$.globalCaption.getValue())
		this.close()
	},
	currentCaptionChanged: function() {
		this.$.globalCaption.setValue(this.currentCaption)
	},
	textLimit: function (inSender, inEvent) {
		
		var s = inSender.getValue();
		if (s.length > 700) {
			inSender.setValue(s.substr(0,699));
		}
		/*if (inSender.name == "editCaption") {
			this.$.contentHeader.setContent("Caption (" + s.length + "/700):");
			if (inEvent.keyCode == 13) {this.saveItemSettings();};
		}
		else if (inSender.name == "globalCaption") {*/
		if (inEvent.keyCode == 13) {this.sendValue();};
		//}
	},
});

enyo.kind({
	name: "GlobalFontSizePopup", 
	kind:"Toaster",
	className:"editListItem fontSizePosition", 
	flyInFrom: "bottom",
	style: "width:350px;height:165px;",
	//flex:1,
	published: {
		//thePaths: "",
		//currentFile: ""
		currentSize: ""
	},
	events: {
		//onFilePicker: "",
		//onEditView: ""
		onNewFontSize: ""
	},
	components: [
		{kind:"VFlexBox",flex:1,components:[
			
			//{kind: "BasicScroller", height: "100px;", components:[
                {kind: "HFlexBox", components: [
                    {name: "labelfont", content: "Font size:", style:"padding-top:10px;"},                                        
                    {kind: "IntegerPicker", name: "globalFont", value: 30, min:8,max:72,label:"", onChange:"sendValue", preference:"fontsize"},
                    {style:"margin-right: 10px", content: "pt", style:"padding-top:10px;margin-left:5px;"}
                ]},
           // ]},
           {height: "20px"},
            {kind: "HFlexBox", components:[
	            {kind: "Button", caption: "Cancel", onclick: "closeMe", className: "enyo-button-negative"},
	            {kind: "Button", caption: "OK", className: "enyo-button-affirmative", flex:1, onclick: "sendValue"}
            ]}
        ]},
	],
	rendered: function() {
		this.inherited(arguments)
		this.currentSizeChanged()
	},
	closeMe: function() {
		this.close()
	},
	sendValue: function() {
		this.doNewFontSize(this.$.globalFont.getValue())
		this.close()
	},
	currentSizeChanged: function() {
		this.$.globalFont.setValue(this.currentSize)
	}
});

enyo.kind({
	name: "ColorSelector", 
	kind:"Toaster",
	className:"editListItem", 
	flyInFrom: "bottom",
	style: "width:500px;height:320px;",
	lazy: false,
	//flex:1,
	published: {
		//thePaths: "",
		//currentFile: ""
		currentColor: "#000000",
		previewPic: "images/black.png",
		textPos: "0",
		leftOffset: 24,
		value: "#000000"
	},
	events: {
		//onFilePicker: "",
		//onEditView: ""
		onNewFontColor: ""
	},
	components: [
		{kind:"VFlexBox",flex:1,components:[
			
			//{kind: "BasicScroller", height: "100px;", components:[
                {layoutKind: "HFlexLayout",height: "220px;", components: [
			        {kind: "DrawImage.control", name: "overrideColorPicker",useExtractFs: false, src:"images/colorpicker.png",stretch:true, pickerMode: true, picWidth: 200, picHeight: 200, onColorPicked: "setOverrideColor"},
			        {kind: "Input", name: "colorOverrideSelected", hint:"",onkeypress: "colorLimit", className:"colorBox",styled: true,inputClassName:"colorBoxInside"},
			        {kind: "DrawImage.control", name: "picSample",useExtractFs: false, src:"", picWidth: 200, picHeight: 150, stretch: true},
			        {kind: "TextCanvas", name: "overrideTextSample",leftOffset:0, className:"", txtWidth: 200, txtHeight: 150},
			    ]},
           // ]},
            {layoutKind: "HFlexLayout", components:[
	            {kind: "Button", caption: "Cancel", onclick: "closeMe", className: "enyo-button-negative"},
	            {kind: "Button", caption: "OK", className: "enyo-button-affirmative", flex:1, onclick: "sendValue"}
            ]}
        ]},
	],
	rendered: function() {
		this.inherited(arguments)
		this.$.overrideColorPicker.loadPicture();
		this.$.overrideColorPicker.setStyle("position:absolute;z-index:9999;");
		this.$.overrideColorPicker.setLeftOffset(this.leftOffset);
		this.$.overrideColorPicker.setTopOffset(12);
		
		this.$.picSample.setStyle("position:relative; left:110px;top: 60px;");
		this.$.overrideTextSample.setStyle("position:relative; left:-100px;top:60px; z-index:9999;");
		this.currentColorChanged();
		this.previewPicChanged();
		this.setOverrideColor("", this.currentColor);
	},
	closeMe: function() {
		this.close();
	},
	sendValue: function() {
		this.value = this.$.colorOverrideSelected.getValue()
		this.doNewFontColor(this.$.colorOverrideSelected.getValue());
		this.close();
	},
	previewPicChanged: function() {
		if (this.previewPic != "images/black.png") {this.$.picSample.setUseExtractFs(true)}
		this.$.picSample.setSrc(this.previewPic);
		this.$.picSample.loadPicture();
	},
	currentColorChanged: function() {
		this.$.colorOverrideSelected.setValue(this.currentColor);
	},
	textPosChanged: function() {
		if (parseInt(this.textPos) == 1) {
			this.$.overrideTextSample.drawText("   Text Sample",28,40,30);
		}
		else {
			this.$.overrideTextSample.drawText("   Text Sample",28,110,30);
		}
	},
	colorLimit: function (inSender, inEvent) {
		var s = inSender.getValue();
		if (inEvent.keyCode == 13) {
			inSender.applyStyle("background", s);
			this.sendValue()
		}
		else if (s.length +1 > 7) {
			inSender.setValue(s.substr(0,6));
		}
	},
	setOverrideColor: function(inSender, e) {
		//if (e == "#0") {e = "black";};
		//if (e != "black") {
		e = VerifyHexColor(e);
		//};
		this.$.colorOverrideSelected.setValue(e);
		this.$.colorOverrideSelected.applyStyle("background", e);
		this.$.overrideTextSample.setTextColor(e);
		//this.log(e)
		this.value = e
		if (parseInt(this.textPos) == 1) {
			this.$.overrideTextSample.drawText("   Text Sample",28,40,30);
		}
		else {
			this.$.overrideTextSample.drawText("   Text Sample",28,110,30);
		}
	}
})