//TODO take out spinners to check compatibility with older webos versions, code in a version check.
//     also maybe make my own spinner that doesn't move as much for the older versions.

enyo.kind({
	name: "scrimSpinner", 
	kind: "VFlexBox",
	style: "position:absolute;top:0;left:0;width:100%;height:100%;background:black;color:white;",
	lazy: false,
	className: "scrimBack",
	published: {
		statusMsg: ""
	},
	messages: [ "keep up the good work!","you're awesome!", "you're fantastic!"
	           ,  "You rock!", "You're great!", "You're wonderful!",  
	           "You're magnificent!", "You're outstanding!",  "You are magnificent!", "You're terrific!",
	            "You are extraordinary!",  "You're exceptional!", "You're something special!"],
	components:[
	     {kind: "VFlexBox",name: "iContent",pack:"center",align:"center",flex:1,style: "position:absolute;top:0;left:0;width:100%;height:100%;background:black;color:white;", components:[
              //{kind:"SpinnerLarge", name:"spin"},
              {kind: "MySpinner", name: "spin2", showing: false},
              {kind: "ProgressBar",name: "prog", minimum: 0, maximum: 100,style:"margin:10px 10px 10px 10px;", width: "60%", position: 0},
              {content: "Loading, Please Wait", style:"font-size:140%;font-color:white;font-variant:small-caps;letter-spacing:-1px"},
              
              {name:"msg", style:"font-size:80%;font-color:white;font-variant:small-caps;letter-spacing:-1px;text-align:center;", allowHtml: true}
	     ]}       
	     
	],
	start: function(aMsg) {
		this.show();

		this.setStyle("position:absolute;top:0;left:0;width:100%;height:100%;background:black;color:white;z-index:9999;")
		if (aMsg) {
			this.statusMsg = aMsg
		}
		this.$.msg.setContent(this.statusMsg);
		var device = enyo.fetchDeviceInfo();
		/*if (parseInt(device.platformVersionMajor) == 3 && parseInt(device.platformVersionDot) >= 5) {
			this.$.spin.show();
		}
		else {*/
			//this.$.spin.hide();
			this.$.spin2.setShowing(true);
			this.$.spin2.startAni();
		//}
	},
    stop: function() {
    	//this.$.spin.hide();
    	this.$.spin2.stopAni();
    	this.hide();
    	this.$.prog.setPosition(0)
    },
    statusMsgChanged: function() {
    	this.$.msg.setContent(this.statusMsg);
    },
    setProgMax: function(val) {
		this.$.prog.setMaximum(val);
	},
	setProgPos: function(val) {
		this.$.prog.setPosition(val);
	},
});

enyo.kind({
	name: "LameSpinnerForOlderWebOSVersions",
	kind: "Control",
	published: {
		aniIndex: 0
	},
	style: "",
	showing: false,
	components: [
	    {kind:"Image", style:"width:32px;height:32px;", name: "img"}         
	],
	startAni: function() {
		//this.center()
		this.setShowing(true)
		this.job = window.setInterval(enyo.hitch(this, "ani"), 500);
		//this.$.pic.start();
	},
	stopAni: function() {
		this.setShowing(false)
		window.clearInterval(this.job);
	},
	
	ani: function() {
		this.$.img.setSrc("images/spin" + this.aniIndex.toString() + ".png")
		this.aniIndex++
		if (this.aniIndex > 3) { this.aniIndex = 0}
		
	}
	
	
});

enyo.kind({
	name: "MySpinner",
	kind: "Control",
	published: {
		aniIndex: 1
	},
	style: "",
	showing: false,
	components: [
		{kind:"enyo.Image", style:"width:32px;height:32px;border: none !important;box-shadow: none !important;", name: "img"}
	],
	prevDate: 0,
	startAni: function() {
		//this.center()
		this.setShowing(true);
		/*this.job = window.setInterval(enyo.hitch(this, "ani"), 500);*/
		var fn = enyo.bind(this, function() {

			this.job = enyo.requestAnimationFrame(fn);
			if (new Date().getTime() - this.prevDate > 250) {
				this.ani();
				this.prevDate = new Date().getTime();
			}
			
		});
		this.prevDate = new Date().getTime();
		this.job = enyo.requestAnimationFrame(fn);
		//this.$.pic.start();
	},
	stopAni: function() {
		this.setShowing(false);
		enyo.cancelRequestAnimationFrame(this.job);
		/*window.clearInterval(this.job);*/
	},
	
	ani: function() {
		this.$.img.setSrc("images/s" + this.aniIndex.toString() + ".png");
		this.$.img.render();
		this.aniIndex++;
		if (this.aniIndex > 8) { this.aniIndex = 1;}
		
	}
	
	
});