var PanAndZooms = [{caption: "None", value: "-1"},
			       {caption: "Pan Horizontally Across Center", value: "0"},
			       {caption: "Pan Horizontally Across Top", value: "4"},
			       {caption: "Pan Horizontally Across Bottom", value: "5"},
			       {caption: "Pan Vertically Centered", value: "1"},
			       {caption: "Pan Vertically On Left", value: "6"},
			       {caption: "Pan Vertically On Right", value: "7"},
			       {caption: "Pan Diagonally Top Left To Bottom Right", value: "2"},
			       {caption: "Pan Diagonally Top Right To Bottom Left", value: "3"}
			      ]
var RandomPan = function() {
	var al = PanAndZooms.length;
    var n = Math.floor((Math.random() * al));
    if (n == 0) {n = 1;};
     
    return PanAndZooms[n].value;
};	



enyo.kind({
	name: "PanAndZoomSuperPickerBase",
	kind: "VFlexBox",
	published: {
		items: [],
        popOpen: false,
        settings: {
	        value: 0,
	        dir: 0,
	        firstSrc: "",
	        secondSrc: ""
    	},
    	storedValue: "",
    	useRandom: false
	},
	className: "superPickerBaseButton",
	events: {
		onChange: ""
	},
	components: [
		{content: "Pan", name: "tName", style: "font-size: 70%;font-weight:bold;", onclick: "openPicker"},
		{kind: "VFlexBox",name: "cSelect", onclick: "openPicker"},
		{content: "0", name: "tSpd", style: "font-size: 58%;font-weight:bold;position:relative;top:-3px;",showing: false, onclick: "openPicker"},
		
		{kind: "Toaster",className: "editListItem", flyInFrom: "right"/*openClassName: "superPickerBaseOpen"*/, onOpen: "resetClassName", layoutKind: "VFlexLayout",width:"100%",height:"500px",lazy: false, name: "p",components: [
			{kind: "VFlexBox", components:[
				{kind: "PanAndZoomSuperPicker", name: "sp",onScrollStart: "closePopup", onPopOpen: "setPop",onScroll:"setLeft", onSelected: "storeValue"}
			]},
			{kind: "Pane", components:[
				{kind: "Pane", components:[
					{kind: "VFlexBox", components:[
						{kind: "CustomRadioSelect",  name: "tSpeed", onClicked: "setTSpeed", items: [
							{defaultClassName: "randomIcon",
					    	 checkedClassName: "",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: 1
							},
							{defaultClassName: "leftArrow",
					    	 checkedClassName: "",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: -1
							},
							{defaultClassName: "rightArrow",
					    	 checkedClassName: "",
							 selectedClassName: "radioSelected",
							 unSelectedClassName: "radioUnSelected",
							 value: 0
							}
					    ]},
						{layoutKind: "HFlexLayout", style: "margin-top:15px;", components: [
							{kind: "Button", caption: "Cancel", onclick: "cancelMe", className: "enyo-button-negative"},
							{kind: "Button", caption: "OK",flex:1, className: "enyo-button-affirmative", onclick: "checkForChange"}
						]}
					]}
				]}
			]}
		]}
	],
	rendered: function() {
		this.inherited(arguments)
		this.useRandomChanged()
		this.itemsChanged()
		this.settingsChanged()
		this.$.sp.loadItems()

		this.setIcons(parseInt(this.settings.value))
	},
	setIcons: function(x) {
		this.log(x)
		if (this.useRandom == false) {
			this.$.tSpeed.setItemShowing(1, false);
		}
		else {
			this.$.tSpeed.setItemShowing(1, true);
		};
		switch (parseInt(x)) {
		    case -1: {
		    	//this.log("-1")
		    	this.$.tSpeed.hide();
		    	break;
		    }
		    case 0: case 4: case 5:{
		    	//this.log("045")
		    	this.$.tSpeed.show();
		    	this.$.tSpeed.setItemShowing(-1, true);
		    	this.$.tSpeed.setItemShowing(0, true);
		    	this.$.tSpeed.setDefaultClassName(-1, "leftArrow");
		    	this.$.tSpeed.setDefaultClassName(0, "rightArrow");
		    	/*this.$.dir1.setIcon("images/left.png");
		    	this.$.dir2.setIcon("images/right.png");*/
		    	break;
		    }
		    case 1: case 6: case 7: {
		    	//this.log("167")
		    	this.$.tSpeed.show();
		    	this.$.tSpeed.setItemShowing(-1, true);
		    	this.$.tSpeed.setItemShowing(0, true);
		    	this.$.tSpeed.setDefaultClassName(-1, "upArrow");
		    	this.$.tSpeed.setDefaultClassName(0, "downArrow");
		    	/*this.$.dir1.setIcon("images/up.png");
		    	this.$.dir2.setIcon("images/down.png");*/
		    	break;
		    }
		    case 2: {
		    	//this.log("2")
		    	this.$.tSpeed.show();
		    	this.$.tSpeed.setItemShowing(-1, true);
		    	this.$.tSpeed.setItemShowing(0, true);
		    	this.$.tSpeed.setDefaultClassName(-1, "topLeftArrow");
		    	this.$.tSpeed.setDefaultClassName(0, "bottomRightArrow");
		    	/*this.$.dir1.setIcon("images/topleft.png");
		    	this.$.dir2.setIcon("images/bottomright.png");*/
		    	break;
		    }
		    case 3: {
		    	this.log("3")
		    	this.$.tSpeed.show();
		    	this.$.tSpeed.setItemShowing(-1, true);
		    	this.$.tSpeed.setItemShowing(0, true);
		    	this.$.tSpeed.setDefaultClassName(-1, "topRightArrow");
		    	this.$.tSpeed.setDefaultClassName(0, "bottomLeftArrow");
		    	/*this.$.dir1.setIcon("images/topright.png");
		    	this.$.dir2.setIcon("images/bottomleft.png");*/
		    	break;
		    }
		    default: {
		    	this.$.tSpeed.show();
		    	this.$.tSpeed.setItemShowing(-1, false);
		    	this.$.tSpeed.setItemShowing(0, false);
		    	this.$.tSpeed.setValue(1)
		 		break;   	
		    }
	    }
	},
	useRandomChanged: function() {
		if (this.useRandom == true) {
			this.items = []
			this.items[0] = {caption: "Random", value: "Random"}
			this.items = this.items.concat(PanAndZooms)
			//this.$.random.setShowing(true)
		} 
		else{
			this.items = []
			this.items = PanAndZooms
			//this.$.random.setShowing(false)
		};
	},
	checkForChange: function() {
		var x = this.$.tSpeed.getValue()
		if (this.settings.value != this.storedValue || parseInt(this.settings.dir) != parseInt(x)) {
			this.settings.value = this.storedValue
			this.settings.dir = x
			this.settingsChanged()
			this.doChange()
		}
		this.$.p.close()
	},
	cancelMe: function() {
		this.$.p.close()
	},
	storeValue: function(iS, iV) {
		this.storedValue = iV
		this.setIcons(iV)
		this.log(iV)
	},
	settingsChanged: function() {
		this.$.tSpeed.setValue(this.settings.dir);
		this.setTSpeed();
		if (this.settings.value != "Random") {
			this.settings.value = parseInt(this.settings.value);
			if (isNaN(this.settings.value)) {this.settings.value = -1};
		}
		
		this.storedValue = this.settings.value
		this.$.sp.valueSelected(this.settings.value)
		PanAndZoomSuperPickerScroll.fSrc = this.settings.firstSrc
		PanAndZoomSuperPickerScroll.sSrc = this.settings.secondSrc
		this.$.cSelect.setStyle("background: url(images/panandzoom" + this.settings.value + ".png) 0 0 no-repeat;width:100%;height:50px;position:relative;top:-3px;left:-2px;background-size:100% 100%;")
		
		var c = this.getProperValue(this.settings.value, true)
		this.$.tName.setContent(c)
		c = this.settings.dir
		if (c == -1) {
			c = "-1"
		} 
		else if (c == 0) {
			c = "0"
		}
		else if (c == 1) {
			c = "Random"
		}
		this.$.tSpd.setContent(c)
		this.setIcons(parseInt(this.settings.value))
	},
	setPop: function() {
		this.popOpen = true
		this.log()
		this.$.sp.stop()
	},
	setTSpeed: function() {
		PanAndZoomSuperPickerScroll.tSpeed = this.$.tSpeed.getValue()
		this.log(PanAndZoomSuperPickerScroll.tSpeed)
		this.$.sp.tSpeed()

	},
	itemsChanged: function() {
		this.$.sp.setItems(this.items)
	},
	resetClassName: function() {
		this.setClassName("superPickerBaseButton")
	},
	openPicker: function() {
		this.setClassName("superPickerBaseButtonClick")
		//this.$.p.setClassName("enyo-popup2")
		window.setTimeout(enyo.bind(this,function() {
			this.$.p.openAtCenter()
			this.settingsChanged();
		}), 30);
		//this.$.p.setStyle("")
	},
	closePopup: function() {
		//this.log()
		if (this.popOpen == true) {
			this.$.sp.closePopup()
			this.popOpen = false
		}
	},
	setLeft: function() {
		PanAndZoomSuperPickerScroll.ScrollLeft = this.$.sp.getScrollLeft()
		//this.log(SuperPickerScroll.ScrollLeft)
	},
	getProperValue: function (inVal, bShort) {
		var c = "";
		var b = bShort
		var f = false
		//this.log(this.shortArray.length)
		//this.initArray()
		for (var i=0;i <= this.items.length; i++) {
			//this.log(this.shortArray[i] + " = " + inVal)
			if (this.items[i] && this.items[i].value == inVal) {
				c =  this.items[i].caption;
				f = true;
				break;
			}
		}
		if (f == true) {
			if (b == true) {
				this.log(c)
				return this.shortName(c);
			}
			else {
				return c;
			}
		}
		return "None"
	},
	shortName: function(inStr) {
		var s = inStr;
		
		if (s.length > 0) {
			s = s.replace("Horizontally", "Horiz.");
			s = s.replace("Vertically", "Vert.");
			s = s.replace("Diagonally", "Diag.");
			s = s.replace(/ /gi, "");
		}
		return s;
	},
});

var PanAndZoomSuperPickerScroll = {};
PanAndZoomSuperPickerScroll.ScrollLeft = 0;
PanAndZoomSuperPickerScroll.tSpeed = 0;
PanAndZoomSuperPickerScroll.fSrc = "";
PanAndZoomSuperPickerScroll.sSrc = "";

enyo.kind({
	name: "PanAndZoomSuperPicker",
	kind: "Scroller",
	height: "340px",
	width: "100%",
	vertical: false, 
	autoVertical: false,
	className: "superPickerBack",
	published: {
		items: [{caption: "",value: ""}],
		componentsCreated: false
	},
	events: {
		onPopOpen: "",
		onSelected: ""

	},
	components: [
		{kind: "HFlexBox",flex:1, name: "superPicker"}
	],
	scrollToView: function(iS, iV) {
		this.log(iV)
		this.scrollIntoView(0, iV)
	},
	tSpeed: function() {
		if (this.componentsCreated == true) {
			for (var i = 0; i < this.items.length; i = i + 2) {
				if (this.$["item" + i].isPopOpen() == true) {
					break;
				}
			};
		};
	},
	closePopup: function() {
		//this.log()
		if (this.componentsCreated == true) {
			for (var i = 0; i < this.items.length; i = i + 2) {
				this.$["item" + i].closePopup();
			};
		}
	},
	closeOtherPops: function(iS, iI) {
		if (this.componentsCreated == true) {
			for (var i = 0; i < this.items.length; i = i + 2) {
				if ("item" + i != iS.name) {
					this.$["item" + i].closePopup();
				}
				else {
					var x = iI.substr(4)
					if (x == 1) {
						x = 2
					}
					else {
						x = 1
					}
					this.$["item" + i].closeSinglePopup(x);	
				}
			};
			this.doPopOpen()
			this.log()
		};
	},
	rendered: function() {
		this.inherited(arguments)
	},
	loadItems: function() {
		var x = []
		if (this.componentsCreated == false) {
			for (var i = 0; i < this.items.length; i = i + 2) {
				this.log(this.items[i].value)
				if (i + 1 < this.items.length) {
					x[x.length] = { kind: "PanAndZoomSuperPickerItem",
								    name: "item" + i, 
									item1Caption: this.items[i].caption, 
									item2Caption: this.items[i+ 1].caption, 
									item1Val: this.items[i].value, 
									item2Val: this.items[i+ 1].value,
									style: "margin-right: 5px;margin-top:10px;margin-left:5px;", 
									onItemClicked: "itemClick",
									onPopOpen: "closeOtherPops", 
									onScrollNeeded: "scrollToView"
								   }
												    
				}
				else {
					x[x.length] = { kind: "PanAndZoomSuperPickerItem",
									name: "item" + i, 
									item1Caption: this.items[i].caption,  
									item1Val: this.items[i].value, 
									style: "margin-right: 5px;margin-top:10px;margin-left:5px;", 
									onItemClicked: "itemClick",
									onPopOpen: "closeOtherPops", 
									showItem2: false, 
									onScrollNeeded: "scrollToView"
								   }
												   
				}
			};
			this.log("starting")
			this.$.superPicker.createComponents(x, {owner: this})  
			this.log("rendering")
			this.componentsCreated = true
			this.render()
		}

	},
	valueSelected: function(value) {
		this.log(value)
		if (this.componentsCreated == true) {
			for (var i = 0; i < this.items.length; i = i + 2) {
				if (this.$["item" + i].getItem1Val() == value) {
					this.$["item" + i].setSelected("item1")
					this.$["item" + i].resetItems(2)	
				}
				else if (this.$["item" + i].getItem2Val() == value) {
					this.$["item" + i].setSelected("item2")
					this.$["item" + i].resetItems(1)	
				}
				else {
					this.$["item" + i].resetItems(0)	
				}
			};
		}
	},
	itemClick: function(iS, iI) {
		this.log(iS.name + ",,," + iI)
		for (var i = 0; i < this.items.length; i = i + 2) {
			if (this.$["item" + i].name != iS.name) {
				this.$["item" + i].resetItems(0)
			}
			else {
				var x = iI.substr(4)
				if (x == 1) {
					x = 2
					this.doSelected(iS.getItem1Val())
				}
				else {
					x = 1
					this.doSelected(iS.getItem2Val())
				}
				this.$["item" + i].resetItems(x)	
			}
		};
	}
});

enyo.kind({
	name: "PanAndZoomSuperPickerItem",
	kind: "VFlexBox",
	published: {
		item1Caption: "",
		item2Caption: "",
		item1Val: "",
		item2Val: "",
		showItem2: true
	},
	events: {
		onItemClicked: "",
		onPopOpen: "",
		onScrollNeeded: ""
	},
	components: [
		{layoutKind: "VFlexLayout", components:[
			{kind: "PanAndZoomSuperPickerSubItem", name: "item1", style: "margin-bottom: 15px;", onclick: "enlargeItem", onPopOpen: "popOpened", onScrollNeeded: "doScrollNeeded"},
			{kind: "PanAndZoomSuperPickerSubItem", name: "item2", onclick: "enlargeItem", onPopOpen: "popOpened", onScrollNeeded: "doScrollNeeded"}
		]}
	],
	showItem2Changed: function() {
		this.$.item2.setShowing(this.showItem2)
	},
	popOpened: function(iS) {
		this.doPopOpen(iS.name)
	},
	isPopOpen: function() {
		if (this.$.item1.getPopIsOpen() == true) {
			this.$.item1.closePop();
			this.$.item1.valChanged();
			//this.$.item1.setTheTimer();
			return true;
		};
		if (this.$.item2.getPopIsOpen() == true) {
			this.$.item2.closePop();
			this.$.item2.valChanged();
			//this.$.item2.setTheTimer();
			return true;
		};
		return false;
	},
	rendered: function() {
		this.inherited(arguments);
		this.item1CaptionChanged();
		this.item2CaptionChanged();
		this.item1ValChanged();
		this.item2ValChanged();
		
		this.showItem2Changed();
	},
	closePopup: function() {
		//this.log()
		this.$.item1.closePopup();
		this.$.item2.closePopup();
	},
	closeSinglePopup: function(which) {
		if (which == 1) {
			this.$.item1.closePopup();
		}
		else {
			this.$.item2.closePopup();
		}
	},
	
	
	item1CaptionChanged: function () {
		this.$.item1.setCap(this.item1Caption)
	},
	item2CaptionChanged: function () {
		this.$.item2.setCap(this.item2Caption)
	},
	item1ValChanged: function () {
		this.log("Item1Val:" + this.item1Val)
		this.$.item1.setVal(this.item1Val)
	},
	item2ValChanged: function () {
		this.$.item2.setVal(this.item2Val)
	},
	enlargeItem: function(iS) {
		iS.setSelected();
		this.doItemClicked(iS.name);
	},
	setSelected: function(itemName) {
		this.$[itemName].setSelected(true)
	},
	resetItems: function(which) {
		if (which == 1 || which == 0) {
			this.$.item1.setDefault();
			this.$.item1.closePopup();
		}
		if (which == 2 || which == 0) {
			this.$.item2.setDefault();
			this.$.item2.closePopup();
		}
	}
});

enyo.kind({
	name: "PanAndZoomSuperPickerSubItem",
	kind: "HFlexBox",
	className: "superPickerItem",
	published: {
		cap: "",
		val: "",
		popIsOpen: false
	},
	events: {
        onclick: "",
        onPopOpen: "",
        onScrollNeeded: ""
	},
	components: [
		{layoutKind: "VFlexLayout",flex:1,name: "contain",onclick:"doclick", style: "width:150px;height:150px;padding:4px 4px 4px 4px;", components:[

			{layoutKind: "HFlexLayout",flex:1,name:"main",onclick:"doclick", components:[
				
				{flex:1},
				{kind: "MyCustomButton",name: "preview", defaultClassName: "previewButton",style:"position:relative;top:-7px;left:12px;", clickClassName: "previewButtonClicked", onButtonClicked:"openPopup"},
			]},
			{content: "caption", name: "lblCaption", onclick: "doclick", style: "font-size:70%;font-weight:bold;margin-left: 2px;margin-right:2px;",flex:1},
		]},
		{kind: "Popup",className: "enyo-popup2", openClassName: "superPickerBaseOpen",dismissWithClick: false,dismissWithEscape: false,onClose: "closePop",name: "iselected",style: "width:225px;height:225px;",lazy: true,onOpen:"valChanged",  pack:"center",align:"center", components:[
			{kind: "Pane",components:[
				{kind: "Pane",components:[
					{kind: "ImageSwitcher",name: "im", onClicked: "closePopup"}
				]}
			]}
		]}
	],
	rendered: function() {
		this.inherited(arguments);
		this.capChanged();
		//feedPicture: function (picSrc, picClass, sStretch, picPan, picDir,picRotate, picTSpeed) {
		this.valChanged();	
		
	},
	valChanged: function(iS, iE) {
		this.log(this.val)
		this.$.main.setStyle("padding: 3px 3px 3px 3px;-webkit-border-radius:10px;width:140px;height:100px;background: url(images/panandzoom" + this.val + ".png) 0 0 no-repeat;background-size:100% 100%;");
		if (this.$.im && this.val != "Random") {
			this.$.im.clearImages()
			if (PanAndZoomSuperPickerScroll.fSrc.length < 1) {
				PanAndZoomSuperPickerScroll.fSrc = "images/preview1.png"
			};
			//if (PanAndZoomSuperPickerScroll.sSrc.length < 1) {
			//	PanAndZoomSuperPickerScroll.sSrc = "images/preview2.png"
			//};
			if (PanAndZoomSuperPickerScroll.tSpeed > 0) {PanAndZoomSuperPickerScroll.tSpeed = 0};
			this.log("dir=" + PanAndZoomSuperPickerScroll.tSpeed)
			this.$.im.feedPicture(PanAndZoomSuperPickerScroll.fSrc, "",false,this.val,PanAndZoomSuperPickerScroll.tSpeed,0,0)
			//this.$.im.feedPicture(PanAndZoomSuperPickerScroll.sSrc, this.val,false,-1,0,0,PanAndZoomSuperPickerScroll.tSpeed)
			
			//this.$.im.feedPicture("images/left.png", this.val,false,-1,0,0,SuperPickerScroll.tSpeed)
			this.$.im.setCanvasWidth(175)
			this.$.im.setCanvasHeight(175)
			this.$.im.refreshSize();
			this.log(iS)
			this.$.im.loadFirstImage()
			/*window.setTimeout(enyo.bind(this,function() {
				this.changePic()
			}), 500);*/

		}
		if (this.val == "Random") {
			this.$.preview.setShowing(false)
		} 
		else {
			this.$.preview.setShowing(true)
		};
	},
	/*picSwitch: 0,
	changePic: function() {
		if (this.$.im) {
			if (this.picSwitch == 0) {
				this.picSwitch = 1
				this.$.im.feedPicture(PanAndZoomSuperPickerScroll.fSrc, "",false,this.val,PanAndZoomSuperPickerScroll.tSpeed,0,0)
			} 
			else{
				this.picSwitch = 0
				this.$.im.feedPicture(PanAndZoomSuperPickerScroll.sSrc, this.val,false,-1,0,0,PanAndZoomSuperPickerScroll.tSpeed)
			};
			this.$.im.changePicture(false);

		}
	},*/
	closePop: function() {
		//window.clearInterval(this.job)
		if (this.$.im) {
			this.$.im.pausePan()
		}
	},
	closePopup: function() {
		//this.log()
		this.popIsOpen = false
		this.$.iselected.close()
		this.closePop()
	},
	capChanged: function() {
		this.$.lblCaption.setContent(this.cap);
	},
	GetTopLeft: function (offset) {

		var x, y = 0;
		var elm = this.$.contain.hasNode()
		if (elm) {
			this.log("node exisit")
			x = elm.offsetLeft;
			y = elm.offsetTop;
			elm = elm.offsetParent;
			while (elm != null) {
				x = parseInt(x) + parseInt(elm.offsetLeft);
				y = parseInt(y) + parseInt(elm.offsetTop);
				elm = elm.offsetParent;
			};
			if (offset == true) {
				return {top:y - 15, left: x - 15 - PanAndZoomSuperPickerScroll.ScrollLeft};
			}
			else {
				return {top:y , left: x	}
			}
		}
		return {top:0, left: 0};
	},
	openPopup: function() {
		this.log(this.GetTopLeft())
		if (this.val != "Random") {
			this.$.iselected.openAt(this.GetTopLeft(true))
			this.doPopOpen()
			this.popIsOpen = true
			//this.$.im.panPicture()
			//this.setTheTimer()
		};
	},
	/*setTheTimer: function() {
		this.job = window.setInterval(enyo.bind(this,(function(){
			this.changePic()
		})),6000 - (PanAndZoomSuperPickerScroll.tSpeed * 850) )
	},*/
	setSelected: function(scrollMe) {
		this.setClassName("superPickerItemSelected")
		if (scrollMe == true) {
			var res = this.GetTopLeft(false)
			this.log(enyo.json.stringify(res))
			if (res.left > 0) {
				this.doScrollNeeded(res.left)
			}
		};
	},
	setDefault: function() {
		this.setClassName("superPickerItem")
	}
});		      