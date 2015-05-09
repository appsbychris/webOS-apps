enyo.kind({
	kind: "ModalDialog", 
	name: "syncDialog", 
	published: {
		head: "Syncing...",
		msg: ""
	},
	events: {
		onOKed: ""
	},
	lazy: false, 
	contentClassName: "syncBack",
	messages: [ "keep up the good work!","you're awesome!", "you're fantastic!"
		           ,  "you rock!", "you're great!", "you're wonderful!",  
		           "you're magnificent!", "you're outstanding!",  "you are magnificent!", "you're terrific!",
		            "you are extraordinary!",  "you're exceptional!", "you're something special!"],
	begins: ["(Hey... ", "(Just wanted to say ", "(By the way, ", "(Just letting you know, "],	            
	components: [
         {layoutKind:"HFlexLayout",flex:1,style:"", components:[
             {layoutKind:"HFlexLayout", components:[
                {kind:"Spinner", name:"spin"}                                  
             ]},        
             {layoutKind:"VFlexLayout", flex:1,components:[
				{name: "title", content:"Syncing...", style:"font-size:110%;"},
				{name: "dialContent", style: "font-size:90%;"},
				{name: "msg", style:"font-size:75%;"}
             ]}
		]},                                          
		{kind:"Button", caption: "OK", name:"okbtn", className: "enyo-button-negative", onclick:"closedialog", showing:false}
	   
	],
	rendered: function() {
		this.inherited(arguments);
		this.msgChanged();
		this.headChanged();
	},
	msgChanged: function() {
		this.$.dialContent.setContent(this.msg);
	},
	headChanged: function() {
		this.$.title.setContent(this.head);
	},
	showButton: function() {
		this.$.okbtn.setShowing(true);
		this.$.spin.hide();
		this.$.msg.setShowing(false);
	},
	hideButton: function() {
		this.$.spin.show();
		this.$.okbtn.setShowing(false);
		this.$.msg.setShowing(true);
	},
	opendialog: function() {
		this.$.spin.show();
		this.$.msg.setContent(this.begins[Math.floor(Math.random() * this.begins.length)] + this.messages[Math.floor(Math.random() * this.messages.length)] + ")");
		this.openAtCenter();
	},
	closedialog: function() {
		this.$.spin.hide();
		this.doOKed();
		this.close();
	}
})