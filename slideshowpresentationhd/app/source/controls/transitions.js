

var transitions = [
    {caption: "None", value: "hidingCanvas"},
    {caption: "Fade Out", value: "fadeOut"},
    {caption: "Fade, Shrink, To Top Left", value: "fadeShrinkTopLeftCorner"},
    {caption: "Fade, Shrink, To Bottom Right", value: "fadeShrinkBottomRight"},
    {caption: "Shrink To Left", value: "shrinkLeft"},
    {caption: "Shrink To Top", value: "shrinkTop"},
    {caption: "Shrink To Top Left", value: "shrinkTopLeft"},
    {caption: "Move off Left", value: "moveOffLeft"},
    {caption: "Move off Left And Shrink", value: "moveOffLeftAndShrink"},
    {caption: "Move off Right", value: "moveOffRight"},
    {caption: "Move off Right And Shrink", value: "moveOffRightAndShrink"},
    {caption: "Move off Top", value: "moveOffTop"},
    {caption: "Move off Top And Shrink", value: "moveOffTopAndShrink"},
    {caption: "Move off Bottom", value: "moveOffBottom"},
    {caption: "Move off Bottom And Shrink", value: "moveOffBottomAndShrink"},
    {caption: "Flatten Vertically To Center", value: "flattenVerticle"},
    {caption: "Flatten Horizontally To Center", value: "flattenHorrizontal"},
    {caption: "Spin, Shrink, to Top Left", value: "spinOffShrinkTopLeftCorner"},
    {caption: "Spin, Shrink, toward Center", value: "spinAndShrinkTowardCenter"},
    {caption: "Spin and Fade Out", value: "spinAndFade", exhibsub: "fadeOut"},
    {caption: "3d Rotate Horizontal", value: "rotateHorIn3D"},
    {caption: "3d Rotate Vertical", value: "rotateVerIn3D"},
    {caption: "3d Rotate Spin", value: "rotateSpinIn3D", exhibsub: "rotateWarpIn3D"},
    {caption: "3d Rotate Warp", value: "rotateWarpIn3D"},
    {caption: "3d Rotate Spin and Shrink", value: "rotateSpinShrinkIn3D"},
    {caption: "Peel And Flip To Top Corner", value: "rotateSpinShrinkTopLeft"},
    {caption: "Peel And Flip To Bottom Corner", value: "rotateSpinShrinkBottomRight"},
    {caption: "Blow Away And Shrink", value: "superSpinShrink"},
    {caption: "Spin, Skew, and Fade", value: "spinSkewAndFade"},
    {caption: "Windmill", value: "windmill", exhibsub: "rotateSpinShrinkIn3D"},
    {caption: "Flip and Zoom In", value: "flipAndZoomIn"},
    {caption: "Flip And Shrink To Center", value: "flipAndShrinkToCenter", exhibsub: "spinAndShrinkTowardCenter"},
    {caption: "Zoom And Fade Out", value: "warpSpeed", exhibsub: "flipAndZoomIn"}
]

var RandomTransition = function() {
	var al = transitions.length;
        var n = Math.floor((Math.random() * al));
        if (n == 0) {n = 1;};
        return transitions[n].value;
};

var GetExhibTransSub = function(inTrans) {
	for (var i = 0; i < transitions.length; i++) {
		if (transitions[i].exhibsub) {
			if (transitions[i].value == inTrans) {
				return transitions[i].exhibsub;
			};
		};
	};
	return inTrans;
};

enyo.kind({
	name: "SuperPickerBase",
	kind: "VFlexBox",
	published: {
		items: [],
        popOpen: false,
        settings: {
	        value: 0,
	        speed: 0,
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
		{content: "trans", name: "tName", style: "font-size: 70%;font-weight:bold;", onclick: "openPicker"},
		{kind: "VFlexBox",name: "cSelect", onclick: "openPicker"},
		{content: "slowest", name: "tSpd", style: "font-size: 58%;font-weight:bold;position:relative;top:-3px;", onclick: "openPicker"},
		
		{kind: "Toaster",className: "editListItem", flyInFrom: "right"/*openClassName: "superPickerBaseOpen"*/, onOpen: "resetClassName", layoutKind: "VFlexLayout",width:"100%",height:"480px",lazy: false, name: "p",components: [
			{kind: "VFlexBox", components:[
				{kind: "SuperPicker", name: "sp",onScrollStart: "closePopup", onPopOpen: "setPop",onScroll:"setLeft", onSelected: "storeValue"}
			]},
			{kind: "Pane", components:[
				{kind: "VFlexBox", components:[
					{kind: "RadioGroup", value: "0", name: "tSpeed", onclick: "setTSpeed", components: [
						{name: "random", caption: "Random", icon: "", value: "-1", flex:1, showing:false},
				        {name: "slowest", caption: "Slowest", icon: "", value: "0", flex:1},
				        {name: "slow", caption: "Slow", icon: "", value: "1", flex:1},
				        {name: "fast", caption: "Fast", icon: "", value: "2", flex:1},
				        {name: "faster", caption: "Faster", icon: "", value: "3", flex:1},
				        {name: "turbo", caption: "Turbo", icon: "", value: "4", flex:1},
				    ]},
					{layoutKind: "HFlexLayout", components: [
						{kind: "Button", caption: "Cancel", onclick: "cancelMe", className: "enyo-button-negative"},
						{kind: "Button", caption: "OK",flex:1, className: "enyo-button-affirmative", onclick: "checkForChange"}
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
	},
	useRandomChanged: function() {
		if (this.useRandom == true) {
			this.items = []
			this.items[0] = {caption: "Random", value: "Random"}
			this.items = this.items.concat(transitions)
			this.$.random.setShowing(true)
		} 
		else{
			this.items = []
			this.items = transitions
			this.$.random.setShowing(false)
		};
	},
	checkForChange: function() {
		var x = this.$.tSpeed.getValue()
		if (this.settings.value != this.storedValue || parseInt(this.settings.speed) != parseInt(x)) {
			this.settings.value = this.storedValue
			this.settings.speed = x
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
	},
	settingsChanged: function() {
		this.$.tSpeed.setValue(this.settings.speed);
		//this.log(this.settings.speed)
		this.setTSpeed();
		this.storedValue = this.settings.value
		this.$.sp.valueSelected(this.settings.value)
		SuperPickerScroll.fSrc = this.settings.firstSrc
		SuperPickerScroll.sSrc = this.settings.secondSrc
		this.$.cSelect.setStyle("background: url(images/" + this.settings.value + ".png) 0 0 no-repeat;width:100%;height:50px;position:relative;top:-3px;left:-2px;background-size:100% 100%;")
		var c = this.getProperValue(this.settings.value, true)
		this.$.tName.setContent(c)
		c = this.settings.speed
		if (c == -1) {
			c = "Random"
		} 
		else if (c == 0) {
			c = "Slowest"
		}
		else if (c == 1) {
			c = "Slow"
		}
		else if (c == 2) {
			c = "Fast"
		}
		else if (c == 3) {
			c = "Faster"
		}
		else if (c == 4) {
			c = "Turbo"
		}
		else {
			c = "Slowest"
		};
		this.$.tSpd.setContent(c)
	},
	setPop: function() {
		this.popOpen = true
		//this.log()
		this.$.sp.stop()
	},
	setTSpeed: function() {
		SuperPickerScroll.tSpeed = this.$.tSpeed.getValue()
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
		SuperPickerScroll.ScrollLeft = this.$.sp.getScrollLeft()
		//this.log(SuperPickerScroll.ScrollLeft)
	},
	getProperValue: function (inVal, bShort) {
		var c = "";
		var b = bShort
		var f = false
		//this.log(this.shortArray.length)
		//this.initArray()
		//I have removed canvasBasicHiding mostly from the app, 
		//but to support older versions, i need to check for it still.
		if (inVal == "canvasBasicHiding") {inVal = "hidingCanvas";};
		for (var i=0;i < this.items.length; i++) {
			if (this.items[i].value == inVal) {
				c =  this.items[i].caption;
				f = true;
				break;
			};
		};
		if (f == true) {
			if (b == true) {
				return this.shortName(c);
			}
			else {
				return c;
			};
		};
		return "Fade Out"
	},
	shortName: function(inStr) {
		var s = inStr;
		
		if (s.length > 0) {
			s = s.replace("Move", "Mv.");
			s = s.replace("Shrink", "Shr.");
			s = s.replace("Flatten", "Fltn.");
			s = s.replace("Vertically", "Vert.");
			s = s.replace("Horizontally", "Horiz.");
			s = s.replace("Bottom", "Btm.");
			s = s.replace("Fade", "Fd.");
			s = s.replace(/ /gi, "");
		}
		return s;
	},
});

var SuperPickerScroll = {};
SuperPickerScroll.ScrollLeft = 0;
SuperPickerScroll.tSpeed = 0;
SuperPickerScroll.fSrc = "";
SuperPickerScroll.sSrc = "";

enyo.kind({
	name: "SuperPicker",
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
			//this.log()
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
					x[x.length] = { kind: "TransSuperPickerItem",
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
					x[x.length] = { kind: "TransSuperPickerItem",
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
		//this.log(value)
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
		//this.log(iS.name + ",,," + iI)
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
	name: "TransSuperPickerItem",
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
			{kind: "TransSuperPickerSubItem", name: "item1", style: "margin-bottom: 15px;", onclick: "enlargeItem", onPopOpen: "popOpened", onScrollNeeded: "doScrollNeeded"},
			{kind: "TransSuperPickerSubItem", name: "item2", onclick: "enlargeItem", onPopOpen: "popOpened", onScrollNeeded: "doScrollNeeded"}
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
			this.$.item1.setTheTimer();
			return true;
		};
		if (this.$.item2.getPopIsOpen() == true) {
			this.$.item2.closePop();
			this.$.item2.valChanged();
			this.$.item2.setTheTimer();
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
	name: "TransSuperPickerSubItem",
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
					{kind: "ImageSwitcher",name: "im", onClicked: "closePopup", useSwipe: false}
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
	valChanged: function() {
		this.log(this.val)
		this.$.main.setStyle("padding: 3px 3px 3px 3px;-webkit-border-radius:10px;width:140px;height:100px;background: url(images/" + this.val + ".png) 0 0 no-repeat;background-size:100% 100%;");
		if (this.$.im && this.val != "Random") {
			this.loadPreview();
			window.setTimeout(enyo.bind(this,function() {
				this.changePic();
			}), 500);

		}
		if (this.val == "Random") {
			this.$.preview.setShowing(false)
		} 
		else {
			this.$.preview.setShowing(true)
		};
	},
	loadPreview: function() {
		this.$.im.clearImages()
		if (SuperPickerScroll.fSrc.length < 1) {
			SuperPickerScroll.fSrc = "images/preview1.png"
		};
		if (SuperPickerScroll.sSrc.length < 1) {
			SuperPickerScroll.sSrc = "images/preview2.png"
		};
		if (SuperPickerScroll.tSpeed < 0) {SuperPickerScroll.tSpeed = 0};
		this.$.im.feedPicture(SuperPickerScroll.fSrc, this.val,false,-1,0,0,SuperPickerScroll.tSpeed)
		this.$.im.feedPicture(SuperPickerScroll.sSrc, this.val,false,-1,0,0,SuperPickerScroll.tSpeed)
		
		//this.$.im.feedPicture("images/left.png", this.val,false,-1,0,0,SuperPickerScroll.tSpeed)
		this.$.im.setCanvasWidth(175)
		this.$.im.setCanvasHeight(175)
		this.$.im.refreshSize();
		this.$.im.loadFirstTwoImages();
	},
	picSwitch: 0,
	changePic: function() {
		if (this.$.im) {
			if (this.picSwitch == 0) {
				this.picSwitch = 1
				this.$.im.feedPicture(SuperPickerScroll.fSrc, this.val,false,-1,0,0,SuperPickerScroll.tSpeed)
			} 
			else{
				this.picSwitch = 0
				this.$.im.feedPicture(SuperPickerScroll.sSrc, this.val,false,-1,0,0,SuperPickerScroll.tSpeed)
			};
			this.$.im.changePicture(false);

		}
	},
	closePop: function() {
		window.clearInterval(this.job)
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
				return {top:y - 15, left: x - 15 - SuperPickerScroll.ScrollLeft};
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
			this.setTheTimer()
		};
	},
	setTheTimer: function() {
		this.job = window.setInterval(enyo.bind(this,(function(){
			this.changePic()
		})),6800 - (SuperPickerScroll.tSpeed * 1000) )
	},
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


