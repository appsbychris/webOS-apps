enyo.kind({
	kind: "Toaster", 
	flyInFrom: "top",
	className: "exifPosition",
	name: "EXIFInfo", 
	style: "width:400px;height:90%;",
	published: {
		exifObj: {},
		componentsCreated: false
	},
	lazy:false,
	components: [
	    {kind: "BasicScroller",className: "editListItem", flex:1, components:[
		    {name: "backdrop",kind: "VFlexBox", flex:1, components: [
		        
		    ]}
	    ]}
	],
	openMe: function() {
		for (var j in this.exifObj) {
			if (this.componentsCreated == false) {
				var x = this.$.backdrop.createComponents([{layoutKind:"HFlexLayout",style:"padding-top:3px;padding-bottom:3px;border-top:1px solid #A9A9A9;border-bottom:1px solid #F0FFFF;", components:[
									 					 {kind: "MyCustomButton", name: j, buttonType:"check",buttonChecked: this.exifObj[j],defaultClassName:"checkOffSmall",checkedClassName:"checkOnSmall", onButtonClicked: "checkClick"},
			                                             //{kind: "CheckBox", name:j, checked: this.exifObj[j], onclick:"checkClick"},
			                                             {content: j, style:"margin-top:8px;"}]}], {owner:this});
			};
			//this.log(x.getChecked())
		}
		if (this.componentsCreated == false) {
			this.$.backdrop.createComponent({style:"height:100px"})
		}
		this.componentsCreated = true;
		this.render();
		this.open();
	},
	checkClick: function(iS,iE) {
		this.exifObj[iS.name] = iS.getChecked()
	}
});