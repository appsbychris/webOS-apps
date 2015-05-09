enyo.kind({
	name: "addView",
	kind: "Pane",
	published: {
		imageCount: 70,
		touchPad: 0,
		selectedImg: -1,
		scrollIndex: 0
	},
	className: "mainBack",
	events: {
		onCanceled:"",
		onAdd:"",
		onNoName:""
	},
	components: [
	{kind: "myScroller", name:"myScroll"},
	{kind:"fDates", name:"fd"},
	{kind: "VFlexBox",flex:1,components:[
	{layoutKind: "HFlexLayout",style:"width:100%,height:40px;margin-right:10px;margin-left:10px;",align:"start",pack:"end",components: [
	{content: "Add Chore:",flex:1,style:"font-size:130%;font-weight:bold;"},
 //{layoutKind: "HFlexLayout",flex:1,style:"width:100%,height:40px;",align:"end",pack:"end",components: [
 {kind: "Button",name:"cancelBtn", caption: "Cancel", onclick: "cancelClick"},
 {kind: "Button", className: "enyo-button-affirmative", caption: "Add Chore", onclick: "addChore"}
	 //]}
	 ]},
	 {kind:"VFlexBox",flex:1, components:[
	 {kind: "Scroller",name:"addScroller", flex:1,components:[
				//{kind: "Group",caption: "Add a Chore", flex:1, components:[
				{layoutKind: "VFlexLayout", flex: 1, pack: "center", align: "center",components:[
				{kind: "Input", name: "choreName", hint:"Enter Chore Name...", alwaysLooksFocused: true,inputClassName:"textTitle", onclick:"resetKeyboard"},
				{layoutKind: "HFlexLayout", components: [
				{kind: "Input", name: "itemTags", hint: "Enter Tags (tag1, tag2, tag3)", alwaysLooksFocused: true, flex:1, onclick:"resetKeyboard"},
				{kind: "TagList", name: "tagList",style: "margin-top:3px;", className: "enyo-button-blue", onTagSelected: "appendTag", caption: "..."}
					//{kind: "Button", caption: "...", onclick: "openTagList"}
					]},

					{layoutKind: "HFlexLayout", style: "margin-bottom:7px;margin-top:7px;",components: [
					{kind: "MyCustomButton",style: "margin-top:7px;", name: "checkExpire",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn"},
					{layoutKind: "VFlexLayout", components: [
					{content: "Delete After Completed: ", style: "margin-left:3px;"},
					{layoutKind: "HFlexLayout", style: "",components: [
					{kind: "IntegerPicker",name:"expirePicker", label: "", min: 1, max: 100,value: 1},
					{content: "times", style: "margin-top:9px;"}
					]}
					]}
					]},

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

					{layoutKind: "HFlexLayout", style: "margin-bottom:10px;",components: [
					{kind: "MyCustomButton", name: "checkDefault",buttonType:"check", defaultClassName:"checkOff",checkedClassName:"checkOn", onButtonClicked: "removeSelected"},
					{content: "Default Image: "},
					{kind: "Image", src: "images/icon64.png"}
					]}
					]},
					{layoutKind:"VFlexLayout",name: "imageContainer", flex:1,components:[
				//{kind:"Scroller", height:"80px", vertical:false, components:[
				{layoutKind: "HFlexLayout", components: [
				{flex: 1},
					//{kind: "Button", caption: "<", onclick: "scrollBack"},
					//{kind: "Button", caption: ">", onclick: "scrollForward"}
					{kind: "FastScroller", onDragForward: "scrollForward", onDragBackward: "scrollBack"}
					]},
					{kind:"HVirtualList",name:"iimageList", onSetupRow:"setuprow",height:"80px", components:[
					{kind: "Item",name:"imgItem", onclick: "itemClick", components: [
								// {layoutKind:"VFlexLayout", flex:1,pack:"center", align: "center", components:[
								{kind: "Image", name: "clipImg"}
			//]}

			]}
			]},
			]},
			{kind: "RichText", name:"notes", hint:"Notes...", alwaysLooksFocused:true, inputClassName:"textNotes", style:"margin-top:10px;", onclick:"resetKeyboard"},

				//]}
				//]}
				]}
				]}
				]}
				],
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
				resetKeyboard: function() {
					enyo.keyboard.setManualMode(false)
				},
				setTagList: function(t) {
					this.$.tagList.setAllTags(t);
					this.$.tagList.setItems();
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
				rendered: function() {
					this.inherited(arguments);



				},
				refreshPage: function() {
					this.selectedImg = -1;
					this.$.checkDefault.setChecked(true)
					this.$.choreName.setValue("");
					this.$.notes.setValue("");
					this.$.itemTags.setValue("")
					this.$.durScale.setValue("weeks");
					this.setInts();
					this.$.durVal.setValue(1);
					this.$.dpick.setValue(new Date());
					this.$.tpick.setValue(new Date());
					this.$.myScroll.scrollTo(0,this.$.iimageList);
					this.$.addScroller.scrollIntoView(0,0);
					if (this.touchPad == 1) {
						this.$.iimageList.setStyle ( "height:100px;border:2px solid black;");
						this.$.cancelBtn.setShowing(true);
						this.$.imageContainer.setStyle("position:relative;top:-30px;")
					}
					else {
						this.$.iimageList.setStyle ( "height:85px;border:2px solid black;");
						this.$.cancelBtn.setShowing(false);
						this.$.iimageList.setAccelerated(false);
						this.$.addScroller.setAccelerated(false);
						this.$.imageContainer.setStyle("position:relative;top:-10px;");
					}
					this.$.iimageList.refresh();

				},
				itemClick: function(iS,iIn) {
					this.log(iS);
		//this.log(enyo.json.stringify(iIn))
		this.$.checkDefault.setChecked(false)
		this.selectedImg = iIn.rowIndex;
		//extra item handling...
		if (this.selectedImg > this.imageCount) {this.selectedImg = this.imageCount}
			this.log (this.selectedImg)
		this.$.iimageList.refresh();
	},
	setuprow: function(is,iIn) {
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
	cancelClick: function() {
		this.resetKeyboard();
		this.doCanceled();
	},
	addChore: function() {
		this.resetKeyboard();
		var p = this.$.choreName.getValue();
		var sTags = this.$.itemTags.getValue();

		if (p.length >0) {
			sTags = sTags.replace(/&/gi,"")
			if (this.$.radio.getValue() == 0) {
				var s = {
					cname: this.$.choreName.getValue(),
					cdone: this.$.durVal.getValue() + "," + this.$.durScale.getValue(),
					clast: this.$.dpick.getValue(),
					clastt: this.$.tpick.getValue(),
					cpic: this.selectedImg,
					cnotes: this.$.notes.getValue(),
					cwhich: 0,
					ctags: sTags,
					cexpire: this.$.checkExpire.getChecked(),
					cexpiretime: this.$.expirePicker.getValue()
				};
			}
			else {
				var d = new Date();
				var x = d.getDay();
				var y = this.$.dayPicker.getValue();
				if (y > x) {
					d = this.$.fd.dateAdd(d,"days",-1 * (7 - (y - x )));
				}
				else {
					d = this.$.fd.dateAdd(d,"days",-1 * (x - y ));
				};
				this.log(d);
				var s = {
					cname: this.$.choreName.getValue(),
					cdone: "7,days",
					clast: d,
					clastt: d,
					cpic: this.selectedImg,
					cnotes: this.$.notes.getValue(),
					cday: y,
					cwhich: 1,
					ctags: sTags,
					cexpire: this.$.checkExpire.getChecked(),
					cexpiretime: this.$.expirePicker.getValue()
				};
			};
			this.doAdd(s);
		}
		else {
			this.doNoName();
		};
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
	}
});

enyo.kind({
	kind: "HFlexBox",
	name: "FastScroller",
	style: "width: 160px;height:30px;",
	className: "spinner1",
	handlingDrag: false,
	triggerDistance: 20,
	events: {
		onDragForward: "",
		onDragBackward: ""
	},
	animateIndex: 1,
	dragstartHandler: function(inSender, inEvent) {
		//this.resetPosition();
		if (inEvent.horizontal && this.hasNode()) {

			this.handlingDrag = true;
			//this.doGesStart(inEvent)
			return true;
		} //else {
		//	return this.fire("ondragstart", inEvent);
		//}
	},
	dragHandler: function(inSender, inEvent) {
		var dx = inEvent.dx;
		if (this.handlingDrag) {
				//this.node.style.webkitTransform = "translate3d(" + dx + "px, 0, 0)";
				//this.doGes(inEvent);
				//this.log(dx)
				if (dx > 0) {
					this.setClassName("spinner" + this.animateIndex);
					this.animateIndex--;
					if (this.animateIndex < 1) {this.animateIndex = 3;};
					this.doDragBackward();
				}
				else {
					this.setClassName("spinner" + this.animateIndex);
					this.animateIndex++;
					if (this.animateIndex > 3) {this.animateIndex = 1;};
					this.doDragForward();
				}
				return true;
			}
		},
		dragfinishHandler: function(inSender, inEvent) {
			if (this.handlingDrag) {
				var dx = inEvent.dx;
			//inEvent.preventClick();
			//this.log(dx)
			window.setTimeout(enyo.bind(this,function() {this.handlingDrag = false;}), 500);
			//this.resetPosition();
			if (dx > 0) {
				//this.handleSwipe();
				//this.doGesEnd(inEvent)
			}
			else {
				//this.doGesInc()
			}
			return true;
		} else {
			//this.fire("ondragfinish", inEvent);
		}
	},

});