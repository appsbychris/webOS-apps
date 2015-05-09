// HelpDialog.js - Help dialog for PopupDemo

enyo.kind({
	name: "HelpDialog",
	kind: "Toaster",
	dismissWithClick: false,
	flyInFrom: "left",
	className: "helpDlg",
	layoutKind: "VFlexLayout",
	events: {
		onRequestInternalHelp: "",
		onWritePref: ""

	},
	components: [
		{name: "appInfoHeader", kind: "HFlexBox", className: "editListSubItem", components: [
			{kind: "Image", src: "images/icon.png"},
			{kind: "VFlexBox", flex: 1, components: [
				{name: "appInfoHeaderTitle", className: "appinfo-title", style: "font-size: 26px; padding: 6px;", content: "Slideshow Presentation HD"},
         		{name: "appInfoBodySubtitle", style: "font-size: 18px; padding: 6px;", content: "v2.0.2 from Apps By Chris"}
			]}
		]},
		{kind: "Scroller", flex: 1, components: [
			/*{className: "faqText", content: "<h3 class='question'>How do I move the popup to another part of the screen?</h3><p class='answer'>webOS doesn't allow that.</p>"},
			{className: "faqText", content: "<h3 class='question'>How do I make other apps use less of the screen, so they're not covered by the popup?</h3><p class='answer'>webOS doesn't allow that.</p>"},*/
			{kind: "RowGroup", defaultKind: "HFlexBox", caption: "Support", components: [
				{kind: "HFlexBox", onclick: "openInternalHelp", align: "center", components: [
					{kind: "Control", style: "width: 32px; margin: 0 8px 0 0", components: [
						{kind: "Image", src: "images/icon.png", style: "width:32px;height:32px;"}
					]},
					{content: $L("Internal Help Document")}
				]},
				{kind: "HFlexBox", onclick: "openHelp", align: "center", components: [
					{kind: "Control", style: "width: 32px; margin: 0 8px 0 0", components: [
						{kind: "Image", src: "images/support/application-web.png"}
					]},
					{content: $L("Online Help Page")}
				]},
				{kind: "HFlexBox", onclick: "openWebosNation", align: "center", components: [
					{kind: "Control", style: "width: 32px; margin: 0 8px 0 0", components: [
						{kind: "Image", src: "images/support/application-web.png"}
					]},
					{content: $L("webOS Nation Support Thread")}
				]},
				{kind: "HFlexBox", onclick: "openWebsite", align: "center", components: [
					{kind: "Control", style: "width: 32px; margin: 0 8px 0 0", components: [
						{kind: "Image", src: "images/support/application-web.png"}
					]},
					{content: $L("Apps By Chris Blog")}
				]},
				{kind: "HFlexBox", onclick: "launchEmail", align: "center", components: [
					{kind: "Control", style: "width: 32px; margin: 0 8px 0 0", components: [
						{kind: "Image", src: "images/support/application-email.png"}
					]},
					{content: $L("Send E-Mail")}
				]}
			]},
			{kind: "HFlexBox", style: "margin-bottom:10px;", components:[		    
		    	{kind: "MyCustomButton",style: "", name: "showAgain", buttonType:"check", defaultClassName:"checkOffSmall",checkedClassName:"checkOnSmall", onButtonClicked: "writePref", preference: "welcome"},                                                                         
		    	{content: "Show Welcome Message"}
		    ]},
		    {kind: "HFlexBox", components:[		    
		    	{kind: "MyCustomButton",style: "", name: "exhibNoteShow", buttonType:"check", defaultClassName:"checkOffSmall",checkedClassName:"checkOnSmall", onButtonClicked: "writePref", preference: "exhibnote"},                                                                         
		    	{content: "Show Exhibition Warning", }
		    ]},
			{name: "appInfoCopyrightText", allowHtml: true, style: "font-size: 14px; padding: 6px;", content: "Copyright © 2012 Apps By Chris"},
			//{name: "acknowledgements", allowHtml: true, style: "font-size: 14px; padding: 6px;", content: "Most icons by Example Co..<br />Some icons by foo."}
		]},
		{layoutKind: "HFlexLayout", pack: "center", style: "margin: 5px 0 0 0;", components: [
			{kind: "Button", caption: $L("Close"), onclick: "closeHelp"}
		]},
		{name: "openService", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open", onFailure: "serviceFailure"},
		{name: "launchService", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "launch", onFailure: "serviceFailure"}
	],

	create: function () {
		this.inherited(arguments);

//		var appInfo = enyo.fetchAppInfo();
//		this.$.appInfoHeaderTitle.setContent(appInfo.title);
//		this.$.appInfoBodySubtitle.setContent(new enyo.g11n.Template($L("v#{version} by #{vendor}")).evaluate(appInfo));
	},   

	writePref: function(iS, iE) {
		var obj = {}
		obj.val = (iS.getChecked() == true ? "1" : "0")
		obj.preference = iS.preference
		this.doWritePref(obj)
	},
	openInternalHelp: function() {
		this.doRequestInternalHelp();
		this.close();
	},
	setChecks: function(welcome, exhib) {
		this.$.showAgain.setChecked((welcome == "1" ? true : false))
		this.$.exhibNoteShow.setChecked((exhib == "1" ? true : false))
	},
	openWebsite: function () {
		this.$.openService.call({id: "com.palm.app.browser", params: {target: enyo.fetchAppInfo().vendorurl}});
	},
   
   	openWebosNation: function () {
		this.$.openService.call({id: "com.palm.app.browser", params: {target: "http://forums.webosnation.com/hp-touchpad-apps/303183-slideshow-presentation-hd.html"}});
	},
	
	openHelp: function () {
		this.$.openService.call({id: "com.palm.app.browser", params: {target: "http://chrishptouchpadapps.tumblr.com/post/11118143698/"}});
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
  
	serviceFailure: function (inSender, inResponse, inRequest) {
		enyo.windows.addBannerMessage(inResponse.errorText, "{}");
	},

	closeHelp: function () {
		this.close();
	}
});

