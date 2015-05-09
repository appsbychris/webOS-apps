enyo.kind({
	name: "TwoOuttaThree",
	kind: enyo.VFlexBox,
	published: {
		aniIndex: 1,
		coinTop: 300,
		coinLeft: 400,
		finished: 0,
		prevX: 0,
		prevY: 0,
		interval:20,
		rotation:250,
		cRound:1,
		cFlip: 1,
		cTurn: 1,
		isFlipping: 1,
	    p1Confirmed: 0,
	    p2Confirmed: 0,
	    p1Flips: 0,
	    p2Flips: 0,
	    p1Rounds: 0,
	    p2Rounds: 0,
	    pWon: 0,
	    p1Coins: 1000,
	    p2Coins: 1000,
	    HASLOADED: false,
	    theads: 0,
	    ttails: 0,
	    topArr: []
	},
	components: [
	    {kind:"audiocontrol", name: "flipping", src: "audio/flip.mp3"},
		{flex: 1, kind: "Pane",name :"pane", className: "bckGround", components: [
		     //{kind: "Scroller", components: [ 
		    //                                                                   
		    {kind: "Image",name: "coin", className:"myImageDime", src: "images/dime/dime1.png", onclick: "coinClicked"},
		    {kind: "Image", name: "p1coin", className: "myImageDime", style: "top: 670px; left:120px;", src: "images/dime/dime1.png", showing:false},
		    {kind: "Image", name: "p2coin", className: "myImageDime", style: "top: 670px; left:820px;", src: "images/dime/dime8.png", showing:false},
		    
		    {kind: "Image", name: "drummer",  style: "position: absolute;top: 500px; left:100px;width:122px; height:134px;", src: "images/drum1.png", showing:false},
		    //{kind: "Image", name: "winimage",  style: "position: absolute;top: 0px; left:0px;width:1024px; height:768px; z-index:10000;", src: "images/player1win1.png", showing:false},
		    {kind: "Button", name: "showMenu", caption: "Menu", showing: false, className:"enyo-button-blue", onclick: "showTheMenu", style: "position: absolute; top:0; left:0; width: 75px; height: 40px;z-index:10000;"},
		    
		    {kind: "Popup",dismissWithClick:false,className:"settingsPop", dismissWithEscape:false, lazy:false, name: "popSettings",components: [
		        {layoutKind: "HFlexLayout", style: "position:relative;top:-10px;height:70px;", components: [
	              	{kind: "Button", caption: "Hide",style: "margin-right:10px;width:75px", onclick: "hideMenu", className:"enyo-button-blue"},
					{layoutKind: "VFlexLayout", style: "position:relative;top:-7px;", components:[
						{kind: "Button", caption: "Top Ten", onclick: "openTopTen", className: "enyo-button-affirmative"},
						{kind: "Button", caption: "Help", onclick: "openHelp", className: "enyo-button-blue"}
					]},
				  	{content: "Sound: ", style: "position:relative;top:15px;"},
				  	{kind: "CheckBox", style: "position:relative;top:10px;marigin-right:10px;", name:"useSound", checked: true, onChange: "checkboxClicked"},
	              	{kind: "RadioGroup", flex:1, style: "margin-left:10px;margin-right:10px;",value: "dime",onChange:"changeCoin", name: "coinSelect",
					    components: [
							{caption: "Penny", icon: "images/pennyheads.png",
							    value: "penny"},
							{caption: "Dime", icon: "images/dimeheads.png",
							    value: "dime"},
						    {caption: "Quarter", icon: "images/quarterheads.png",
							    value: "quarter"}
					]},
				 	{kind: "RadioGroup",flex:1, value: "two", name: "players", onChange: "changePlayers",
					    components: [
					        {caption: "One Player", icon: "",
					            value: "one"},
					        {caption: "Two Player", icon: "",
					            value: "two"}
					]},
				 	{kind: "Button",name :"restartBut", caption: "Restart",style: "marign-left:10px;", onclick: "confirmRestart", className:"enyo-button-negative"},
		        ]}
			]},
			{kind: "playerPop", name: "popOne", useClass: "player1", head: "PLAYER1", onConfirmed:"player1Confirm", onBetConfirm: "player1BetConfirm"},
			{kind: "playerPop", name: "popTwo", useClass: "player2", head: "PLAYER2", onConfirmed:"player2Confirm", onBetConfirm: "player2BetConfirm"},
		    
			{kind: "Popup",dismissWithClick:false,lazy:false,className:"msgPopPlayer1ChoiceOpen", dismissWithEscape:false,  name: "popMsg", components: [
   		         {name: "msgContent", content: "Player 1, make your choice!",flex:1}
   		         
   			]},
   			{kind: "Popup",dismissWithClick:false,lazy:false,className:"computer", dismissWithEscape:false,  name: "popComp", components: [
		         {name: "compContent", content: "Computer",flex:1}
		         
			]},
   			{kind: "ModalDialog",lazy:false, name: "popWin",style:"height:100px;", onclick: "checkTopTen",onOpen:"playApplause" },
   			{kind: "ModalDialog",lazy:false, name: "popConfirm",style:"height:120px;", components: [
   			    {layoutKind: "VFlexLayout", components: [
   			         {content: "Restart Current Game?"},
   			         {layoutKind: "HFlexLayout", components: [
   			              {kind: "Button", flex: 1, caption: "Cancel", onclick: "cancelRestart"},
   			              {kind: "Button", flex: 1, caption: "Restart", className:"enyo-button-negative", onclick:"restartGame"}
   			         ]}
   			    ]}     
   			]},
   			{kind: "ModalDialog",lazy:false,onOpen:"fillTopTen", name: "popTopTen",style:"height:380px;", components: [
   			    {layoutKind: "VFlexLayout",flex: 1, components: [
   			         {content: "Top Ten:"},
   			         {layoutKind: "HFlexLayout", components:[
   			         	{content: "Name",flex: 2},
   			         	{content: "Coins",flex: 1}
   			         ]},
   			         {layoutKind: "HFlexLayout", components:[
   			         	{name: "topTenName",flex: 2,style: "font-size: 80%;font-weight:bold;", allowHtml: true},
   			         	{name: "topTenCoins",flex: 1,style: "font-size: 80%;font-weight:bold;", allowHtml: true}
   			         ]}
   			        			         
   			    ]},
   			    {kind:"Button",style: "margin-top:15px;",className: "enyo-button-blue", caption: "Close", onclick: "closeTopTen"}     
   			]},
   			{kind: "ModalDialog",lazy:false, name: "popAddName",style:"height:300px;", components: [
   			    {layoutKind: "VFlexLayout", components: [
   			         {content: "New High Score!"},
   			         {name: "winNotes"},
   			         {content: "Please enter your name:"},
   			         {kind: "Input", name: "playerName", hint: "Your Name..."},
   			         {layoutKind: "HFlexLayout", components: [
   			              {kind: "Button", flex: 1, caption: "Add", className:"enyo-button-affirmative", onclick:"addAndCloseWin"}
   			         ]}
   			    ]}     
   			]},
			{kind: "Popup",dismissWithClick:false,className:"roundPop", dismissWithEscape:false,  name: "popRound", onClose:"openRound",components: [
			     {layoutKind:"HFlexLayout", components:[                             
	   		        {layoutKind: "VFlexLayout", flex:1, components:[
	   		          {kind: "MyCustomButton", name: "player1Round1", defaultClassName:"roundImage1off", clickClassName: "roundImage1off", disabledClassName: "roundImage1"},
	   		          {kind: "MyCustomButton", name: "player1Round2", defaultClassName:"roundImage1off", clickClassName: "roundImage1off", disabledClassName: "roundImage1"},
	   		          {kind: "MyCustomButton", name: "player1Round3", defaultClassName:"roundImage1off", clickClassName: "roundImage1off", disabledClassName: "roundImage1"},
	   		             
	   		        ]},
	   		        {layoutKind: "VFlexLayout",flex:1, components:[
					   {kind: "MyCustomButton", name: "player1flip1",clickable: false, defaultClassName:"flipImageoffp11", dualDefault: "flipImageLost", disabledClassName: "flipImage"},
					   {kind: "MyCustomButton", name: "player1flip2",clickable: false, defaultClassName:"flipImageoffp12", dualDefault: "flipImageLost", disabledClassName: "flipImage"},
					   {kind: "MyCustomButton", name: "player1flip3",clickable: false, defaultClassName:"flipImageoffp13", dualDefault: "flipImageLost", disabledClassName: "flipImage"},
	   		             
	   		        ]},
	   		        {name: "p1Total", content: "test", style:"-webkit-transform: rotate(90deg);"},
	   		        {layoutKind: "VFlexLayout",flex:1, components: [
	   		        ]},
	   		        {layoutKind: "VFlexLayout",flex:1, components: [
	   		             {kind: "Image", name:"theRound", src: "images/round1.png"}                                           
	   		        ]},

	   		        {layoutKind: "VFlexLayout",flex:2, components: [
	   		        	
	   		        ]},
	   		        {name: "p2Total",content:"test", style:"-webkit-transform: rotate(-90deg);"},
	   		        {layoutKind: "VFlexLayout", flex:1,align:"end",pack:"right", components:[
						{kind: "MyCustomButton", name: "player2flip1",clickable: false, defaultClassName:"flipImageoffp21", dualDefault: "flipImageLost", disabledClassName: "flipImage"},
						{kind: "MyCustomButton", name: "player2flip2",clickable: false, defaultClassName:"flipImageoffp22", dualDefault: "flipImageLost", disabledClassName: "flipImage"},
						{kind: "MyCustomButton", name: "player2flip3",clickable: false, defaultClassName:"flipImageoffp23", dualDefault: "flipImageLost", disabledClassName: "flipImage"},
	   		             
	   		        ]},
  	   		        {layoutKind: "VFlexLayout",flex:1,align:"end",pack:"right", components:[
	   		          {kind: "MyCustomButton", name: "player2Round1", defaultClassName:"roundImage2off", clickClassName: "roundImage2off", disabledClassName: "roundImage2"},
	   		          {kind: "MyCustomButton", name: "player2Round2", defaultClassName:"roundImage2off", clickClassName: "roundImage2off", disabledClassName: "roundImage2"},
	   		          {kind: "MyCustomButton", name: "player2Round3", defaultClassName:"roundImage2off", clickClassName: "roundImage2off", disabledClassName: "roundImage2"},
	   		             
	   		        ]}
	   		      ]}
   			//]}
   			]},
   			{kind: "CoinVisual", name: "p1Points"},
   			{kind: "CoinVisual", name: "p2Points", viewStyle: 1},
   			{kind: "RoundBonus", name: "rBonus"},
   			{kind: "CoinRing", name: "ring"},
   			{kind: "coinBet", name: "p1Bet"},
   			{kind: "coinBet", name: "p2Bet", viewStyle: 1},
   			{kind: "HeadsAndTails", name: "hnt"}
		]}
	],
	openHelp: function() {
		window.open("http://chrishptouchpadapps.tumblr.com/post/18099518647/two-outta-three-1-1-0-help-overview")	
	},
	playApplause: function() {
		if (
			this.$.popWin.getContentClassName() == "msgBoxGameOverp2" ||
			this.$.popWin.getContentClassName() == "msgBoxGameOverp1") {
				if (this.$.useSound.getChecked() == true) {
					this.$.flipping.setCurrentSeconds(19)
					this.$.flipping.pauseSound()	
				}
		}
		else {
			if (this.$.useSound.getChecked() == true) {
				this.$.flipping.setCurrentSeconds(12)
				this.$.flipping.pauseSound()
				window.setTimeout(enyo.bind(this,function() {
					this.$.flipping.pauseSound()
				}), 6000);
			}
		}

			
	},
	topTen: function() {
		    this.pname = "";
	        this.pcoins = 0;    
	},
	openTopTen: function() {
		this.$.coin.setShowing(false);
		this.$.popTopTen.openAtCenter();
	},
	closeTopTen: function() {
		this.$.coin.setShowing(true);
		this.$.popTopTen.close();
	},
	fillTopTen: function() {
		var s = "";
		var t = "";
		this.topArr.sort(this.compare);
		for (var i = 0; i < this.topArr.length; i++) {
			if (this.topArr[i].pcoins > 0) {
				s += this.topArr[i].pname + "<br />";
				t += this.topArr[i].pcoins + "<br />";
			}; 
		};
		this.$.topTenName.setContent(s);
		this.$.topTenCoins.setContent(t);	
	},
	compare: function (a,b) {
		var x = a.pcoins
		var y = b.pcoins
		if (x > y)	{
			return -1
		}
		if (x < y)	{
			return 1
		}
		return 0
	},
	changePlayers: function() {
		this.INPLAYER = 1;
		this.$.coin.hide();
		if (this.INFLIP == 0) {
			this.confirmRestart();
		}
		else {
			if (this.$.players.getValue() == "one"){
				this.$.players.setValue("two");
			}
			else {
				this.$.players.setValue("one");
			}
		};
	},
	checkboxClicked: function(inSender) {
		this.$.popOne.setUseSound(inSender.getChecked())
		this.$.popTwo.setUseSound(inSender.getChecked())
		this.$.p1Points.setUseSound(inSender.getChecked())
		this.$.p2Points.setUseSound(inSender.getChecked())
		this.$.p1Bet.setUseSound(inSender.getChecked())
		this.$.p2Bet.setUseSound(inSender.getChecked())
	    if (inSender.getChecked() == false) {
	        this.$.flipping.stop();
	    };
	},
	confirmRestart: function () {
		this.$.coin.hide();
		this.$.popConfirm.openAtCenter();
	},
	cancelRestart: function() {
		this.$.coin.show();
		this.$.popConfirm.close();
		if (this.INPLAYER == 1) {
			this.INPLAYER = 0;
			if (this.$.players.getValue() == "one"){
				this.$.players.setValue("two");
			}
			else {
				this.$.players.setValue("one");
			};
		};
	},
	restartGame: function() {
		if (this.INFLIP != 1) {
			this.$.coin.show();
			this.$.popConfirm.close();
			this.$.popTwo.close();
			this.p2Confirmed = 0;
			this.p1Confirmed = 0;
			this.isFlipping = 1;
			this.p1Flips = 0;
			this.p2Flips = 0;
			this.cFlip = 1;
			this.cTurn = 1;
			this.p1Coins = 1000
			this.p2Coins = 1000
			this.resetGame(1);
			this.$.popOne.open();
			this.$.popOne.showSection(1);
			this.$.popMsg.setClassName("enyo-popup msgPopPlayer1ChoiceOpen");
			this.$.msgContent.setContent("Player 1 make your choice!");
			this.$.popMsg.open();
			if (this.$.players.getValue() == "one") {
				this.$.compContent.setContent("Touchpad waiting for you...");
				this.$.popComp.open();
			}
			else {
				this.$.popComp.close();
			};
		}
		else {
			this.$.popConfirm.close();
		}
	},
	hideMenu: function() {
		this.$.popSettings.close();
		this.$.showMenu.setShowing(true);
	},
	showTheMenu: function() {
		this.$.popSettings.open();
		this.$.showMenu.setShowing(false);
	},
	changeCoin: function() {
		if (this.$.coinSelect.getValue() == "dime") {
				this.$.coin.setSrc("images/dime/dime1.png")
				this.$.coin.setClassName ("myImageDime");
				this.$.p1coin.setClassName ("myImageDime");
				this.$.p2coin.setClassName ("myImageDime");
				this.$.popOne.setIcons(2)
				this.$.popTwo.setIcons(2)
		}
		else if (this.$.coinSelect.getValue() == "penny") {
				this.$.coin.setSrc("images/penny/penny1.png")
				this.$.coin.setClassName ("myImagePenny");
				this.$.p1coin.setClassName ("myImagePenny");
				this.$.p2coin.setClassName ("myImagePenny");
				this.$.popOne.setIcons(1);
				this.$.popTwo.setIcons(1);
		}
		else if (this.$.coinSelect.getValue() == "quarter") {
			this.$.coin.setSrc("images/quarter/quarter1.png");
			this.$.coin.setClassName ("myImageQuarter");
			this.$.p1coin.setClassName ("myImageQuarter");
			this.$.p2coin.setClassName ("myImageQuarter");
			this.$.popOne.setIcons(3);
			this.$.popTwo.setIcons(3);
		};
		if (this.isFlipping == 1) {
			this.setPlayerCoins(false);
		};
		if (this.$.useSound.getChecked() == true) {
			this.$.flipping.playClick();
		};
	},
	rendered: function() {
		this.inherited(arguments);
		if (this.HASLOADED == false) {
			this.INFLIP = 0;
			enyo.nextTick(enyo, enyo.setFullScreen, true);
			enyo.setAllowedOrientation("landscape");
			window.PalmSystem.setWindowProperties({blockScreenTimeout : true});
			this.$.popOne.open();
			this.$.popMsg.open();
			this.$.popRound.open();
			this.$.popSettings.open();
			this.$.flipping.loadSound();
			this.$.p1Total.setContent(this.p1Coins)
			this.$.p2Total.setContent(this.p2Coins)
			//localStorage.setItem("twoouttathreetopten", null)
			var top = localStorage.getItem("twoouttathreetopten")
			if (!top || top == null) {
				
			}
			else {
				try {
					this.topArr = enyo.json.parse(enyo.string.fromBase64(top))
				}
				catch (e) {
					
				}
			};
			if (this.topArr.length < 1) {
				for (var i = 0; i <= 9; i++) {
					this.topArr[i] = new this.topTen
				};
				this.createFakeTopTen();

			};
			this.log(this.topArr.length)
			this.HASLOADED = true
		}
	},
	createFakeTopTen: function() {
		this.topArr[0].pname = "Your Mom"	
		this.topArr[0].pcoins = 150000

		this.topArr[1].pname = "Nick L. Andime"	
		this.topArr[1].pcoins = 100000

		this.topArr[2].pname = "Dan D. Lyon"	
		this.topArr[2].pcoins = 70000

		this.topArr[3].pname = "Hal E. Luya"	
		this.topArr[3].pcoins = 60000

		this.topArr[4].pname = "Candice B. Fureal"	
		this.topArr[4].pcoins = 40000

		this.topArr[5].pname = "Stu Pitt"	
		this.topArr[5].pcoins = 28000

		this.topArr[6].pname = "Quimby Ingmeen"	
		this.topArr[6].pcoins = 20000

		this.topArr[7].pname = "Eve Hill"	
		this.topArr[7].pcoins = 12000

		this.topArr[8].pname = "Clara Sabell"	
		this.topArr[8].pcoins = 8000

		this.topArr[9].pname = "Lynn Meabuck"	
		this.topArr[9].pcoins = 5000

		var s = enyo.json.stringify(this.topArr);
		s = enyo.string.toBase64(s);

		localStorage.setItem("twoouttathreetopten", s);

	},
	checkTopTen: function() {
		var b = false
		var x = 0;
		var p = 1
		this.log(this.$.popWin.getContentClassName())
		if (this.$.popWin.getContentClassName() == "msgBoxInGamep1" || 
			this.$.popWin.getContentClassName() == "msgBoxGameOverp2" ||
			this.$.popWin.getContentClassName() == "msgBoxGameOverTouchpad") {
				
				x = this.p1Coins;
				p = 1
		}
		else if (this.$.popWin.getContentClassName() == "msgBoxInGamep2" ||
				 this.$.popWin.getContentClassName() == "msgBoxGameOverp1") {
					
					x = this.p2Coins;
					p = 2
		}
		else {
			this.closeWin();
			return;
		};
		this.log("checking")
		this.topArr.sort(this.compare);
		this.log(this.topArr.length)
		for (var i = this.topArr.length - 1; i >= 0; i--) {
			this.log(x + "," + this.topArr[i].pcoins)
			if (x > this.topArr[i].pcoins) {
				b = true
				break;
			};
		};
		this.log(b)
		if (b == true) {
			if (this.$.players.getValue() == "one" && p == 2) {
				this.$.playerName.setValue("Touchpad");
				this.addAndCloseWin();
			} 
			else {
				this.$.coin.setShowing(false);

				this.$.popAddName.openAtCenter();
				this.$.winNotes.setContent("Player " + p.toString() + " won with " + x.toString() + " gold coins!" )
			};
			
		} 
		else {
			this.closeWin();
		};

	},
	addAndCloseWin: function () {
		var x = 0;
		if (this.$.popWin.getContentClassName() == "msgBoxInGamep1" || 
			this.$.popWin.getContentClassName() == "msgBoxGameOverp2" ||
			this.$.popWin.getContentClassName() == "msgBoxGameOverTouchpad") {
				
				x = this.p1Coins;
		}
		else if (this.$.popWin.getContentClassName() == "msgBoxInGamep2" ||
				 this.$.popWin.getContentClassName() == "msgBoxGameOverp1") {
					
					x = this.p2Coins;
		}
		this.log("adding");
		this.topArr[this.topArr.length] = new this.topTen;
		this.topArr[this.topArr.length - 1].pname = this.$.playerName.getValue();
		this.topArr[this.topArr.length - 1].pcoins = x;
		this.topArr.sort(this.compare);
		this.topArr = this.topArr.slice(0,10);
		var s = enyo.json.stringify(this.topArr);
		this.log(s);
		s = enyo.string.toBase64(s);

		localStorage.setItem("twoouttathreetopten", s);
		this.$.coin.setShowing(true);
		this.$.popAddName.close();
        this.closeWin();
	},
	closeWin: function () {
        this.resetGame(this.pWon);
		this.$.popWin.close();
	},
	openRound: function() {
		this.$.popRound.open();
	},
	player1Confirm: function() {
		this.p1Confirmed = 1;
		this.$.popOne.showSection(2);
		this.$.popOne.setBetMode(0);
		this.$.popOne.setPCoins(this.p1Coins)
		this.$.msgContent.setContent("Player 1, make your bet!")
		this.setPlayerCoins(true)
	},
	player1BetConfirm: function() {
		if (this.$.popOne.getBetMode() == 0) {
			if (this.$.players.getValue() == "two") {
				this.$.p1Bet.showAndSetBet(this.$.popOne.getBet())

				this.$.popOne.close();
				this.$.popMsg.close();
				this.$.popTwo.open();
				this.$.popTwo.showSection(2);
				this.$.popTwo.setBetMode(1);
				this.$.popTwo.setPCoins(this.p2Coins)
				this.$.msgContent.setContent("Player 2, make your bet!");
				this.$.popMsg.setClassName("enyo-popup msgPopPlayer2ChoiceOpen");
				this.$.popMsg.open();	
			}
			else {
				//COMPUTER BETTING
				this.$.popOne.close();
				this.$.popMsg.close();
				this.$.p1Bet.showAndSetBet(this.$.popOne.getBet())
				this.$.compContent.setContent("Touchpad making its bet...");
				window.setTimeout(enyo.hitch(this,(function() {
					var x = Math.floor(Math.random() * (this.p2Coins / 1.5))
					this.$.popTwo.setBetMode(3);
					this.$.popTwo.setBet(x)
					this.$.compContent.setContent("Touchpad bets " + x + " gold coins.");
					this.$.p2Bet.showAndSetBet(this.$.popTwo.getBet())
					window.setTimeout(enyo.hitch(this,(function() {
						this.player2BetConfirm()
					})), 1000)
				})), 1000)
			}
		} 
		else{
			this.$.popOne.close();
			if (this.$.players.getValue() == "two" || this.$.popTwo.getBetMode() == 1) {
				this.$.p1Bet.showAndSetBet(this.$.popOne.getBet())
				this.isFlipping = 0;
				this.$.popMsg.setClassName("enyo-popup msgPopPlayer1ChoiceClosed");
				this.$.msgContent.setContent("Player 1, Flip The Coin!");
				this.log(this.$.coin.hasNode().offsetLeft + "," + this.$.coin.hasNode().offsetTop)
				this.$.ring.startMe(this.coinLeft + this.prevX, this.coinTop + this.prevY)
				this.$.popMsg.open();
			}
			else {
				/*this.$.compContent.setContent("Computer flipping the coin...");
				window.setTimeout(enyo.hitch(this,(function() {
					this.isFlipping = 0;
					this.coinClicked(0,0);
				})), 500)*/
			}
		};
		
		
	},
	player2BetConfirm: function() {
		if (this.$.popTwo.getBetMode() == 0) {
			if (this.$.players.getValue() == "two") {
				this.$.p2Bet.showAndSetBet(this.$.popTwo.getBet())
				this.$.popTwo.close();
				this.$.popMsg.close();
				this.$.popOne.open();
				this.$.popOne.setPCoins(this.p1Coins)
				this.$.popOne.showSection(2);
				this.$.popOne.setBetMode(1);
				this.$.msgContent.setContent("Player 1, make your bet!");
				this.$.popMsg.setClassName("enyo-popup msgPopPlayer1ChoiceOpen");
				this.$.popMsg.open();	
			}
			else {
				//COMPUTER BETTING
			}
		}
		else {
			this.$.popTwo.close();
			if (this.$.players.getValue() == "two") {
				this.$.p2Bet.showAndSetBet(this.$.popTwo.getBet())
				this.isFlipping = 0;
				this.$.popMsg.setClassName("enyo-popup msgPopPlayer2ChoiceClosed");
				this.$.msgContent.setContent("Player 2, Flip The Coin!");
				this.log(this.$.coin.hasNode().offsetLeft + "," + this.$.coin.hasNode().offsetTop)
				this.$.ring.startMe(this.coinLeft + this.prevX, this.coinTop + this.prevY)
				this.$.popMsg.open();
			}
			else {
					this.$.compContent.setContent("Touchpad flipping the coin...");
					window.setTimeout(enyo.hitch(this,(function() {
						this.isFlipping = 0;
						this.coinClicked(0,0);
					})), 900)
			}	
		};
		
	},
	player2Confirm: function() {
		this.p2Confirmed = 1;
		if (this.$.players.getValue() == "two") {
			this.$.popTwo.showSection(2);
			this.$.popTwo.setBetMode(0);
			this.$.popTwo.setPCoins(this.p2Coins);
			this.$.msgContent.setContent("Player 2, make your bet!");
			this.setPlayerCoins(true);
		}
		else {
			this.setPlayerCoins(true);
			this.$.compContent.setContent("Touchpad making its bet...");
			window.setTimeout(enyo.hitch(this,(function() {
				var x = Math.floor(Math.random() * (this.p2Coins / 1.5))
				this.$.popTwo.setBetMode(1);
				this.$.popTwo.setBet(x)
				this.$.compContent.setContent("Touchpad bets " + x + " gold coins.");
				this.$.p2Bet.showAndSetBet(this.$.popTwo.getBet())
				window.setTimeout(enyo.hitch(this,(function() {
					this.$.popMsg.close();
					this.$.popOne.open();
					this.$.popOne.setPCoins(this.p1Coins)
					this.$.popOne.showSection(2);
					this.$.popOne.setBetMode(1);
					this.$.msgContent.setContent("Player 1, make your bet!");
					this.$.popMsg.setClassName("enyo-popup msgPopPlayer1ChoiceOpen");
					this.$.popMsg.open();	
				})), 1000)
			})), 1000)
		}
	},
	animateDrums: function() {
		this.$.drummer.setSrc("images/drum" + this.drumIndex.toString() + ".png");
		this.drumIndex++;
		if (this.drumIndex > 4) {this.drumIndex = 1};
	},
	stopDrums: function() {
		window.clearInterval(this.drumJob);
	},
	coinClicked: function(inSender, inEvent) {
		if (this.isFlipping == 0) {
			this.$.coin.setStyle("")
			this.$.ring.stopMe();
			this.$.restartBut.setDisabled(true);
			this.INFLIP = 1;
			this.$.popMsg.close();
			this.interval = Math.floor(Math.random() * 20);
			this.isFlipping = 1;
			this.drumIndex = 1;
			
			this.$.rBonus.startMe()
			var x, y = 0;
			this.finished = 0;
			this.rotation = 700 + (Math.floor(Math.random() * 1500));

			this.$.drummer.setShowing(true);
			this.drumJob = window.setInterval(enyo.hitch(this, "animateDrums"),50);
			if (this.$.useSound.getChecked() == true) {
				this.$.flipping.setCurrentSeconds(0)
				this.$.flipping.play();
			}
			x = Math.floor(Math.random() * 100);
			if (x > 49) {
				x = Math.floor(Math.random() * 41) ;
				
			}
			else {
				x = (Math.floor(Math.random() * 41) ) * -1;
			};
			y = Math.floor(Math.random() * 40);
			if (y > 49) {
				y =Math.floor(Math.random() * 41);
			}
			else {
				y =(Math.floor(Math.random() * 41) ) * -1;
			};
			if ( x + this.coinLeft < 0 ) {
				x = x * -1;
			}
			else if (x + this.coinLeft > 1000) {
				x = x * -1;
			};
			if (y + this.coinTop < 0 ) {
				y = y * -1;
			}
			else if (y + this.coinTop > 700) {
				y = y * -1;
			};
			this.prevX = x;
			this.prevY = y;
			
			this.job = window.setInterval(enyo.hitch(this, "animateCoin"), this.interval);
			this.$.coin.setStyle("top: " + this.coinTop + "px; left: " + this.coinLeft +"px;	position:absolute;	-webkit-transition-property:  -webkit-transform;	-webkit-transition-duration: 2s;	-webkit-transform-origin:center;	-webkit-transform:translate3d(" + x + "px," + y + "px,0) scale3d(4,4,0) rotate3d(0,0,0," + this.rotation + "deg);	-webkit-transform-style: preserve-3d;");
			window.setTimeout(enyo.bind(this,(function() {
				this.rotation = this.rotation + 1000 + (Math.floor(Math.random() * 4000));
				this.$.coin.setStyle("top: " + this.coinTop + "px; left: " + this.coinLeft +"px;	position:absolute;	-webkit-transition-property:  -webkit-transform, top, left;	-webkit-transition-duration: 1.5s;	-webkit-transform-origin:center;	-webkit-transform:translate3d(" + (x * -1 ) + "px," + (y * -1 ) + "px,0) scale3d(1,1,0) rotate3d(0,0,0," + this.rotation + "deg);	-webkit-transform-style: preserve-3d;");
				window.setTimeout(enyo.bind(this,(function() {
					this.stopCoin();
					this.bounce3();
				})),1500)
			})),2000)
		};
	},
	setPlayerCoins: function(showThem) {
		if (this.cTurn == 1) {
			if (this.$.popOne.getChoose() == "heads") {
				if (this.$.coinSelect.getValue() == "dime") {
					this.$.p1coin.setSrc("images/dime/dime1.png");
					this.$.p2coin.setSrc("images/dime/dime8.png");
				}
				else if (this.$.coinSelect.getValue() == "penny") {
					this.$.p1coin.setSrc("images/penny/penny1.png");
					this.$.p2coin.setSrc("images/penny/penny8.png");
				}
				else if (this.$.coinSelect.getValue() == "quarter") {
					this.$.p1coin.setSrc("images/quarter/quarter1.png");
					this.$.p2coin.setSrc("images/quarter/quarter8.png");
				};
			}
			else {
				if (this.$.coinSelect.getValue() == "dime") {
					this.$.p2coin.setSrc("images/dime/dime1.png");
					this.$.p1coin.setSrc("images/dime/dime8.png");
				}
				else if (this.$.coinSelect.getValue() == "penny") {
					this.$.p2coin.setSrc("images/penny/penny1.png");
					this.$.p1coin.setSrc("images/penny/penny8.png");
				}
				else if (this.$.coinSelect.getValue() == "quarter") {
					this.$.p2coin.setSrc("images/quarter/quarter1.png");
					this.$.p1coin.setSrc("images/quarter/quarter8.png");
				};
			};
		}
		else {
			if (this.$.popTwo.getChoose() == "heads") {
				if (this.$.coinSelect.getValue() == "dime") {
					this.$.p2coin.setSrc("images/dime/dime1.png");
					this.$.p1coin.setSrc("images/dime/dime8.png");
				}
				else if (this.$.coinSelect.getValue() == "penny") {
					this.$.p2coin.setSrc("images/penny/penny1.png");
					this.$.p1coin.setSrc("images/penny/penny8.png");
				}
				else if (this.$.coinSelect.getValue() == "quarter") {
					this.$.p2coin.setSrc("images/quarter/quarter1.png");
					this.$.p1coin.setSrc("images/quarter/quarter8.png");
				};
			}
			else {
				if (this.$.coinSelect.getValue() == "dime") {
					this.$.p1coin.setSrc("images/dime/dime1.png");
					this.$.p2coin.setSrc("images/dime/dime8.png");
				}
				else if (this.$.coinSelect.getValue() == "penny") {
					this.$.p1coin.setSrc("images/penny/penny1.png");
					this.$.p2coin.setSrc("images/penny/penny8.png");
				}
				else if (this.$.coinSelect.getValue() == "quarter") {
					this.$.p1coin.setSrc("images/quarter/quarter1.png");
					this.$.p2coin.setSrc("images/quarter/quarter8.png");
				};
			};
		};
		if (showThem == true) {
			this.$.p1coin.setShowing(true);
			this.$.p2coin.setShowing(true);
			this.$.p1coin.addClass("popItUp");
			this.$.p2coin.addClass("popItUp");
			if (this.$.useSound.getChecked() == true) {
				this.$.flipping.playClick2();
			};
		}
	},
	/*

	bounce1: function() {
		var x, y = 0;
		this.rotation = 1080;
		x = Math.floor(Math.random() * 100);
		if (x > 49) {
			x =Math.floor(Math.random() * 31);
		}
		else {
			x =(Math.floor(Math.random() * 31) ) * -1;
		};
		y = Math.floor(Math.random() * 100);
		if (y > 49) {
			y =Math.floor(Math.random() * 31) ;
			
		}
		else {
			y =(Math.floor(Math.random() * 31) ) * -1;
		};
		if (x > this.prevX) {x = this.prevX - 10};
		if (y > this.prevY) {y = this.prevY - 10};
		if ( x + this.coinLeft < 0 ) {
			x = x * -1;
		}
		else if (x + this.coinLeft > 1000) {
			x = x * -1;
		};
		if ( y + this.coinTop < 0 ) {
			y = y * -1;
		}
		else if (y + this.coinTop > 700) {
			y = y * -1;
		};
		this.prevX = x;
		this.prevY = y;
		this.interval = Math.floor(Math.random() * 50) + this.interval;
		this.job = window.setInterval(enyo.hitch(this, "animateCoin"), this.interval);
		this.$.coin.setStyle("top: " + this.coinTop + "px; left: " + this.coinLeft +"px;	position:absolute;	-webkit-transition-property:  -webkit-transform;	-webkit-transition-duration: 3s;	-webkit-transform-origin:center;	-webkit-transform:translate3d(" + x + "px," + y + "px,0) scale3d(3,3,0) rotate(" + this.rotation + "deg);	-webkit-transform-style: preserve-3d;");
		window.setTimeout(enyo.bind(this,(function() {
			this.rotation = 1440;
			this.$.coin.setStyle("top: " + this.coinTop + "px; left: " + this.coinLeft +"px;	position:absolute;	-webkit-transition-property:  -webkit-transform, top, left;	-webkit-transition-duration: 2.5s;	-webkit-transform-origin:center;	-webkit-transform:translate3d(" + (x * -1 ) + "px," + (y * -1 ) + "px,0) scale3d(1,1,0) rotate(" + this.rotation + "deg);	-webkit-transform-style: preserve-3d;");
			window.setTimeout(enyo.bind(this,(function() {
				this.stopCoin();
				this.bounce2();
			})),2300)
		})),2800)
	},
	bounce2: function() {
		var x, y = 0;
		this.rotation = 1800;
		x = Math.floor(Math.random() * 100);
		if (x > 49) {
			x =Math.floor(Math.random() * 21) ;
		}
		else {
			x =(Math.floor(Math.random() * 21) ) * -1
		};
		y = Math.floor(Math.random() * 100);
		if (y > 49) {
			y =Math.floor(Math.random() * 21);
		}
		else {
			y =(Math.floor(Math.random() * 21)) * -1;
		};
		if (x > this.prevX) {x = this.prevX - 10};
		if (y > this.prevY) {y = this.prevY - 10};
		if ( x + this.coinLeft < 0 ) {
			x = x * -1;
		}
		else if (x + this.coinLeft > 1000) {
			x = x * -1;
		}
		if ( y + this.coinTop < 0 ) {
			y = y * -1;
		}
		else if (y + this.coinTop > 700) {
			y = y * -1;
		}
		this.prevX = x;
		this.prevY = y;
		this.interval = Math.floor(Math.random() * 100) + this.interval;
		this.job = window.setInterval(enyo.hitch(this, "animateCoin"), this.interval);
		this.$.coin.setStyle("top: " + this.coinTop + "px; left: " + this.coinLeft +"px;	position:absolute;	-webkit-transition-property:  -webkit-transform;	-webkit-transition-duration: 2s;	-webkit-transform-origin:center;	-webkit-transform:translate3d(" + x + "px," + y + "px,0) scale3d(2.5,2.5,0) rotate(" + this.rotation + "deg);	-webkit-transform-style: preserve-3d;");
		window.setTimeout(enyo.bind(this,(function() {
			this.rotation = 2160;
			this.$.coin.setStyle("top: " + this.coinTop + "px; left: " + this.coinLeft +"px;	position:absolute;	-webkit-transition-property:  -webkit-transform, top, left;	-webkit-transition-duration: 1.5s;	-webkit-transform-origin:center;	-webkit-transform:translate3d(" + (x * -1 ) + "px," + (y * -1 ) + "px,0) scale3d(1,1,0) rotate(" + this.rotation + "deg);	-webkit-transform-style: preserve-3d;");
			window.setTimeout(enyo.bind(this,(function() {
				this.stopCoin();
				this.bounce3();
			})),1300)
		})),1800)
	},*/
	bounce3: function() {
		var x, y = 0;
		this.rotation = 5500 + Math.floor(Math.random() * 10000);
		x = Math.floor(Math.random() * 100);
		if (x > 49) {
			x =Math.floor(Math.random() * 2) ;
		}
		else {
			x =(Math.floor(Math.random() * 2) ) * -1;
		};
		y = Math.floor(Math.random() * 100);
		if (y > 49) {
			y =Math.floor(Math.random() * 5) ;
		}
		else {
			y =(Math.floor(Math.random() * 5) ) * -1;
		};
		if (x > this.prevX) {x = 1};
		if (y > this.prevY) {y = 1};
		if ( x + this.coinLeft < 0 ) {
			x = x * -1;
		}
		else if (x + this.coinLeft > 1000) {
			x = x * -1;
		};
		if ( y + this.coinTop < 0 ) {
			y = y * -1;
		}
		else if (y + this.coinTop > 700) {
			y = y * -1;
		};
		this.prevX = x;
		this.prevY = y;
		
		this.interval = Math.floor(Math.random() * 250) + this.interval;
		this.job = window.setInterval(enyo.hitch(this, "animateCoin"), this.interval);
		this.$.coin.setStyle("top: " + this.coinTop + "px; left: " + this.coinLeft +"px;	position:absolute;	-webkit-transition-property:  -webkit-transform;	-webkit-transition-duration: 900ms;	-webkit-transform-origin:center;	-webkit-transform:translate3d(" + x + "px," + y + "px,0) scale3d(1.5,1.5,0) rotate3d(0,0,0," + this.rotation + "deg);	-webkit-transform-style: preserve-3d;");
		window.setTimeout(enyo.bind(this,(function() {
			this.rotation = this.rotation + 2000 + (Math.floor(Math.random() * 15000));
			this.$.coin.setStyle("top: " + this.coinTop + "px; left: " + this.coinLeft +"px;	position:absolute;	-webkit-transition-property:  -webkit-transform, top, left;	-webkit-transition-duration: 500ms;	-webkit-transform-origin:center;	-webkit-transform:translate3d(" + (x * -1 ) + "px," + (y * -1 ) + "px,0) scale3d(1,1,0) rotate3d(0,0,0," + this.rotation + "deg);	-webkit-transform-style: preserve-3d;");
			window.setTimeout(enyo.bind(this,(function() {
				//this.$.coin.setStyle("position:absolute;	-webkit-transition-property:  -webkit-transform;	-webkit-transition-duration: 500ms;	-webkit-transform-origin:center;	-webkit-transform: rotate(0deg) scale3d(1,1,0); -webkit-transform-style: preserve-3d;");
				window.setTimeout(enyo.bind(this,(function() {
					this.finished = 1;
					this.$.rBonus.stopMe()
					this.stopCoin();
				})),300)
			})),500)
		})),900)
	},
	animateCoin: function() {
		if (this.$.coinSelect.getValue() == "dime") {
			this.$.coin.setSrc("images/dime/dime" + this.aniIndex.toString() + ".png");
			this.aniIndex++;
			if (this.aniIndex > 13) { this.aniIndex = 1;};
		}
		else if (this.$.coinSelect.getValue() == "penny") {
			this.$.coin.setSrc("images/penny/penny" + this.aniIndex.toString() + ".png");
			this.aniIndex++;
			if (this.aniIndex > 14) { this.aniIndex = 1;};
		}
		else if (this.$.coinSelect.getValue() == "quarter") {
			this.$.coin.setSrc("images/quarter/quarter" + this.aniIndex.toString() + ".png");
			this.aniIndex++;
			if (this.aniIndex > 14) { this.aniIndex = 1;};
		}
		
	},
	stopCoin: function() {
		window.clearInterval(this.job);

		if (this.finished == 1) {
			this.stopDrums();
			this.$.drummer.setSrc("images/drum5.png");
			window.setTimeout(enyo.bind(this,(function() {
				if (this.$.useSound.getChecked() == true) {
					this.$.flipping.pauseSound()
				}
				var s = this.$.coinSelect.getValue()
				var ones = 0
				var zeros = 0
				var t = 0
				for (var i = 0; i <= 21; i++) {
					t = Math.floor(Math.random() * 2)
					if (t == 1) {
						ones++
					} 
					else {
						zeros++
					};
				};
                if (this.theads >= (Math.floor(Math.random() * 8) + 1)) {
                	ones = ones + this.theads;
                	this.theads = 0;
                };
                if (this.ttails >= (Math.floor(Math.random() * 8) + 1)) {
                	zeros = zeros + this.ttails;
                	this.ttails = 0;
                };
				if (ones > zeros){
					this.$.coin.setSrc("images/" + s + "/" + s + "8.png");
					this.checkWin("tails");
					this.ttails++;
				}
				else {
					this.$.coin.setSrc("images/" + s + "/" + s + "1.png");
					this.checkWin("heads");
					this.theads++;

				}/*
				if (this.$.coinSelect.getValue() == "dime") {
					if ((Math.floor(Math.random() * 2)) == 1){//(this.aniIndex > 2 && this.aniIndex < 7) {
						
					}
					else {
						
					};
				}
				else if (this.$.coinSelect.getValue() == "penny") {
					if ((Math.floor(Math.random() * 2)) != 1){//(this.aniIndex > 2 && this.aniIndex < 9) {
						this.$.coin.setSrc("images/penny/penny8.png");
						this.checkWin("tails");
					}
					else {
						this.$.coin.setSrc("images/penny/penny1.png");
						this.checkWin("heads");
					};
				}
				else if (this.$.coinSelect.getValue() == "quarter") {
					if (Math.floor(Math.random() * 2) == 1 ) {//(this.aniIndex > 7 && this.aniIndex < 17) {
						this.$.coin.setSrc("images/quarter/quarter8.png");
						this.checkWin("tails");
					}
					else {
						this.$.coin.setSrc("images/quarter/quarter1.png");
						this.checkWin("heads");
					};
				};*/
			})),300)
			
		};
	},
	setFlipMarker: function(p) {
		if (p == 1) {
			if (this.cFlip == 1) {
				this.$.player1flip1.setButtonEnabled(false);
				this.$.player2flip1.setToDualDefault();
			};
			if (this.cFlip == 2) {
				this.$.player1flip2.setButtonEnabled(false);
				this.$.player2flip2.setToDualDefault();
			};
			if (this.cFlip == 3) {
				this.$.player1flip3.setButtonEnabled(false);
				this.$.player2flip3.setToDualDefault();
			};
		}
		else {
			if (this.cFlip == 1) {
				this.$.player2flip1.setButtonEnabled(false);
				this.$.player1flip1.setToDualDefault();
			};
			if (this.cFlip == 2) {
				this.$.player2flip2.setButtonEnabled(false);
				this.$.player1flip2.setToDualDefault();
			};
			if (this.cFlip == 3) {
				this.$.player2flip3.setButtonEnabled(false);
				this.$.player1flip3.setToDualDefault();
			};
		}
	},
	getRoundMult: function() {
		switch (this.cRound)	{
			case 3: {
				return 2 * this.getBonusVal();
				break;
			}
			case 4: {
				return 3 * this.getBonusVal()
				break;
			}
			case 5: {
				return 4 * this.getBonusVal();
				break;
			}
			default: {
				return 1 * this.getBonusVal();
				break;
			}
		}
	},
	getBonusVal: function() {
		var x = this.$.rBonus.getVal()
		return Number(x)	
	},
	calculateBets: function(winner) {
		if (winner == 1) {
			var x = Math.floor(parseInt(this.$.popOne.getBet())  * this.getBonusVal());
			var y = parseInt(this.$.popTwo.getBet());
			this.p1Coins += x + y;
			this.p2Coins -= y;
			this.$.p1Points.clearValues();
			this.$.p2Points.clearValues();
			this.$.p1Points.feedValue("+" + x.toString());
			this.$.p1Points.feedValue("+" + y.toString());
			this.$.p2Points.feedValue("-" + y.toString());
			this.$.p1Points.showMe();
			this.$.p2Points.showMe();
			if (this.cTurn == winner) {
				x = Math.floor(100 * this.getRoundMult());
				this.p1Coins += x;
				this.$.p1Points.feedValue("+" + x.toString());
			};
		} 
		else {
			var x = parseInt(this.$.popOne.getBet());
			var y = Math.floor(parseInt(this.$.popTwo.getBet()) * this.getBonusVal());
			this.p1Coins -= x
			this.p2Coins += y + x
			this.$.p1Points.clearValues();
			this.$.p2Points.clearValues();
			this.$.p1Points.feedValue("-" + x.toString());
			this.$.p2Points.feedValue("+" + y.toString());
			this.$.p2Points.feedValue("+" + x.toString());
			this.$.p1Points.showMe();
			this.$.p2Points.showMe();
			if (this.cTurn == winner) {
				x = Math.floor(100 * this.getRoundMult());
				this.p2Coins += x;
				this.$.p2Points.feedValue("+" + x.toString());
			};
			//this.$.pane.createComponent({kind:"coinPopup"},{owner: this})
			//this.$.pane.render()
			//SHOW COIN POPUPS
		};
		if (this.p1Coins <= 0) {
			return 1;
		}
		else if (this.p2Coins <= 0) {
			return 2;
		};
		return 0;
	},
	checkWin: function(result) {
		if (result == "heads") {
			//this.$.winheads.setShowing(true);
		}
		else {
			//this.$.wintails.setShowing(true);
		};
		var gOCheck = 0
		if (this.cTurn == 1) {
			if (this.$.popOne.getChoose() == result) {
				this.$.hnt.showMe(1,result, this.$.players.getValue())
				gOCheck = this.calculateBets(1)
				this.$.popMsg.setClassName("enyo-popup msgPopPlayer1ChoiceClosed");
				this.$.msgContent.setContent("Player 1 Wins This Flip!");
				this.$.popMsg.open();
				this.setFlipMarker(1);
				this.p1Flips++;
				this.cTurn = 2;
			}
			else {
				this.$.hnt.showMe(2,result, this.$.players.getValue())
				gOCheck = this.calculateBets(2)
				if (this.$.players.getValue() == "two") {
					this.$.popMsg.setClassName("enyo-popup msgPopPlayer2ChoiceClosed");
				}
				else {
					this.$.popMsg.setClassName("enyo-popup msgPopPlayer2ChoiceOpenComputer");
				};
				this.$.msgContent.setContent("Player 2 Wins This Flip!");
					
				this.$.popMsg.open();
				this.setFlipMarker(2);
				this.p2Flips++;
				this.cTurn = 1;
			};
		}
		else {
			if (this.$.popTwo.getChoose() == result) {
				this.$.hnt.showMe(2,result, this.$.players.getValue())
				gOCheck = this.calculateBets(2)
				if (this.$.players.getValue() == "two") {
					this.$.popMsg.setClassName("enyo-popup msgPopPlayer2ChoiceClosed");
				}
				else {
					this.$.popMsg.setClassName("enyo-popup msgPopPlayer2ChoiceOpenComputer");
				};
				this.$.msgContent.setContent("Player 2 Wins This Flip!");
					
				this.$.popMsg.open();
				this.$.msgContent.setContent("Player 2 Wins This Flip!");
				this.$.popMsg.open();
				this.setFlipMarker(2);
				this.p2Flips++;
				this.cTurn = 1;
			}
			else {
				this.$.hnt.showMe(1,result, this.$.players.getValue())
				gOCheck = this.calculateBets(1)
				this.$.popMsg.setClassName("enyo-popup msgPopPlayer1ChoiceClosed");
				this.$.msgContent.setContent("Player 1 Wins This Flip!");
				this.$.popMsg.open();
				this.setFlipMarker(1);
				this.p1Flips++;
				this.cTurn = 2;
			};
		};
		if (gOCheck != 0) {
			/* player ran out of money*/
			//msgBoxGameOverp1
			if (this.$.players.getValue() == "two" || gOCheck == 1) {
				this.$.popWin.setContentClassName("msgBoxGameOverp" + gOCheck);
			}
			else {
				this.$.popWin.setContentClassName("msgBoxGameOverTouchpad");	
			}
			window.setTimeout(enyo.bind(this,function() {
				this.$.popTwo.setPCoins(this.p2Coins)
				this.$.popOne.setPCoins(this.p1Coins)
				this.$.p1Total.setContent(this.p1Coins)
				this.$.p2Total.setContent(this.p2Coins)
				this.INFLIP = 0;
				this.p2Confirmed = 0;
				this.p1Confirmed = 0;
				this.isFlipping = 1;
				this.pWon = 1
				this.$.coin.setShowing(false);
				this.$.popMsg.close();
				this.$.hnt.hideMe();
				this.$.drummer.setShowing(false);
				this.$.popWin.openAtCenter();
			}), 1500);

		} 
		else{
			this.cFlip++
			
			window.setTimeout(enyo.bind(this,(function() {
				this.$.popMsg.close();
				this.$.hnt.hideMe();
				this.$.drummer.setShowing(false);
				var b = false;
				var x = 0
				if (this.p1Flips > 1) {
	                if (this.cFlip == 3) {
	                	x = Math.floor(50 * this.getRoundMult())
	                	this.$.p1Points.feedValue("+" + x)
	                	this.p1Coins += x
	                };

					this.p1Flips = 0;
					this.p2Flips = 0;
					this.p1Rounds++;
					this.cFlip = 1;
					if (this.p1Rounds == 1) {this.$.player1Round1.setButtonEnabled(false);};
					if (this.p1Rounds == 2) {this.$.player1Round2.setButtonEnabled(false);};
					if (this.p1Rounds == 3) {this.$.player1Round3.setButtonEnabled(false);};
					if (this.p1Rounds > 2) {
						x = Math.floor(225 * this.getRoundMult())
						this.$.p1Points.feedValue("+" + x)
						this.p1Coins += x
						this.$.popWin.setContentClassName("msgBoxInGamep1");
						if (this.$.players.getValue() == "one") {
							this.$.compContent.setContent("Touchpad is sad it lost the game :( ...");
						}
						this.pWon = 1;
						window.setTimeout(enyo.bind(this,function() {
							this.$.popWin.openAtCenter();
						}), 1500);
						b = true;
					}
					else {
						x = Math.floor(200 * this.getRoundMult())
						this.$.p1Points.feedValue("+" + x)
						this.p1Coins += x
						this.winIndex = 1;
						//this.$.winimage.setShowing(true);
						//this.winJob = window.setInterval(enyo.hitch(this,"animateWinp1"), 450);
						if (this.$.players.getValue() == "one") {
							this.$.compContent.setContent("Touchpad is sad it lost the round :( ...");
						}
						this.$.theRound.setSrc("images/round" + this.cRound.toString() + ".png");
						this.$.popWin.setContentClassName("msgBoxInp1");
						window.setTimeout(enyo.bind(this,function() {
							this.$.popWin.openAtCenter();
						}), 1500);
						
						//window.setTimeout(enyo.bind(this,(function() {
						//	this.stopWin;
						//	this.$.winimage.setShowing(false);
						//})), 3000)
						b = true;
					};
					this.cRound++;
					
					this.$.popMsg.setClassName("enyo-popup msgPopPlayer2ChoiceOpen");
					this.$.msgContent.setContent("Player 2, you lost, so make your choice!");
					if (b ==false ) {
						if (this.$.players.getValue() == "two") {
							this.$.popTwo.showSection(1);
							window.setTimeout(enyo.bind(this,function() {
								this.$.popTwo.open();
								this.$.popMsg.open();
							}), 1500);
							
						}
						else {
							this.$.compContent.setContent("Touchpad deciding heads or tails...");
							window.setTimeout(enyo.hitch(this,(function(){
								var x = Math.floor(Math.random() * 100);
								if (x < 49) {
									this.$.popTwo.setChoose("heads");
								}
								else {
									this.$.popTwo.setChoose("tails");
								}
								this.$.compContent.setContent("Touchpad chooses " + this.$.playerTwo.getValue() + "...");
								window.setTimeout(enyo.bind(this,function() {
									this.player2Confirm();	
								}), 1000);
								
							})), 1000)
						}
					}
				}
				else if (this.p2Flips > 1) {
					if (this.cFlip == 3) {
	                	x = Math.floor(50 * this.getRoundMult());
	                	this.$.p2Points.feedValue("+" + x);
	                	this.p2Coins += x;
	                };
					this.p1Flips = 0;
					this.p2Flips = 0;
					this.p2Rounds++;
					this.cFlip = 1;
					if (this.p2Rounds == 1) {this.$.player2Round1.setButtonEnabled(false);};
					if (this.p2Rounds == 2) {this.$.player2Round2.setButtonEnabled(false);};
					if (this.p2Rounds == 3) {this.$.player2Round3.setButtonEnabled(false);};
					if (this.p2Rounds > 2) {
						x = Math.floor(225 * this.getRoundMult());
						this.$.p2Points.feedValue("+" + x);
						this.p2Coins += x;
						if (this.$.players.getValue() == "one") {
							this.$.compContent.setContent("Touchpad is excited it won the game! :) :) ;) ...");
						};
						this.$.popWin.setContentClassName("msgBoxInGamep2");
						this.pWon = 1;
						window.setTimeout(enyo.bind(this,function() {
							this.$.popWin.openAtCenter();
						}), 1500);
						b = true;
					}
					else {
						x = Math.floor(200 * this.getRoundMult());
						this.$.p2Points.feedValue("+" + x);
						this.p2Coins += x;
						this.winIndex = 1;
						if (this.$.players.getValue() == "one") {
							this.$.compContent.setContent("Touchpad is excited it won the round! :) ...");
						};
						this.$.popWin.setContentClassName("msgBoxInp2");
						window.setTimeout(enyo.bind(this,function() {
							this.$.popWin.openAtCenter();
						}), 1500);
						b = true;
					};
					this.cRound++;
					if (this.$.players.getValue() == "one" && b == false) {
						this.$.compContent.setContent("Touchpad is excited it won!...");
					};
					this.$.popMsg.setClassName("enyo-popup msgPopPlayer1ChoiceOpen");
					this.$.msgContent.setContent("Player 1, you lost, so make your choice!");
					if (b == false) {
						this.$.popOne.showSection(1);
						window.setTimeout(enyo.bind(this,function() {
							this.$.popOne.open();
							this.$.popMsg.open();
						}), 1500);
					}
				}
				else {
					if (this.cTurn == 1) {
						this.$.popOne.showSection(1);
						this.$.popMsg.setClassName("enyo-popup msgPopPlayer1ChoiceOpen");
						if (this.$.players.getValue() == "one") {
							this.$.compContent.setContent("Touchpad is excited it won! \r\nWaiting for your next move ...");
						}
						this.$.msgContent.setContent("Player 1, you lost, so make your choice!");
						window.setTimeout(enyo.bind(this,function() {
							this.$.popOne.open();
							this.$.popMsg.open();
						}), 1500);
						
					}
					else {
						if (this.$.players.getValue() == "two") {
							this.$.popTwo.showSection(1);
							this.$.popMsg.setClassName("enyo-popup msgPopPlayer2ChoiceOpen");
							this.$.msgContent.setContent("Player 2, you lost, so make your choice!");
							window.setTimeout(enyo.bind(this,function() {
								this.$.popTwo.open();
								this.$.popMsg.open();
							}), 1500);
						}
						else {
							this.$.compContent.setContent("Touchpad deciding heads or tails...");
							window.setTimeout(enyo.hitch(this,(function(){
								var x = Math.floor(Math.random() * 100);
								if (x < 49) {
									this.$.popTwo.setChoose("heads");
								}
								else {
									this.$.popTwo.setChoose("tails");
								}
								this.$.compContent.setContent("Touchpad chooses " + this.$.popTwo.getChoose() + "...");
								window.setTimeout(enyo.bind(this,function() {
									this.player2Confirm();	
								}), 1000);
							})), 1000)
						}
					}
					this.$.p2coin.setShowing(false);
					this.$.p1coin.setShowing(false);
					this.$.p1Bet.hideMe();
					this.$.p2Bet.hideMe();
					this.$.rBonus.hideMe();
			
					window.setTimeout(enyo.bind(this,function() {
						this.$.p1Points.hideMe();
						this.$.p2Points.hideMe();
					}), 1800);
				}
				this.$.popTwo.setPCoins(this.p2Coins)
				this.$.popOne.setPCoins(this.p1Coins)
				this.$.p1Total.setContent(this.p1Coins)
				this.$.p2Total.setContent(this.p2Coins)
				
				this.INFLIP = 0;
				this.p2Confirmed = 0;
				this.p1Confirmed = 0;
				this.isFlipping = 1;
			})),4000);
		};
	},
	resetGame: function(full) {
		if (full == 1) {
			this.pWon = 0;
			this.cRound = 1;
			this.cFlip = 1;
			this.p1Rounds = 0;
			this.p2Rounds = 0;
			this.p1Flips = 0;
			this.p2Flips = 0;
			this.p1Coins = 1000;
			this.p2Coins = 1000;
			this.$.p1Total.setContent(this.p1Coins)
			this.$.p2Total.setContent(this.p2Coins)
			this.$.player1Round1.setButtonEnabled(true);
			this.$.player1Round2.setButtonEnabled(true);
			this.$.player1Round3.setButtonEnabled(true);
			this.$.player2Round1.setButtonEnabled(true);
			this.$.player2Round2.setButtonEnabled(true);
			this.$.player2Round3.setButtonEnabled(true);
			this.$.theRound.setSrc("images/round1.png");
		}
		this.$.coin.setShowing(true);
		this.$.restartBut.setDisabled(false);
		this.$.ring.stopMe();
		this.$.rBonus.hideMe();
		this.$.popTwo.setPCoins(this.p2Coins)
		this.$.popOne.setPCoins(this.p1Coins)
		this.$.p1Points.hideMe();
		this.$.p2Points.hideMe();
		this.$.popOne.showSection(1);
		this.$.popTwo.showSection(1);
		this.$.p1Bet.hideMe();
		this.$.p2Bet.hideMe();
		this.$.popTwo.close();
		this.$.theRound.setSrc("images/round" + this.cRound.toString() + ".png");
		if (this.cTurn ==1) {
			this.$.popMsg.setClassName("enyo-popup msgPopPlayer1ChoiceOpen");
			this.$.msgContent.setContent("Player 1, you lost, so make your choice!");
			this.$.popOne.open();
			this.$.popMsg.open();
			if (this.$.players.getValue() == "one") {
				this.$.compContent.setContent("Touchpad is waiting for you ...");
			}
		}
		else {
			if (this.$.players.getValue() == "two") {
				this.$.popMsg.setClassName("enyo-popup msgPopPlayer2ChoiceOpen");
				this.$.msgContent.setContent("Player 2, you lost, so make your choice!");
				this.$.popTwo.open();
				this.$.popMsg.open();
			}
			else {
				this.$.popTwo.close();
				this.$.popMsg.close();
				this.$.compContent.setContent("Touchpad deciding heads or tails...");
				window.setTimeout(enyo.hitch(this,(function(){
					var x = Math.floor(Math.random() * 100);
					if (x < 49) {
						this.$.popTwo.setChoose("heads");
					}
					else {
						this.$.popTwo.setChoose("tails");
					}
					this.$.compContent.setContent("Touchpad chooses " + this.$.popTwo.getChoose() + "...");
					this.player2Confirm();
				})), 1000)
			};
		};
		this.$.player1flip1.setButtonEnabled(true);
		this.$.player1flip2.setButtonEnabled(true);
		this.$.player1flip3.setButtonEnabled(true);
		this.$.player2flip1.setButtonEnabled(true);
		this.$.player2flip2.setButtonEnabled(true);
		this.$.player2flip3.setButtonEnabled(true);
		this.$.player1flip1.setToDefault();
		this.$.player1flip2.setToDefault();
		this.$.player1flip3.setToDefault();
		this.$.player2flip1.setToDefault();
		this.$.player2flip2.setToDefault();
		this.$.player2flip3.setToDefault();
		this.$.p2coin.setShowing(false);
		this.$.p1coin.setShowing(false);
	}
});