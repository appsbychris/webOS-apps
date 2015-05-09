enyo.kind({
	kind: "ModalDialog", 
	name: "okBox", 
	published: {
		msg: ""
	},
	lazy: false, 
	components: [
	    {name: "dialContent"},                                                                            
	    {layoutKind: "HFlexLayout", flex:1, components: [
	         {kind: "Button", caption: "OK",flex:1,className:"enyo-button-affirmative", onclick: "confirmClick"}
	                              //{kind: "Button", caption: "Cancel", onclick: "cancelClick"}
	    ]}
	],
	rendered: function() {
		this.inherited(arguments);
		this.msgChanged();
	},
	msgChanged: function() {
		this.$.dialContent.setContent(this.msg);
	},
	confirmClick: function() {
		this.close();
	}
});

enyo.kind({
	kind: "ModalDialog", 
	name: "confirmBox", 
	published: {
		head: "",
		msg: "",
		store1: [],
		store2: []
	},
	events: {
		onDelete: "",
		onKeep: ""
	},
	lazy: false, 
	components: [
		{layoutKind:"VFlexLayout",flex:1, components:[
		    {name: "title", content:" "},
		    {name: "dialContent"},
		    {layoutKind: "HFlexLayout", components:[
		        {kind:"Button",flex:1, caption: "Delete", className: "enyo-button-negative", onclick:"deleteItem"},
		        {kind:"Button",flex:1, caption: "Keep", className: "enyo-button-affirmative", onclick:"keepItem"}
		    ]}
		]}
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
	deleteItem: function() {
		this.close();
		this.doDelete(this.store1,this.store2);
		
	},
	keepItem: function() {
		this.close();
		this.doKeep(this.store1,this.store2);
		
	}
});