enyo.kind({
	name: "CoinVisual",
	kind: "HFlexBox",
	published: {
		feedVal: 1,
		viewStyle: 0,
		useSound: true
	},
	events: {
	
	},
	showing:false,
	pack:"center",
	align: "center",
	components:[
		{name: "one",showing: false,kind: "coinPopup"},
		{name: "two",showing:false,kind: "coinPopup", coinW: 70, coinH: 70},
		{name: "three",showing:false,kind: "coinPopup", coinW: 60, coinH: 60},
		{name: "four",showing:false,kind: "coinPopup", coinW: 50, coinH: 50},
		{name: "five",showing:false,kind: "coinPopup", coinW: 40, coinH: 40},
		{name: "six",showing:false,kind: "coinPopup", coinW: 35, coinH: 35},
		{kind:"audiocontrol", name: "snd", src: ""}
	],
	rendered: function() {
		this.inherited(arguments);
		this.viewStyleChanged();	
		this.setShowing(false)
	},
	viewStyleChanged: function() {
		if (this.viewStyle == 0) {
			this.setStyle("position:absolute;background:none;width:300;height:80;top:140px;left:220px;")

		} 
		else {
			this.setStyle("position:absolute;background:none;width:300;height:80;top:-160px;-webkit-transform: rotate(180deg) translate3d(220px,0,0);")	
		};	
	},
	feedValue: function(val) {
		if (val != "+0" && val != "-0") {
			switch (this.feedVal) {
				case 1: {
					this.$.one.setCoinVal(val);
					this.$.one.setShowing(true);
					this.$.one.setClassName("popIt");
					break;
				};
				case 2: {
					this.$.two.setCoinVal(val);
					this.$.two.setShowing(true);
					this.$.two.setClassName("popIt");
					break;
				};
				case 3: {
					this.$.three.setCoinVal(val);
					this.$.three.setShowing(true);
					this.$.three.setClassName("popIt");
					break;
				};
				case 4: {
					this.$.four.setCoinVal(val);
					this.$.four.setShowing(true);
					this.$.four.setClassName("popIt");
					break;
				};
				case 5: {
					this.$.five.setCoinVal(val);
					this.$.five.setShowing(true);
					this.$.five.setClassName("popIt");
					break;
				};
				case 6: {
					this.$.six.setCoinVal(val);
					this.$.six.setShowing(true);
					this.$.six.setClassName("popIt");
					break;
				};
			}
			this.feedVal++;
			if (this.feedVal > 6) {this.feedVal = 1};
			if (this.useSound == true) {
				this.$.snd.playJingle()
			}
		}
	},
	clearValues: function() {
		this.$.one.setShowing(false);
		this.$.two.setShowing(false);
		this.$.three.setShowing(false);
		this.$.four.setShowing(false);
		this.$.five.setShowing(false);
		this.$.six.setShowing(false);
		this.$.one.setClassName("");
		this.$.two.setClassName("");
		this.$.three.setClassName("");
		this.$.four.setClassName("");
		this.$.five.setClassName("");
		this.$.six.setClassName("");
		this.feedVal = 1
	},
	showMe: function() {
		this.setShowing(true);
	},
	hideMe: function() {
		this.setShowing(false);
	}
});

enyo.kind({
	name: "coinPopup",
	kind: "Control",
	published: {
		coinW: 80,
		coinH: 80
	},
	events: {
	
	},
	components:[
		{layoutKind:"HFlexLayout",name:"coin", components:[
			{name:"coinVal", content: "0", style:"-webkit-transform: rotate(90deg);"}
		]}
	],
	rendered: function() {
		this.inherited(arguments);
		this.coinWChanged();	
	},
	coinWChanged: function() {
		this.$.coin.setStyle("background:url(\"images/coinback.png\");background-size:100% 100%;width:" + this.coinW.toString() + "px;height:" + this.coinH.toString() + "px;");	
	},
	coinHChanged: function() {
		this.coinWChanged();
	},
	setCoinMode: function(val) {
		if (val = 1) {
			
		} 
		else {
			
		};
	},
	setCoinVal: function(val) {
		this.$.coinVal.setContent(val)	
		var x = Number(val.substr(1))
		var p = val.substr(0,1)
		var s = 80 - this.coinW
		s = 110 - s
		if (p == "+") {
			this.$.coinVal.setStyle("position:relative;left:-5px;font-size:" + s + "%;font-weight:bold;color:green;-webkit-transform: rotate(90deg);")
		} 
		else {
			this.$.coinVal.setStyle("position:relative;left:-5px;font-size:" + s + "%;font-weight:bold;color:red;-webkit-transform: rotate(90deg);")	
		};
	}
});

enyo.kind({
	name: "RoundBonus",
	kind: "HFlexBox",
	published: {
		bonuses: [1,0,1,.10,.25,1,.50,1,.75,1,.90,1,1.5,2,1,2.5,3,1,3.5,1,1,4,1,1,4.5,5]
	},
	events: {
	
	},
	showing:false,
	components:[
		{layoutKind:"HFlexLayout",name:"coin",pack:"center", align:"center", components:[
			{name:"bonusVal", content: "0", style:"position:relative;top:30px;left:20px;font-size:140%;font-weight:bold;"}
		]}
	],
	startMe: function() {
		this.setShowing(true);
		this.setStyle("position:absolute;top:105px;left:600px;")
		this.$.coin.setStyle("background:url(\"images/coinback.png\");background-size:100% 100%;width:100px;height:100px;");
		this.setClassName("popItUp")	
		this.job = window.setInterval(enyo.bind(this,function() {
			this.$.bonusVal.setContent("x" + this.bonuses[Math.floor(Math.random() * this.bonuses.length)] )
		}), 75);
	},
	stopMe: function() {
		window.clearInterval(this.job);
	},
	hideMe: function() {
		this.setShowing(false);
		this.setClassName("")
	},
	getVal: function() {
		var x = this.$.bonusVal.getContent();
		x = x.substr(1);
		return x;
	}
});

enyo.kind({
	name: "CoinRing",
	kind: "HFlexBox",
	published: {
		dir: 0
	},
	events: {
	
	},
	showing:false,
	components:[
		{layoutKind:"HFlexLayout",name:"coin",style: "background:url(\"images/coinring.png\");background-size:100% 100%;width:190px;height:190px;", components:[
			
		]}
	],
	startMe: function(cLeft,cTop) {

		this.setShowing(true);
		this.setStyle("top:" + (cTop - 60)+ "px;left:" + (cLeft - 60)+ "px;")
		this.log(cTop + ", " + cLeft)
		this.$.coin.setStyle("background:url(\"images/coinring.png\");background-size:100% 100%;width:190px;height:190px;-webkit-transition-timing-function: linear;-webkit-transition-property:  -webkit-transform;-webkit-transition-duration: 1s;-webkit-transform-origin:center;-webkit-transform: rotate(0deg);");	
		this.job = window.setInterval(enyo.bind(this,function() {
			if (this.dir > 129600) {
				this.dir = 0
				this.$.coin.setStyle("background:url(\"images/coinring.png\");background-size:100% 100%;width:190px;height:190px;-webkit-transform-origin:center;-webkit-transform: rotate(0deg);");	
			}
			this.dir += 360
			//this.log (this.dir)
			this.$.coin.setStyle("background:url(\"images/coinring.png\");background-size:100% 100%;width:190px;height:190px;-webkit-transition-timing-function: linear;-webkit-transition-property:  -webkit-transform;-webkit-transition-duration: 1s;-webkit-transform-origin:center;-webkit-transform: rotate(" + this.dir + "deg);");	
			/*if (this.dir == 0) {
				this.dir = 1
				this.$.coin.setStyle("background:url(\"images/coinring.png\");background-size:100% 100%;width:140px;height:140px;-webkit-transition-property:  -webkit-transform;-webkit-transition-duration: 1s;-webkit-transform-origin:center;-webkit-transform: rotate(360deg);");	
			} 
			else {
				this.dir = 0
				this.$.coin.setStyle("background:url(\"images/coinring.png\");background-size:100% 100%;width:140px;height:140px;-webkit-transition-property:  -webkit-transform;-webkit-transition-duration: 1s;-webkit-transform-origin:center;-webkit-transform: rotate(0deg);");	
			};*/
		}), 950);
	},
	stopMe: function() {
		window.clearInterval(this.job);
		this.$.coin.setStyle("background:url(\"images/coinring.png\");background-size:100% 100%;width:190px;height:190px;-webkit-transform-origin:center;-webkit-transform: rotate(0deg);");	
		this.dir = 0
		this.hideMe()
	},
	hideMe: function() {
		this.setShowing(false);
	}
});

enyo.kind({
	name: "coinBet",
	kind: "HFlexBox",
	published: {
		viewStyle: 0,
		useSound: true
	},
	events: {
	
	},
	showing: false,
	components:[
		{layoutKind:"HFlexLayout",name:"coin", components:[
			{name:"coinVal", content: "0", style:"-webkit-transform: rotate(90deg);"}
		]},
		{kind:"audiocontrol", name: "snd", src: ""}
	],
	rendered: function() {
		this.inherited(arguments);
		this.coinWChanged();	
		this.viewStyleChanged();
		this.setShowing(false)
	},
	viewStyleChanged: function() {
		if (this.viewStyle == 0) {
			this.setStyle("position:absolute;background:none;width:96;height:100;top:240px;left:220px;font-size:110%;font-weight:bold;")

		} 
		else {
			this.$.coinVal.setStyle("position:relative;left:65px;-webkit-transform: rotate(-90deg);")
			this.setStyle("position:absolute;background:none;width:96;height:100;top:240px;left:700px;font-size:110%;font-weight:bold;")
			//this.setStyle("position:absolute;background:none;width:96;height:100;top:-260px;-webkit-transform: rotate(180deg) translate3d(220px,0,0);font-size:110%;font-weight:bold;")	
		};	
	},
	coinWChanged: function() {
		this.$.coin.setStyle("background:url(\"images/pilecoins.png\");background-size:100% 100%;width:96px;height:100px;");	
	},
	showAndSetBet: function(val) {
		if (Number(val) > 0) {
			this.$.coinVal.setContent(val)	
			this.setShowing(true)
			this.setClassName("popItUp");
			if (this.useSound == true) {
				this.$.snd.playSwoosh()
			}
		}
	},
	hideMe: function() {
		this.setShowing(false);
		this.setClassName("");
	}
});

enyo.kind({
	name: "HeadsAndTails",
	kind: "HFlexBox",
	published: {
	},
	events: {
	
	},
	showing: false,
	components:[
		{kind: "Image", name: "winheadsp1", src: "images/headsp1.png", showing:false},
		{kind: "Image", name: "wintailsp1", src: "images/tailsp1.png", showing:false},
		{kind: "Image", name: "winheadsp2", src: "images/headsp2.png", showing:false},
		{kind: "Image", name: "wintailsp2", src: "images/tailsp2.png", showing:false}
	],
	rendered: function() {
		this.inherited(arguments);
		this.setShowing(false)
	},
	
	showMe: function(player,result,mode) {
		this.setShowing(true)
		if (player == 1) {
			this.setStyle("position:absolute;left:90px;top:210px;")	
			if (result == "heads") {
				this.$.winheadsp1.setShowing(true)
				this.$.wintailsp1.setShowing(false)
				this.$.winheadsp2.setShowing(false)
				this.$.wintailsp2.setShowing(false)
			} 
			else {
				this.$.winheadsp1.setShowing(false)
				this.$.wintailsp1.setShowing(true)	
				this.$.winheadsp2.setShowing(false)
				this.$.wintailsp2.setShowing(false)
			};
		} 
		else {
			if (mode == "two") {
				this.setStyle("position:absolute;top:240px;left:770px;")
				if (result == "heads") {
					this.$.winheadsp2.setShowing(true)
					this.$.wintailsp2.setShowing(false)
					this.$.winheadsp1.setShowing(false)
					this.$.wintailsp1.setShowing(false)
				} 
				else {
					this.$.winheadsp2.setShowing(false)
					this.$.wintailsp2.setShowing(true)	
					this.$.winheadsp1.setShowing(false)
					this.$.wintailsp1.setShowing(false)
				};		
			}
			else {
				this.setStyle("position:absolute;top:240px;left:550px;")
				if (result == "heads") {
					this.$.winheadsp2.setShowing(false)
					this.$.wintailsp2.setShowing(false)
					this.$.winheadsp1.setShowing(true)
					this.$.wintailsp1.setShowing(false)
				} 
				else {
					this.$.winheadsp2.setShowing(false)
					this.$.wintailsp2.setShowing(false)	
					this.$.winheadsp1.setShowing(false)
					this.$.wintailsp1.setShowing(true)
				};
			}
		};
		
		this.setClassName("popItUp");

	},
	hideMe: function() {
		this.setShowing(false);
		this.setClassName("");
	}
});