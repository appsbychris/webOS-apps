//Project handlers

enyo.kind({
	kind: "Pane", 
	name:"ProjectHandler", 
	className: "editWindowPane", 
	lazy: true, 
	published: {
		selectedRow: -1,
		thePaths: "",
		currentFile: "",
		projectNameList: [],
		fullProjects: [],
		bCancel: false
	},
	events: {
		onDataToSave: "",
		onShutDown: "",
		onRequestDataInfo: "",
		onRequestNewProject: "",
		onRequestLoadProject: "",
		onRequestSaveAs: "",
		onRequestDeleteProject: "",
		onRequestMsgBox: "",
		onRequestHelpPop: ""
	},
	components: [
		{kind: "VFlexBox",className: "editListItem", components: [
			//{kind: "HFlexBox",flex:1, components: [
					{kind: "HFlexBox", components: [

						{kind: "DataSpinner", name: "spin", style: ""},
						{name: "statusMsg", showing: false}
					]},
		            {kind: "VirtualList",height: "100%", width: "100%", name: "fileHandlerList", className: "editListSubItem", onSetupRow: "setupFileHandler", components: [
		                {kind: "SwipeableItem",name:"fileItem",className: "editListItemList", tapHighlight: true,onclick: "fileHandlerClick", onConfirm: "fileHandlerDelete", layoutKind: "HFlexLayout", components: [
		                    {kind: "projectItem", name: "pItem", layoutKind: "HFlexLayout"}
		                ]}
		            ]},
		    //    ]}
	      //  ]},
	        {kind: "VFlexBox",className: "editListSubItem", components: [
		        {kind: "Input", name: "saveName", hint: "Save As...", alwaysLooksFocused: true, selectAllOnFocus:true, onkeypress:"fileDialogPress"},
		        {kind: "HFlexBox", components: [
		        	{kind: "HelpButton", helpID: "projects", onHelpRequested: "doRequestHelpPop"},
		        	{kind: "VFlexBox",flex:1, components:[
		        		{kind: "Button",name: "saveLoad", caption: "Load",className:"enyo-button-affirmative", onclick: "fileHandlerSaveLoad"},
	         			{kind: "Button", caption: "Cancel", onclick: "fileHandlerCancel", className: "enyo-button-negative"}
		        	]}
		        ]}
	         	
	        ]}
        ]},
	],
	setupFileHandler: function(inSender, inIndex) {
		if (inIndex >= 0) {
		    if (inIndex < this.fullProjects.length) {
		    	
		    	var isRowSelected = (inIndex == this.selectedRow);
		    	if (isRowSelected) {
		    		this.$.fileItem.addClass("editListItemSelected")
		    	}
		    	else {
		    		this.$.fileItem.removeClass("editListItemSelected")
		    	}
		    	this.$.pItem.feedInfo(this.fullProjects[inIndex])

		    	//this.$.fileHandlerItemContent.applyStyle("background", isRowSelected ? "#9BA6B1" : null);
		    	//this.$.fileHandlerItemContent.setContent(this.fileNames[inIndex]);
		    	return true;
		    }
		}
	},
	fileHandlerDelete: function(inSender, inIndex) {
		var s = this.fullProjects[inIndex].projectName
		
		if (this.currentFile != s) {
			this.doRequestDeleteProject(s);
			this.fullProjects.splice(inIndex,1);
			var x = this.thePaths.getSettingIndexByName(s);
			this.thePaths.deleteSettingItem(x);
		}
		else {
			this.doRequestMsgBox("You can't delete the show you currently have open.");
		
		}
		this.$.fileHandlerList.refresh();
	},
	fileHandlerClick: function(inSender, inEvent) {
		this.selectedRow = inEvent.rowIndex;
		this.$.fileHandlerList.refresh();
	},
	projectIndex: 0,
	startUp: function(viewMode) {
		this.log("starting up")
		this.bCancel = false
		this.fullProjects = []
		this.projectNameList = []
		this.projectIndex = 0
		this.projectNameList = this.thePaths.getListOfProjects()
		this.log(this.projectNameList)
		switch (viewMode) {
			case "load": {
				this.$.saveLoad.setCaption("Load");
				this.$.saveName.setShowing(false);
				break;
			}
			case "save": {
				this.$.saveLoad.setCaption("Save As");
				this.$.saveName.setHint("Save As...")
				this.$.saveName.setShowing(true);
				break;
			}
			case "new": {
				this.$.saveLoad.setCaption("Make New Project");
				this.$.saveName.setHint("New Project Name...")
				this.$.saveName.setShowing(true);
				break;
			}
		}
		this.$.spin.showMe();
		this.$.statusMsg.setShowing(true);
		this.generateAndRequestSql();
	},
	generateAndRequestSql: function() {
		this.log("generating sql")
		var sql = []
		if (this.bCancel === true) {return;};
		this.$.statusMsg.setContent("Loading projects " + (this.projectIndex + 1) + " of " + (this.projectNameList.length) + "...")
		if (this.thePaths.getSetting(this.projectNameList[this.projectIndex], "projectpreviewcheck") == true) {
			this.log("TRUE")
			this.fullProjects.push(this.thePaths.getSetting(this.projectNameList[this.projectIndex], "projectpreview"))
			this.projectIndex++
			if (this.projectIndex < this.projectNameList.length) {
				this.generateAndRequestSql()
			}
			else {
				//got all data
				this.$.spin.hideMe();
				this.$.statusMsg.setShowing(false);
				this.log(enyo.json.stringify(this.fullProjects))
				this.$.fileHandlerList.refresh()
			}
		}
		else {
			sql.push("SELECT max(picorder) FROM picPathsTable WHERE filename = '" + this.projectNameList[this.projectIndex] + "';")
			sql.push("SELECT picpath, picorder FROM picPathsTable WHERE filename = '" + this.projectNameList[this.projectIndex] + "' AND picorder = '0';")
			sql.push("SELECT picpath, picorder FROM picPathsTable WHERE filename = '" + this.projectNameList[this.projectIndex] + "' AND picorder = '1';")
			sql.push("SELECT picpath, picorder FROM picPathsTable WHERE filename = '" + this.projectNameList[this.projectIndex] + "' AND picorder = '2';")
			sql.push("SELECT max(audorder) FROM audPathsTable WHERE filename = '" + this.projectNameList[this.projectIndex] + "';")
			this.doRequestDataInfo(sql)
		};
		
	},
	giveSqlResults: function(data) {
		if (this.bCancel === true) {return;};
		var obj = function() {
			return {photos: [
				        {src: ""},
				        {src: ""},
				        {src: ""}
				    ],
				    picCount: 0,
				    audCount: 0,
				    projectName: ""
				}
		};
		var tmp = new obj();
		tmp.projectName = this.projectNameList[this.projectIndex];
		//try {
			if (data[0].rows.length > 0) {
				tmp.picCount = parseInt(data[0].rows.item(0)["max(picorder)"]) || 0;
			};
			if (data[4].rows.length > 0) {
				tmp.audCount = parseInt(data[4].rows.item(0)["max(audorder)"]) || 0;
			};
			if (tmp.picCount > 0) {tmp.picCount++};
			if (tmp.audCount > 0) {tmp.audCount++};
			for (var i = 1; i < 4; i++) {
				try {
					var x = parseInt(data[i].rows.item(0)["picorder"])
				}
				catch (e) {
					break;
				}
				
				if (x == 0 || x == 1 || x == 2) {
					tmp.photos[x].src = data[i].rows.item(0)["picpath"];
					
					
				}
			};
		/*}
		catch (e) {
			tmp.picCount = 0
			tmp.audCount = 0
		}*/
		this.fullProjects.push(tmp);
		this.thePaths.setSetting(this.projectNameList[this.projectIndex], "projectpreviewcheck", true);
		this.thePaths.setSetting(this.projectNameList[this.projectIndex], "projectpreview", tmp);
		this.projectIndex++
		if (this.projectIndex < this.projectNameList.length) {
			this.$.fileHandlerList.refresh();
			enyo.nextTick(this,this.generateAndRequestSql);
		}
		else {
			//got all data
			this.$.spin.hideMe();
			this.$.statusMsg.setShowing(false);
			this.log(enyo.json.stringify(this.fullProjects));
			this.$.fileHandlerList.refresh();
		}
	},
	fileHandlerCancel: function () {
		/*this.$.fileHandler.close();

		this.setPicLabel();*/
		//this.doRequestNewProject(this.$.saveName.getValue())
		this.bCancel = true;
		this.doShutDown();
	},
	fileDialogPress: function(inSender, inEvent) {
		if (inEvent.keyCode == 13) {
			this.fileHandlerSaveLoad();
		}
	},
	fileHandlerSaveLoad: function() {
		this.bCancel = true;
		if (this.$.saveLoad.getCaption() == "Load") {
			if (this.selectedRow > -1) {
				var s = this.fullProjects[this.selectedRow].projectName;
				this.doRequestLoadProject(s);
			}
		}
		else if (this.$.saveLoad.getCaption() == "Save As") {
			this.log("SAVEAS")
			var s = this.$.saveName.getValue();
			this.doRequestSaveAs(s);
		}
		else {
			var s = this.$.saveName.getValue();
			this.doRequestNewProject(s);
		}
	},
});


enyo.kind({
	name: "projectItem",
	kind: "Control",
	published: {
		picCount: 0,
		audCount: 0,
		projectName: "",
		photos: [], //{src: ""}
        
	},
	style: "width: 100%;",
	events: {
		onClicked: ""
	},
	components: [
	/*
                         Project Name
	image/image/image    pic count
                         aud count   
	*/
		{kind: "HFlexBox", style: "margin-left: 10px;margin-top:10px;margin-bottom:10px;", components: [
			{kind: "HFlexBox", style: "z-index:100;width: 100px;height:100px;background: url(images/projectback.png) 0 0 no-repeat;background-size: 100% 100%;-webkit-transform:rotate3d(0,0,0,-5deg)", components:[
				{kind: "Image", name: "image1", style :"z-index:100;width: 75px;height:70px;position:relative;top: 6px;left:5px;"}
			]},
			{kind: "HFlexBox", style: "z-index:90;width: 100px;height:100px;background: url(images/projectback.png) 0 0 no-repeat;background-size: 100% 100%;position:relative;left:-25px;", components:[
				{kind: "Image", name: "image0", style :"z-index:90;width: 83px;height:70px;position:relative;top: 6px;left:7px;"}
			]},
			{kind: "HFlexBox", style: "z-index:80;width: 100px;height:100px;background: url(images/projectback.png) 0 0 no-repeat;background-size: 100% 100%;-webkit-transform:rotate3d(0,0,0,5deg);position:relative;left:-50px;", components:[
				{kind: "Image", name: "image2", style :"z-index:80;width: 75px;height:70px;position:relative;top: 6px;left:15px;"}
			]}
		]},
		{kind: "VFlexBox",name: "iInfo", style: "position:relative;left:-40px;", components: [
			{name: "project", style: "font-size:120%;font-weight: bold;"},
			{kind: "HFlexBox", components:[
				{kind: "Image", name: "picIcon", style: "width:24px;height:24px;", src: "images/icon.png"},
				{name: "pCount", style: "font-size:90%;font-weight: bold;"},
			]},
			{kind: "HFlexBox", components:[
				{kind: "Image", name: "audIcon",style: "width:24px;height:24px;", src: "images/music.png"},
				{name: "aCount", style: "font-size:90%;font-weight: bold;"}
			]}
		]}
	],
	rendered: function() {
		this.inherited(arguments)
		this.renderInfo()
	},
	feedInfo: function(p) {
		this.picCount = p.picCount
		this.audCount = p.audCount
		this.projectName = p.projectName
		this.photos = p.photos

		this.renderInfo()
	},
	renderInfo: function() {
		for (var i = 0; i < this.photos.length; i++) {
			if (this.photos[i].src.length > 0) {
				this.$["image" + i].setSrc("/var/luna/data/extractfs" + this.photos[i].src + ":0:0:64:64:2");
			}
			else {
				this.$["image" + i].setSrc("images/black.png");	
			}
		};
		this.$.project.setContent(this.projectName);
		this.$.aCount.setContent(this.audCount + " audio tracks.");
		this.$.pCount.setContent(this.picCount + " pictures.");
		if (this.layoutKind == "VFlexLayout") {
			this.$.iInfo.setStyle("position:relative;left:10px;max-width:300px;overflow:hidden;")
		}
	},
	clickHandler: function() {
		this.doClicked(this.projectName)
	}
});