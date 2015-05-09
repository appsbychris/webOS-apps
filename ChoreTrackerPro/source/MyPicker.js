enyo.kind({
	name: "MyPicker", 
	kind: "Control",
	published: {
		items: [],
		value: "",
		caption:"",
		maxWidth: 200,
		label:"Label:"
	},
	events: {
		onChange:""
	},
	components : [
	     {layoutKind:"VFlexLayout",  components:[
	         {layoutKind: "HFlexLayout", components:[                                                          
		         {name:"myLabel", content: "Label:", style:"font-size:70%;font-weight:bold;margin-right:3px;",onclick:"openMenu"},
		         {kind:"Image",name:"selected",onclick:"openMenu"},//className:"pickerIcon"},
		     ]},
		     {kind:"PopupSelect",name:"myMenu",lazy:false, onSelect: "popupSelect"}
	     ]}
    ],
    rendered: function() {
    	this.inherited(arguments);
    	this.itemsChanged();
    	this.labelChanged();
    },
    labelChanged: function() {
    	this.$.myLabel.setContent(this.label);
    	
    },
    itemsChanged: function() {
    	this.$.myMenu.setItems(this.items);
    	
    },
	openMenu: function() {
		this.$.myMenu.openAtControl(this.$.myLabel,{});
	},
	popupSelect: function(inSender, inSelected) {
	    this.value = inSelected.getValue();
	    this.caption = inSelected.getIcon();
	    this.valueChanged();
	    this.doChange();
	},
	getCustomValue: function(itemVal) {
		for (var i = 0; i < this.items.length; i++) {
			this.log(this.items[i].value + "," + i)
			if (this.items[i].value == itemVal) {
				return this.items[i].subValue
				break;
			};
		};
		return "singleView";
	},
	valueChanged: function(){
		var b = false;
		//if (this.caption.length < 1) {
			for (var i = 0;i < this.items.length;i++) {
				if (this.items[i].value == this.value) {
					this.caption = this.items[i].icon;
					b = true;
					break;
				};
			};
		//}
		//else {
		//	b = true
		//}
		this.log (this.value)
		if (b == false) {
			this.value = 0;
			this.valueChanged();
			return;
		}
		try {
			
			var s = this.caption.indexOf("touchpad");
			var x = this.caption;
			if (s < 0) {
				x = x.replace(".png","touchpad.png");
			};
			//this.$.selected.setStyle("")
			this.$.selected.setSrc(x);
			this.log(x);
			
		}
		catch (e) {};
	}
});