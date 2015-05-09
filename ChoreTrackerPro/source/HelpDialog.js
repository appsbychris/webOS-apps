// HelpDialog.js - Help dialog for PopupDemo

enyo.kind({
	name: "HelpDialog",
	kind: "Toaster",
	dismissWithClick: false,
	flyInFrom: "left",
	className: "helpDlg",
	layoutKind: "VFlexLayout",
	components: [
		{name: "appInfoHeader", kind: "PageHeader", components: [
			{kind: "Image", src: "images/icon64.png"},
			{kind: "VFlexBox", flex: 1, components: [
				{name: "appInfoHeaderTitle", className: "appinfo-title", style: "font-size: 26px; padding: 6px;", content: "Chore Tracker Pro"},
         		{name: "appInfoBodySubtitle", style: "font-size: 18px; padding: 6px;", content: "v1.0.6 by Apps By Chris"}
			]}
		]},
		{kind: "Scroller", flex: 1, components: [
			//{className: "faqText", content: "<h3 class='question'>How do I move the popup to another part of the screen?</h3><p class='answer'>webOS doesn't allow that.</p>"},
			//{className: "faqText", content: "<h3 class='question'>How do I make other apps use less of the screen, so they're not covered by the popup?</h3><p class='answer'>webOS doesn't allow that.</p>"},
			{kind: "RowGroup", defaultKind: "HFlexBox", caption: "Support", components: [
				{kind: "HFlexBox", onclick: "openWebsite", align: "center", components: [
					{kind: "Control", style: "width: 32px; margin: 0 8px 0 0", components: [
						{kind: "Image", src: "images/support/application-web.png"}
					]},
					{content: $L("Support Website")}
				]},
				{kind: "HFlexBox", onclick: "openHelp", align: "center", components: [
					{kind: "Control", style: "width: 32px; margin: 0 8px 0 0", components: [
						{kind: "Image", src: "images/support/application-web.png"}
					]},
					{content: $L("Online Help Page")}
				]},
				{kind: "HFlexBox", onclick: "openwebosNation", align: "center", components: [
					{kind: "Control", style: "width: 32px; margin: 0 8px 0 0", components: [
						{kind: "Image", src: "images/support/application-web.png"}
					]},
					{content: $L("webOSnation Support Thread")}
				]},
				{kind: "HFlexBox", onclick: "launchEmail", align: "center", components: [
					{kind: "Control", style: "width: 32px; margin: 0 8px 0 0", components: [
						{kind: "Image", src: "images/support/application-email.png"}
					]},
					{content: $L("Send E-Mail")}
				]}
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
	/*{kind: "HelpMenu", caption: "Online Help",  target: "http://chrishptouchpadapps.tumblr.com/post/16991714628/chore-tracker-pro-1-0-0-help"},
		     	{kind: "HelpMenu",caption: "Support Thread", target: "http://forums.webosnation.com/hp-touchpad-apps/311895-new-app-chore-tracker-pro.html"},
		     	{kind: "HelpMenu",caption: "Apps By Chris Blog", target: "http://chrishptouchpadapps.tumblr.com/"}*/
	openWebsite: function () {
		this.$.openService.call({id: "com.palm.app.browser", params: {target: "http://chrishptouchpadapps.tumblr.com/"}});
	},
   
	openHelp: function () {
		this.$.openService.call({id: "com.palm.app.browser", params: {target: "http://chrishptouchpadapps.tumblr.com/post/16991714628/"}});
	},
	openwebosNation: function() {
		this.$.openService.call({id: "com.palm.app.browser", params: {target: "http://forums.webosnation.com/hp-touchpad-apps/311895-new-app-chore-tracker-pro.html"}});
	},
	launchEmail: function () {
		var text, i, statusItem, statusTemplate, deviceInfo, pName;
		var appInfo = enyo.fetchAppInfo();
		//this.log(enyo.json.stringify(appInfo))
		var email = "appsbychrisvanhooser@gmail.com";
		
		text = "<br /><br />" +
			"Chore Tracker Pro for HP webOS, version #1.0.6"
				
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
				summary: "Chore Tracker Pro" + " question",
				text: text,
				recipients: [{type: "email", role: 1, value: email, contactDisplay: "Chore Tracker Pro" + " Support"}]
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

