enyo.kind({
	name: "scrimSpinner", 
	kind: "Scrim",
	messages: [ "keep up the good work!","you're awesome!", "you're fantastic!"
	           ,  "You rock!", "You're great!", "You're wonderful!",  
	           "You're magnificent!", "You're outstanding!",  "You are magnificent!", "You're terrific!",
	            "You are extraordinary!",  "You're exceptional!", "You're something special!"],
	components:[
	     {layoutKind: "VFlexLayout",pack:"center",align:"center",flex:1,height:"100%", components:[
              {kind:"SpinnerLarge", name:"spin"},
              {content: "Loading, Please Wait", style:"font-size:140%;font-color:white;font-variant:small-caps;letter-spacing:-1px"},
              
              {name:"msg", style:"font-size:80%;font-color:white;font-variant:small-caps;letter-spacing:-1px"}
	     ]}       
	     
	],
	start: function() {
		this.$.msg.setContent("(By the way, " + this.messages[Math.floor(Math.random() * this.messages.length)] + ")");
		this.show();
		this.$.spin.show();
	},
    stop: function() {
    	this.$.spin.hide();
    	this.hide();
    }
});