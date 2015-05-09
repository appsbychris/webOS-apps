enyo.kind({
	name: "prefView",
	kind: "Pane",
	published: {
		
		touchPad: 0
	},
	className: "mainBack",
	events: {
		onCanceled:"",
		onSavePrefs:""
	},
	
	components: [
         {kind:"fDates", name:"fd"},
         {kind: "VFlexBox",style:"border:2px solid black;width:100%;",flex:1, components: [
            {layoutKind:"HFlexLayout", style:"width:100%;", components:[
                 {content: "Preferences", flex: 1,style:"font-size:140%;font-weight:bold;"},
                 {kind: "Button", caption: "Cancel", onclick: "cancelClick", name:"cancelBtn"},
                 {kind: "Button", className: "enyo-button-affirmative", caption: "Save Changes", onclick: "saveThePrefs"},
             ]},  
             {kind:"VFlexBox",flex:1, components:[
       
			     {kind: "Scroller",name:"addScroller", flex:1, components:[         
			          {layoutKind: "VFlexLayout",caption: "Preferences", flex:1, pack:"justify",align:"center",components:[
			             {layoutKind:"VFlexLayout", style:"width:300px;", pack:"start",align:"start", components:[                                                                                                               
			                {content:"Notifications:",style:"font-size:140%;font-weight:bold;"},
			                {layoutKind:"HFlexLayout", style:"width:300px;", components:[
			                     {layoutKind:"VFlexLayout", flex:1, components:[                                  
			                         {kind: "MyCustomButton", name: "checkDaily",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: ""}
			                     ]},
			                     {layoutKind:"VFlexLayout",flex:2, components:[
				                     {content:"Give daily chore list at:",style:"position:relative;left:-25px;"},
				                     {kind:"TimePicker",name:"alertTime",style:"position:relative;left:-20px;",label:""}
			                     ]}
			                ]},
			                {layoutKind:"HFlexLayout", style:"width:300px;", components:[
			                     {layoutKind:"VFlexLayout", flex:1, components:[  
			                         {kind: "MyCustomButton", name: "checkPastdue",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: ""}
			                     ]},
			                     {layoutKind:"VFlexLayout", flex:2, components:[  
			                         {content:"Notify when item is past-due",style:"position:relative;left:-20px;"}
			                     ]}     
			                ]},
			                {content:"General:",style:"font-size:140%;font-weight:bold;"},
			                {content:"Auto Refresh rate:"},
			                {layoutKind:"HFlexLayout", style:"width:300px;", components:[
			                     {layoutKind:"VFlexLayout", flex:1, components:[  
			                         {kind: "MyCustomButton", name: "checkRefresh",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: ""}
			                     ]},
			                     {layoutKind:"HFlexLayout", flex:2, components:[  
		                             {kind:"IntegerPicker",min:1,max:300,value:60,label:"",name:"refreshRate",style:"position:relative;left:-30px;"},
		  	                         {content:"minutes",style:"position:relative;top:15px;left:-20px;"}
		                         ]}   
		  	                ]},
		  	                {layoutKind:"HFlexLayout", style:"width:300px;", components:[
		  	                     {layoutKind:"VFlexLayout", flex:1, components:[
			                         {kind: "MyCustomButton", name: "checkScreen",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: ""},
			                     ]},
			                     {layoutKind:"VFlexLayout", flex:2, components:[  
			                         {content:"Keep Screen On",style:"position:relative;left:-20px;"}
			                     ]}
			                       
			                ]},
			                {content:"Sync Settings:",style:"font-size:140%;font-weight:bold;"},
			                /*
			                 * Sync options:
			                 * enable syncing
			                 * sync down on startup
			                 * sync up on auto refresh/certain time
			                 * user name
			                 * password
			                 * confirm items to be deleted
			                 * sync on daily list
			                 * */
			                {layoutKind:"HFlexLayout", style:"width:300px;", components:[
			                     {layoutKind:"VFlexLayout", flex:1, components:[  
			                         {kind: "MyCustomButton", name: "enableSync",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "showHideSync"}
			                     ]},
			                     {layoutKind:"VFlexLayout", flex:2, components:[  
			                         {content:"Enable Syncing",style:"position:relative;left:-20px;"}
			                     ]}     
			                ]},
			                {layoutKind: "VFlexLayout", name: "syncSettings", components:[
				                {content: "Box.net Login Info:"},
				                {kind: "Input", hint: "Box.net Username",style:"width:295px;", name:"loginID",selectAllOnFocus:true,autoWordComplete:false, autoCapitalize:"lowercase",autocorrect:false,spellcheck:false },
				                {kind: "PasswordInput", hint: "Box.net Password",style:"width:295px;", name:"passCode",selectAllOnFocus:true, autoWordComplete:false, autoCapitalize:"lowercase",autocorrect:false,spellcheck:false},
				                {layoutKind:"HFlexLayout", style:"width:300px;", components:[
					                 {layoutKind:"VFlexLayout", flex:1, components:[  
					                     {kind: "MyCustomButton", name: "syncDown",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: ""}
					                 ]},
					                 {layoutKind:"VFlexLayout", flex:2, components:[  
					                     {content:"Sync on app start-up",style:"position:relative;left:-20px;"}
					                 ]}     
					            ]},
					            {layoutKind:"HFlexLayout", style:"width:300px;", components:[
						             {layoutKind:"VFlexLayout", flex:1, components:[  
						                 {kind: "MyCustomButton", name: "syncUp",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: ""}
						             ]},
						             {layoutKind:"VFlexLayout", flex:2, components:[  
						                 {content:"Upload Sync on Auto-Refresh",style:"position:relative;left:-20px;"}
						             ]}     
						        ]},
						        {layoutKind:"HFlexLayout", style:"width:300px;", components:[
				                     {layoutKind:"VFlexLayout", flex:1, components:[  
				                         {kind: "MyCustomButton", name: "deleteConfirm",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: ""}
				                     ]},
				                     {layoutKind:"VFlexLayout", flex:2, components:[  
				                         {content:"Confirm each item that would be deleted",style:"position:relative;left:-20px;"}
				                     ]}     
				                ]}
			                ]}
		  	             ]}  
			         ]}
			     ]}
			 ]}
         ]}
	     //]}
	],
	hideCancel: function() {
		this.$.cancelBtn.setShowing(false);
	},
	showHideSync: function() {
		//this.log(this.$.enableSync.getChecked())
		this.$.syncSettings.setShowing(this.$.enableSync.getChecked())
	},
	saveThePrefs: function() {
		var prefObj = {
			useAutoRefresh: this.$.checkRefresh.getChecked(),
			autoRefresh: this.$.refreshRate.getValue(),
			useDailyList: this.$.checkDaily.getChecked(),
			dailyTime: this.$.fd.formatTheDate(this.$.alertTime.getValue(),"hh:nn:a/p"),
			usePastDue: this.$.checkPastdue.getChecked(),
			screenOn: this.$.checkScreen.getChecked(),
			enableSync: this.$.enableSync.getChecked(),
			userName: this.$.loginID.getValue(),
			passWord: this.$.passCode.getValue(),
			syncDown: this.$.syncDown.getChecked(),
			syncUp: this.$.syncUp.getChecked(),
			deleteConfirm: this.$.deleteConfirm.getChecked()
		};
		//this.log("&&&&&&&&&&&&&&" + prefObj.dailyTime)
		this.doSavePrefs(prefObj);
	},
	refreshSettings: function(o, p){
		this.$.addScroller.scrollIntoView(0,0);
		this.$.checkRefresh.setChecked(o.useAutoRefresh);
		this.$.refreshRate.setValue(o.autoRefresh);
		this.$.checkDaily.setChecked(o.useDailyList);
		var Arr = o.dailyTime.split(":");
		if (Arr[2] == "pm") {
			if (Number(Arr[0] < 12)) {Arr[0] = Number(Arr[0]) + 12;};
		}
		var lastDate = new Date(1,1,2011,Number(Arr[0]),Number(Arr[1]),0,0);
		//this.log("$$$$$$$$$$$$" + lastDate)
		this.$.alertTime.setValue(lastDate);
		this.$.checkPastdue.setChecked(o.usePastDue);
		this.$.checkScreen.setChecked(o.screenOn);
		/*enableSync: this.$.enableSync.getChecked(),
			userName: this.$.loginID.getValue(),
			passWord: this.$.passCode.getValue(),
			syncDown: this.$.syncDown.getChecked(),
			syncUp: this.$.syncUp.getChecked(),
			deleteConfirm: this.$.deleteConfirm.getChecked()*/
		this.$.enableSync.setChecked(p.enableSync);
		this.$.loginID.setValue(p.userName);
		this.$.passCode.setValue(p.passWord);
		this.$.syncDown.setChecked(p.syncDown);
		this.$.syncUp.setChecked(p.syncUp);
		this.$.deleteConfirm.setChecked(p.deleteConfirm);
		this.$.syncSettings.setShowing(this.$.enableSync.getChecked())
		if (this.touchPad == 0) {
			this.$.addScroller.setAccelerated(false)
		}
	},
	cancelClick: function() {
		this.doCanceled();
	}
});