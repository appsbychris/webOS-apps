enyo.kind({
	//track past due and completed
	//reset...track date since
	
	name: "mainWindow",
	kind: enyo.VFlexBox,
	published: {
		touchPad: 0,
		imageCount: 70,
		openNote: -1,
		selectedImg: -1,
		oldLast: "",
		oldName: "",
		oldDone: "",
		oldOnTime: 0,
		thisDevice: {},
		newLast: "",
		newIndex: -1,
		newDone: "",
		openIndex: -1,
		STARTUP: false,
		syncing: false,
		inCustomView:0,
		tagList: [],
		tagViews: {
			singleView: "",
			doubleView: "",
			triView: "",
			quadView: "",
			fiveView: "",
			sixView: ""
		},
		viewMode: "singleView",
		scaleArray: ["years","months","weeks","days", "hours", "minutes"],
		prefObj: {
			useAutoRefresh: true,
			autoRefresh: 60,
			useDailyList: true,
			dailyTime: "08:00:am",
			usePastDue: false,
			screenOn: false,
			deviceID: 0,
			editDate: ""
		},
		syncObj: {
			enableSync: false,
			userName: "",
			passWord: "",
			syncDown: true,
			syncUp: true,
			deleteConfirm: true
		},

		refreshTime: 0,
		deleteCounter: 0
	},
	components: [
	     {kind: "AppMenu",name:"myMenu", components: [
		     {kind: "EditMenu"},
		     
		     {caption: "Preferences", onclick: "openPrefs"},
		     {caption: "Show Filter Toolbar", name: "tagToggle",onclick: "toggleTagBar"},
		     
		     {caption: "Sync...", name:"mnuSyncOptions", components:[
		         {caption: "Download Sync", onclick: "syncdown"},
		         {caption: "Upload Sync", onclick: "syncup"}
		     ]},
		     {caption: "Help...", onclick: "openHelpDialog"
		     	/*{kind: "HelpMenu", caption: "Online Help",  target: "http://chrishptouchpadapps.tumblr.com/post/16991714628/chore-tracker-pro-1-0-0-help"},
		     	{kind: "HelpMenu",caption: "Support Thread", target: "http://forums.webosnation.com/hp-touchpad-apps/311895-new-app-chore-tracker-pro.html"},
		     	{kind: "HelpMenu",caption: "Apps By Chris Blog", target: "http://chrishptouchpadapps.tumblr.com/"}*/
		     }
		       
		 ]},
		 {kind: "scrimSpinner", name:"spin"},
	     {kind: "SyncManager", name:"sync",onGotSyncCommands:"parseSyncCommands", onSyncError: "checkSyncError"},
	     {kind: "okBox",name:"okDialog"},
	     {kind: "confirmBox", name:"cBox", onDelete:"confirmDeleteItem",onKeep:"confirmKeepItem"},
	     /*{kind: "DaySelect", name:"pSelect", onCanceled:"closeSelect",onDone:"changeDisplay"},*/
	     {kind: "helpPop", name:"helppop"},
	     {name: "storeKey", kind: "PalmService", service: "palm://com.palm.keymanager/",
	            method: "store", onSuccess: "savedKey", onFailure: "failedSaveKey",
	            subscribe: true
	     },
	     {name: "getKey", kind: "PalmService", service: "palm://com.palm.keymanager/",
		        method: "fetchKey", onSuccess: "gotKey", onFailure: "noKey",
		        subscribe: true
		 },
		 {name: "deleteKey", kind: "PalmService", service: "palm://com.palm.keymanager/",
			    method: "remove", onSuccess: "saveKey", onFailure: "saveKey",
			    subscribe: true
		 },   
	     {
             name: "setAlarm",
             kind: "PalmService",
             service: "palm://com.palm.power/timeout/",
             method: "set",
             onSuccess: "setAlarmSuccess",
             onFailure: "setAlarmFailure",
             subscribe: true
         },
         {
             name: "clearAlarm",
             kind: "PalmService",
             service: "palm://com.palm.power/timeout/",
             method: "clear",
             subscribe: true
         },
	     {kind: "ApplicationEvents", onWindowParamsChange: "activateHandler",onBack:"checkBack",onOpenAppMenu: "toggleTouchpadView"},//,onApplicationRelaunch: "onload", onLoad:"onload",onWindowActivated:"onload",onWindowParamsChange:"onload"},
	     
	     {kind: "myScroller", name:"myScroll"},
	     {kind:"dataControl", name: "mydb", onLoaded: "loadData", onDataCompleted: "parseData",onAddCompleted: "",onDatabaseChange: "writeDate"},
	     {kind:"fDates", name:"fd"},
	     {kind: "MemoryArray", name: "chores"},
	     {kind: "MyPopup", name:"checkPop", onUndo: "undoCheck"},
	     {name: "getPref",
		    kind: "PalmService",
		    service: "palm://com.palm.systemservice/",
		    method: "getPreferences",
		    onSuccess: "getPreferencesSuccess",
		    onFailure: "getPreferencesFailure"
		 },
		 {name: "setPref",
		    kind: "PalmService",
		    service: "palm://com.palm.systemservice/",
		    method: "setPreferences",
		    onSuccess: "setPreferencesSuccess",
		    onFailure: "setPreferencesFailure"
		 },
		 {kind: "HelpDialog", name: "helpDialog"},
         {flex: 1,name: "containPane", kind: "Pane", components: [
           	{kind: "SingleView", name: "singleView",onDelete: "deleteItem", onEditButton: "openNotes", onCheckButton: "updateItem", onReorder: "reorder", onTagChange: "tagsChanged"},
		    {kind: "DoubleView",lazy:true, name: "doubleView",onDelete: "deleteItem",onEditButton: "openNotes", onCheckButton: "updateItem", onReorder: "reorder", onTagChange: "tagsChanged"},
		    {kind: "TriView",lazy:true, name: "triView",onDelete: "deleteItem",onEditButton: "openNotes", onCheckButton: "updateItem", onReorder: "reorder", onTagChange: "tagsChanged"},
		    {kind: "QuadView",lazy:true, name: "quadView",onDelete: "deleteItem",onEditButton: "openNotes", onCheckButton: "updateItem", onReorder: "reorder", onTagChange: "tagsChanged"},
		    {kind: "SixView",lazy:true, name: "sixView",onDelete: "deleteItem",onEditButton: "openNotes", onCheckButton: "updateItem", onReorder: "reorder", onTagChange: "tagsChanged"},
		    {kind:"addView",name:"addview",onCanceled:"cancelClick",onAdd:"addRecord",onNoName:"noNameInAdd", flex:1,lazy:true},
		    {kind:"prefView", name:"prefview",onCanceled:"cancelClick",onSavePrefs:"savePrefs",flex:1,lazy:true}
		]},
        {layoutKind: "HFlexLayout",className:"toolbarBack",name:"toolbar",pack:"center",align:"center", components:[
             {kind: "MyPicker", name: "syncNeeded", onChange:"syncup", showing:false},  
             {kind:"MyPicker", name: "splitViews", onChange:"changeViews",style:"margin-left:10px;margin-right:10px;"},                                                                                                     
             {kind:"MyCustomButton",buttonType:"dual",style:"margin-left:10px;margin-right:20px;", onButtonClicked:"toggleTagBar",name:"filterButton", defaultClassName: "showFilterButton", clickClassName: "showFilterButtonClick", dualDefault: "hideFilterButton", dualClick: "hideFilterButtonClick"},
             {kind:"MyPicker", name: "sortBy", onChange:"refreshList"},
             {kind:"MyPicker", name:"timeBy", onChange:"refreshList"},
             {kind:"MyCustomButton",buttonType:"basic",style:"margin-left:20px;", onButtonClicked:/*"setAlarmClick"*/ "filldatabase",name:"addButton"}
        ]},
        /*{kind: "Toaster",flyInFrom: "left",name:"exitView", className: "popBack2", dismissWithClick: false, dismissWithEscape: false, components:[
            //{kind:"Button",caption:"exit",onclick:"loadData"}
            {kind:"MyCustomButton",  defaultClassName:"exitCustomButton",clickClassName:"exitCustomButtonClick", onButtonClicked:"reloadData"},
        ]},*/
        {kind: "Popup", name: "detailed", pack: "center", align: "center",lazy:true,onBeforeOpen:"loadUpNotes",onClose:"resetKeyboard", components:[     
             {kind: "VFlexBox",flex:1, name:"popLayout",style:"margin-left:10px;margin-right:10px;",components:[
                  {layoutKind: "HFlexLayout",style:"width:100%,height:40px;",align:"start",pack:"end",components: [
                        {content: "Edit:",flex:1,style:"font-size:130%;font-weight:bold;"},
                        //{layoutKind: "HFlexLayout",flex:1,style:"width:100%,height:40px;",align:"end",pack:"end",components: [
			                {kind: "Button", caption: "Cancel", onclick: "closePop"},
				            {kind: "Button",className: "enyo-button-affirmative", caption: "Save Changes", onclick: "saveChore"}
			             //]}
				    ]},                                                                                    
                  {kind: "BasicScroller",className:"mainBack",name:"popScroll", components:[         
	                    {kind: "Input", name: "choreName", hint:"Chore Name...", alwaysLooksFocused: true,inputClassName:"textTitle", onclick:"resetKeyboard"},
	                    {layoutKind: "HFlexLayout", style: "margin-top:3px;margin-bottom:3px;",components: [
			            	{kind: "Input", name: "itemTags", hint: "Enter Tags", alwaysLooksFocused: true, flex:1, onclick:"resetKeyboard"},
				            {kind: "TagList", name: "tagListButton", className: "enyo-button-blue", onTagSelected: "appendTag", caption: "..."}
			            ]},
			            {kind: "RichText", name:"notes", alwaysLooksFocused: true, hint:"Notes...", inputClassName:"textNotes" , onclick:"resetKeyboard"},
			            
			            {layoutKind: "HFlexLayout",style:"margin-top:10px;margin-bottom:10px;", components:[
			                                                    
			                 {layoutKind: "VFlexLayout",style:"width:280px", components: [
			                     {layoutKind:"HFlexLayout",components:[
			                          {content:"Late",flex:1, style:"border-top-left-radius:5px;padding-left:2px;margin-right:5px;border:2px solid black;"},
			                          {content: "On Time",flex:1, style:"padding-left:2px;margin-right:5px;border:2px solid black;"},
			                          {content: "Total",flex:1, style:"border-top-right-radius:5px;padding-left:2px;border:2px solid black;"}
                                 ]},
                                 {layoutKind:"HFlexLayout", components:[
			                          {name: "pastDue",flex:1, style:"padding-left:2px;margin-right:5px;border:2px solid black;"},
								      {name: "ontime",flex:1, style:"padding-left:2px;margin-right:5px;border:2px solid black;"},
			                          {name: "completed",flex:1, style:"padding-left:2px;border:2px solid black;"}
			                     ]},
								 
								 {layoutKind: "HFlexLayout",style:"border-bottom-left-radius:5px;border-bottom-right-radius:5px;padding-left:2px;border:2px solid black;",align:"center",pack:"end", components:[
								      {name: "reset",style:"margin-right:10px;"}, 
								      {kind:"Button",style:"width:50px;height:20px;", caption:"reset",onclick:"resetLastDate",className:"enyo-button-blue"}                
								 ]}     
			                 ]}
			            ]},
			            {layoutKind: "HFlexLayout", style: "margin-bottom:10px;",components: [
			            	{kind: "MyCustomButton", name: "checkDefault",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "removeSelected"},
			            	{content: "Default Image: "},
			            	{kind: "Image", src: "images/icon64.png"}
			            ]},
			            
		       
			            {layoutKind:"VFlexLayout",name: "imageContainer", flex:1,components:[ 
			            	{layoutKind: "HFlexLayout", components: [
			                	{flex: 1},
			                	{kind: "FastScroller", onDragForward: "scrollForward", onDragBackward: "scrollBack"}
			                	//{kind: "Button", caption: "<", onclick: "scrollBack"},
			                	//{kind: "Button", caption: ">", onclick: "scrollForward"}
				            ]},
				            {kind:"HVirtualList",name:"iimageList", onSetupRow:"setuprowDetails",height:"80px", components:[
		                         {kind: "Item",name:"imgItem", tapHighlight: false,onclick: "itemClick", components: [
							        
										{kind: "Image", name: "clipImg"}
		                        
							         
							     ]}
							]},
			            ]},

			            {layoutKind: "HFlexLayout", style: "margin-bottom:10px;",components: [
			            	{kind: "MyCustomButton",style: "margin-top:7px;", name: "checkExpire",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn"},
			            	{layoutKind: "VFlexLayout", components: [
				            	{content: "Delete After Completed: ", style: "margin-left:3px;"},
				            	{layoutKind: "HFlexLayout", style: "",components: [
					            	{kind: "IntegerPicker",name:"expirePicker", label: "", min: 1, max: 100,value: 1},
					            	{content: "times", style: "margin-top:9px;"}
					            ]}
			            	]}
			            ]},
			            {layoutKind: "VFlexLayout",style:"position:relative;top:-10px;", components: [
			                {kind: "RadioGroup", name: "radio", onclick: "radioClick", components: [   
							      	{caption: "Interval", icon: "", value: "0"},
						            {caption: "Day", icon: "", value: "1"}
							]},
			                {layoutKind: "HFlexLayout", name: "interval",components: [
			                     {content: "Interval: "}, 
								 {kind: "IntegerPicker",name:"durVal", label: "", min: 1, max: 24,value: 1},
					             {kind: "Picker",name: "durScale", items:["hours", "days","weeks", "months", "years"], value: "weeks", onChange: "setInts"}
					        ]},
					        {layoutKind: "HFlexLayout", name: "days",showing:false,components: [
								 {kind: "Picker",name: "dayPicker", items:[
								       {caption:"Sunday", value: 0},
								       {caption:"Monday", value: 1},
								       {caption:"Tuesday", value: 2},
								       {caption:"Wednesday", value: 3},
								       {caption:"Thursday", value: 4},
								       {caption:"Friday", value: 5},
								       {caption:"Saturday", value: 6}
								 ], value: 0}
								       
					        ]},
					        {layoutKind: "VFlexLayout", name: "times", components: [
					            {content: "Last Completed:"},
					            {kind: "DatePicker", name: "dpick",label: "", minYear: 1990, maxYear: 2015},
					            {kind: "TimePicker", name: "tpick",label: ""}
					        ]},
					        {kind: "VFlexBox", style: "height:100px;"}
		                ]}
		                
                  ]}
	          ]}
         ]}
	],
	phoneTagBarSwitch: 0,
	toggleTouchpadView: function() {
		if (this.phoneTagBarSwitch == 0) {
			this.$.tagToggle.setCaption("Show Filter Toolbar");
		}
		else {
			this.$.tagToggle.setCaption("Hide Filter Toolbar");
		};

		if (this.touchPad == 1) {
			this.$.tagToggle.setShowing(false);
		}
		else {
			this.$.tagToggle.setShowing(true);	
		};

		this.$.mnuSyncOptions.setShowing(this.syncObj.enableSync);
	},
	changeViews: function() {
		var s = this.$.splitViews.getCustomValue(this.$.splitViews.getValue());
		this.$.containPane.selectViewByName(s);
		this.viewMode = s;
		this.$[s].setTouchPad(this.touchPad);
		//this.$[iS.loadView].setChores(this.$.chores)
		this.$[s].setTimeBy(this.$.timeBy.getValue());
		this.$[s].setTags(this.tagViews);
		this.$[s].toggleTagBar(this.$.filterButton.getButtonDual() == 1 ? true : false)
		this.$.setPref.call({"viewmode": s});
		//this.$[iS.loadView].updateList()
		this.scanAndFilterTags(true);

	},
	UpdateTimeout: 0,
	tagsChanged: function(iS, iE) {
        /*var o = {
            sender: iS.name,
            values: iE
        }
        this.doTagChange(o)*/
        var x = iE.sender;
        if (x == "choreList0") {
        	x = "singleView";
        } 
        else if (x == "choreList1") {
        	x = "doubleView";
        }
        else if (x == "choreList2") {
        	x = "triView";
        }
        else if (x == "choreList3") {
        	x = "quadView";
        }
        else if (x == "choreList4") {
        	x = "fiveView";
        }
        else if (x == "choreList5") {
        	x = "sixView";
        };
        this.tagViews[x] = iE.values;
        if (this.UpdateTimeout <= 0) {
        	this.UpdateTimeout = 1;
        	window.setTimeout(enyo.bind(this,function() {
        		this.scanAndFilterTags(true);
        		this.UpdateTimeout = 0;
        	}), 500);
        };
        var y = enyo.string.toBase64(enyo.json.stringify(this.tagViews))
        this.$.setPref.call({"tagvalues": y});
    },
    onlyTagsFilter: function(s, x) {
    	var showTags = s.split("&");
		var itemTags = x.split(",");
		var b = false;
		var t = "";
		var u = "";
		for (var n = 0; n < showTags.length; n++) {
			try {
				t = enyo.string.trim(showTags[n]);
			}
			catch (e) {
				t = showTags[n];
			};
			if (t == "*") {
				if (itemTags.length > 1) {
					b = true;
				}
				else {
					b = false;
				};
			}
			else {
				for (var j = 0; j < itemTags.length; j++) {
					try {
						u = enyo.string.trim(itemTags[j]);
					}
					catch (e) {
						u = itemTags[j];
					};
					if (u == t) {
						b = true;
						break;
					}
					else {
						//not a full match
						b = false;
					};
				};
			};
			if (b == false) {break;};
		};
		return b;
		
	},
	multiTagsFilter: function(s, x) {
		var b = false;
		this.log(s)
		if (s.length == 0) {

			return true;
		}
		var itemTags = x.split(",");
		var showTags = s.split(",");
		var t = "";
		var u = "";
		for (var j = 0; j < itemTags.length; j++) {

			try {
				t = enyo.string.trim(itemTags[j]);
			}
			catch (e) {
				t = itemTags[j];
			};

			for (var i = 0; i < showTags.length; i++) {
				try {
					u = enyo.string.trim(showTags[i]);
				}
				catch (e) {
					u = showTags[i];
				};
				if (u == t) {
                	b = true;
             		break;   	
				}
			};
			if (b) {break;};
		};
		return b;
	},
	addTagGroup: function(s) {
		var Arr = s.split(",");
		for (var i = 0; i < Arr.length; i++) {
			try {
				Arr[i] = enyo.string.trim(Arr[i])
			}
			catch (e) {
				Arr[i] = ""
			}

			if (this.doesTagExist(Arr[i]) == false) {
				//this.log(Arr[i])
				this.tagList[this.tagList.length] = Arr[i];
			}; 
		};
	},
	doesTagExist: function(s) {
		if (s.length < 1) { return true;};
		for (var i = this.tagList.length - 1; i >= 0; i--) {
			if (this.tagList[i].toLowerCase() == s.toLowerCase()) {
				return true;
				break;
			};
		};
		return false;
	},
	scanAndFilterTags: function(punt) {


			//Include any item containing any of the following tags:
						// use the "," 
						/* tag1, tag2, tag3
						   This will display all items that contain at least one of those tags

						   To chain tags, use the "&" symbol
						   tag1 & tag2 & tag3
						   This will display all items the contain ALL of those tags

						   tag1 & tag2, tag3
						   This will display ALL items with tag3, and all items with tag1 and tag2
						*/
		this.tagList = [];
		this.$[this.viewMode].clearList();
		//this.log("VIEWMODE: " + this.viewMode);
		var feedMe = enyo.bind(this, (function(i,k) {
			this.$[this.viewMode].feedItem(k, 
										   this.$.chores.choreList[i].sName,
										   this.$.chores.choreList[i].sDone,
										   this.$.chores.choreList[i].sLast,
										   this.$.chores.choreList[i].sPic,
										   this.$.chores.choreList[i].sNotes,
										   this.$.chores.choreList[i].sFlags,
										   this.$.chores.choreList[i].sTags
				                          );
		}));
		var k = 0;
		var b = false;
		for (var i = 0; i < this.$.chores.getItemCount(); i++) {
			//this.log(i)
			b = false;
			k = 0;
			var x = this.$.chores.getItemInfo(i, "tags");
			if (!x) {x = ""};
			this.addTagGroup(x);
			x = x.toLowerCase();
			for (m in this.tagViews) {
				var s = this.tagViews[m].toLowerCase();
				if (s.indexOf("&") >= 0) {
					if (s.indexOf(",") < 0) {
						b = this.onlyTagsFilter(s, x);
						if (b) {
							
							feedMe(i,k);
							
						}
					}
					else {
						var tmp = s.split(",");
						var onlyArr = [];
						var multiArr = [];
						var p = 0;
						for (p = 0; p < tmp.length; p++) {
							if (tmp[p].indexOf("&") < 0) {
								multiArr[multiArr.length] = tmp[p];
							}
							else {
								onlyArr[onlyArr.length] = tmp[p];
							}
						};
						s = multiArr.join(",");
						b = this.multiTagsFilter(s, x);
						if (b == false) {
							for (var n = 0; n < onlyArr.length; n++) {
								b = this.onlyTagsFilter(onlyArr[n], x);	
								if (b) {
									break;
								}
							};
						}

						if (b) {
							
							feedMe(i,k);
						}

					};
				}
				else {
					
					b = this.multiTagsFilter(s, x);
					//this.log(b)
					if (b) {

						feedMe(i,k);

					};
				};
				k++
				if (m == this.viewMode) {
					break;
				};
			};
		};
		this.$[this.viewMode].setTimeBy(this.$.timeBy.getValue())
		this.$[this.viewMode].updateList(punt);
		//this.log(this.tagList)
		this.tagList.sort((function(a,b) {
			if (a.toLowerCase() < b.toLowerCase()) {
				return -1;
			}
			if (a.toLowerCase() > b.toLowerCase()) {
				return 1;
			}
			return 0;
		}))
		//this.log(this.tagList)
		this.$[this.viewMode].updateTagList(this.tagList);
	},
	toggleTagBar: function(iS, iE, noRefresh) {
		var b = false;
		var s = 0
		if (iS.name == "tagToggle") {
			if (iS.caption == "Show Filter Toolbar") {
				b = true;
				this.$.tagToggle.setCaption("Hide Filter Toolbar");
				this.phoneTagBarSwitch = 1
				s = 1
			}
			else {
				this.$.tagToggle.setCaption("Show Filter Toolbar");
				this.phoneTagBarSwitch = 0
				s = 0
			};
		}
		else if (iS.name == "STARTUP") {
			if (iE == 1) {
				b = true;
				s = 1
			};
		}
		else {
			if (iE == 0) {
				b = true;
				s = 1
			};
		};
		this.$[this.viewMode].setTags(this.tagViews);
		this.$[this.viewMode].toggleTagBar(b);
		if (!noRefresh) {
			this.$.setPref.call({"filterbutton": s});
			this.$[this.viewMode].refreshList(false);
		}
	},
	/*
	 * Startup is staggered to prevent a freeze up on the touchpad
	 * Only happens on device. Need to look into further.
	 * Notes: Starts up, logs everything through the last setup row call,
	 * app has an orange hue, the list is never updated, and the touchpad is frozen
	 * only way to get out is to do a hard reset.
	 * 
	 * Staggering it seems to help, but doesn't stop completely.
	 * The only way that seems to make it crash proof, is to hide the whole
	 * pane, set up everything while it is hidden, and then show when everything
	 * is loaded.
	 * 
	 * */ 
	create: function() {
        this.STARTUP = true;
		this.thisDevice = enyo.fetchDeviceInfo();
		this.log(this.thisDevice)
		this.dashArr = [];

        this.inherited(arguments);

		this.$.spin.start();
		this.$.containPane.hide();
		this.$.toolbar.setShowing(false);
		var useT = "";
		var s = this.thisDevice.modelNameAscii.toLowerCase()
		if (s.indexOf("touchpad") >= 0) {
			this.touchPad  = 1;
			this.$.addButton.setDefaultClassName("addButtonTouchpad");
			this.$.addButton.setClickClassName("addButtonTouchpadClick");
			this.$.addButton.setToDefault();
			useT = "touchpad";
		}        
		else {
			this.touchPad  = 0;
			this.$.addButton.setDefaultClassName("addButtonPhone");
			this.$.addButton.setClickClassName("addButtonPhoneClick");
			this.$.addButton.setToDefault();
			this.$.splitViews.setShowing(false);
			this.$.filterButton.setShowing(false);
		}
		var its = [
		           {icon:"images/timeleft" + useT + ".png",caption: "Time Left", value:0},
	               {icon:"images/timesince" + useT + ".png",caption:"Since last done", value:1}, 
	               {icon:"images/duedate" + useT + ".png",caption:"Due Date", value:2}
	             ];
		this.$.timeBy.setItems(its);
		this.$.timeBy.setLabel("Show:");
		its = [
		      {icon:"images/duetoday" + useT + ".png",caption: "Due Date", value:0},
		      {icon:"images/dangerzone" + useT + ".png",caption: "Danger Zone", value:1},
		      {icon:"images/custom" + useT + ".png",caption: "Custom", value:2},
		      {icon:"images/atoz" + useT + ".png",caption:"Name", value:3},
	          {icon:"images/mostrecent" + useT + ".png",caption: "Most Recently Completed", value:4},
	          {icon:"images/duration" + useT + ".png",caption: "Duration", value:5}
	          
	    ];
		this.$.sortBy.setItems(its);
		this.$.sortBy.setLabel("Sort:");
		
		its = [
		       {icon:"images/syncneeded" + useT + ".png", caption: "Upload Sync Needed", value:0}
		];
		this.$.syncNeeded.setItems(its);
		this.$.syncNeeded.setLabel("");
		this.$.syncNeeded.setValue(0);

		its = [
			{icon:"images/singleviewtouchpad.png",caption: "Single View", value:0, subValue: "singleView"},
		    {icon:"images/doubleviewtouchpad.png",caption: "Double View", value:1, subValue: "doubleView"},
		    {icon:"images/tripleviewtouchpad.png",caption: "Triple View", value:2, subValue: "triView"},
		    {icon:"images/quadviewtouchpad.png",caption:"Four-Way View", value:3, subValue: "quadView"},
	        {icon:"images/sixwaytouchpad.png",caption: "Six-Way View", value:4, subValue: "sixView"},
		]
		this.$.splitViews.setItems(its);
		this.$.splitViews.setLabel("");
		this.$.splitViews.setValue(0);

		this.$.detailed.setClassName("detailsPop");
    },
    rendered: function() {
		this.inherited(arguments);
		if (this.thisDevice.platformVersionMajor > 1) {
			this.$.getKey.call({"keyname": "boxPW"});
		};
		
		this.dashArr[0] =  this.createComponent( {
	        kind: "Dashboard",
	        smallIcon: "images/icon32.png",
	        onTap: "dashboardTap",
	        onDashboardActivated: "dashboardActivated",
	        owner: this
	    });
	    
	    
	    
	    window.setTimeout(enyo.bind(this,function(){
			this.$.getPref.call(
				      {
				          "keys": ["viewmode","filterbutton", "tagvalues","deleteconfirm","password","syncup","syncdown","enablesync","username", "editdate", "sort", "display", "useautorefresh", "autorefresh", "usedailylist", "dailytime", "usepastdue", "screenon","firstrun","deviceid"]
				      });
		    }), 1000);
		
	},
	getPreferencesSuccess: function(iS,iR) {
		if (!iR.firstrun || iR.firstrun != 1) {
			var d = new Date();
			var did = Math.floor(Math.random() * d.getTime());
			this.$.setPref.call(
				      {
				           "firstrun" : 1,
				           "deviceid" : did,
				           "sort" : 0,
				           "display" : 0,
				           "viewmode": "singleView",
				           "useautorefresh": this.prefObj.useAutoRefresh,
				           "autorefresh": this.prefObj.autoRefresh,
				           "usedailylist": this.prefObj.useDailyList,
				           "dailytime": this.prefObj.dailyTime,
				           "usepastdue": this.prefObj.usePastDue,
				           "enablesync": this.syncObj.enableSync,
				           "screenon": this.prefObj.screenOn,
				           "username": this.syncObj.userName,
				           "password": this.syncObj.passWord,
				           "syncdown": this.syncObj.syncDown,
				           "filterbutton": 0,
				           "syncup": this.syncObj.syncUp,
				           "deleteconfirm": this.syncObj.deleteConfirm,
				           "tagvalues": enyo.string.toBase64(enyo.json.stringify(this.tagViews))
				      });
			this.prefObj.deviceID = did;
		}
		else {
			this.prefObj.deviceID = iR.deviceid;
			this.prefObj.useAutoRefresh = iR.useautorefresh;
			this.prefObj.autoRefresh = iR.autorefresh;
			this.prefObj.useDailyList = iR.usedailylist;
			this.prefObj.dailyTime = iR.dailytime;
			this.prefObj.usePastDue = iR.usepastdue;
			this.log(iR.screenon)
			this.prefObj.screenOn = iR.screenon;
			if (iR.tagvalues) {
				var x = this.tagViews;
				try {
					x = enyo.json.parse(enyo.string.fromBase64(iR.tagvalues));
				}
				catch (e) {}
				this.tagViews = x;
				//this.log(enyo.json.stringify(this.tagViews));
			}


			if (iR.viewmode) {
				this.viewMode = iR.viewmode
				var k = 0
				for (var i in this.tagViews) {
					if (i == this.viewMode) {

						break;
					}; 
					k++
				};
				if (k > 4) { k = 4}
				this.$.splitViews.setValue(k)
				//this.log(this.viewMode + "," + k)
			}


			if (!iR.filterbutton) {iR.filterbutton = 0}
			if (iR.filterbutton == 1) {
				this.$.filterButton.setToDualDefault()
			}
			
			this.phoneTagBarSwitch = iR.filterbutton
			

			this.syncObj.enableSync = iR.enablesync;
	        this.syncObj.userName = iR.username;
	        if (this.thisDevice.platformVersionMajor < 2) {
	        	try {
	        		this.syncObj.passWord = enyo.string.fromBase64(iR.password);
	        	}
	        	catch (e) {
	        		this.syncObj.passWord = "";
	        	};
			};
	        this.syncObj.syncDown = iR.syncdown;
	        this.syncObj.syncUp = iR.syncup;
	        this.syncObj.deleteConfirm = iR.deleteconfirm;
		};
		
		this.$.sync.setDeviceID(this.prefObj.deviceID);
		
		if (!iR.editdate) {
			var d = new Date();
			d = this.$.fd.formatTheDate(d, "yyyy/mm/ddThh:nn:a/p");
			this.prefObj.editDate = d;
		}
		else {
			this.prefObj.editDate = iR.editdate;
		};
		
		this.$.sortBy.setValue(iR.sort);
		this.$.timeBy.setValue(iR.display);
		window.setTimeout(enyo.bind(this,this.loadDatabase), 1000);
		
		
	},
	loadDatabase: function (){
		var s = "CREATE TABLE IF NOT EXISTS choreTable (chorename TEXT NOT NULL DEFAULT \"nothing\", choreduration TEXT NOT NULL DEFAULT \"nothing\", chorelastdone TEXT NOT NULL DEFAULT \"nothing\", picture TEXT NOT NULL DEFAULT \"nothing\", extra1 TEXT NOT NULL DEFAULT \"nothing\", extra2 TEXT NOT NULL DEFAULT \"nothing\", extra3 TEXT NOT NULL DEFAULT \"nothing\", extra4 TEXT NOT NULL DEFAULT \"nothing\");";
		this.$.mydb.loadDatabase("ext:choredb", "1.0", "chores", 64000, s);	
	},
	
	loadData: function() {
		this.tempA = [];
		this.inCustomView = 0;
		var mytext = "SELECT * FROM choreTable;";
		enyo.log("loading data");
		this.$.sync.checkForSyncFile();
		window.setTimeout(enyo.bind(this, function(){
			this.$.mydb.getData(mytext);
		}), 500);
	},
	parseData: function(s, results) {
		var s= "";
		enyo.log("parsing");
		this.$.chores.clearItems();
		var sql = [];
		for (var i = 0; i < results.rows.length; i++) {
			this.$.chores.feedItem(results.rows.item(i)["chorename"],
				                   results.rows.item(i)["choreduration"],
					               results.rows.item(i)["chorelastdone"],
					               results.rows.item(i)["picture"],
					               results.rows.item(i)["extra1"],
					               results.rows.item(i)["extra2"], 
					               results.rows.item(i)["extra3"]
					              );

			if ((this.syncObj.enableSync == false || (this.syncObj.enableSync == true && this.syncObj.syncDown == false)) && this.STARTUP == true) {
				s = this.checkPastSingleItem(i)
				if (s.length > 0) {
					sql[sql.length] = s
				}
				//this.log("single check")
			}
			this.addTagGroup(this.$.chores.choreList[i].sTags);
//sName,sDone,sLast,sPic, sNotes,sFlags, sTags
			if (this.tagViews.singleView.length == 0 && this.viewMode == "singleView") {
				this.$.singleView.feedItem(0,
				                       this.$.chores.choreList[i].sName,
				                       this.$.chores.choreList[i].sDone,
					                   this.$.chores.choreList[i].sLast,
					                   this.$.chores.choreList[i].sPic,
					                   this.$.chores.choreList[i].sNotes,
					                   this.$.chores.choreList[i].sFlags, 
					                   this.$.chores.choreList[i].sTags
					                  );
			};

		};
		
		if (this.syncObj.enableSync == true && this.syncObj.syncDown == true && this.STARTUP == true) {
			this.syncdown();
		}
		else {
			if (sql.length > 0) {this.$.mydb.updateRecordBulk(sql);};
			this.endLoad();
		};
		
	},
	endLoad: function() {
		if (this.syncObj.enableSync == true && this.syncObj.syncDown == true) {
		 	this.checkPastDue();
		}
		window.setTimeout(enyo.bind(this,function(){
			this.sortList();
			if (this.viewMode == "singleView") {
				this.$.singleView.sortList(this.$.sortBy.getValue());
			};
			this.STARTUP = false;
			window.setTimeout(enyo.bind(this,function(){
				
				this.job = window.setInterval(enyo.bind(this,this.refreshCallback), 60000);

				this.$.containPane.show();
				this.$.containPane.selectViewByName(this.viewMode);
				
				this.$[this.viewMode].setTags(this.tagViews);-

				this.$[this.viewMode].setTouchPad(this.touchPad);
				this.$[this.viewMode].setTimeBy(this.$.timeBy.getValue());

				this.toggleTagBar("", this.$.filterButton.getButtonDual() == 1 ? 0 : 1, true)


				this.$.toolbar.setShowing(true);
				
				if (this.$.chores.getItemCount() == 0) {
					
					this.$.helppop.openPop(this.touchPad);
					this.$.helppop.setClassName("helpPop");
				}
				else {
					//window.setTimeout(enyo.bind(this,function() {
					if (this.tagViews.singleView.length == 0 && this.viewMode == "singleView") {
						this.$[this.viewMode].updateTagList(this.tagList);
						enyo.nextTick(this.$.singleView,this.$.singleView.updateList, true);
					}
					else {
						if (this.viewMode == "singleView") {
							enyo.nextTick(this,this.scanAndFilterTags, true);	
						}
						else {
							this.changeViews()
						}
					}
					//}),100)
				};
				
				this.$.spin.stop();
				if (enyo.windowParams.action &&  enyo.windowParams.action == "loadToday") {this.activateHandler();};
				window.setTimeout(enyo.bind(this,function() {
						this.setAlarmClick();
						window.setTimeout(enyo.bind(this,function() {
							this.toggleScreen();
							
						}),3000)
				}),3000)
			}),1000)
		}),1000)
	},
	savedKey: function(iS,iR) {
    	//enyo.error("key saved" + enyo.json.stringify(iR))
    },
    failedSaveKey: function(iS,iR) {
    	//enyo.error("fail key saved" + enyo.json.stringify(iR))
    },
    gotKey: function(iS,iR) {
    	//enyo.error("got key" + enyo.json.stringify(iR))
    	this.syncObj.passWord = enyo.string.fromBase64(iR.keydata);
    	//enyo.error(this.syncObj.passWord)
    },
    noKey: function(iS,iR) {
    	//enyo.error("no key" + enyo.json.stringify(iR))
    },
	writeDate: function() {
		var d = new Date();
		d = this.$.fd.formatTheDate(d, "yyyy/mm/ddThh:nn:a/p");
		this.$.setPref.call(
			      {
			           "editdate" : d
			      });
		this.prefObj.editDate = d;
		if (this.syncObj.enableSync == true) {this.$.syncNeeded.setShowing(true);}; 
	},
	checkSyncError: function() {
		this.log("sync error");
		if (this.STARTUP == true) {
			this.endLoad();
		}
		else {
			this.sortList();
			//this.$.choreList.punt();
			this.scanAndFilterTags(true)
		};
	},
	parseSyncCommands: function(iS, syncResults) {

		if (syncResults[0].syncBlock != "NO_FILES") {
			this.syncing = true;
			try {
				var o = enyo.json.parse(syncResults[0].syncBlock);
			}
			catch (e) {
				//error
			//	enyo.error(e)
			//	enyo.error(syncResults[0].syncBlock.substr(0,100) + syncResults[0].syncBlock.substr(syncResults[0].syncBlock.length-100))
				this.$.sync.setError("Corrupt_Data");
				return;
			};
			
			var p = this.$.chores.getChoreList();
			
			o.sort(this.$.chores.compareByName);
			p.sort(this.$.chores.compareByName);
			var newItems = [];
			var delItems = [];
			var sql = [];
			var begining = "UPDATE choreTable SET ";
			var end = "";
			for (var i = 0;i < o.length;i++){
				var b = false;
				var nameChange = false;
				var g = "";
				for (var j = 0;j < p.length;j++){
					
					if (p[j].sName == o[i].sName || o[i].sFlags.indexOf("oldname:" + p[j].sName + "@") >= 0) {
						p[j].sFound = 1;
						if ( o[i].sFlags.indexOf("oldname:" + p[j].sName + "@") < 0) {
							end = "\" WHERE chorename = \"" + o[i].sName + "\"";
						}
						else {
							var Arr = o[i].sFlags.split("@");
							
							for (var k = 0;k < Arr.length;k++) {
								var m = Arr[k].indexOf(":");
								this.log("k = " + Arr[k] + " " + Arr[k].substr(0,m));
								if (Arr[k].substr(0, m) == "oldname") {
									g = Arr[k].substr(m+1);
									break;
								};
							};
							this.log(g);
							end = "\" WHERE chorename = \"" + g + "\"";
							sql[sql.length] = begining + "chorename = \"" + o[i].sName + end;
							end = "\" WHERE chorename = \"" + o[i].sName + "\"";
							p[j].sName = o[i].sName;
							nameChange = true;
						}
						if (p[j].sLast != o[i].sLast){
							//edit
							p[j].sLast = o[i].sLast;
							sql[sql.length] = begining + "chorelastdone = \"" + o[i].sLast + end;
						};
						if (p[j].sDone != o[i].sDone){
							//edit
							p[j].sDone = o[i].sDone;
							sql[sql.length] = begining + "choreduration = \"" + o[i].sDone + end; 
						};
						if (p[j].sPic != o[i].sPic){
							//edit
							p[j].sPic = o[i].sPic;
							sql[sql.length] = begining + "picture = \"" + o[i].sPic + end;
						};
						//this.log(o[j].sNotes)
						if (p[j].sNotes != o[i].sNotes){
							//edit
							this.log("NOTES");
							p[j].sNotes = o[i].sNotes;
							sql[sql.length] = begining + "extra1 = \"" + o[i].sNotes + end;
						};
						if (o[i].sTags && p[j].sTags != o[i].sTags){
							
							p[j].sTags = o[i].sTags;
							sql[sql.length] = begining + "extra3 = \"" + o[i].sTags + end;
						};
						if (p[j].sFlags != o[i].sFlags){
							//edit
							if (nameChange == true) {
								p[j].sFlags = o[i].sFlags.replace("oldname:" + g + "@", "oldname:~@");
							}
							else {
								p[j].sFlags = o[i].sFlags;
							};
							sql[sql.length] = begining + "extra2 = \"" + p[j].sFlags + end;
						};
						b = true;
						break;
					};
				};
				if (b == false) {
					//new item
					newItems[newItems.length] = o[i];
				};
			}
			this.$.sync.setMsg("Scanning new and deleted items");
			this.$.chores.setChoreList(p.concat(newItems));
			this.log(p.length)
			var delSql = [];
			for (i = 0;i < p.length;i++){
				if (!p[i].sFound || p[i].sFound == 0) {
					this.log("found");
					if (this.syncObj.deleteConfirm == false) {
						end = "\" WHERE chorename = \"" + p[i].sName + "\"";
						delSql[delSql.length] = "DELETE FROM choreTable WHERE chorename = \"" + p[i].sName + "\"";
						
						this.$.chores.deleteItem(this.$.chores.getIndexByName(p[i].sName));
					}
					else {
						delItems[delItems.length] = p[i];
					};
				};
				p[i].sFound = 0;
			};
			begining = "INSERT INTO choreTable (chorename, choreduration, chorelastdone, " +
					   "picture, extra1, extra2, extra3, extra4) VALUES (\"";
			if (newItems.length > 0) {
				for (i = 0;i < newItems.length; i++) {
					sql[sql.length] = begining + newItems[i].sName + "\", \"" +
					                  newItems[i].sDone + "\", \"" + newItems[i].sLast +
					                  "\", \"" + newItems[i].sPic + "\", \"" + 
					                  newItems[i].sNotes + "\", \"" + newItems[i].sFlags +
					                  "\", \"" + newItems[i].sTags + "\", \"\")";
					                  
				};
				
			};
			this.$.sync.setMsg("Updating database")
			if (this.syncObj.deleteConfirm == false) {
				if (delSql.length > 0) {
					sql = sql.concat(delSql);
				};
				if (sql.length > 0)	{this.$.mydb.updateRecordBulkNoEvent(sql);};
				this.syncing = false;
				if (this.STARTUP == true) {
					this.endLoad();
				}
				else {
					this.sortList();
					//this.$.choreList.punt();
					this.scanAndFilterTags(true)
				}
			}
			else {
				this.deleteCounter = 0;
				this.$.sync.closeMsg();
				this.startConfirmDelete(delItems,sql);
			}
		}
		else {
			this.syncing = false;
			if (this.STARTUP == true) {
				
				this.endLoad();
			}
			else {
				this.sortList();
				//this.$.choreList.punt();
				this.scanAndFilterTags(true)
			};
		};
		this.$.sync.closeMsg();
	},
	startConfirmDelete: function(o,sql) {
		this.log(this.deleteCounter + "," + o.length);
		if (this.deleteCounter < o.length) {
			this.$.cBox.openAtCenter();
			this.$.cBox.setStore1(o);
			this.$.cBox.setStore2(sql);
			this.$.cBox.setHead("Confirm Delete:");
			this.$.cBox.setMsg("Delete " + o[this.deleteCounter].sName + " from database?");
		}
		else {
			if (sql.length > 0)	{this.$.mydb.updateRecordBulkNoEvent(sql);};
			this.syncing = false;
			if (this.STARTUP == true) {
				
				this.endLoad();
			}
			else {
				this.sortList();
				//this.$.choreList.punt();
				this.scanAndFilterTags(true)
			};
		};
	},
	confirmDeleteItem: function(iS,s1,s2) {
		var end = "\" WHERE chorename = \"" + s1[this.deleteCounter].sName + "\"";
		s2[s2.length] = "DELETE FROM choreTable WHERE chorename = \"" + s1[this.deleteCounter].sName + "\"";
		this.$.chores.deleteItem(this.$.chores.getIndexByName(s1[this.deleteCounter].sName));
		this.deleteCounter++;
		this.startConfirmDelete(s1,s2);
	},
	confirmKeepItem: function(iS,s1,s2) {
		this.deleteCounter++;
		this.startConfirmDelete(s1,s2);
		this.$.syncNeeded.setShowing(true);
	},
	syncdown: function() {
		//for (var i = 0; i < 200; i ++) {
		//	this.$.sync.feedSyncItem(i)
		//}
		//if (!this.lasttt){
		//	this.lasttt = 0
		//}
		//this.$.sync.feedSyncItem(enyo.json.stringify(this.$.chores.getChoreList()))
		if (this.inCustomView == 1) {
			this.reloadData();
		};
		this.$.syncNeeded.setShowing(false);
		this.$.sync.setLastDate(this.prefObj.editDate);
		this.$.sync.setProcessFlag("get_files");//"sync_upload")//
		this.$.sync.logIntoBox(this.syncObj);
		//this.$.sync.getSyncFolder()
	},
	syncup: function() {
		//for (var i = 0; i < 200; i ++) {
		//	this.$.sync.feedSyncItem(i)
		//}
		this.$.sync.feedSyncItem(enyo.json.stringify(this.$.chores.getChoreList()));
		this.$.sync.setLastDate(this.prefObj.editDate);
		this.$.sync.setProcessFlag("sync_upload");//"get_files")//
		this.$.sync.logIntoBox(this.syncObj);
		this.$.syncNeeded.setShowing(false);
		//this.$.sync.getSyncFolder()
	},
	checkBack: function(is, inEvent) {
		this.resetKeyboard();
		this.$.containPane.selectViewByIndex(0);
		this.closePop();
		this.$.toolbar.setShowing(true);
		inEvent.stopPropagation();
		inEvent.preventDefault();
	    return -1;
	},
	activateHandler: function() {
		if (enyo.windowParams.action &&  enyo.windowParams.action == "loadToday") {
			if (this.$.chores.getItemCount() > 0) {
				enyo.windowParams.action = "";
				d =  new Date();
				d.setDate(1);
				this.$[this.viewMode].feedCustomView ({
					radio: 0,
					rangeMin: d,
					rangeMax: new Date()
				});
			};
			
		};
	},
	openPrefs: function() {
		this.$.toolbar.setShowing(false);
		this.$.containPane.selectViewByName("prefview");
		this.$.prefview.setTouchPad(this.touchPad)
		this.$.prefview.refreshSettings(this.prefObj, this.syncObj);
		if (this.touchPad != 1) {this.$.prefview.hideCancel();};
		if (this.$.helppop.getOpened() == 1) {this.$.helppop.close();};
	},
	saveKey: function(iS,iE) {
		var b64 = enyo.string.toBase64(this.syncObj.passWord);
		this.log("KEYDATA: " + b64);
		this.$.storeKey.call({"keyname":"boxPW", "keydata": b64, "type":"BLOB", "nohide": "true"});
	},
	savePrefs: function(iS,iE) {
		
        this.prefObj.useAutoRefresh = iE.useAutoRefresh;
        this.prefObj.autoRefresh = iE.autoRefresh;
        this.prefObj.useDailyList = iE.useDailyList;
        this.prefObj.dailyTime = iE.dailyTime;
        this.prefObj.usePastDue = iE.usePastDue;
        this.prefObj.screenOn = iE.screenOn;
        
        this.syncObj.enableSync = iE.enableSync;
		this.syncObj.userName = iE.userName;
		this.syncObj.passWord = iE.passWord;
		
		if (this.thisDevice.platformVersionMajor > 1) {
			this.$.deleteKey.call({"keyname": "boxPW"});
		}
		
		this.syncObj.syncDown = iE.syncDown;
		this.syncObj.syncUp = iE.syncUp;
		this.syncObj.deleteConfirm = iE.deleteConfirm;
        //this.log(this.syncObj.deleteConfirm)
        if (this.prefObj.useAutoRefresh == false) {
        	window.clearInterval(this.job);
        	this.refreshTime = 0;
        }
        else {
        	window.clearInterval(this.job);
        	this.job = window.setInterval(enyo.bind(this,this.refreshCallback),60000);
        };
		if (this.syncObj.enableSync == false) {
			this.$.syncNeeded.setShowing(false);
		};
        this.setAlarmClick();
        this.cancelClick();
        this.refreshList();
        this.toggleScreen();
	},
	refreshCallback: function() {
		this.refreshTime++;
		if (this.refreshTime >= this.prefObj.autoRefresh) {
			this.checkPastDue();
			this.refreshTime = 0;
			this.refreshJustList();
			if (this.syncObj.syncUp == true) {
				if (this.$.syncNeeded.getShowing() == true) {
					this.syncup();
				};
			};
		};
	},
    setAlarmClick: function()  {
       //this.$.dash.pushDashboard("test")
    	if (this.prefObj.useDailyList == true) {
	    	var d = new Date;
	    	var Arr = this.prefObj.dailyTime.split(":");
	    	if (Arr[2] == "pm") {
				if (Number(Arr[0] < 12)) {Arr[0] = Number(Arr[0]) + 12};
			}
	    	d.setHours(Number(Arr[0]),Number(Arr[1]));
			
	    	var results = this.$.fd.timeSpan(new Date(),d,"minutes");
	    	if (results.negative == 1 ) {
	    		d = this.$.fd.dateAdd(d, "days", 1);
	    	}
	    	this.log("ALARM SET TO: " + d);
			var timeAt = (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear()
							+ " " + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds();
	        this.$.setAlarm.call(
	    		   {
	    	            wakeup: true,
	    	            key: "choreTrackerKey",
	    	            uri: "palm://com.palm.applicationManager/launch",
	    	            at: timeAt,
	    	            params: {
	    	               id: "com.chrisvanhooser.choretrackerpro",
	    	               params: {
	    	                  action: "alarmWakeup"
	    	               }
	    	            }
	    	         });
    	}
    	else {
    		this.$.clearAlarm.call(
 	    		   {
 	    	            key: "choreTrackerKey"
 	    	       });
    	};
    },  
    setAlarmSuccess: function(inSender, inResponse) {   
        this.log("Set alarm success, results=" + enyo.json.stringify(inResponse));
    },
    setAlarmFailure: function(inSender, inError, inRequest) {
        this.log(enyo.json.stringify(inError));
    },
	undoCheck: function() {

		var sql = [];
		if (!this.deleteItemUndo.sName) {
			x = this.$.chores.getIndexByName(this.oldName);
			this.log(x + this.oldName +  "," + this.newLast + "," + this.oldLast);
			var end = "\" WHERE chorename = \"" + this.oldName + "\" AND choreduration = \"" + this.newDone + "\" AND chorelastdone = \"" + this.newLast + "\"";
			var s = this.oldLast;
			//this.oldLast = s
			var t = Number(this.$.chores.getItemInfo(x,"completed"));
			t--;
			this.$.chores.setItemInfo(x, "completed", t.toString());
			this.$.chores.setItemInfo(x, "ontime", this.oldOnTime.toString());
			
			sql[0] = "UPDATE choreTable SET extra2 = \"" + this.$.chores.getItemInfo(x,"flags") + end;
			sql[1] = "UPDATE choreTable SET chorelastdone = \"" + s + end;
			
			end = "\" WHERE chorename = \"" + this.oldName + "\" AND choreduration = \"" + this.newDone + "\" AND chorelastdone = \"" + s + "\"";
			sql[2] = "UPDATE choreTable SET choreduration = \"" + this.oldDone + end;
			this.$.chores.setItemInfo(x, "last", s);
		}
		else {
			var begining = "INSERT INTO choreTable (chorename, choreduration, chorelastdone, " +
					   "picture, extra1, extra2, extra3, extra4) VALUES (\"";
			var o = this.deleteItemUndo
			sql[sql.length] = begining + o.sName + "\", \"" +
					                     o.sDone + "\", \"" + 
					                     o.sLast + "\", \"" + 
					                     o.sPic  + "\", \"" + 
					                     o.sNotes + "\", \"" + 
					                     o.sFlags + "\", \"" + 
					                     o.sTags + "\", \"\")";
			this.$.chores.feedItem(o.sName,o.sDone,o.sLast,o.sPic, o.sNotes,o.sFlags, o.sTags)
		};
		
		this.$.mydb.updateRecordBulk(sql);
		this.sortList();
		this.scanAndFilterTags(false)
		this.$.checkPop.setInterval(100);
	},
	deleteItemUndo: {},
	updateItem: function(iS,iE) {
		var x = this.$.chores.getIndexByName(iE) //iE.rowIndex;
		this.log("ROWINDEX:" + x)
		var d = new Date();
		var b = false;
		this.$.checkPop.openPop();
		this.setOld(x);
		var sql = [];
		var end = "\" WHERE chorename = \"" + this.oldName + "\"" //AND choreduration = \"" + this.oldDone + "\" AND chorelastdone = \"" + this.oldLast + "\"";

		var t = Number(this.$.chores.getItemInfo(x,"completed"));
		t++;
		this.deleteItemUndo = {}
		if (this.$.chores.getItemInfo(x, "expire") == "true") {
			var expireTime = this.$.chores.getItemInfo(x,"expiretime")	
			if (t >= parseInt(expireTime)) {
				this.deleteItemUndo = this.$.chores.choreList[x]
				this.deleteItem("", this.deleteItemUndo.sName)
				return;
			}
		}

		if (this.$.chores.getItemInfo(x,"useday") == "1") {
			
			var j = this.$.chores.getItemInfo(x,"done");
			var Arr = j.split(",");
			var dd = this.$.fd.dateAdd(this.$.fd.getPercent(this.$.chores.getItemInfo(x,"last"),0,1),Arr[1],Number(Arr[0]));
			var results = this.$.fd.timeSpan(d,dd,"hours");
			var p = Number(this.$.chores.getItemInfo(x,"day"));
			var q = d.getDay();
			if (results.negative == 1) {
				q = 7 - (q-p);
			}
			else {
				q = 7 + (p-q);
			};
			//this.log("**********" + q.toString())
			this.$.chores.setItemInfo(x,"done", q.toString() + ",days");
			var s = this.$.fd.formatTheDate(d,"yyyy-mm-dd") + "T08:00:am";
			b  = true;
			
		}
		else {
			this.log(d)
			var s = this.$.fd.formatTheDate(d,"yyyy-mm-dd") + "T" + this.$.fd.formatTheDate(d,"hh:nn:a/p");
		}
		

		this.$.chores.setItemInfo(x, "completed", t.toString());
		t = Number(this.$.chores.getItemInfo(x,"ontime"));
		this.oldOnTime = t;
		this.log(t);
		if (this.$.chores.getItemInfo(x,"markpast") == "0") {
			t++;
			this.$.chores.setItemInfo(x,"ontime",t.toString());
			
		};
		
		this.$.chores.setItemInfo(x, "markpast","0");
		sql[0] = "UPDATE choreTable SET extra2 = \"" + this.$.chores.getItemInfo(x,"flags") + end;
		
		this.$.chores.setItemInfo(x, "last", s);
		sql[1] = "UPDATE choreTable SET chorelastdone = \"" + s + end;
		
		if (b == true) {
			//end = "\" WHERE chorename = \"" + this.oldName + "\" AND choreduration = \"" + this.oldDone + "\" AND chorelastdone = \"" + s + "\"";
			sql[2] =  "UPDATE choreTable SET choreduration = \"" + this.$.chores.getItemInfo(x,"done") + end;
		};
		this.$.mydb.updateRecordBulk(sql);
		
		
		this.newLast = s;
		this.newIndex = x;
		this.newDone = this.$.chores.getItemInfo(x,"done");
		
		this.sortList();
		this.scanAndFilterTags()
		//this.$.singleView.setChores(this.$.chores);
		///this.$.singleView.updateList();
	},
	
	deleteItem: function(iS,iE) {
		var x = this.$.chores.getIndexByName(iE);
		this.log(x);
		this.setOld(x);
		var sql = "DELETE FROM choreTable WHERE chorename = \"" + this.oldName + "\"" // AND choreduration = \"" + this.oldDone + "\" AND chorelastdone = \"" + this.oldLast + "\"";
		
		this.$.mydb.deleteRecord(sql);
		this.$.chores.deleteItem(x)
		this.scanAndFilterTags(false)
	},
	reorder:function(inSender,toIndex,fromIndex){
	      if(toIndex != fromIndex && toIndex > -1 && toIndex < this.$.chores.getItemCount()){
	    	  this.reindex(fromIndex,toIndex);
	      };
	},
	reindex: function(fromIndex, toIndex) {
		var Arr = [];
		var b = false;
		var x = 0;
		this.$.chores.sortBy("index");
		for (var i = 0; i < this.$.chores.getItemCount();i++) {
			if (fromIndex > toIndex) {
				if (i == fromIndex) {
					x = toIndex;
				}
				else if (i == toIndex || b) {
					x = i + 1;
					b = true;
				};
			}
			else {
				if (i == fromIndex) {
					x = toIndex;
					b = true;
				}
				else if (b) {
					x = i - 1;
					
				};
			};
			if (b || i == fromIndex) {
				var end = "\" WHERE chorename = \"" + this.$.chores.getItemInfo(i,"name") + "\" AND choreduration = \"" + this.$.chores.getItemInfo(i,"done") + "\" AND chorelastdone = \"" + this.$.chores.getItemInfo(i,"last") + "\"";
				this.$.chores.setItemInfo(i,"index", x.toString());
				var sql = "UPDATE choreTable SET extra2 = \"" + this.$.chores.getItemInfo(i,"flags") + end;
				
				Arr[Arr.length] = sql;
			};
		};
		this.$.mydb.updateRecordBulk(Arr);
		this.$.chores.sortBy("index");
		this.$.sortBy.setValue(2)
		//this.$.choreList.refresh();
		this.scanAndFilterTags(false);
	},
	
	resetLastDate: function() {
		var d = new Date();
		d = this.$.fd.formatTheDate(d,"mm-dd-yyyy");
		this.$.chores.setItemInfo(this.openIndex, "reset", d);
		this.$.chores.setItemInfo(this.openIndex, "pastdue", "0");
		this.$.chores.setItemInfo(this.openIndex, "completed", "0");
		this.$.chores.setItemInfo(this.openIndex, "ontime", "0");
		var end = "\" WHERE chorename = \"" + this.oldName + "\" AND choreduration = \"" + this.oldDone + "\" AND chorelastdone = \"" + this.oldLast + "\"";
		
		var sql = "UPDATE choreTable SET extra2 = \"" + this.$.chores.getItemInfo(this.openIndex, "flags") + end;
		this.$.mydb.updateRecord(sql);
		this.$.pastDue.setContent(this.$.chores.getItemInfo(this.openIndex, "pastdue"));
		this.$.completed.setContent(this.$.chores.getItemInfo(this.openIndex, "completed") );
		this.$.ontime.setContent(this.$.chores.getItemInfo(this.openIndex, "ontime") );
		this.$.reset.setContent("since " + this.$.chores.getItemInfo(this.openIndex, "reset") );
		
	},
	
	saveChore: function() {
		//var s = "CREATE TABLE IF NOT EXISTS choreTable (
		//chorename TEXT NOT NULL DEFAULT \"nothing\", choreduration TEXT NOT NULL DEFAULT \"nothing\", 
		//chorelastdone TEXT NOT NULL DEFAULT \"nothing\", picture TEXT NOT NULL DEFAULT \"nothing\",
		//extra1 TEXT NOT NULL DEFAULT \"nothing\", extra2 TEXT NOT NULL DEFAULT \"nothing\", 
		//extra3 TEXT NOT NULL DEFAULT \"nothing\", extra4 TEXT NOT NULL DEFAULT \"nothing\");";
		/*this.$.choreName.getValue(),
				cdone: this.$.durVal.getValue() + "," + this.$.durScale.getValue(),
				clast: this.$.dpick.getValue(),
				clastt: this.$.tpick.getValue(),
				cpic: this.selectedImg,
				cnotes: this.$.notes.getValue()
			}
			
			*/
		var newName = this.$.choreName.getValue();

		if (newName.length < 1) {
			this.noNameInAdd();
			return;
		};
		this.log(this.oldName + " , " + newName)
		if (this.oldName.toLowerCase() != newName.toLowerCase()) {
			if (this.$.chores.doesNameExist(newName) == true) {
				this.$.okDialog.openAtCenter();
				this.$.okDialog.setMsg("Name already exist. Please choose another.");
				return;
			};
		};
		var sql = [];
		this.log("SAVE CHORE!!!: " +  this.$.fd.formatTheDate(this.$.tpick.getValue(),"hh:nn:a/p") + "," + this.$.tpick.getValue())
		var s = this.$.fd.formatTheDate(this.$.dpick.getValue(),"yyyy-mm-dd") + "T" + this.$.fd.formatTheDate(this.$.tpick.getValue(),"hh:nn:a/p");
		var end = "\" WHERE chorename = \"" + this.oldName + "\"" //AND choreduration = \"" + this.oldDone + "\" AND chorelastdone = \"" + this.oldLast + "\"";
		var sdone = this.$.durVal.getValue() + "," + this.$.durScale.getValue();
		if (this.$.radio.getValue() == 0) {
			this.$.chores.setItemInfo(this.openIndex, "useday", "0");
			this.$.chores.setItemInfo(this.openIndex, "day", "0");
			
		}
		else {
			var y = this.$.dayPicker.getValue();
			if (this.$.chores.getItemInfo(this.openIndex, "useday") == "0" || Number(this.$.chores.getItemInfo(this.openIndex, "day")) != y) {
				var d = new Date();
				var x = d.getDay();
				
				if (y > x) {
					d = this.$.fd.dateAdd(d,"days",-1 * (7 - (y - x )));
				}
				else {
					d = this.$.fd.dateAdd(d,"days",-1 * (x - y ));
				};
				//this.log(d + x.toString() + "," + y.toString())
				s = this.$.fd.formatTheDate(d,"yyyy-mm-dd") + "T08:00:am";
				//this.log("!!!!!!!!!!!!" + s)
			}
			this.$.chores.setItemInfo(this.openIndex, "useday", "1");
			this.$.chores.setItemInfo(this.openIndex, "day", y.toString());
			sdone = "7,days";
		};
		this.$.chores.setItemInfo(this.openIndex,"tags", this.$.itemTags.getValue());
		this.$.chores.setItemInfo(this.openIndex,"expire", this.$.checkExpire.getChecked());
		this.$.chores.setItemInfo(this.openIndex, "expiretime", this.$.expirePicker.getValue());
		var nameChange = false
		if (newName.toLowerCase() != this.oldName.toLowerCase()) {
			this.$.chores.setItemInfo(this.openIndex,"oldname", this.oldName);
			nameChange = true
		};

		sql[0] = "UPDATE choreTable SET extra2 = \"" + this.$.chores.getItemInfo(this.openIndex, "flags") + end;
		sql[1] = "UPDATE choreTable SET picture = \"" + this.selectedImg + end;
		this.$.chores.setItemInfo(this.openIndex, "pic", this.selectedImg.toString());
		
		
		sql[2] = "UPDATE choreTable SET extra3 = \"" + this.$.chores.getItemInfo(this.openIndex, "tags") + end;

		x = this.$.notes.getValue();
		sql[3] = "UPDATE choreTable SET extra1 = \"" + x + end;
		this.$.chores.setItemInfo(this.openIndex, "notes", x);

		sql[4] = "UPDATE choreTable SET choreduration = \"" + sdone + end;
		this.$.chores.setItemInfo(this.openIndex, "done", sdone);

		sql[5] = "UPDATE choreTable SET chorelastdone = \"" + s + end;
		this.$.chores.setItemInfo(this.openIndex, "last", s);
		
		var oN = this.oldName;
		
		
		if (nameChange == true) {
			sql[6] = "UPDATE choreTable SET chorename = \"" + newName + end;
			this.$.chores.setItemInfo(this.openIndex, "name", newName);
			this.oldName = newName;
		}
		
		this.$.mydb.updateRecordBulk(sql);
		this.closePop();
		this.sortList();
		this.scanAndFilterTags(true)
		//this.$.choreList.punt();
	},
	closePop: function() {
		this.$.detailed.close();
	},
	itemClick: function(iS,iIn) {
		this.log(iS);
		//this.log(enyo.json.stringify(iIn))
		this.$.checkDefault.setChecked(false)
		this.selectedImg = iIn.rowIndex;
		//extra item handling...
		if (this.selectedImg > this.imageCount) {this.selectedImg = this.imageCount}
		this.$.iimageList.refresh();
	},
	setInts: function() {
		switch (this.$.durScale.getValue()) {
			case "hours": {
				this.$.durVal.setMax(24);
				break;
			};
			case "days": {
				this.$.durVal.setMax(365);
				break;
			};
			case "weeks": {
				this.$.durVal.setMax(52);
				break;
			};
			case "months": {
				this.$.durVal.setMax(12);
				break;
			};
			case "years": {
				this.$.durVal.setMax(100);
				break;
			};
		};
	},
	setuprowDetails: function(is,iIn) {
		if (iIn >=0) {
//enyo.log("setuprow")
			if (iIn < this.imageCount + 1) {
				//enyo.log(iIn)
				//Need an extra item so list scrolls to end on phone
				if (iIn < this.imageCount) {
					if (this.touchPad == 1) {
						this.$.clipImg.setStyle("position:relative;top:10px;left:10px;width:75px;height75px;");
						
					}
					else {
						this.$.clipImg.setStyle("position:relative;top:10px;left:10px;width:65px;height65px;");
					};
					if (this.selectedImg == iIn) {
						//this.$.imgItem.setStyle("background:#0000FF;")
						this.$.imgItem.setClassName("imageListBackSelected" + this.touchPad.toString());
					}
					else {
						this.$.imgItem.setClassName("imageListBack" + this.touchPad.toString());
						//this.$.imgItem.setStyle("background:null;")
					};
					
					this.$.clipImg.setSrc("images/img" + (iIn+1) + ".png");
				}
				else {
					//extra item to take up space at the end
					if (this.touchPad == 0) {
						this.$.imgItem.setStyle("width:75px;")
					}
				};
				return true;
			};
		};
		return false;
	},
	setOld: function(x) {
		this.oldLast = this.$.chores.getItemInfo(x, "last");
		this.oldName = this.$.chores.getItemInfo(x, "name");
		this.oldDone = this.$.chores.getItemInfo(x, "done");
	},
	removeSelected: function() {
		if (this.$.checkDefault.getChecked() == true) {
			this.selectedImg = -1;
			this.$.iimageList.refresh();
		}
		else {
			this.selectedImg = 0;
			this.$.iimageList.refresh();
		}
	},
	loadUpNotes: function() {
		var x = this.openIndex;
		var s = this.$.chores.getItemInfo(x, "notes");
		if (this.touchPad == 1) {
			var w = window.outerWidth - 100;
			var h = window.outerHeight - 100;
			this.$.iimageList.setStyle ( "height:100px;border:2px solid black;");
			this.$.imageContainer.setStyle("position:relative;top:-30px;");
		}
		else {
			var w = window.innerWidth - 20;
			var h = window.innerHeight - 20;
			this.$.iimageList.setStyle ( "height:85px;border:2px solid black;");
			this.$.imageContainer.setStyle("position:relative;top:-10px;");
			this.$.iimageList.setAccelerated(false);
			this.$.popScroll.setAccelerated(false);
		}
		this.$.detailed.setStyle("width:" + w.toString() + "px;height:" + h.toString() +  "px;");
		this.setOld(x);
		
		this.setTagList(this.tagList)

		var j = this.$.fd.getPercent(this.oldLast,0,1);
		this.$.dpick.setValue(j);
		this.$.tpick.setValue(j);
		
		this.$.choreName.setValue(this.oldName);
		this.$.notes.setValue(s);
		//this.log(s)
		this.$.itemTags.setValue(this.$.chores.getItemInfo(x,"tags"))
		this.$.pastDue.setContent(this.$.chores.getItemInfo(x, "pastdue"));
		
		this.$.ontime.setContent(this.$.chores.getItemInfo(x, "ontime"));
		this.$.reset.setContent("since " + this.$.chores.getItemInfo(x, "reset") );
		var Arr = this.oldDone.split(",");
		this.$.durVal.setValue(Number(Arr[0]));
		this.$.durScale.setValue(Arr[1]);
		this.selectedImg = Number(this.$.chores.getItemInfo(x, "pic"));
		this.$.dayPicker.setValue(Number(this.$.chores.getItemInfo(x,"day")));
		this.$.radio.setValue(Number(this.$.chores.getItemInfo(x,"useday")));
		this.log(this.$.chores.getItemInfo(x,"expire"))
		this.$.checkExpire.setChecked(this.$.chores.getItemInfo(x,"expire"));
		this.$.expirePicker.setValue(parseInt(this.$.chores.getItemInfo(x,"expiretime")));
		if (this.$.checkExpire.getChecked() == true) {
			this.$.completed.setContent( this.$.chores.getItemInfo(x, "completed") + " of " + this.$.expirePicker.getValue());
		}
		else {
			this.$.completed.setContent( this.$.chores.getItemInfo(x, "completed") );	
		}
		

		this.radioClick();
		this.log(this.selectedImg);
		this.$.iimageList.refresh();
		
		this.$.popScroll.scrollIntoView(0,0);
		this.log ("SELECTEDIMG:" + this.selectedImg)
		if (this.selectedImg == -1) {
			this.$.checkDefault.setChecked(true)
			this.$.checkDefault.setToChecked()
			this.removeSelected()
		} 
		else {
			this.$.checkDefault.setChecked(false)
			this.$.myScroll.scrollTo(this.selectedImg,this.$.iimageList);	
		};
		
	},
	openNotes:function(iS,iE) {
		//this.openNote = iE.rowIndex
		var x = this.$.chores.getIndexByName(iE) //iE.rowIndex;
		this.openIndex = x;
		this.$.detailed.openAtCenter();
		
		//this.$.choreList.refresh()
	},
	puntList: function() {
		this.sortList();
		//this.$.choreList.punt();
		this.scanAndFilterTags(true);
	},
	refreshList: function(iS,iE) {
		/*
		 * prefObj: {
			useAutoRefresh: true,
			autoRefresh: 60,
			useDailyList: true,
			dailyTime: "08:00:am",
			usePastDue: false
		}
		syncObj: {
			enableSync: false,
			userName: "",
			passWord: "",
			syncDown: true,
			syncUp: true,
			deleteConfirm: true
		},*/
		if (this.thisDevice.platformVersionMajor > 1) {
			this.$.setPref.call(
				      {
				           "sort" : this.$.sortBy.getValue(),
				           "display" : this.$.timeBy.getValue(),
				           "useautorefresh": this.prefObj.useAutoRefresh,
				           "autorefresh": this.prefObj.autoRefresh,
				           "usedailylist": this.prefObj.useDailyList,
				           "dailytime": this.prefObj.dailyTime,
				           "usepastdue": this.prefObj.usePastDue,
				           "screenon": this.prefObj.screenOn,
				           "enablesync": this.syncObj.enableSync,
				           "username": this.syncObj.userName,
				           //"password": this.syncObj.passWord,
				           "syncdown": this.syncObj.syncDown,
				           "syncup": this.syncObj.syncUp,
				           "deleteconfirm": this.syncObj.deleteConfirm
				      });
		}
		else {
			this.$.setPref.call(
				      {
				           "sort" : this.$.sortBy.getValue(),
				           "display" : this.$.timeBy.getValue(),
				           "useautorefresh": this.prefObj.useAutoRefresh,
				           "autorefresh": this.prefObj.autoRefresh,
				           "usedailylist": this.prefObj.useDailyList,
				           "dailytime": this.prefObj.dailyTime,
				           "usepastdue": this.prefObj.usePastDue,
				           "enablesync": this.syncObj.enableSync,
				           "username": this.syncObj.userName,
				           "password": enyo.string.toBase64(this.syncObj.passWord),
				           "syncdown": this.syncObj.syncDown,
				           "syncup": this.syncObj.syncUp,
				           "deleteconfirm": this.syncObj.deleteConfirm
				      });
		}
		if (iS && iS.name == "sortBy" ) {this.sortList();};
		this.scanAndFilterTags(false)
	},
	refreshJustList: function() {
		this.sortList();
		this.scanAndFilterTags(false);
	},
	
	toggleScreen: function() {
		this.log(this.prefObj)
		if (this.prefObj.screenOn == true) {
			this.log("SCREEN ON")
			enyo.windows.setWindowProperties(window,{blockScreenTimeout : true});
		}
		else {
			this.log("SCREEN OFF")
			enyo.windows.setWindowProperties(window,{blockScreenTimeout : false});
		}
	},
	dashboardActivated: function(dash) {
    	//this.log(enyo.json.stringify(dash))
        for (l in dash) {
            var c = dash[l].dashboardContent;
            if (c) {
                c.$.topSwipeable.setStyle("outline:black solid thick;background:black;");
            };
        };
    },
	
	sortList: function() {
		
		switch (this.$.sortBy.getValue()) {
			case 3: {
				this.$.chores.sortBy("abc");
				break;
			};
			case 1: {
				this.$.chores.sortBy("danger");
				break;
			};
			case 4: {
				this.$.chores.sortBy("recent");
				break;
			};
			case 2: {
				this.$.chores.sortBy("index");
				break;
			};
			case 5: {
				this.$.chores.sortBy("often");
				break;
			};
			case 0: {
				this.$.chores.sortBy("today");
				break;
			};
		};
	},
	
	addRecord: function(iS,iE) {
		enyo.log(enyo.json.stringify(iE));
		//this.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + iE.cname + "," + (this.$.chores.doesNameExist(iE.cname)))
		if (this.$.chores.doesNameExist(iE.cname) == false) {
			d = new Date();
			d = this.$.fd.formatTheDate(d,"mm-dd-yyyy");
			iE.dateAdded = d;
			var x = Number(this.$.chores.getHighestIndex()) + 1;
			if (iE.cwhich == 0) {
				iE.last = this.$.fd.formatTheDate(iE.clast,"yyyy-mm-dd") + "T" + this.$.fd.formatTheDate(iE.clastt,"hh:nn:a/p");
				this.$.mydb.addRecord("INSERT INTO choreTable (chorename, choreduration, chorelastdone, " +
					"picture, extra1, extra2, extra3, extra4) VALUES (\"" + iE.cname + "\", \"" + 
					iE.cdone + "\", \"" + iE.last + "\", \"" + iE.cpic + "\", \"" + iE.cnotes + "\", \"" +
					"index:" + (x.toString()) + "@adddate:" + iE.dateAdded + "@completed:0@pastdue:0@ontime:0@reset:" + 
					iE.dateAdded + "@markpast:0@useday:0@day:0@pastnotify:" + iE.dateAdded + "@oldname:~@expire:" + iE.cexpire + "@expiretime:" + iE.cexpiretime + "@\", \"" + iE.ctags + "\", \"\")");
					//sName,sDone,sLast,sPic, sNotes,sFlags
				this.$.chores.feedItem(iE.cname,iE.cdone,iE.last,iE.cpic,iE.cnotes,"index:" + 
						(x.toString()) + "@adddate:" + iE.dateAdded + "@completed:0@pastdue:0@ontime:0@reset:" + 
						iE.dateAdded + "@markpast:0@useday:0@day:0@pastnotify:" + iE.dateAdded + "@oldname:~@", iE.ctags);
				this.log(iE.cpic)
			}
			else {
				iE.last = this.$.fd.formatTheDate(iE.clast,"yyyy-mm-dd") + "T08:00:am"
				this.$.mydb.addRecord("INSERT INTO choreTable (chorename, choreduration, chorelastdone, " +
						"picture, extra1, extra2, extra3, extra4) VALUES (\"" + iE.cname + "\", \"" + 
						iE.cdone + "\", \"" + iE.last + "\", \"" + iE.cpic + "\", \"" + iE.cnotes + "\", \"" +
						"index:" + (x.toString()) + "@adddate:" + iE.dateAdded + "@completed:0@pastdue:0@ontime:0@reset:" + 
						iE.dateAdded + "@markpast:0@" +	"useday:1@day:" + iE.cday + "@pastnotify:" + iE.dateAdded + 
						"@oldname:~@expire:" + iE.cexpire + "@expiretime:" + iE.cexpiretime + "@\", \"" + iE.ctags + "\", \"\")");
						
				this.$.chores.feedItem(iE.cname,iE.cdone,iE.last,iE.cpic,iE.cnotes,"index:" + (x.toString()) + "@adddate:" + 
						iE.dateAdded + "@completed:0@pastdue:0@ontime:0@reset:" + iE.dateAdded + "@markpast:0@" +
						"useday:1@day:" + iE.cday + "@pastnotify:" + iE.dateAdded + "@oldname:~@expire:" + iE.cexpire + "@expiretime:" + iE.cexpiretime + "@", iE.ctags);								
			};
			this.addTagGroup(iE.ctags)
			this.reloadListAndClose();
		}
		else {
			this.$.okDialog.openAtCenter();
			this.$.okDialog.setMsg("Name already exist. Please choose another.");
		};
	},
	noNameInAdd: function() {
		this.$.okDialog.openAtCenter();
		this.$.okDialog.setMsg("Please enter a name.");
	},
	reloadListAndClose: function() {
		this.$.containPane.selectViewByName(this.viewMode);
		this.$.toolbar.setShowing(true);
		this.sortList();
		enyo.nextTick(this,this.scanAndFilterTags, false);
	},
	cancelClick: function() {
		this.$.containPane.selectViewByName(this.viewMode);
		this.$.toolbar.setShowing(true);
	},
	filldatabase: function() {
		enyo.log("click");
		this.$.toolbar.setShowing(false);
		this.$.containPane.selectViewByName("addview");
		this.$.addview.setTagList(this.tagList);
		this.$.addview.setTouchPad(this.touchPad);
		this.$.addview.refreshPage();
		/*var s= ""
			this.$.WaitingDialog.openAtCenter()
			this.$.msg.setContent("loading")
		this.db.transaction( 
		        enyo.bind(this,(function (transaction) { 
		        	for (var i = 0;i < 10;i++) {
		    			s = "INSERT INTO choreTable (chorename, choreduration, chorelastdone, picture, extra1, extra2, extra3, extra4) VALUES (\"chorename-" + i.toString() + "\", \"choreduraction-" + i.toString() + "\", \"chorelastdone-" + i.toString() + "\", \"picture-" + i.toString() + "\", \"\", \"\", \"\", \"\")"
		    			transaction.executeSql(s, [], [], []); 
		    		}
		        	this.displaydata()
		        })));
		*/
	},
	
	dashboardTap: function() {
		//this.log("DASH TAP!")
		this.dashArr[0].pop();
	},
	checkPastSingleItem: function(i) {
		var d = new Date();
		var bD = false;
		var s = this.$.chores.getItemInfo(i,"done");
		var Arr = s.split(",");
		var b = false;
		var scales = "";
		var f = 0;
		bD = false;
		var sql = ""
		for (var j = 0;j < this.scaleArray.length;j++) {
			if (Arr[1] == this.scaleArray[j] || b) {
				
				if (b == false) {
					b = true;
					f = j;
				};
				scales = scales + this.scaleArray[j] + ",";
			};
		};
		//this.log("Adding date")
		var nowDate = this.$.fd.dateAdd(this.$.fd.getPercent(this.$.chores.getItemInfo(i, "last"),0,1),Arr[1],Number(Arr[0]));
		//this.log("date passed")
		var results = this.$.fd.timeSpan(d, nowDate, scales);
		var k = 0;
		scales = "";
		if (results.negative == 1 ) {
			//choreNames = choreNames + this.$.chores.getItemInfo(i,"name") + ", "
			var x = this.$.chores.getItemInfo(i,"pastnotify");
			if (!x) {x = this.$.fd.formatTheDate(d,"mm-dd-yyyy");};
			var t = x.split("-");
			var dd = new Date(Number(t[2]),Number(t[0]) - 1, Number(t[1]), d.getHours(), d.getMinutes(), d.getSeconds(),d.getMilliseconds());
			var r = this.$.fd.timeSpan(d,dd,"hours");
			
			if (r.negative == 1 || (this.$.chores.getItemInfo(i,"markpast") != "1")) {
				switch (Arr[1]) {
					case "hours": {
						this.log(results.hours);
						if (results.minutes > 30 || results.hours > 0.5) {
							bD = true;
							
						}
						break;
					};
					case "days": case "weeks":{
						this.log(results.days);
						this.log(results.weeks);
						if (results.days > 0.75) {
							bD = true;
						};
						break;
					};
					case "months": {
						if (results.days > 0.75 || results.months > 0.08) {
							bD = true;
						};
						break;
					};
					case "years": {
						if (results.days > 1) {
							bD = true;
						};
						break;
					};
				};
				
				if (bD == true) {
					dd = this.$.fd.formatTheDate(d,"mm-dd-yyyy");
					this.$.chores.setItemInfo(i,"pastnotify",dd);
					
					var end = "\" WHERE chorename = \"" + this.$.chores.getItemInfo(i,"name") + "\" AND choreduration = \"" + this.$.chores.getItemInfo(i,"done") + "\" AND chorelastdone = \"" + this.$.chores.getItemInfo(i,"last") + "\"";
				
				
					if (this.$.chores.getItemInfo(i,"markpast") != "1") {
						t = Number(this.$.chores.getItemInfo(i,"pastdue"));
						t++;
						this.$.chores.setItemInfo(i, "pastdue", t.toString());
						this.$.chores.setItemInfo(i, "markpast","1");
					}
					if (this.prefObj.usePastDue == true) {
						//this.$.dash.pushDashboard("Item Past Due!:",this.$.chores.getItemInfo(i,"name"))
						this.log("notifying");
						this.dashArr[1] = {icon:"images/icon48.png",title: "Item Past Due!", text: this.$.chores.getItemInfo(i,"name")};
						this.dashArr[0].push(this.dashArr[1]);
					}
					dd = this.$.chores.getItemInfo(i,"flags");
					sql = "UPDATE choreTable SET extra2 = \"" + dd + end;
				}
			}
		}
		return sql
	},
	checkPastDue: function() {
		var sql = [];
		this.log("checking past");
		var x = ""
		for (var i = 0; i < this.$.chores.getItemCount();i++) {
			//this.log(this.$.chores.getItemCount())
			x = this.checkPastSingleItem(i)
			if (x.length > 0) {
				sql[sql.length] = x
			}
		}
		if (sql.length > 0) {this.$.mydb.updateRecordBulk(sql);};
	},
	radioClick: function() {
		if (this.$.radio.getValue() == 0) {
			this.$.interval.setShowing(true);
			this.$.times.setShowing(true);
			this.$.days.setShowing(false);
		}
		else {
			this.$.interval.setShowing(false);
			this.$.times.setShowing(false);
			this.$.days.setShowing(true);
		};
	},
	resetKeyboard: function() {
    	enyo.keyboard.setManualMode(false)
    },
    setTagList: function(t) {
    	this.$.tagListButton.setAllTags(t);
    	this.$.tagListButton.setItems();
    },
	appendTag: function(iS, iE) {
    	var s = this.$.itemTags.getValue();
    	if (s.length == 0) {
    		s = s + iE;
    	}
    	else {
	    	try {
	    		s = enyo.string.trim(s);
	    	}
	    	catch (e) {};
	    	var t = s.substr(s.length - 1);
	    	if (t == ",") {
	    		s = s + " " + iE;
	    	}
	    	else {
	    		s = s + ", " + iE;
	    	}
	    }
	    s = s.replace(/&/gi,"")
	    this.$.itemTags.setValue(s);
	    var elm = this.$.itemTags.hasNode()
	    if (elm) {
	    	elm.scrollTop = elm.scrollHeight
	    	this.$.itemTags.forceFocus()
	    }
    },
    scrollBack: function() {
		var y = window.innerWidth;
		if (y > 500) {
			y = y / 2;
		}
		else {
			y = y * 1.5;
		};
		this.$.myScroll.scrollBack(y, this.$.iimageList);
	},
	scrollForward: function() {
		var y = window.innerWidth;
		if (y > 500) {
			y = y / 2;
		}
		else {
			y = y * 1.5;
		};
		this.$.myScroll.scrollAhead(y, this.$.iimageList);
	},
	openHelpDialog: function() {
		this.$.helpDialog.open();
	}
});