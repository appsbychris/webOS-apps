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
		canTapAndHold: false,
		canTapOnDual: false,
		buttonDual: 0,
		tapHold:0
	},
	events: {
		onButtonClicked: "",
		onTapAndHold: ""
	},
	components : [
          {kind: "CustomButton",  name:"MyButton", onmousedown:"myMousedownHandler",onmouseup:"myMouseupHandler", onclick: "myClickHandler"}
	],
	rendered: function() {
		this.inherited(arguments);
		if (this.buttonChecked == true) {
			this.$.MyButton.setClassName(this.checkedClassName);	
		}
		else if (this.buttonDual == 1) {
			this.$.MyButton.setClassName(this.defaultDual);	
		}
		else {
			this.$.MyButton.setClassName(this.defaultClassName);
		}
	},
	setToDefault: function() {
		this.$.MyButton.setClassName(this.defaultClassName);
		this.buttonDual = 0;
	},
	setToChecked: function() {
		this.$.MyButton.setClassName(this.checkedClassName);
		this.buttonChecked = true
		this.buttonDual = 0;
	},
	setToDualDefault: function() {
		this.$.MyButton.setClassName(this.dualDefault);
		this.buttonDual = 1;
	},
	tapHoldChanged: function() {
		if (this.tapHold >= 4) {
			if (((this.buttonDual == 1 && this.canTapOnDual == true) || this.buttonDual == 0) && this.canTapAndHold == true) {this.doTapAndHold()}
			this.tapHold = 0
			window.clearInterval(this.job)
		}
	},
	myClickHandler: function(inSender, inEvent) {
		var b = false
		enyo.log("clickhandler")
		if (this.buttonEnabled == true) {
			if (this.canTapAndHold == true && this.tapHold>= 3) {
				if (((this.buttonDual == 1 && this.canTapOnDual == true) || this.buttonDual == 0) && this.canTapAndHold == true) {this.doTapAndHold()}
				this.tapHold = 0
				window.clearInterval(this.job)
				b = true
			}
			if (this.buttonType == "basic") {
				this.$.MyButton.setClassName(this.defaultClassName);
				if (b == false) { enyo.nextTick(this,this.doButtonClicked, inEvent);}
			}
			else if (this.buttonType == "dual" ) {
				if (this.buttonDual == 0) {
					//this.$.MyButton.removeClass(this.clickClassName);
					this.$.MyButton.setClassName(this.dualDefault);
					this.buttonDual = 1;
					if (b == false) { enyo.nextTick(this,this.doButtonClicked,"0");}
				}
				else {
					this.$.MyButton.setClassName(this.defaultClassName);
					//this.$.MyButton.removeClass(this.dualClick);
					//this.$.MyButton.removeClass(this.dualDefault);
					this.buttonDual = 0;
					if (b == false) {enyo.nextTick(this,this.doButtonClicked,"1");}
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
				//this.log("sending event")
				enyo.nextTick(this,this.doButtonClicked, inEvent);
				//this.log("sent")
			}
			this.tapHold = 0
			window.clearInterval(this.job)
		}
	},
	getValue: function() {
		return this.buttonChecked
	},
	myMousedownHandler: function(inSender, inEvent) {
		enyo.log("mousedown")
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
				if (this.canTapAndHold == true) {
					this.job = window.setInterval(enyo.bind(this,(function() {
						this.tapHold++
						if (this.tapHold >= 4) {this.tapHoldChanged()}
					})),200)
				}
			}
	},
	myMouseupHandler: function(inSender, inEvent) {
		enyo.log("mouseup")
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
	},
	mouseoutHandler: function(inSender, inEvent) {
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
	setChecked: function(val) {
		
		if (val == false || val == "false" || val == 0 || val == -1) {
			//this.buttonChecked = true;
			this.buttonChecked = false
			this.$.MyButton.setClassName(this.defaultClassName);
		}
		else {
			this.$.MyButton.setClassName(this.checkedClassName);
			this.buttonChecked = true;
		}
		//return this.$.MyButton.getClassName() + ","  + val + "," + this.buttonChecked;
	},
	getChecked: function() {
		
		if (this.$.MyButton.getClassName() == this.checkedClassName) {
			return true
		}
		else {
			return false
		}
		//return this.$.MyButton.getClassName() + ","  + val + "," + this.buttonChecked;
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