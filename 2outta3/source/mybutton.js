enyo.kind({
	name: "MyCustomButton", 
	kind: "Control",
	published: {
		defaultClassName: "",
		clickClassName: "",
		disabledClassName: "",
		checkedClassName: "",
		buttonType: "basic",  //check, dual
		dualDefault: "",
		dualDisabled: "",
		dualClick: "",
		buttonEnabled: true,
		buttonChecked: false,
		buttonDual: 0,
		clickable: true
	},
	events: {
		onButtonClicked: "",
		onButtonmousedown: "",
		onButtonmouseup: ""
	},
	components : [
          {kind: "CustomButton",  name:"MyButton", onmousedown:"myMousedownHandler",onmouseup:"myMouseupHandler", onclick: "myClickHandler"}
	],
	rendered: function() {
		this.inherited(arguments);
		this.$.MyButton.setClassName(this.defaultClassName);
	},
	setToDefault: function() {
		this.$.MyButton.setClassName(this.defaultClassName);
		this.buttonDual = 0;
	},
	setToDualDefault: function() {
		this.$.MyButton.setClassName(this.dualDefault);
		this.buttonDual = 1;
	},
	myClickHandler: function(inSender, inEvent) {
		if (this.buttonEnabled == true && this.clickable == true) {
			if (this.buttonType == "basic") {
				this.$.MyButton.setClassName(this.defaultClassName);
				this.doButtonClicked();
			}
			else if (this.buttonType == "dual") {
				if (this.buttonDual == 0) {
					//this.$.MyButton.removeClass(this.clickClassName);
					this.$.MyButton.setClassName(this.dualDefault);
					this.buttonDual = 1;
					this.doButtonClicked("0");
				}
				else {
					this.$.MyButton.setClassName(this.defaultClassName);
					//this.$.MyButton.removeClass(this.dualClick);
					//this.$.MyButton.removeClass(this.dualDefault);
					this.buttonDual = 0;
					this.doButtonClicked("1");
				}
			}
			else { //check button
				if (this.buttonChecked == false) {
					this.buttonChecked = true;
					this.$.MyButton.setClassName(this.checkedClassName);
				}
				else {
					this.buttonChecked = false;
					this.$.MyButton.setClassName(this.defaultClassName);
				}
				this.doButtonClicked();
			}
		}
	},
	getValue: function() {
		return this.buttonChecked
	},
	myMousedownHandler: function(inSender, inEvent) {
		if (this.buttonEnabled == true && this.clickable == true) {
			this.doButtonmousedown(inSender,inEvent)
				if (this.buttonEnabled == true) {
					if (this.buttonType == "basic") {
						this.$.MyButton.setClassName(this.clickClassName);
					}
					else if (this.buttonType == "dual") {
						if (this.buttonDual == 0) {
							this.$.MyButton.setClassName(this.clickClassName);
						}
						else {
							this.$.MyButton.setClassName(this.dualClick);
						}
					}
					else { //check button
						
					}
				}
		}
	},
	myMouseupHandler: function(inSender, inEvent) {
		if (this.buttonEnabled == true && this.clickable == true) {
			this.doButtonmouseup(inSender,inEvent)
			if (this.buttonEnabled == true) {
				if (this.buttonType == "basic") {
					this.$.MyButton.setClassName(this.defaultClassName);
				}
				else if (this.buttonType == "dual") {
					if (this.buttonDual == 0) {
						this.$.MyButton.setClassName(this.defaultClassName);
					}
					else {
						this.$.MyButton.setClassName(this.dualDefault);
					}
				}
				else { //check button
					
				}
			}
		}
	},
	getDown: function() {
		if (this.$.MyButton.getClassName() == this.defaultClassName) {
			return false;
		} 
		else {
			return true;
		};	
	},
	mouseoutHandler: function(inSender, inEvent) {
		if (this.buttonEnabled == true && this.clickable == true) {
			if (this.buttonEnabled == true) {
				if (this.buttonType == "basic") {
					this.$.MyButton.setClassName(this.defaultClassName);
				}
				else if (this.buttonType == "dual") {
					if (this.buttonDual == 0) {
						this.$.MyButton.setClassName(this.defaultClassName);
					}
					else {
						this.$.MyButton.setClassName(this.dualDefault);
					}
				}
				else { //check button
					
				}
			}
		}
		
	},
	buttonEnabledChanged: function() {
				if (this.buttonType == "basic") {
					if (this.buttonEnabled == true) {
						this.$.MyButton.setClassName(this.defaultClassName);
					}
					else {
						this.$.MyButton.setClassName(this.disabledClassName);
					}
				}
				else if (this.buttonType == "dual") {
					if (this.buttonDual == 0) {
						if (this.buttonEnabled == true) {
							this.$.MyButton.setClassName(this.defaultClassName);
						}
						else {
							this.$.MyButton.setClassName(this.disabledClassName);
						}
					}
					else {
						if (this.buttonEnabled == true) {
							this.$.MyButton.setClassName(this.dualDefault);
						}
						else {
							this.$.MyButton.setClassName(this.dualDisabled);
						}
					}
				}
				else { //check button
					
				}
	},
	buttonCheckedChanged: function() {
		if (this.buttonChecked == true) {
			//this.buttonChecked = true;
			this.$.MyButton.setClassName(this.checkedClassName);
		}
		else {
			//this.buttonChecked = false;
			this.$.MyButton.setClassName(this.defaultClassName);
		}
	},
	switchDual: function() {
		if (this.buttonDual == 0) {
			//this.$.MyButton.removeClass(this.clickClassName);
			this.$.MyButton.setClassName(this.dualDefault);
			this.buttonDual = 1;
		}
		else {
			this.buttonDual = 0;
			//this.$.MyButton.removeClass(this.dualClick);
			this.$.MyButton.setClassName(this.defaultClassName);
		}
	}
		
})