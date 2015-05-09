
enyo.kind({
	name: "MyLabeledContainer",
	kind: enyo.HFlexBox,
	published: {
		label: ""
	},
	style: "margin:5px;",
	components: [
		{name: "label", style: "margin-left:10px;", flex: 1},
		{name: "client"}
	],
	create: function(inProps) {
		this.inherited(arguments);
		this.layout.align = "center";
		//bc
		this.label = this.label || this.caption;
		//
		this.labelChanged();
	},
	labelChanged: function() {
		this.$.label.setContent(this.label);
	}
});


enyo.kind({
	name: "CustomRadioSelect",
	kind: enyo.HFlexBox,
	style: "height: 50px;",
	published: {
		items: [],
		//item object:
		/*
		{defaultClassName: "",
		 selectedClassName: "",
		 value: "",
		 caption: "",
		 (optional)
		 checkedClassName: "",
		 unSelectedClassName: ""
		}



		*/
		defaultVal: "",
		componentsCreated: false,
		componentsArray: [],
		selectIndex: -1
	},
	events: {
		onClicked: ""
	},
	components: [
		{kind: "HFlexBox", name: "contentArea", flex:1}
	],
	create: function(inProps) {
		this.inherited(arguments);
		this.renderItems();
	},
	itemsChanged: function() {
		this.renderItems();
	},
	renderItems: function() {
		var obj = function () {
			return {
				kind: "VFlexBox",
				components: [
					{kind: "MyCustomButton",
					 defaultClassName: "",
					 checkedClassName: "",
					 buttonType: "check",
					 index: 0,
					 onButtonClicked: "uncheckRest",
					 name: "",
					},
					{content: "",
					 className: "buttonCaptionSettings",
					 name: "",
					 allowHtml: true
				    }
				],
				name: "",
				flex:1,
				pack: "center",
				align: "center",
				onclick: "selectMe",
				selectedClass: "",
				unSelectedClass: "",
				showing: true,
				index: 0
			}
		}
		//this.log(this.items)
		if (this.componentsCreated == false && this.items.length > 0) {
			this.componentsCreated = true
			this.componentsArray = []
			for (var i = 0; i < this.items.length; i++) {
				var x = new obj()
				x.components[0].defaultClassName = this.items[i].defaultClassName
				x.components[0].checkedClassName = this.items[i].checkedClassName || this.items[i].defaultClassName 
				x.components[0].index = i
				x.components[0].name = "item" + i
				if (this.items[i].caption && this.items[i].caption.length > 0) {
					x.components[1].name = "itemCaption" + i
					x.components[1].content = this.items[i].caption
				}
				else {
					x.components.splice(1,1)
				}
				x.name = "itemContainer" + i
				x.index = i
				x.selectedClass = this.items[i].selectedClassName
				x.unSelectedClass = this.items[i].unSelectedClassName || ""
				this.componentsArray.push(x)
			};
			this.$.contentArea.createComponents(this.componentsArray,{owner: this})
			this.$.contentArea.render()
			this.setValue(this.defaultVal)
			//this.log("created RADIO")
		}
	},
	selectMe: function(iS, iE) {
		this.$["item" + iS.index].setChecked(true)
		this.$["itemContainer" + iS.index].setClassName(iS.selectedClass)
		this.uncheckRest(iS, "")
	},
	getValue: function() {
		if (this.selectIndex > -1) {
			return this.items[this.selectIndex].value
		}
		else if (this.items.length > 0) {
			return this.items[0].value
		}
		else {
			return ""
		}
	},
	getCaption: function() {
		if (this.selectIndex > -1) {
			return this.items[this.selectIndex].caption
		}
	},
	setValue: function(inVal) {
		if (this.componentsCreated == true) {
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].value == inVal) {
					this.$["item" + i].setChecked(true)
					this.$["itemContainer" + i].setClassName(this.componentsArray[i].selectedClass)
					var iS = {index: i}
					this.uncheckRest(iS, "NO_EVENT")
					break;
				}
			};
		}
	},
	setDefaultClassName: function(inVal, inClass) {
		////this.log(this.items)
		for (var i = 0; i < this.items.length; i++) {
			if (this.items[i].value == inVal) {
				////this.log("set")
				//this.log(inClass)
				this.$["item" + i].setDefaultClassName(inClass)
				this.$["item" + i].setCheckedClassName(inClass)
				this.$["item" + i].setChecked(this.$["item" + i].getChecked())
				this.componentsArray[i].components[0].defaultClassName = inClass
				break;
			}
		};
	},
	getCheckedClassName: function() {
		if (this.selectIndex >= 0) {
			if (this.selectIndex < this.items.length) {
				return this.items[this.selectIndex].checkedClassName 
			}
		}
	},
	setItemShowing: function(inVal, inShowing) {
		for (var i = 0; i < this.items.length; i++) {
			if (this.items[i].value == inVal) {
				//this.$["item" + i].setShowing(inShowing)
				this.$["itemContainer" + i].setShowing(inShowing)
				this.componentsArray[i].showing = inShowing
				break;
			}
		};
	},
	uncheckRest: function(iS, iE) {
		if (iS.index == this.selectIndex) {return;}
		for (var i = 0; i < this.componentsArray.length; i++) {
			if (i != iS.index) {
				this.$[this.componentsArray[i].components[0].name].setChecked(false)	
				this.$["itemContainer" + i].setClassName(this.componentsArray[i].unSelectedClass)
			}
		};
		this.selectIndex = iS.index
		if (!iE || iE.length < 1) {this.doClicked()}
	}
});