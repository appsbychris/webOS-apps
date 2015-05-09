enyo.kind({
	name: "RangePicker", 
	kind: "Control",
	events: {
		onMinChanged: "",
		onMaxChanged: ""
	},
	components : [
	   {layoutKind:"HFlexLayout", components: [
		   {kind: "IntegerPicker", name: "minNum", value: 30, min:8,max:72,label:"", onChange:"minC"},
		   {content: "pt to ", style:"padding-top:10px;margin-left:4px;"},
		   {kind: "IntegerPicker", name: "maxNum", value: 30, min:8,max:72,label:"", onChange:"maxC"},
		   {name: "labelfont1", content: "pt", style:"padding-top:10px;margin-left:4px;"}
		   ]
	   }
	],
	minC: function() {
		this.doMinChanged(this.$.minNum.getValue())
	},
	maxC: function() {
		this.doMaxChanged(this.$.maxNum.getValue())
	},
	setMinVal: function (val) {
		this.$.minNum.setValue(val)
	},
	setMaxVal: function (val) {
		this.$.maxNum.setValue(val)
	}
})