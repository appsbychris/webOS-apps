enyo.kind({
	name: "playerPop",
	kind: "Popup",
	dismissWithClick:false,
	lazy:false, 
	dismissWithEscape:false,
	published: {
		useClass: "",
		pCoins: 1000,
		head: "Player",
		betMode: 0,
		useSound: true	

	},
	events: {
		onConfirmed: "",
		onBetConfirm: ""

	},
	holding: false,
	holdTime: 0, 
	holdVal: "+",
	components: [
     	{name: "popHeader",content: "PLAYER 1"},
     	{name: "Choose",layoutKind: "HFlexLayout", showing:true,components:[
         	{kind: "RadioGroup",flex:3, value: "heads", name: "playerChoose", components: [
					{caption: "Heads",name: "pheads", icon: "images/dimeheads.png",
					    value: "heads"},
					{caption: "Tails",name: "ptails", icon: "images/dimetails.png",
					    value: "tails"}
			]},
			{kind: "MyCustomButton", defaultClassName:"readyButton", clickClassName:"readyButtonClicked", onButtonClicked: "confirmClick"}
	 	]},
	 	{name: "Bet",showing:false, layoutKind: "HFlexLayout", flex:1,components:[
	 		{layoutKind:"VFlexLayout", flex:1,components:[
	 			{layoutKind:"HFlexLayout",components:[
	 				{content: "Bet: ", style: "margin-right:10px;"},
		 			{name: "betVal", content:"0", style: "margin-right:10px;"},
		 			{content: " gold coins"}
		 		]},
		 		{layoutKind:"HFlexLayout",components:[
		 			{kind: "MyCustomButton",name:"plus", defaultClassName:"plusButton", caption: "+",clickClassName:"plusButtonClicked",onButtonmousedown:"checkHold",onButtonmouseup:"releaseHold", onButtonClicked: "increase1"},
		 			{kind: "MyCustomButton",name:"minus", defaultClassName:"minusButton",caption: "-", clickClassName:"minusButtonClicked",onButtonmousedown:"checkHold",onButtonmouseup:"releaseHold", onButtonClicked: "increase1"}
			 		//{kind: "Button",name:"plus",style:"background:green;",flex:1, caption: "+",onmousedown:"checkHold",onmouseup:"releaseHold",onclick:"increase1"},
			 		//{kind: "Button",name:"minus",style:"background:red;",flex:1, caption: "-",onmousedown:"checkHold",onmouseup:"releaseHold",onclick:"increase1"}
			 		
		 		]}
		 	]},
		 	{kind: "MyCustomButton", defaultClassName:"readyButton", clickClassName:"readyButtonClicked", onButtonClicked: "betDone"}
	 	]},
		{kind:"audiocontrol", name: "snd", src: ""}
	],
	pCoinsChanged: function() {
		this.$.popHeader.setContent(this.head + " - " + this.pCoins.toString() + " gold coins")	
		var x = parseInt(this.$.betVal.getContent())
		if (this.pCoins < x) {
			x = this.pCoins
		}
		this.$.betVal.setContent(x)

	},
	confirmClick: function() {
		this.doConfirmed()
		if (this.useSound == true) {
			this.$.snd.playClick();
		}
	},
	headChanged: function() {
		this.pCoinsChanged()	
	},
	betDone: function() {
		this.doBetConfirm(this.$.betVal.getContent())	
		//this.$.snd.playClick();
	},
	checkHold: function(iS,iE) {
		this.holding = true	
		this.holdVal = iS.caption

		window.setTimeout(enyo.bind(this,function() {
			if (this.holding == true && iS.getDown() == true) {
				this.speedChange(iS)
			};
		}), 300);
	},
	releaseHold: function() {
		this.holding = false
		this.holdTime = 0
	},
	speedChange: function(iS) {
		if (this.holding == true && iS.getDown() == true) {
			var val = parseInt(this.$.betVal.getContent());
			this.holdTime++
			var inc = 10
			if (this.holdTime > 180) {
				inc = 1000;
			}
			else if (this.holdTime > 170) {
				inc = 800;
			}
			else if (this.holdTime > 160) {
				inc = 500;
			}
			else if (this.holdTime > 140) {
				inc = 400;
			}
			else if (this.holdTime > 120) {
				inc = 300;
			}
			else if (this.holdTime > 100) {
				inc = 200;
			}
			else if (this.holdTime > 80) {
				inc = 100;
			}
			else if (this.holdTime > 60) {
				inc = 75;
			}
			else if (this.holdTime > 40) {
				inc = 40;
			}
			else if (this.holdTime > 20) {
				inc = 20;
			};
			
			
			
			
			
			if (this.holdVal == "+") {
				val += inc;
			} 
			else{
				val -= inc;
			};
			if (val < 0) {
				val = 0;
				this.holding = false;
			};
			if (val > (this.pCoins)) {
				val = this.pCoins;
				this.holding = false;
			};
			this.$.betVal.setContent(val.toString());
			window.setTimeout(enyo.bind(this,function() {
				if (this.holding == true && iS.getDown() == true) {
					this.speedChange(iS);
				};
			}), 50);

			
		};		
	},
	increase1: function (iS,iE) {
		this.holding = false;
		this.holdTime = 0
		var val = parseInt(this.$.betVal.getContent())
		if (iS.name == "plus") {
			val++;
		} 
		else {
			val--;
		};
		if (val < 0) {
			val = 0;
			this.holding = false;
		};
		if (val > (this.pCoins)) {
			val = this.pCoins;
			this.holding = false;
		};
		this.$.betVal.setContent(val.toString());
	},
	rendered: function() {
		this.inherited(arguments);
		this.useClassChanged();
		this.headChanged();
	},
	useClassChanged: function() {
		this.addClass(this.useClass);
	},
	getChoose: function() {
		return this.$.playerChoose.getValue();
	},
	setChoose: function(val) {
		this.$.playerChoose.setValue(val);
	},
	getBet: function() {
		return this.$.betVal.getContent();	
	},
	setBet: function (val) {
		this.$.betVal.setContent(val);	
	},
	showSection: function(val) {
		switch (val) {
			case 1: {
				this.$.Choose.setShowing(true)
				this.$.Bet.setShowing(false)
				break;
			}
			case 2: {
				this.$.Choose.setShowing(false)
				this.$.Bet.setShowing(true)
				break;
			}
			case 3: {
				break;
			}
		}	
	},
	setIcons: function(val) {
		switch (val) {
			case 1: {
				this.$.pheads.setIcon("images/pennyheads.png")
				this.$.ptails.setIcon("images/pennytails.png")
				break;
			}
			case 2: {
				this.$.pheads.setIcon("images/dimeheads.png")
				this.$.ptails.setIcon("images/dimetails.png")
				break;
			}
			case 3: {
				this.$.pheads.setIcon("images/quarterheads.png")
				this.$.ptails.setIcon("images/quartertails.png")
				break;
			}
		}
	}
});