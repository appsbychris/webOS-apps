enyo.kind({
   name:"BaseApp",
   kind:"Component",
   published: {
	   scaleArray: ["years","months","weeks","days", "hours", "minutes"],
   
	   prefObj: {
			useAutoRefresh: true,
			autoRefresh: 60,
			useDailyList: true,
			dailyTime: "08:00:am",
			
			usePastDue: false,
			screenOn: false
		},
		doneIt: false
   },
   appWindow:null,
   dockWindow:null,
   
   components:[
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
		{name: "getPref",
		    kind: "PalmService",
		    service: "palm://com.palm.systemservice/",
		    method: "getPreferences",
		    onSuccess: "getPreferencesSuccess",
		    onFailure: "getPreferencesFailure"
		 },
      {kind: "ApplicationEvents", onLoad:"onload", onUnload:"unload",
      onApplicationRelaunch: "onload",
      onWindowActivated:"onload"},
      {kind:"dataControl", name: "mydb", onLoaded: "loadData", onDataCompleted: "parseData",onAddCompleted: "loadData"},
	  {kind:"fDates", name:"fd"},
	  {kind: "MemoryArray", name: "chores"},
      {kind: "dashBoard", name:"dash"}//,
      //{kind:"SinglePane",name:"myapp",showing:false}
   ],
   create:function(){
      this.inherited(arguments);
      //enyo.log();
   },
   windowParamsChangeHandler: function() {
      if(enyo.windowParams.cmd == "unload"){
    	  //enyo.log(enyo.windowParams.source+" closed");
         if( enyo.windowParams.source == "AppView"){
            this.appWindow = null;
            //this.destroy()
         }
         
      }
   },
   onload:function(){
	   this.log(enyo.windowParams);
      
         //if(this.appWindow){
         //   //enyo.log("app view exists")
        //    enyo.windows.activateWindow(this.appWindow);
        // }else 
    	  if (enyo.windowParams.action != "alarmWakeup") {
    		  if (enyo.windowParams.action == "loadToday") {
    			  /*if (this.appWindow) {
    				  enyo.windows.activateWindow(this.appWindow,{action:"loadToday"});
    				  
    			  }
    			  else {
    				  this.appWindow = enyo.windows.openWindow("appview.html","AppView",{action:"loadToday"});
    			  }*/
    		  }
    		  else {
                  this.appWindow = enyo.windows.openWindow("appview.html","AppView",{});
    		  };
    	  }
    	  else if (enyo.windowParams.action == "alarmWakeup") {
    		  this.log(this.doneIt);
    		  if (this.doneIt == false) {
    			  this.doneIt = true;
    			  this.$.getPref.call(
    			      {
    			          "keys": [ "useautorefresh", "autorefresh", "usedailylist", "dailytime", "usepastdue", "screenon"]
    			      });
    		  }
    	  }
         
         
   },
   appRelaunch:function(){
	   
	   //enyo.log();
   },
   unload:function(){
	   //enyo.log();
   },
   getPreferencesSuccess: function(iS,iR) {
		this.prefObj.useAutoRefresh = iR.useautorefresh;
		this.prefObj.autoRefresh = iR.autorefresh;
		this.prefObj.useDailyList = iR.usedailylist;
		this.prefObj.dailyTime = iR.dailytime;
		this.prefObj.usePastDue = iR.usepastdue;
		this.prefObj.screenOn = iR.screenon;
		this.loadDatabase();
	},
   loadDatabase: function (){
		var s = "CREATE TABLE IF NOT EXISTS choreTable (chorename TEXT NOT NULL DEFAULT \"nothing\", choreduration TEXT NOT NULL DEFAULT \"nothing\", chorelastdone TEXT NOT NULL DEFAULT \"nothing\", picture TEXT NOT NULL DEFAULT \"nothing\", extra1 TEXT NOT NULL DEFAULT \"nothing\", extra2 TEXT NOT NULL DEFAULT \"nothing\", extra3 TEXT NOT NULL DEFAULT \"nothing\", extra4 TEXT NOT NULL DEFAULT \"nothing\");";
		this.$.mydb.loadDatabase("ext:choredb", "1.0", "chores", 64000, s);		
	},
	loadData: function() {
		var mytext = "SELECT * FROM choreTable;";
		enyo.log("loading data");
	    this.$.mydb.getData(mytext);
	},
	parseData: function(s, results) {
		var d = new Date();
		enyo.log("parsing");
		this.$.chores.clearItems();
		for (var i = 0; i < results.rows.length; i++) {
			this.$.chores.feedItem(results.rows.item(i)["chorename"],results.rows.item(i)["choreduration"],
					results.rows.item(i)["chorelastdone"],results.rows.item(i)["picture"],
					results.rows.item(i)["extra1"],results.rows.item(i)["extra2"]);
			
			//s = s + results.rows.item(i)["chorename"] + "/" + results.rows.item(i)["choreduration"] + "/" + results.rows.item(i)["chorelastdone"] + "/" + results.rows.item(i)["picture"] + "/" + results.rows.item(i)["extra1"] + "  !  " 
		};
		//this.$.data.setContent(s)
		
		this.$.chores.sortBy("today");
		var choreNames = "";
		var sql = [];
		var bD = false;
		for (var i = 0; i < this.$.chores.getItemCount();i++) {
			var s = this.$.chores.getItemInfo(i,"done");
			var Arr = s.split(",");
			var b = false;
			var scales = "";
			var f = 0;
			bD = false;
			for (var j = 0;j < this.scaleArray.length;j++) {
				if (Arr[1] == this.scaleArray[j] || b) {
					
					if (b == false) {
						b = true;
						f = j;
					}
					scales = scales + this.scaleArray[j] + ",";
				}
			}
			if (scales.indexOf("days") < 0) {
				scales = "days," + scales;
			};
			var nowDate = this.$.fd.dateAdd(this.$.fd.getPercent(this.$.chores.getItemInfo(i, "last"),0,1),Arr[1],Number(Arr[0]));
			var results = this.$.fd.timeSpan(d, nowDate, scales);
			var k = 0;
			this.log(d + "," + nowDate);
			scales = "";
				this.log(enyo.json.stringify(results));
			if (results.negative == 1 || results.days < 1 ) {
				if (nowDate.getDate() <= d.getDate() || results.negative == 1) {choreNames = choreNames + this.$.chores.getItemInfo(i,"name") + ", ";};
				var x = this.$.chores.getItemInfo(i,"pastnotify");
				var t = x.split("-");
				var dd = new Date(Number(t[0]) - 1, Number(t[1]), Number(t[2]), d.getHours(), d.getMinutes(), d.getSeconds(),d.getMilliseconds());
				var r = this.$.fd.timeSpan(d,dd,"days");
				if (r.negative == 1 || (this.$.chores.getItemInfo(i,"markpast") != "1")) {
					if (results.negative == 1) {
						switch (Arr[1]) {
							case "hours": {
								this.log(results.hours);
								if (results.minutes > 30 || results.hours > 0.5) {
									bD = true;
									
								};
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
							
							var end = "\" WHERE chorename = \"" + this.$.chores.getItemInfo(i,"name") + 
							           "\" AND choreduration = \"" + this.$.chores.getItemInfo(i,"done") + 
							           "\" AND chorelastdone = \"" + this.$.chores.getItemInfo(i,"last") + "\"";
						
						
							if (this.$.chores.getItemInfo(i,"markpast") != "1") {
								t = Number(this.$.chores.getItemInfo(i,"pastdue"));
								t++;
								this.$.chores.setItemInfo(i, "pastdue", t.toString());
								this.$.chores.setItemInfo(i, "markpast","1");
							};
							if (this.prefObj.usePastDue == true) {
								this.$.dash.pushDashboard("Item Past Due!:",this.$.chores.getItemInfo(i,"name"));
							};
							dd = this.$.chores.getItemInfo(i,"flags");
							sql[sql.length] = "UPDATE choreTable SET extra2 = \"" + dd + end;
						};
					};
				};
			};
		};
		if (sql.length > 0) {
			this.$.mydb.updateRecordBulk(sql);
		};
		if (choreNames.length > 0) {
			if (this.prefObj.useDailyList == true) {
			   this.$.dash.pushDashboard("Chores For Today:",choreNames.substr(0, choreNames.length - 2));
			};
		};
		this.setAlarmClick();
		//this.$.choreList.punt();
		//this.$.WaitingDialog.close()
	},
	setAlarmClick: function()  {
	       //this.$.dash.pushDashboard("test")
		if (this.prefObj.useDailyList == true) {
	    	var d = new Date;
	    	var Arr = this.prefObj.dailyTime.split(":");
	    	if (Arr[2] == "pm") {
				if (Number(Arr[0] < 12)) {Arr[0] = Number(Arr[0]) + 12;};
			};
	    	d.setHours(Number(Arr[0]),Number(Arr[1]));
			//make sure to use UTC time
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
    	}
    },
    setAlarmSuccess: function(inSender, inResponse) {   
        this.log("Set alarm success, results" );
    },
    setAlarmFailure: function(inSender, inError, inRequest) {
        this.log(inError);
    }
})