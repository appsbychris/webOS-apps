enyo.kind({
	name: "MyPopup",
	kind: "Toaster",
	flyInFrom: "left",
	className: "popBack",
	dismissWithClick: false,
	dismissWithEscape: false,
	
	published: {
		touchPad: 0,
		opened: 0,
		interval:0,
		messages: ["Good job!", "Great job!", "Keep up the good work!","You're awesome!", "Keep it up!", "Success!", "Fantastic!"
		           , "Sweet!", "You rock!", "Way to go!", "Great!", "Awesome!", "Wonderful!", "Win!", "Yeah!", "Terrific!", 
		           "Magnificent!", "Outstanding!", "Impressive!", "You're Outstanding!", "You are magnificent!", "You're terrific!",
		           "Extraordinary!", "Remarkable!", "You are extraordinary!", "You're remarkable!", "Exceptional!", "Nice work!",
				   "Sweet!", "Woo-hoo!", "Yay!", "You're a hard worker!"]

	},
	events: {
		onUndo: ""
	},
	components: [
	    {kind:"MyCustomButton",name:"btn",style:"margin-top:5px;margin-left:5px;", onButtonClicked:"doUndo",defaultClassName:"undoButtonTouchpad",clickClassName:"undoButtonTouchpadClick"},
	    {name: "msg", content:"Great job!",style:"margin-top:5px;margin-left:5px;margin-right:5px;font-weight:bolder;font-size:110%;"},         
	    {style:"position:absolute;right:0px;bottom:0px;width:40px;height:40px;", onclick:"closeme"}
	],
	
	openPop: function() {
		this.interval = 0;
		if (this.opened == 0) {
			this.job = window.setInterval(enyo.bind(this,(function(){
				this.interval++;
				if (this.interval >= 12){
					this.opened = 0;
					window.clearInterval(this.job);
					this.close();
				};
				
			})),500);
			this.open();
			this.opened = 1;
		}
		this.$.msg.setContent(this.messages[Math.floor(Math.random() * this.messages.length)]);
	},
	closeme: function() {
		this.interval = 999;
	}
});

enyo.kind({
	name: "helpPop",
	kind: "Popup",
	//className: "popBack",
	
	published: {
		touchPad: 0,
		opened: 0,
		interval:0,
		

	},
	events: {
		onUndo: ""
	},
	components: [
	    {kind:"Image", src:"images/nolist.png"}
	],
	
	openPop: function(tp) {
		//this.setClassName("")
		this.touchPad = tp
		this.opened = 1
		this.open()
		var x = window.innerWidth
		this.log(x)
		if (x > 300) {
			x = (x / 2) - 155;
		};
		if (this.touchPad == 1) {
			x = x + 45;
		};
		this.setStyle("left:" + x + "px;");
	},
	closeme: function() {
		this.opened = 0;
		this.close();
	}
});