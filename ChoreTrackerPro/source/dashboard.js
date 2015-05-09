enyo.kind({
	name: "dashBoard",
	kind: "Component",
	components: [
		{name: "launchApp", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "launch", onSuccess: "launchSuccess",
	             onFailure: "launchFailure", subscribe: true
	    },
		{name: "dashboard", kind:"Dashboard", smallIcon: "images/icon32.png", onTap: "messageTap",onDashboardActivated: "dashboardActivated"}
	],
	launchSuccess: function(inSender, inResponse) {
        enyo.log("Launch  success, results="); 
    },
    launchFailure: function(inSender, inResponse) {
        enyo.log("Launch  failure, results=");
    },
	pushDashboard: function(ti,te) {
		this.$.dashboard.push({icon:"images/icon48.png", title:ti, text:te});
	},
	popDashboard: function() {
		this.$.dashboard.pop();
	},
    dashboardActivated: function(dash) {
        for (l in dash) {
            var c = dash[l].dashboardContent;
            if (c) {
                c.$.topSwipeable.setStyle("outline:black solid thick;background:black;");
            };
        };
    },
	messageTap: function(inSender, layer) {
		this.log(enyo.json.stringify(layer));
		if (layer.title == "Chores For Today:") {
			enyo.windows.activate("appview.html","AppView",{action: "loadToday"});
		} 
		else {
			enyo.windows.activate("appview.html","AppView",{});
		}
        this.popDashboard();
	},
	iconTap: function(inSender, layer) {
		this.messageTap();
	},
});