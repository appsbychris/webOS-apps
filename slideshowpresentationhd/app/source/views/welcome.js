enyo.kind({
	name: "WelcomePage",
	kind: "Pane",
	className: "editListItem",
	published: {},
	events: {
		onComplete: "",
		onWritePref: ""
	},
	components: [
		{kind: "VFlexBox", components:[
			{kind: "HFlexBox", components:[	
				{kind: "Image", src: "images/icon.png"},
				{content: "Welcome to Slideshow Presentation HD", style: "font-size:120%;font-weight:bold;"},
			]},
			{allowHtml: true,
			 content: "<br />With Slideshow Presentation HD, you can create stunning photo shows that you can set to music." +
			          "<br /><br />Please check the help menu (located in the top left corner) for help on getting started." +
			          "<br />You can also email me with any questions, comments, or problems." + 
			          "<br />Emails will be answered within 24-48 hours." +
			          "<br />If something doesn't work how you think it should be working, please send me an email rather than stating a problem in a review." +
			          "<br />I am not able to respond to reviews, and I will need more information from you to fix any issues." +
			          "<br />Most likely I can get the problem fixed quickly, or let you know what might have gone wrong." +
			          "<br />Email can be found here, or in the Help menu."

			},
			{kind: "HFlexBox", onclick: "launchEmail", style: "border: 2px solid black;border-radius: 10px;width:300px;margin-top:10px;", align: "center", components: [
				{kind: "Control", style: "width: 32px; margin: 0 8px 0 0", components: [
					{kind: "Image", src: "images/support/application-email.png"}
				]},
				{allowHtml: true,style: "font-size:80%;font-weight:bold;",content: $L("Click Here to <br />E-Mail Apps By Chris with<br />any questions or comments.")}
			]},
			{allowHtml: true,
			 content: "<br /><b>Note:</b><br />" + 
			          "If you had an older version and are upgrading, Slideshow Presentation HD is going to convert and move the database where it stores all your projects. This process can take a few minutes."
			},
			{flex:1},
			{kind: "HFlexBox", components:[	
			//position: relative; left: -160px;
				{kind: "HFlexBox", style: "width:350px;font-size:80%;", align: "start", components:[	
					{kind: "Image", src: "images/welcomearrow.png"},
					{allowHtml: true,content: "This is the saving indicator. While this is visible, content is being saved to the database. Closing the app while this is visible <b><u>will</u></b> cause data loss. (Note: This does not show while a show is running. Stop a show before closing to verify all data has been saved.)"},
				]},
				{flex:1},
				{kind: "VFlexBox", components:[	
					{kind: "HFlexBox", style: "margin-bottom:10px;", align: "end", components:[		    
				    	{kind: "MyCustomButton",style: "", name: "showAgain", buttonType:"check", defaultClassName:"checkOffSmall",checkedClassName:"checkOnSmall", onButtonClicked: "writePref"},                                                                         
				    	{content: "Show this message again."}
				    ]},
				    {kind: "HFlexBox", flex:1, components:[	
						{flex:1},	
						{kind: "Button", caption: "Continue",  onclick: "startLoad", className: "enyo-button-affirmative", style: "width: 300px;font-size:200%;font-weight:bold;height:50px;"}
					]}
				]}
			]},
			
		]},
		
		{name: "launchService", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "launch", onFailure: "serviceFailure"}
	],
	pressed: false,
	startLoad: function() {
		if (this.pressed === false) {
			this.pressed = true;
			this.writePref();
			this.doComplete();
		}
	},
	launchEmail: function () {
		var text, i, statusItem, statusTemplate, deviceInfo, pName;
		var appInfo = enyo.fetchAppInfo();
		this.log(enyo.json.stringify(appInfo))
		var email = appInfo.email;
		
		text = "<br /><br />" +
			new enyo.g11n.Template("#{title} for HP webOS, version #{version}").evaluate(appInfo);
				
		text += "<h2>Environment</h2><dl>";
//		text += "<dt>Mojo.Environment.build</dt><dd>" + Mojo.Environment.build + "</dd>";
		deviceInfo = enyo.fetchDeviceInfo();
		for (pName in deviceInfo) {
			text += "<dt>" + pName + "</dt><dd>";
			text += deviceInfo[pName];
			text += "</dd>";
		}
		text += "</dl>";
				
		enyo.windows.addBannerMessage($L("Enter a description of your issue"), "{}");
		
		this.$.launchService.call({
			id: "com.palm.app.email",
			params: {
				summary: appInfo.title + " question",
				text: text,
				recipients: [{type: "email", role: 1, value: email, contactDisplay: appInfo.title + " Support"}]
			}
		});
	},
	setCheck: function(val) {
		this.$.showAgain.setChecked((val == "1" ? true : false))
	},
	writePref: function() {
		this.doWritePref((this.$.showAgain.getChecked() == true ? "1" : "0"))
	},
});
