enyo.kind({
	name: "DaySelect",
	kind: "Popup",
	published: {
		
		touchPad: 0
	},
	
	events: {
		onCanceled:"",
		onDone:""
	},
	
	components: [
	      /*
	       * View by date range
	       * view by due a certain day/date
	       * view by interval
	       * view by
	       * */
	      {layoutKind: "VFlexLayout", components:[
               {content: "Show only:"},
               {kind: "RadioGroup", name: "radio", onclick: "radioClick",value:0, components: [   
				  	{caption: "Range", icon: "", value: "0"},
			        {caption: "Day", icon: "", value: "1"},
			        {caption: "Interval", icon: "", value: "2"}
			   ]},
			   {layoutKind:"VFlexLayout", name:"optionOne", components:[
			       {content: "Select a date range:"},
			       {kind: "DatePicker", name: "dPickMin",label: "", minYear: 1990, maxYear: 2015},
			       {content: "to",style:"position:relative;left:70px;top:-5px;"},
			       {kind: "DatePicker", name: "dPickMax",label: "", minYear: 1990, maxYear: 2015, style:"position:relative;top:-7px;"}
			   ]},
			   {layoutKind:"VFlexLayout", name:"optionTwo",showing:false, components:[
                   {kind: "RadioGroup", name: "radioDay", onclick: "radioClickSingle",value:0, components: [   
	    			    {caption: "Date", icon: "", value: "0"},
	    			    {caption: "Day", icon: "", value: "1"}
	    		   ]},
	    		   {layoutKind: "VFlexLayout", name: "interval",components: [
	    		        {content: "Select a date:"},                                                     
	    		        {kind: "DatePicker", name: "dPickSingle",label: "", minYear: 1990, maxYear: 2015}
	               ]},
		           {layoutKind: "VFlexLayout", name: "days",showing:false,components: [
                        {content: "Select a day:"},
					    {kind: "Picker",name: "dayPicker", items:[
						      {caption:"Sunday", value: 0},
						      {caption:"Monday", value: 1},
						      {caption:"Tuesday", value: 2},
						      {caption:"Wednesday", value: 3},
						      {caption:"Thursday", value: 4},
						      {caption:"Friday", value: 5},
						      {caption:"Saturday", value: 6}
						], value: 0}
						       
		           ]}
 			   ]},
 			   {layoutKind:"VFlexLayout", name:"optionThree",showing:false, components:[
   			       {content: "Select an Interval:"},
   			       {content: "(select 0 for all)"},
   			       {layoutKind: "HFlexLayout", components: [
  						{kind: "IntegerPicker",name:"durVal", label: "Done Every", min: 0, max: 24,value: 1},
  		                {kind: "Picker",name: "durScale", items:["hours", "days","weeks", "months", "years"], value: "weeks", onChange: "setInts"}
  		           ]},
   			   ]},
   			   {layoutKind: "HFlexLayout",components: [
	                {kind: "Button",flex:1, caption: "Cancel", onclick: "doCanceled"},
		            {kind: "Button",flex:1, className: "enyo-button-affirmative", caption: "Show", onclick: "okClick"}
			   ]}
	      ]}
	      
	],
	rendered: function() {
		this.inherited(arguments);
	},
	/*openPop: function() {
		this.log();
		this.openAtCenter();
		this.log();
	},*/
	radioClick: function() {
		this.log(this.$.radio.getValue());
		if (this.$.radio.getValue()== 0) {
				this.$.optionOne.setShowing(true);
				this.$.optionTwo.setShowing(false);
				this.$.optionThree.setShowing(false);
				
		}
		else if (this.$.radio.getValue()== 1) {
				//this.log("in 1");
				this.$.optionOne.setShowing(false);
				this.$.optionTwo.setShowing(true);
				this.$.optionThree.setShowing(false);
				//this.log("out 1");
		}
		else if (this.$.radio.getValue()== 2) {
				this.$.optionOne.setShowing(false);
				this.$.optionTwo.setShowing(false);
				this.$.optionThree.setShowing(true);
		};
		
	},
	radioClickSingle: function() {
		if (this.$.radioDay.getValue() == 0) {
			this.$.interval.setShowing(true);
			//this.$.times.setShowing(true)
			this.$.days.setShowing(false);
		}
		else {
			this.$.interval.setShowing(false)
			//this.$.times.setShowing(false)
			this.$.days.setShowing(true) 
		}
	},
	setInts: function() {
		switch (this.$.durScale.getValue()) {
			case "hours": {
				this.$.durVal.setMax(24);
				break;
			};
			case "days": {
				this.$.durVal.setMax(365);
				break;
			};
			case "weeks": {
				this.$.durVal.setMax(52);
				break;
			};
			case "months": {
				this.$.durVal.setMax(12);
				break;
			};
			case "years": {
				this.$.durVal.setMax(100);
				break;
			};
		};
	},
	okClick: function(){
		var s = {
				radio: this.$.radio.getValue(),
				rangeMin: this.$.dPickMin.getValue(),
				rangeMax: this.$.dPickMax.getValue(),
				radioDay: this.$.radioDay.getValue(),
				singleDate: this.$.dPickSingle.getValue(),
				day: this.$.dayPicker.getValue(),
				durVal: this.$.durVal.getValue(),
				durScale: this.$.durScale.getValue()
		};
		this.doDone(s);
	}
});