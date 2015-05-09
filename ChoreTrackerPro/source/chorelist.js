enyo.kind({
    kind:"VFlexBox",
    name:"ChoreList",
    flex: 2,
    published: {
    	//chores: "",
    	timeBy: "",
    	myDb: "",
    	scaleArray: ["years","months","weeks","days", "hours", "minutes"],
    	touchPad: 0,
    	inCustomView: 0,
    	tags: "",
    	viewMode: 0,
    	section: 0,
    	currentDisplay: "",
    	allTags: [],
    	popOpen: 0
    },
    events: {
    	onEditButton: "",
    	onCheckButton: "",
    	onReorder: "",
    	onTagChange: "",
    	onInCustom: "",
    	onDelete: ""
    },
    components:[
    	{kind: "ApplicationEvents", onWindowRotated: "checkPopups"},
    	{kind: "MemoryArray", name: "chores"},
    	{kind: "MemoryArray", name: "customChores"},
    	{kind:"fDates", name:"fd"},
    	{kind: "DaySelect", name:"pSelect", onCanceled:"closeSelect",onDone:"changeDisplay"},
    	{kind: "Toaster",flyInFrom:"left",name:"exitView", className: "popBack2", dismissWithClick: false, dismissWithEscape: false, components:[
            {kind:"MyCustomButton",  defaultClassName:"exitCustomButton",clickClassName:"exitCustomButtonClick", onButtonClicked:"reloadData"}
        ]},
    	{kind: "VFlexBox", name: "tagLine", className: "tagLineBack",components: [
    		{layoutKind: "HFlexLayout", style: "padding: 2px 2px 2px 2px;",flex:1, components: [
    			{kind: "MyCustomButton", defaultClassName:"viewOnlyButton",clickClassName:"viewOnlyButtonClick", onButtonClicked: "showpop"},
	    		{layoutKind: "VFlexLayout",flex:1, components: [
		    		//{content: "Tags: ", style: "font-size:80%;font-weight:bold;position:relative;top:2px;left:8px;"},
		    		{kind: "Input",onkeypress: "checkFinished", flex:1, name: "tagNames", hint: "Enter tags...",/*style:"position:relative;top:-8px;",*/ onchange:"tagsChanged"},
	    		]},
	    		{kind: "MyCustomButton", defaultClassName:"tagBuilderButton",clickClassName:"tagBuilderButtonClick", onButtonClicked: "openTagBuilder"},
	    	]},
	    	/*{layoutKind: "HFlexLayout", flex:1,components: [
	    		{flex:1},
	    		{kind: "MyCustomButton", defaultClassName:"viewOnlyButton",clickClassName:"viewOnlyButtonClick", onButtonClicked: "showpop"},
	    		{flex:1},
	    		{kind: "MyCustomButton", defaultClassName:"tagBuilderButton",clickClassName:"tagBuilderButtonClick", onButtonClicked: "openTagBuilder"},
	    		{flex: 1}
	    		//{kind: "Button", caption: "View Only", onclick: "showpop", flex:1},
	    		//{kind: "Button", caption: "Tag Builder", onclick: "openTagBuilder", flex:1}
	    	]}*/
    	]},
    	{kind: "TagBuilder",onTextFocus: "movePopup", style: "min-height: 140px;",lazy:false, name: "tagBuilder", onTagChange: "tagsChanged", onClose: "resetKeyboard"},
    	{kind:"ReorderableVirtualList",name:"choreList",reorderable:true,onReorder:"doReorder",className: "mainBack",height:"100%",width:"100%", onSetupRow:"setuprow", components:[
			{kind: "SwipeableItem",name:"choreItem",onclick: "", onConfirm: "deleteItem", layoutKind: "VFlexLayout", components: [
				{kind: "HFlexBox",flex:1, components:[
					{layoutKind: "VFlexLayout",style:"padding-right:8px;",components:[
						{kind:"Image", name: "imgIcon"},
						{flex:1},
						{kind:"Image", name: "imgExpire", src: "images/expire.png"}
					]},

				    {kind: "VFlexBox",flex:1, components:[
				    	{name: "lblTitle", style: "font-size:120%;font-weight:bold;padding-right:15px;"},
					    {name: "lblTime", style: ""},
					    {name: "lblDur", showing:false,className:"lblTimePhone", style:"position:relative;top:-5px;font-weight:bold;"},
				    	{name:"record"},
						{layoutKind:"HFlexLayout",name: "touchBarLayout",style:"padding-left:10px;padding-right:10px;padding-top:10px;", flex:1, components:[
				            {kind:"MyCustomButton", name:"editButton",style: "padding-top:10px;padding-right:4px;",defaultClassName:"editButtonTouchpad",clickClassName:"editButtonTouchpadClick", onButtonClicked:"editClicked"},
				            {kind: "Image", name:"touchBar", className:"TouchBar"}
				        ]}
					]},
				    {kind: "HFlexBox",pack:"right",align:"top", components:[
				        {kind:"MyCustomButton", name:"editButtonSmall", defaultClassName:"editButtonPhone",clickClassName:"editButtonPhoneClick", onButtonClicked:"editClicked"},
				        {kind:"MyCustomButton", name:"checkButton", onButtonClicked:"buttonChecked"}
				    ]}
				]}
			]}
		]}
	],
	rendered: function() {
		this.inherited(arguments);
		this.sectionChanged();
	},
	deleteItem: function(iS, iE) {
		if (this.inCustomView == 1) {
			var chore = this.$.customChores;
		}
		else {
			var chore = this.$.chores;
		};
		var s = chore.getItemInfo(iE, "name")
		this.doDelete(s)
	},
	resetKeyboard: function() {
		enyo.keyboard.setManualMode(false);
	},
	setAccelerated: function(b) {
		this.$.choreList.setAccelerated(b)
	},
	openTagBuilder: function() {
		var openTag = enyo.bind(this,(function(){
			var results = this.GetTopLeft()
			results.top = results.top - 15
			var y = window.outerWidth
			if (this.viewMode == 2) {
				results.left = results.left - 10
				if ((this.section == 1 || this.section == 5 || this.section == 6) && y < 800 ) {
					results.left = results.left - 50
				}
			}
			this.log(results)
			this.$.tagBuilder.openAt(results, true);
			this.$.tagBuilder.setTagList(this.allTags);
			var s = this.$.tagNames.getValue();
			this.log(s)
			if (s && s.length > 0) {
				this.log(s)
				this.$.tagBuilder.setCurrentTags(s);
			}
		}))
		this.popOpen = 1
		if (enyo.keyboard.isShowing() == true) {
			enyo.keyboard.forceHide();
			this.log("TIMEOUTSETTING")
			window.setTimeout(enyo.bind(this, function(){openTag();}), 1000);
		}
		else {
			openTag();
		}


	},
	checkPopups: function() {
		this.$.tagBuilder.close();
		this.$.pSelect.close();
		if (this.inCustomView == 1) {
			this.$.exitView.close();
			var results = this.GetTopLeft();
			var pos = {top: results.top + results.height - 70,
					   left: results.left
			          };
			this.$.exitView.openAt(pos);
		}
	},
	sectionChanged: function() {
		if (this.section == -1) {
			//split view
			this.addStyles("border-right: 4px ridge #1E90FF;");
		}
		else if (this.section == 1) {
			//split view
			this.addStyles("border-left: 4px ridge #1E90FF;");
		}
		else if (this.section == 2) {
			this.addStyles("border-left: 4px ridge #1E90FF;border-right: 4px ridge #1E90FF;");
			//tri view
		}
		else if (this.section == 3) {
			//quad view
			this.addStyles("border-bottom: 4px ridge #1E90FF;border-right: 4px ridge #1E90FF;");
		}
		else if (this.section == 4) {
			//quad view
			this.addStyles("border-top: 4px ridge #1E90FF;border-right: 4px ridge #1E90FF;");
		}
		else if (this.section == 5) {
			//quad view
			this.addStyles("border-bottom: 4px ridge #1E90FF;border-left: 4px ridge #1E90FF;");
		}
		else if (this.section == 6) {
			//quad view
			this.addStyles("border-top: 4px ridge #1E90FF;border-left: 4px ridge #1E90FF;");
		}
		else if (this.section == 7) {
			//six view
			this.addStyles("border-right: 4px ridge #1E90FF;border-left: 4px ridge #1E90FF;border-bottom: 4px ridge #1E90FF;");
		}
		else if (this.section == 8) {
			//six view
			this.addStyles("border-top: 4px ridge #1E90FF;border-left: 4px ridge #1E90FF;border-right: 4px ridge #1E90FF;");
		}
		else {
			//this.setStyle("")
			//single view
		};
	},
	clearItems: function() {
		this.$.chores.clearItems();
	},
	checkFinished: function(iS, iE) {
    	if (iE.keyCode == 13) {
    		this.tagsChanged()
    	}
    },
	tagsChanged: function(iS, iE) {
		if (iS.name == "tagBuilder") {
			this.$.tagNames.setValue(iE)
		}
		this.doTagChange(this.$.tagNames.getValue());
	},
	hideTagLine: function() {
		this.$.tagLine.setShowing(false);
	},
	showTagLine: function() {
		this.$.tagLine.setShowing(true);
	},
	setTags: function(s) {
		this.$.tagNames.setValue(s);
	},
	buttonChecked: function(iS, iR) {
		if (this.inCustomView == 0) {
			var x = this.$.chores.getItemInfo(iR.rowIndex, "name");
		}
		else {
			var x = this.$.customChores.getItemInfo(iR.rowIndex, "name");
		}
		this.doCheckButton(x);
	},
	editClicked: function(iS, iR) {
		if (this.inCustomView == 0) {
			var x = this.$.chores.getItemInfo(iR.rowIndex, "name");
		}
		else {
			var x = this.$.customChores.getItemInfo(iR.rowIndex, "name");
		}
		this.doEditButton(x);
	},
	refreshList: function(puntIt, custom) {
		if (custom && this.inCustomView == 1) {
			this.changeDisplay(0,this.currentDisplay);
		}
		else {
			if (puntIt) {
				this.$.choreList.punt();
			}
			else {
				this.$.choreList.refresh();
			};
		};
	},
	setuprow: function(is,iIn) {
		if (this.inCustomView == 1) {
			var chore = this.$.customChores;
		}
		else {
			var chore = this.$.chores;
		};
		try {
		//if (this.STARTUP == true) {return false;};
		if (iIn >=0) {
//enyo.log("setuprow")
			if (iIn <= chore.getItemCount() - 1) {
				var inTagMode = this.$.tagNames.getValue()
				if (!inTagMode || inTagMode.length == 0) {
					inTagMode = 0
				}
				else {
					inTagMode = 1
				}
				var x = chore.getItemInfo(iIn, "last");
				var y = chore.getItemInfo(iIn, "done");
				var dDate = new Date();
				var oldDate = this.$.fd.getPercent(chore.getItemInfo(iIn, "last"),0,1);
				var Arr = y.split(",");
				var sDone = "";



				if (chore.getItemInfo(iIn,"useday") != "1") {
					if (Number(Arr[0]) == 1) {
						sDone = "Done every " + Arr[1].substr(0,Arr[1].length - 1);
					}
					else {
						sDone = "Done every " + Arr[0] + " " + Arr[1];
				    };
				}
				else {
					sDone = "Done every " + this.$.fd.getDayName(chore.getItemInfo(iIn,"day"));
				};

				var b = false;
				var scales = "";
				var f = 0;
				var xW = window.outerWidth;
				if (this.viewMode == 2 && xW == 768 ) {
					scales = "hours,minutes"
				}
				else {
					for (var i = 0;i < this.scaleArray.length;i++) {
						if (Arr[1] == this.scaleArray[i] || b) {
							if (b == false) {
								b = true;
								f = i;
							};
							scales = scales + this.scaleArray[i] + ",";
						};
					};

				};
				//this.log(Arr[1] + oldDate + "," + nowDate)
				var v = this.timeBy;//.getValue();

				switch (v) {
					case 1: {
						var results = this.$.fd.timeSpan(oldDate, dDate, scales);
						break;
					};
					case 0: {

						var nowDate = this.$.fd.dateAdd(this.$.fd.getPercent(chore.getItemInfo(iIn, "last"),0,1),Arr[1],Number(Arr[0]));
						//this.log("!!!!!!!!!!!!!!!!!!" + this.$.fd.getPercent(this.$.chores.getItemInfo(iIn, "last"),0,1))
						var results = this.$.fd.timeSpan(dDate, nowDate, scales);
						break;
					};
					case 2: {
						var nowDate = this.$.fd.dateAdd(this.$.fd.getPercent(chore.getItemInfo(iIn, "last"),0,1),Arr[1],Number(Arr[0]));
						break;
					};
					default: {
						var nowDate = this.$.fd.dateAdd(this.$.fd.getPercent(chore.getItemInfo(iIn, "last"),0,1),Arr[1],Number(Arr[0]));
						//this.log("!!!!!!!!!!!!!!!!!!" + this.$.fd.getPercent(this.$.chores.getItemInfo(iIn, "last"),0,1))
						var results = this.$.fd.timeSpan(dDate, nowDate, scales);
						break;
					};
				};
				//time left
				//var results = this.timeSpan(dDate, nowDate, scales)
				//time since
				//var results = this.timeSpan(oldDate, dDate, scales)
				if (v == 0 || v==1) {
					//i = this.scaleArray.length
					var j = 0;
					scales = "";

					for (i = f;i < this.scaleArray.length; i++) {
						switch (this.scaleArray[i]) {
							case "minutes": {
								if (results.minutes && results.minutes > 0) {
									scales = scales + Math.floor(results.minutes) + this.formatScales(" " + this.scaleArray[i],1) + ", ";
								};
								break;
							};
							case "hours": {
								if (results.hours && results.hours > 0) {
									scales = scales + Math.floor(results.hours) + this.formatScales(" " + this.scaleArray[i],1) + ", ";
								};
								break;
							};
							case "days": {
								if (results.days && results.days > 0) {
									scales = scales + results.days + this.formatScales(" " + this.scaleArray[i],1) + ", ";
								};
								break;
							};
							case "weeks": {
								if (results.weeks && results.weeks > 0) {
									scales = scales + results.weeks + this.formatScales(" " + this.scaleArray[i],1) + ", ";
								};
								break;
							};
							case "months": {
								if (results.months && results.months > 0) {
									scales = scales + results.months + this.formatScales(" " + this.scaleArray[i],0) + ", ";
								};
								break;
							};
							case "years": {
								if (results.years && results.years > 0) {
									scales = scales + results.years +  this.formatScales(" " + this.scaleArray[i],0) + ", ";
								};
								break;
							};
						};


					};
					if (scales.length > 0) {
						if (results.negative == 1) {
							this.$.lblTime.setContent(scales.substr(0,scales.length - 2) + " past due");
						}
						else {
							this.$.lblTime.setContent(scales.substr(0,scales.length - 2));
						};
					}
					else {
						this.$.lblTime.setContent("0 minutes");
					};
				}
				else {
					this.$.lblTime.setContent("Due: " + this.$.fd.formatTheDate(nowDate,"mm-dd-yyyy"));

				};

				if (this.viewMode == 1) {
					xW = xW / 2;
				};

				var showExpire = chore.getItemInfo(iIn, "expire")
				if (showExpire == "true") {
					var expireTime = chore.getItemInfo(iIn, "expiretime");
					var completed = chore.getItemInfo(iIn,"completed");
					sDone = sDone + " (" + completed + "/" + expireTime + ")";
					if (parseInt(expireTime) - parseInt(completed) <= 1) {
						this.$.imgExpire.setShowing(true);
						this.$.imgExpire.setClassName("expire" + this.touchPad.toString())
					}
					else {
						this.$.imgExpire.setShowing(false);
					}
				}
				else {
					this.$.imgExpire.setShowing(false);
				}
				if (this.touchPad == 0) {
					this.$.lblTime.setClassName("lblTimePhone");
					if (this.viewMode == 2) {
						//this.log( "WINDOW WIDTH: " + xW)
						if (xW == 768) {
							this.$.lblTitle.setStyle("font-size:90%;font-weight:bold;position:relative;top:-7px;");
							this.$.lblTime.setStyle("position:relative;top:-8px;font-size: 70%;");
							xW = 100;
							sDone = sDone.replace("Done e", "E");
							var tmp = this.$.lblTime.getContent();
							tmp = tmp.replace("past due", "late");
							this.$.lblTime.setContent(tmp);
							this.$.lblDur.setStyle("font-size:70%;position:relative;top:-10px;font-weight:bold;");
						}
						else {
							this.$.lblTitle.setStyle("font-size:120%;font-weight:bold;");
							this.$.lblDur.setStyle("position:relative;top:-5px;font-weight:bold;");
							this.$.lblTime.setStyle("");
							xW = xW / 3;
						};
					}
					else {
						this.$.lblTitle.setStyle("font-size:110%;font-weight:bold;position:relative;top:-1px;");
					};
					this.$.lblDur.setShowing(true);
					this.$.lblDur.setContent(sDone);

					if (this.inCustomView == 1 && inTagMode == 0) {
						this.$.choreItem.setClassName("enyo-item listPhoneCustom listBack" + this.$.fd.getPercent(x,y,0));
					}
					else if (this.inCustomView == 0 && inTagMode == 1) {
						this.$.choreItem.setClassName("enyo-item listPhoneTagMode listBack" + this.$.fd.getPercent(x,y,0));
					}
					else if (this.inCustomView == 1 && inTagMode == 1) {
						this.$.choreItem.setClassName("enyo-item listPhoneCustomTagMode listBack" + this.$.fd.getPercent(x,y,0));
					}
					else {
						this.$.choreItem.setClassName("enyo-item listPhone listBack" + this.$.fd.getPercent(x,y,0));
					};

					if (xW <=100) {
						var tN = 9;
					}
					else if (xW > 100 && xW <=320) {
						var tN = 14;
					}
					else if (xW > 320 && xW <=350) {
						var tN = 16;
					}
					else if (xW >350 && xW <=400) {
						var tN = 21;
					}
					else if (xW >400 && xW <=480) {
						var tN = 14;
					}
					else if (xW >480) {
						var tN = 31;
					};
					var sn = chore.getItemInfo(iIn, "name");
					if (sn.length > tN) {sn = sn.substr(0,(tN-3)) + "...";};
					this.$.lblTitle.setContent(sn);

					//this.$.lblTitle.setContent("listBack" + this.$.fd.getPercent(x,y,0))
					//this.$.choreItem.setStyle("min-height:75px;")
					this.$.touchBar.setSrc("");
					if (this.$.touchBar.getShowing() == true){
						this.$.touchBar.setShowing(false);
					};
					if (this.$.imgIcon.getClassName() != "imgPhone") {
						this.$.imgIcon.setClassName("imgPhone");
					};
					if (this.$.editButton.getShowing() == true) {
						this.$.editButton.setShowing(false);
						this.$.editButtonSmall.setShowing(true);
					};

					if (this.$.checkButton.getDefaultClassName() != "checkButtonPhone") {
						this.$.checkButton.setDefaultClassName("checkButtonPhone");
						this.$.checkButton.setClickClassName("checkButtonPhoneClick");
						this.$.checkButton.setToDefault();
					};
				}
				else {

					//this.$.touchBar.setStyle("width:100%;height:75px;")
					var sn = chore.getItemInfo(iIn, "name");
					if (xW > 800) {
						if (sn.length > 32) {sn = sn.substr(0,(29)) + "...";};
					}
					else {
						if (sn.length > 25) {sn = sn.substr(0,(22)) + "...";};
					};
					if (this.viewMode == 1) {
						this.$.lblDur.setShowing(true);
						this.$.lblDur.setContent(sDone);
						this.$.lblTitle.setContent(sn);
						this.$.lblTitle.setStyle("font-size:105%;font-weight:bold;");
						this.$.touchBarLayout.setStyle("padding-left:10px;padding-right:10px;padding-top:4px;");
						this.$.lblTime.setClassName("lblTimePhone");
					}
					else {
						this.$.lblTime.setClassName("lblTimeTouchpad");
						this.$.lblTitle.setContent(sn + " - " + sDone);
					}
					var tt = this.$.fd.getPercent(x,y,0);
					var end = ".png";
					if (this.viewMode == 1) {end = "p" + end};
					this.$.touchBar.setSrc("images/" + tt + end);
					//this.log(this.$.touchBar.getSrc());
					if (this.$.touchBar.getShowing() == false){
						this.$.touchBar.setShowing(true);
					}
					//this.log(this.$.touchBar.getShowing() + ", images/" + this.$.fd.getPercent(x,y,0) + ".png")
					if (this.inCustomView == 1 && inTagMode == 0) {
						this.$.choreItem.setClassName("listBackTouchpadCustom listTouchpad");
					}
					else if (this.inCustomView == 0 && inTagMode == 1) {
						this.$.choreItem.setClassName("listBackTouchpadTagMode listTouchpad");
					}
					else if (this.inCustomView == 1 && inTagMode == 1) {
						this.$.choreItem.setClassName("listBackTouchpadCustomTagMode listTouchpad");
					}
					else {
						if (tt <= 0) {
							this.$.choreItem.setClassName("listBackTouchpadPastdue listTouchpad");
						}
						else {
							this.$.choreItem.setClassName("listBackTouchpad listTouchpad");
						};
					};

					//this.$.choreItem.setStyle("min-height:175px;")
					if (this.$.imgIcon.getClassName() != "imgTouchpad") {
						this.$.imgIcon.setClassName("imgTouchpad");
					};
					if (this.$.editButtonSmall.getShowing() == true) {
						this.$.editButton.setShowing(true);
						this.$.editButtonSmall.setShowing(false);
					};

					if (this.$.checkButton.getDefaultClassName() != "checkButtonTouchpad") {

						this.$.checkButton.setDefaultClassName("checkButtonTouchpad");
						this.$.checkButton.setClickClassName("checkButtonTouchpadClick");
						this.$.checkButton.setToDefault();
					};
					//this.log(this.$.touchBar.getSrc())
				};
				x  = chore.getItemInfo(iIn, "pic");
				//this.log("img index:" + x)
				//if (x.length > 0) {
					//this.log("setting image")
				if (Number(x) == -1) {
					this.$.imgIcon.setSrc("images/icon64.png");
				}
				else {
					this.$.imgIcon.setSrc("images/img" + (Number(x) + 1) + ".png");
				};

					//this.log("SETUPROW")
				//};
				//this.$.record.setContent(s)
				return true;
			};
		};
		}
		catch (e) {
			this.error("setup row errored" +e);
		};
	},

	formatScales: function(s,uod) {
		if (this.touchPad == 0 || this.viewMode == 1) {
			if (uod == 0) {
				s = s.toUpperCase();
			}
			else {
				s = s.toLowerCase();
			};
			s = s.substr(1,1);

		};
		return s;
	},
	showpop: function() {
		//if (this.$.helppop.getOpened() == 1) {this.$.helppop.close();};
		var results = this.GetTopLeft()
		results.top = results.top - 15
		var y = window.outerWidth
		if (this.viewMode == 2) {
			results.left = results.left - 10
			if ((this.section == 1 || this.section == 5 || this.section == 6) && y < 800 ) {
				results.left = results.left - 50
			}
		}
		this.log(results)
		this.$.pSelect.openAt(results, true);
	},
	changeDisplay: function(iS, o) {

		var results = this.GetTopLeft();
		var pos = {top: results.top + results.height - 70,
				   left: results.left
		          };
		this.$.exitView.openAt(pos);
		this.inCustomView = 1;
		this.doInCustom(true);
		this.currentDisplay = o;
		//this.log(o.radio);
		this.$.customChores.clearItems();
		if (o.radio == 0) {
			var finalA = [];
			for (var i = 0;i < this.$.chores.getItemCount();i++) {
				var d = this.$.fd.getPercent(this.$.chores.getItemInfo(i,"last"),0,1);
				var s = this.$.chores.getItemInfo(i,"done");
		        var Arr = s.split(",");
		        d = this.$.fd.dateAdd(d,Arr[1],Number(Arr[0]));

		        if ( (d.getFullYear() > o.rangeMin.getFullYear()) ||
		        		(d.getFullYear() == o.rangeMin.getFullYear() && d.getMonth() > o.rangeMin.getMonth()) ||
		        		(d.getFullYear() == o.rangeMin.getFullYear() && d.getMonth() == o.rangeMin.getMonth() &&
		        		 d.getDate() >= o.rangeMin.getDate()) ) {

		        	if ( (d.getFullYear() < o.rangeMax.getFullYear()) ||
		        			(d.getFullYear() == o.rangeMax.getFullYear() && d.getMonth() < o.rangeMax.getMonth()) ||
		        			(d.getFullYear() == o.rangeMax.getFullYear() && d.getMonth() == o.rangeMax.getMonth() &&
		        			 d.getDate() <= o.rangeMax.getDate()) ) {

		        		        this.$.customChores.feedItem(this.$.chores.choreList[i].sName,
										                     this.$.chores.choreList[i].sDone,
											                 this.$.chores.choreList[i].sLast,
											                 this.$.chores.choreList[i].sPic,
											                 this.$.chores.choreList[i].sNotes,
											                 this.$.chores.choreList[i].sFlags,
											                 this.$.chores.choreList[i].sTags
											                );


		        	};
		        };
			};
			this.refreshList(true, false);
		}
		else if (o.radio == 1) {
			this.log(o.radioDay);
			if (o.radioDay == 0) {
				var d = o.singleDate;
				for (var i = 0;i < this.$.chores.getItemCount();i++) {
					var d1 = this.$.fd.getPercent(this.$.chores.getItemInfo(i,"last"),0,1);
					var s = this.$.chores.getItemInfo(i,"done");
			        var Arr = s.split(",");
			        d1 = this.$.fd.dateAdd(d1,Arr[1],Number(Arr[0]));
			        this.log(d1 + "," + d);
			        if ( (d.getDate() == d1.getDate()) && (d.getMonth() == d1.getMonth()) && (d.getFullYear() == d1.getFullYear())  ) {

			        	this.$.customChores.feedItem(this.$.chores.choreList[i].sName,
								                     this.$.chores.choreList[i].sDone,
									                 this.$.chores.choreList[i].sLast,
									                 this.$.chores.choreList[i].sPic,
									                 this.$.chores.choreList[i].sNotes,
									                 this.$.chores.choreList[i].sFlags,
									                 this.$.chores.choreList[i].sTags
									                );
			        };
				};
				this.refreshList(true, false);
			}
			else {
				var d = new Date();
				var x = d.getDay();
				var y = o.day;
				if (y > x) {
					d = this.$.fd.dateAdd(d,"days", (7 - (y - x )));
				}
				else {
					d = this.$.fd.dateAdd(d,"days", 7 - (x - y ));
				};
				for (var i = 0;i < this.$.chores.getItemCount();i++) {
					var d1 = this.$.fd.getPercent(this.$.chores.getItemInfo(i,"last"),0,1);
					var s = this.$.chores.getItemInfo(i,"done");
			        var Arr = s.split(",");
			        d1 = this.$.fd.dateAdd(d1,Arr[1],Number(Arr[0]));
			        this.log(d + "," + d1);
			        if (this.tempA[i].sFlags.indexOf("useday:1@") > -1) {
				        if ( (d.getDate() == d1.getDate()) && (d.getMonth() == d1.getMonth()) && (d.getFullYear() == d1.getFullYear())  ) {

				        	this.$.customChores.feedItem(this.$.chores.choreList[i].sName,
									                     this.$.chores.choreList[i].sDone,
										                 this.$.chores.choreList[i].sLast,
										                 this.$.chores.choreList[i].sPic,
										                 this.$.chores.choreList[i].sNotes,
										                 this.$.chores.choreList[i].sFlags,
										                 this.$.chores.choreList[i].sTags
										                );
				        };
			        };
				};
				this.refreshList(true, false);
			}
		}
		else if (o.radio == 2) {
			for (var i = 0;i < this.$.chores.getItemCount();i++) {
				if (this.$.chores.choreList[i].sFlags.indexOf("useday:1@") < 0) {
					var s = this.$.chores.getItemInfo(i,"done");
			        var Arr = s.split(",");
			        this.log(Arr + "," + o.durVal + "," + o.durScale);
			        if (o.durVal == 0) {
			        	if (Arr[1] == o.durScale) {
			        		this.$.customChores.feedItem(this.$.chores.choreList[i].sName,
									                     this.$.chores.choreList[i].sDone,
										                 this.$.chores.choreList[i].sLast,
										                 this.$.chores.choreList[i].sPic,
										                 this.$.chores.choreList[i].sNotes,
										                 this.$.chores.choreList[i].sFlags,
										                 this.$.chores.choreList[i].sTags
										                );
			        	}
			        }
			        else {
			        	if (Arr[1] == o.durScale && Number(Arr[0]) == o.durVal) {
			        		this.$.customChores.feedItem(this.$.chores.choreList[i].sName,
									                     this.$.chores.choreList[i].sDone,
										                 this.$.chores.choreList[i].sLast,
										                 this.$.chores.choreList[i].sPic,
										                 this.$.chores.choreList[i].sNotes,
										                 this.$.chores.choreList[i].sFlags,
										                 this.$.chores.choreList[i].sTags
										                );
			        	};
			        };
				};
		    };
			this.refreshList(true, false);
		}
		this.$.pSelect.close();
	},
	reloadData: function() {
		this.$.exitView.close();
		this.inCustomView = 0;
		this.doInCustom(false);
		this.$.customChores.clearItems();
		this.currentDisplay = {};

		this.refreshList(true, false);

	},
	closeSelect: function() {
		this.$.pSelect.close();
	},
	GetTopLeft: function () {

		var x, y = 0;
		var elm = this.$.choreList.hasNode()
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
	},
});

enyo.kind({
    kind:"Popup",
    name:"TagBuilder",
    published: {
    	currentTags: ""

    },
    events: {
    	onTagChange: "",
    	onTextFocus: ""
    },

    style: "width: 300px;",
    components:[
    	/*
		A list of all tags
		a way to type tags in
		& operator
		, operator

		input  button
		&    ,
    	*/
    	{layoutKind: "VFlexLayout", components:[
    		{layoutKind: "HFlexLayout", components:[
		    	{kind: "Button", caption: "C", className: "enyo-button-negative", onclick: "clearTags", style: "width:20px;height:20px;"},
		    	{kind: "Input",onfocus: "checkPopup",onkeypress: "checkFinished" , alwaysLooksFocused: true,style: "width: 160px;", name: "tagFilter", hint: "", onclick:"resetKeyboard"},
		    	{kind: "TagList",name: "tagList", caption: "...", onTagSelected: "appendTag", className: "enyo-button-blue"}

		    ]},
	    	{layoutKind: "HFlexLayout", components:[
	    		{kind: "RadioGroup", name: "radio", value: ", ", components: [
				    {caption: "And (\"&\")", icon: "", value: " & "},
			        {caption: "Or (\",\")", icon: "", value: ", "}
				]},
	    		{kind: "Button",flex:1, caption: "OK", className: "enyo-button-affirmative", onclick: "tagsFinished"}
	    	]}
    	]}
	],
	rendered: function() {
    	this.inherited(arguments);
    	this.currentTagsChanged()
    	//this.currentTagsChanged();
    },
    checkFinished: function(iS, iE) {
    	if (iE.keyCode == 13) {
    		this.tagsFinished()
    	}
    },
    checkPopup: function() {
    	this.doTextFocus();
    },
    currentTagsChanged: function() {
    	this.$.tagFilter.setValue(this.currentTags);
    },
    tagsFinished: function() {
    	var s = this.$.tagFilter.getValue();
    	this.doTagChange(s);
    	this.close();
    },
    setTagList: function(t) {
    	this.log(t)
    	this.$.tagList.setAllTags(t);
    	this.$.tagList.setItems();
    },
    resetKeyboard: function() {
    	enyo.keyboard.forceShow();
    },
    appendTag: function(iS, iE) {
    	var s = this.$.tagFilter.getValue();
    	if (s.length == 0) {
    		s = s + iE;
    	}
    	else {
	    	try {
	    		s = enyo.string.trim(s);
	    	}
	    	catch (e) {};
	    	var t = s.substr(s.length - 1);
	    	if (t == "," || t == "&") {
	    		s = s + " " + iE;
	    	}
	    	else {
	    		s = s + this.$.radio.getValue() + iE;
	    	}
	    }
	    this.$.tagFilter.setValue(s);
	    var elm = this.$.tagFilter.hasNode()
	    if (elm) {
	    	elm.scrollTop = elm.scrollHeight
	    	this.$.tagFilter.forceFocus()
	    }

	   // this.$.tagFilter.getSelection().collapseToEnd();
	    //this.$.tagFilter.setSelection({start: s.length-1, end: s.length-1})
    },
    clearTags: function() {
    	this.$.tagFilter.setValue("");
    }
});

enyo.kind({
    kind:"Button",
    name:"TagList",
    published: {
    	allTags: []
    },
    events: {
    	onTagSelected: ""
    },
    components:[
    	{kind: "PopupSelect", name: "tagMenu", onSelect: "itemSelected"}
    ],
    rendered: function() {
    	this.inherited(arguments);
    	this.setItems();
    },
    setItems: function() {
    	//this.log(this.allTags)
    	this.$.tagMenu.setItems(this.allTags);
    },
    itemSelected: function(inSender, inSelected) {
    	this.doTagSelected(inSelected.getValue());
    	this.$.tagMenu.openAt(this.GetTopLeft());
    },
    clickHandler: function() {
    	if (this.allTags.length > 0) {
	    	enyo.keyboard.setManualMode(true)
	    	this.$.tagMenu.openAt(this.GetTopLeft());
	    }
    },
    GetTopLeft: function () {

		var x, y = 0;
		var elm = this.hasNode()
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
			return {top:y , left: x	};

		}
		return {top:0, left: 0};
	},
});