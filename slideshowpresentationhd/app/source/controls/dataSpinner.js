enyo.kind({
	name: "DataSpinner", 
	kind: "VFlexBox",
	style: "position:fixed;bottom:0;left:0;width:32px;height:32px;z-index:99999",
	lazy: false,
	showing: false,
	published: {
		isOpen: false
	},
	components:[
	    //{kind:"Spinner", name:"spin"},
	    {kind: "MySpinner", name: "spin2", showing: false}
	     
	],
	showMe: function() {
		this.setShowing(true);
		var device = enyo.fetchDeviceInfo();
		/*if (parseInt(device.platformVersionMajor) == 3 && parseInt(device.platformVersionDot) >= 5) {
			this.$.spin.show();
		}
		else {*/
			//this.$.spin.hide();
			this.$.spin2.startAni();
		//}
		this.isOpen = true
	},
	hideMe: function() {
		//this.$.spin.hide();
		this.$.spin2.stopAni();
		this.setShowing(false);
		this.isOpen = false
	}
});