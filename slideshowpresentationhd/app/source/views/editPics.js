


enyo.kind({
	kind: "Pane", 
	name:"editPics", 
	lazy: true, 
	className: "editWindowPane", 
	published: {
		selectedRow: 0,
		thePaths: "",
		currentFile: "",
		needSave: false,
		beSilent: 0,
		actualIndex: 0,
		currentItem: 0,
		lastItems: [],
		totalItems: 0,
		goingBack: false
	},
	events: {
		onDataToSave: "",
		onShutDown: "",
		onRequestHelpPop: ""
	},
	components: [                                             
	    {layoutKind: "VFlexLayout", components: [
                {kind: "HFlexBox", style: "height:80px", className: "editListSubItem", components: [
                   	{kind: "MyCustomButton", defaultClassName:"backButton", name:"backPics", clickClassName: "backButtonClicked", onButtonClicked: "shutDown"},                            
					{kind: "VFlexBox", components:[
						{kind: "HFlexBox",name: "unsaved", components:[
							{kind: "Image", style :"height:32px;width:32px;", src: "images/needsave.png"},
							{content: "You have unsaved data!<br />You must click the back button to save when finished!", allowHtml: true, style: "font-size:70%;font-weight:bold;"}
						]},    
						{kind: "HFlexBox", components:[               	
	                    	{name: "picHeaderContent",content: "Edit Pictures", flex: 1}
	                    ]}
                    ]},
                    {flex:1},
					{kind: "HelpButton", helpID: "editpictures", onHelpRequested: "doRequestHelpPop", style: "margin-right:15px;"},
                    {kind: "VFlexBox", components: [
                    	{name: "viewing", content: "Pictures 0 to 0"},
                    	{kind: "Button", caption: "Jump To", onclick: "openJumpToPopup", className: "enyo-button-affirmative"}
                    ]}
                ]},
                {kind: "VFlexBox",flex:1, components: [
		            {kind: "HFlexBox",className:"editListSubItem",style: "height:120px", components:[
		            	//{kind: "Button", caption: "<"},
		            	{kind: "VFlexBox",flex: 1, components:[
			            	{kind: "HVirtualList",name:"imageList", onSetupRow:"setupMiniImages",height:"98px", components:[
		                        {kind: "VSwipeableItem",name:"imgItem",style: "height:98px;", onclick: "miniImageClick",onConfirm: "deletePicItem", components: [
									{kind: "VFlexBox", components:[
										{kind: "Image", name: "clipImg", style: "width:65px;height:55px;border-radius:3px;"},
										{name: "clipsrc", content: "", style: "font-size:55%;width:65px;height:17px;overflow:hidden;"},
										{name: "clipIndex", content: "0", style:"position: relative;top: -89px;left:-5px;font-weight:bold;"}
									]}
							    ]}
							]}
						]},
						//{kind: "Button", caption: ">"}
		            ]},
		            {kind: "HFlexBox", flex: 1, components:[
			            {kind: "VFlexBox",flex: 1, components:[
			            {kind: "Scroller",autoVeritcal: false,horizontal:false,autoHorizontal:false, flex: 1, components: [
		             		{kind: "VFlexBox",className:"editListSubItem",flex:1, components: [
        	                	{content: "Index:"},
        	                	{kind: "HFlexBox", components: [
	        	                	{content: "0", name: "itemIndex", style: "margin-right:10px;"},
	        	                	{kind: "Button", caption: "set", onclick: "openIndexPicker", className: "enyo-button-affirmative"}
	        	                ]}
        	                    //{kind: "IntegerPicker",style:"margin-right: 10px", name: "itemIndex", label: "", min: 0, max: 10, onChange: "saveItemSettings", preference: "order"}
        	                ]},
        	                {kind: "VFlexBox", className:"editListSubItem",flex:1, components: [
        	                	{content: "Stretch:"},
							    {kind: "MyCustomButton",style:"margin-right: 10px", name: "stretchMode", buttonType: "check", defaultClassName:"checkOff", checkedClassName: "checkOn",onButtonClicked: "saveItemSettings"}
							]},
							{kind: "VFlexBox",className:"editListSubItem",flex:1, components: [
								{content: "Rotation:"},
	        	                {kind: "Picker",style:"margin-top: 7px",name:"picRotation",onChange:"saveItemSettings", value: 0, items: [
	        	                    {caption:"None", value: 0},                                                                                                        
	        	                    {caption:"90deg Clockwise", value: 1},
	        	                    {caption:"180deg", value: 2},
	        	                    {caption:"90deg Counter-Clockwise", value: 3}
	        	                ]}
	        	            ]},
        	                {kind: "VFlexBox",className:"editListSubItem",flex:1, components: [
        	                	{content: "Custom Duration:"},
        	                	//{flex: 1},
        	                	{kind: "HFlexBox",style:"margin-top: 7px", components: [
	        	                	{kind: "IntegerPicker", name: "editDurPicker", label: "", min: 8, max: 60,value:15, onChange: "saveItemSettings"},
									{kind: "Picker",style:"margin-left: 10px", name: "editScalePicker", value: "seconds", 
									    items: ["seconds", "minutes"], 
									    onChange:"saveItemSettings"
									}
								]}
							]},                                                            
							{kind: "VFlexBox", className:"editListSubItem",flex:1, components: [
								{content: "Caption Location"},
	        	                {kind: "Picker",style:"margin-top: 7px", name: "capLocPicker", value: "Bottom", items: ["Bottom", "Top"], onChange:"saveItemSettings"}
	        	            ]},
	        	        ]}
		             	]},
			            {kind: "VFlexBox",style: "width: 530px;margin-left:4px;margin-right:4px;", components:[
							{kind: "Scroller",autoVeritcal: false,horizontal:false,autoHorizontal:false, flex: 1, components: [
								{name: "fileName", content: "", style: "font-size:90%;max-width: 520px;overflow:hidden;max-height:75px;"},
								{kind: "VFlexBox",name: "contain", style: "width: 530px;height:400px;", components:[
									{kind: "Spinner", name: "spin", showing: false},
						            {kind: "CSnapScroller",style: "width: 520px;height:400px;",className: "editPicBack",vertical:false,autoVeritcal: false,onSnap: "snapChecker",name:"picItems", components: [
										//{kind: "TextCanvas", domAttributes: {style: ""}, name: "textCanvas", txtWidth: 500, txtHeight: 375}
									]}
								]},
								{kind: "VFlexBox",className:"editListSubItem", flex:1,components:[
				        	        {kind: "RichText", name: "editCaption",hint: "Enter Caption", changeOnInput : true, onkeypress: "textLimit" ,alwaysLooksFocused: true, richContent: false, inputClassName: "txtBoxInside"}
								]}
				    	    ]}
						]},
						{kind: "VFlexBox",flex: 1, components:[
						{kind: "Scroller",autoVeritcal: false,horizontal:false,autoHorizontal:false, flex: 1, components: [
        	                {kind: "VFlexBox",className:"editListSubItem",flex:1,style: "min-height:60px;", components: [
        	                	{content: "Transition:"},
        	                	//{flex:1},
        	                    {kind: "SuperPickerBase",name: "transPicker", onChange: "saveItemSettings", style: "max-width:150px;overflow:hidden;"}
	        	            ]},
	        	            {kind: "VFlexBox",className:"editListSubItem",flex:1,style: "min-height:60px;", components: [
        	                	{content: "Cinematic Mode:"},
        	                	//{flex:1},
        	                	{kind: "PanAndZoomSuperPickerBase", name: "addPanPicker", onChange: "prefAddPan", style: "max-width:150px;overflow:hidden;"}
        	                ]},
        	                {kind: "VFlexBox", className:"editListSubItem",flex:1, components: [
	        	            	{content: "Font Size:"},
	        	            	{kind: "HFlexBox",style:"margin-top: 7px", components: [
			        	            {kind: "IntegerPicker", name: "picFontSize", value: 30, min:8,max:72,label:"", onChange:"saveItemSettings"},
			        	            {content: "pt", style:"margin-top:10px;margin-left:5px;"}
			        	        ]}
	        	            ]},
	        	            {kind: "VFlexBox", className:"editListSubItem",flex:1,components: [
					        	{name: "colorPreview"},
						        {kind: "Button", caption: "Set Caption Color", onclick: "openCaptionColorPopup", className: "enyo-button-affirmative"}
						    ]}
						]}
			            ]}
						
					]},
	             /*{kind: "VFlexBox",flex:1, components:[
		            {kind: "ReorderableVirtualList", width: "100%", height: "100%",name: "fileList", onSetupRow: "setupRow", reorderable:true,
		                 onReorder: "reorder",
		                 components: [
		                  {kind: "SwipeableItem",name: "picItem", className: "editListItemList", tapHighlight: true,onclick: "itemClick", onConfirm: "deletePicItem", layoutKind: "HFlexLayout", components: [
		                       {name: "theOrder", content:"0", className: "editListIndex"},                                                                                                     
		                       {kind:"Image",name: "itemImage", className:"anImage"},
		                       {layoutKind:"VFlexLayout",style: "width:170px;padding-left:10px;", name:"rowGroupList", components: [
	    	                         {name: "filename",style:"font-weight:bold;font-size: 90%;", flex: 1},
	    	                         {name: "caption",style:"font-weight:bold;font-size: 70%;", className: "wordWrap", flex: 2}
	    	                   ]},
	    	                   {layoutKind:"VFlexLayout", name:"rowGroupEnd", style:"width: 125px;",components: [
	                                {layoutKind:"HFlexLayout",  flex: 1, components: [
	    	                             {name: "caploc",style:"font-weight:bold;font-size: 70%;", flex:1},
		        	                     {name: "picSize", style:"margin-left: 3px;font-weight:bold;font-size: 70%;", flex:1},
	    	                             {name: "capColor",className:"colorBoxList",style:"font-weight:bold;font-size: 70%;"}
	    	                        ]},
	    	                        {layoutKind:"HFlexLayout",  flex: 1, components: [
	    	                             {name: "trans",style:"font-weight:bold;font-size: 70%;", flex: 1},
	    	                             {name: "transspeed",style:"position:relative;left: 20px;font-weight:bold;font-size: 70%;", flex: 1}
	    	                        ]},     
	    	                        {layoutKind:"HFlexLayout",  flex: 1, components: [
	    	                             {kind: "Image", name: "stretchImage", className: "smallImage", src:"images/stretch.png"},
	                                     {name: "rotatecap",style:"font-weight:bold;font-size: 70%;",flex: 1}
	    	                        ]},
	    	                        {layoutKind:"HFlexLayout", name:"rowinfo", flex: 1, components: [
	        	                        {name: "picDelay",style:"font-weight:bold;font-size: 70%;"},
	        	                        {name: "picPan", style:"margin-left: 3px;font-weight:bold;font-size: 70%;"}
	        	                    ]}
	    	                   ]}
		                   ]}
	                ]}*/
	          // ]},
	           
            ]}
        ]},
        {kind: "ColorSelector", className: "runSettingPopup editPicsFontColorPosition",leftOffset: 536, flyInFrom: "right", name: "colorSelector", onNewFontColor: "saveItemSettings"},
        {kind: "IndexPicker",className: "indexPopupPosition", name: "indexPicker", onIndexSelected: "newIndexNumber"},
        {kind: "IndexPicker",className: "jumpPopupPosition",flyInFrom: "right", name: "jumpPicker", onIndexSelected: "jumpToIndex"},
    ],
    startUp: function() {
    	enyo.setAllowedOrientation("landscape");
		this.selectedRow = 0;
		this.actualIndex = 0;
		this.currentItem = 0;

		this.thePaths.orderArray("pictures");
		this.$.picHeaderContent.setContent("Edit Pictures: " + this.thePaths.getPictureCount() + " pictures");
		//this.$.itemIndex.setMax(this.thePaths.getPictureCount() - 1);

		this.needSave = false;
		this.$.unsaved.setShowing(false);
		//enyo.asyncMethod(this.$.fileList,this.$.fileList.punt);
		var res = this.getTopLeft();
		//this.$.textCanvas.setStyle("position:fixed;z-index:100;width:375px;height:500px;top:225px;left:270px;")//top:" + res.top + "px;left:" + res.left + "px;");
		//this.log("@@@@@======================>>>>>>>" + "position:fixed;z-index:100;top:" + res.top + "px;left:" + res.left + "px;")
		this.loadItemsView();
		//this.fillEditPicPane(0);
    },
    shutDown: function() {
		this.beSilent = 1;
		this.saveItemSettings();
		this.beSilent = 0;
		if (this.needSave == true) {
			this.reIndex()
		}
		enyo.setAllowedOrientation("free");
		this.doShutDown()
	},
	textLimit: function (inSender, inEvent) {
		
		var s = inSender.getValue();
		if (s.length > 700) {
			inSender.setValue(s.substr(0,699));
		}
		if (inEvent.keyCode == 13) {this.saveItemSettings();};
	},
	getTopLeft: function () {

		var x, y = 0;
		var elm = this.$.picItems.hasNode()
		if (elm) {
			this.log("node exisit")
			x = elm.offsetLeft;
			y = elm.offsetTop;
			elm = elm.offsetParent;
			while (elm != null) {
				x = parseInt(x) + parseInt(elm.offsetLeft);
				y = parseInt(y) + parseInt(elm.offsetTop);
				elm = elm.offsetParent;
			};
			return {top:y , left: x	}
		}
		return {top:0, left: 0};
	},
	setupMiniImages: function(is,iIn) {
		if (iIn >=0) {
			if (iIn < this.lastItems.length ) {
					//if (this.touchPad == 1) {
						
					/*}
					else {
						this.$.clipImg.setStyle("position:relative;top:10px;left:10px;width:65px;height65px;");
					};*/
					if (this.selectedRow == iIn) {
						//this.$.imgItem.setStyle("background:#0000FF;")
						this.$.imgItem.setClassName("editListImgListSelected");
					}
					else {
						this.$.imgItem.setClassName("editListImgList");
						//this.$.imgItem.setStyle("background:null;")
					};
					var s = this.lastItems[iIn].components[0].src.replace(/200/gi, "50")
					this.$.clipImg.setSrc(s);
					this.$.clipIndex.setContent(this.lastItems[iIn].iIndex);
					s = s.replace(":0:0:50:50:2", "");
					var i = s.lastIndexOf("/", s.length - 1);
					s = s.substr(i + 1, s.length - (i+1));
					this.$.clipsrc.setContent(s);
				return true;
			};
		};
		return false;
	},
	miniImageClick: function(iS, iE) {
		if (this.selectedRow != iE.rowIndex) {
			this.selectedRow = iE.rowIndex;
			this.$.picItems.snapToView(this.selectedRow);
		}
		else {
			this.saveItemSettings()
		}
	},
	justLoaded: false,
	snapChecker: function(iS,iE) {
		/*if (this.freshLoad == true) {
			this.freshLoad = false;
			return;
		};*/
		var b = false
		this.log("###########=====" + iE + "," + this.currentItem + "," + this.justLoaded)
		if (iE != this.currentItem || this.justLoaded == true) {
			if (this.justLoaded == false) {
				this.saveItemSettings();
			}
			b = true;
		}
		this.currentItem = iE;
		this.actualIndex = this.lastItems[this.currentItem].iIndex;

		this.log(this.actualIndex + "," + this.totalItems);
		//this.log(this.downloadedItems[this.actualIndex].post.blog_name + ", " + this.downloadedItems[this.actualIndex].post.date);
		this.selectedRow = iE;
		this.$.imageList.refresh();
		this.scrollTo(this.selectedRow)
		if (this.currentItem >= this.totalItems - 1 && this.justLoaded == false) {
			//this.toggleContain(false, false);
			//this.$.spin.start();

			if (this.actualIndex >= this.thePaths.getPictureCount() - 1) {
				//enyo.nextTick(this, this.getItems, true);
				this.log("MAX")
			}
			else {
				this.log("RELOAD")
				enyo.nextTick(this, this.loadItemsView);
			};
		}
		else if (this.currentItem == 0 && (this.actualIndex-1 > 0) && this.justLoaded == false) {
			//this.toggleContain(false, false);
			//this.$.spin.start();
			this.log("GONEBACK")
			this.goingBack = true;
			enyo.nextTick(this,this.loadItemsView);
		}
		if (b) {
			//this.$[this.lastItems[iE].name].scrollToTop();
			this.log("@@@@============>>>>>>>>>>>>>>")
			enyo.nextTick(this,this.fillEditPicPane,this.actualIndex)
		};
		this.justLoaded = false
	},
	freshLoad: false,
	loadItemsView: function() {
		this.$.picItems.setShowing(false)
		this.$.spin.show();
		var itemsToRender = 12;
		var picLength = this.thePaths.getPictureCount()
		if (picLength < itemsToRender) {
			itemsToRender = picLength;
		};
		if (picLength <= 20) {
			itemsToRender = 20;
		};
		if (this.lastItems.length > 0) {
			for (var i = 0; i < this.lastItems.length; i++) {
				this.$[this.lastItems[i].name].destroy();
			};
		}

		//var viewWidth = 1024
		//if (this.hasNode()) {
			var viewWidth = 500//window.innerWidth
		//}
		//this.log("VIEW" + viewWidth)
		var itemView = function(viewW) {
			return {kind: "VFlexBox",
		            name: "",
		            iIndex: -1,
		            style: "width:" + viewW + "px;height:375px;margin-right:5px;margin-left:5px;",
		            textDrawn: false,
		            components: [
		            	{kind: "DrawImage.control",
 						 src: "",
 						 picWidth: 500,
 						 picHeight: 375,
 						 txtWidth: 500,
 						 txtHeight: 375,
 						 onPicLoaded: "reDrawCaption",
 						 name: "",
 						 autoLoad: true,
 						 domAttributes: { 
					    	style: ""
						 }
		                }
		            ]
		           }
		};
		
		var tmpArr = [];
		this.lastItems = [];
		if (this.goingBack == false) {
			this.log("!!!!!!!!!!!=================>>>>>>>>> going forward")
			var x = this.actualIndex - 4;
			if (x < 0) {x = 0};
			var y = x + itemsToRender + (x > 0 ? 4 : 0);
			if (y >= picLength) {
				y = picLength - 1
				x = y - itemsToRender - 4
				if (x < 0) {x = 0};
			};
			//this.log("XANDY=" + x + ","+ y)
			for (var i = x; i <= y; i++) {
				var iV = new itemView(viewWidth);
				iV.name = "item" + i;
				iV.iIndex = i;
				iV.components[0].src = "/var/luna/data/extractfs" + this.thePaths.getPictureInfo(i, "path") + ":0:0:200:200:2";
				iV.components[0].name = "canvas" + i;
				iV.components[0].picRotate = parseInt(this.thePaths.getPictureInfo(i, "rotate"))
				iV.components[0].stretch = (this.thePaths.getPictureInfo(i, "stretch") == "1" ? true : false)
				iV.components[0].style =  "width:500px; height:375px;"
				tmpArr.push(iV);
			};
		}
		else {
			this.log("!!!!!!!!!!!=================>>>>>>>>> going back")
			var x = this.actualIndex - itemsToRender;
			if (x < 0) {x = 0};
			//tmpArr = this.downloadedItems.slice(x, x + itemsToRender + 1);	
			var y = (x + itemsToRender + 4)
			if (y >= picLength) {y = picLength - 1}
			for (var i = x; i <= y ; i++) {
				var iV = new itemView(viewWidth);
				iV.name = "item" + i;
				iV.iIndex = i;
				iV.components[0].src = "/var/luna/data/extractfs" + this.thePaths.getPictureInfo(i, "path") + ":0:0:200:200:2";	
				iV.components[0].name = "canvas" + i;
				iV.components[0].picRotate = parseInt(this.thePaths.getPictureInfo(i, "rotate"))
				iV.components[0].stretch = (this.thePaths.getPictureInfo(i, "stretch") == "1" ? true : false)
				tmpArr.push(iV);
			};
		}

		x = this.actualIndex;
		var lastCItem = this.currentItem
		/*x = x - 1;
		if (x < 0) {x = 0;};*/
		for (i = 0; i < tmpArr.length; i++) {
			if (tmpArr[i].iIndex == x) {
				this.currentItem = i;
				break;
			}
		};
		this.totalItems = tmpArr.length;
		this.lastItems = tmpArr;

    	//this.toggleContain(true, true);
		//this.$.contain.selectViewByName("mainView");

    	this.$.picItems.createComponents(tmpArr, {owner:this});
    	this.$.picItems.render();
    	//this.$.picItems.setIndex(this.currentItem)

    	this.goingBack = false;
    	this.log("citem, actIn======================>>" + this.currentItem + "," + this.actualIndex);
    	this.$.imageList.punt();
    	this.$.viewing.setContent("Pictures " + (this.lastItems[0].iIndex + 1) + " to " + (this.lastItems[this.lastItems.length - 1].iIndex + 1) + " of " + (this.thePaths.getPictureCount()))
    	this.$.spin.hide();
	    enyo.nextTick(this.$.picItems,this.$.picItems.setShowing,true)
    	/*if (lastCItem == this.currentItem) {
    		this.log("===============citm == >>")
    		//this.freshLoad = true
    		enyo.nextTick(this,this.fillEditPicPane,this.actualIndex)
    	}
    	else {*/
    		this.log("===============snapto == >>")
    		this.justLoaded = true;
    		enyo.nextTick(this.$.picItems,this.$.picItems.snapToView,this.currentItem);	
    	//}
    	//this.snapChecker("", this.currentItem)
    	
    	//this.log()
    	/*window.setTimeout(enyo.bind(this,function() {
    		this.determineLiked();
    		enyo.nextTick(this.$.spin,this.$.spin.stop);
    	}), 800);*/
    	
	},
	newIndexNumber: function(iS, iE) {
		iE = parseInt(iE)
		if (isNaN(iE) == true) {
			iE = 0
		}
		if (iE > this.thePaths.getPictureCount() - 1) {
			iE = this.thePaths.getPictureCount() - 1
		}
		else if (iE < 0) {
			iE = 0
		}
		this.$.itemIndex.setContent(iE)
		this.saveItemSettings();
		this.actualIndex = iE;
		this.loadItemsView();
	},
	jumpToIndex: function(iS,iE) {
		iE = parseInt(iE)
		if (isNaN(iE) == true) {
			iE = 0
		}
		if (iE > this.thePaths.getPictureCount() - 1) {
			iE = this.thePaths.getPictureCount() - 8
		}
		else if (iE < 0) {
			iE = 0
		}
		//this.saveItemSettings();
		this.actualIndex = iE;
		this.log("$$$$++======================>>>>" + iE)
		this.loadItemsView();

	},
	openIndexPicker: function() {
		this.$.indexPicker.open();
		this.$.indexPicker.setCurrentIndex(this.thePaths.getPictureInfo(this.actualIndex, "index"))
	},
	openJumpToPopup: function() {
		this.$.jumpPicker.open();
		this.$.jumpPicker.setCurrentIndex = ""//this.lastItems[this.currentItem].iIndex
	},
	openCaptionColorPopup: function() {
		this.$.colorSelector.open();

		this.$.colorSelector.setCurrentColor(this.thePaths.getPictureInfo(this.actualIndex, "captioncolor"));
		this.$.colorSelector.setTextPos(this.thePaths.getPictureInfo(this.actualIndex, "captionlocation"));
		this.$.colorSelector.setPreviewPic(this.thePaths.getPictureInfo(this.actualIndex, "path"));
	},
    /*setupRow: function(inSender, inIndex) {
		var x = 0;
		if (inIndex >= 0 ) {

		    if (inIndex <= this.thePaths.getPictureCount() - 1) {
		    	if (this.selectedRow < 0) {
		        	this.selectedRow = 0;
		        	this.fillEditPicPane(this.selectedRow);
		        };
		          
	    		
		    	var isRowSelected = (inIndex == this.selectedRow);
		    	var s = this.thePaths.getPictureInfo(inIndex, "path");
		    	x = s.lastIndexOf("/");
		    	var out = ""
		    	switch (this.thePaths.getPictureInfo(inIndex,"rotate")) {
		    	    case 0: {
		    	    	out = "0deg"
		    	    	break;
		    	    }
		    	    case 1: {
		    	    	out = "90deg"
		    	    	break;
		    	    }
		    	    case 2: {
		    	    	out = "180deg"
		    	    	break;
		    	    }
		    	    case 3: {
		    	    	out = "-90deg"
		    	    	break;
		    	    }
		    	}
		    	this.$.rotatecap.setContent(out)
		    	switch (parseInt(this.thePaths.getPictureInfo(inIndex,"tspeed"))) {
		    	    case 0: {
		    	    	out = "slowest"
		    	    	break;
		    	    }
		    	    case 1: {
		    	    	out = "slow"
		    	    	break;
		    	    }
		    	    case 2: {
		    	    	out = "fast"
		    	    	break;
		    	    }
		    	    case 3: {
		    	    	out = "faster"
		    	    	break;
		    	    }
		    	    case 4: {
		    	    	out = "turbo"
		    	    	break;
		    	    }
		    	}
		    	this.$.transspeed.setContent(out)
		    	
		    	if (isRowSelected) {
		    		this.$.picItem.addClass("editListItemSelected")
		    	}
		    	else {
		    		this.$.picItem.removeClass("editListItemSelected")
		    	}
		        this.$.theOrder.setContent(inIndex)//this.thePaths.getPictureInfo(inIndex, "index"));
		        
		        var c = this.thePaths.getPictureInfo(inIndex, "caption");
		        if (c.length > 100) {
		        	c = c.substr(0,100) + "...";
		        }
		        this.$.caption.setContent(c);
		        c = s.substr(x+1)
		        if (c.length > 18) {
		        	c = c.substr(0,16) + "...";
		        }
		        this.$.filename.setContent(c);
		        if (parseInt(this.thePaths.getPictureInfo(inIndex, "captionlocation")) == 0) {
		        	this.$.caploc.setContent("Btm.");
		        }
		        else {
		        	this.$.caploc.setContent("Top");
		        };
		       
		        this.$.itemImage.setSrc("/var/luna/data/extractfs" + s + ":0:0:64:64:2");
		        
		        c = this.thePaths.getPictureInfo(inIndex, "stretch");
	    	    
	    	    if (c == "1") {
	    			this.$.stretchImage.show();
	    		}
	    		else {
	    			this.$.stretchImage.hide();
	    		};
	    		c = this.$.transPicker.getProperValue(this.thePaths.getPictureInfo(inIndex, "transition"), true)
	    		if (c.length > 9) {
		        	c = c.substr(0,9) + "...";
		        }
	    		this.$.trans.setContent(c);
	    		c = VerifyHexColor(this.thePaths.getPictureInfo(inIndex, "captioncolor"));
	    		this.$.capColor.setContent(c);
	    		this.$.capColor.applyStyle("background", c);
	    		
	    		this.$.picDelay.setContent(this.thePaths.getPictureInfo(inIndex, "delay"));
	    		this.$.picSize.setContent(this.thePaths.getPictureInfo(inIndex, "fontsize") + "pt");
	    		c = this.thePaths.getPictureInfo(inIndex, "pan");
	    		if (Number(c) > -1) {
	    			c = "Pan";
	    		}
	    		else {c= "";}
	    		this.$.picPan.setContent(c);
    		
		        return true;
		    }
		}
		return false;
	},
	itemClick: function(inSender, inEvent) {
		this.beSilent = 1;
		this.saveItemSettings();
		this.beSilent = 0;
	    this.selectedRow = inEvent.rowIndex;
	    var x = this.selectedRow;
	    this.fillEditPicPane(x);
	},*/
	reorder:function(inSender,toIndex,fromIndex){
	    if (toIndex != fromIndex && toIndex > -1 && toIndex < this.thePaths.getPictureCount()) {
	    	var inDex = toIndex
	        var oldDex = fromIndex
	        var sql = []
			sql.push("UPDATE picPathsTable SET picorder = " + inDex + " WHERE pkey = " + this.thePaths.getPictureInfo(oldDex, "pkey") + ";");
			this.thePaths.setPictureInfo(oldDex, "index", inDex);
			var j = this.thePaths.getPictureInfo(oldDex, "path");
			var i = 0
			this.selectedRow = inDex
			if (oldDex < inDex) {
				for (i = inDex; i >= 1; i--) {
					if (i == oldDex -1) {break;}
					if (this.thePaths.getPictureInfo(i, "path") != j) {
						sql.push("UPDATE picPathsTable SET picorder = " + (i - 1) + " WHERE pkey = " + this.thePaths.getPictureInfo(i, "pkey") + ";");
						this.thePaths.setPictureInfo(i, "index", i-1);
					}
				}
			}
			else {
				var yy = false
				for (i = inDex; i <= this.thePaths.getPictureCount() - 1; i++) {
					if (this.thePaths.getPictureInfo(i, "path") != j && yy == false) {
						sql.push("UPDATE picPathsTable SET picorder = " + (i + 1) + " WHERE pkey = " + this.thePaths.getPictureInfo(i, "pkey") + ";");
						this.thePaths.setPictureInfo(i, "index", i + 1);
					}
					else {
						yy = true
						if (this.thePaths.getPictureInfo(i, "path") != j) {
							sql.push("UPDATE picPathsTable SET picorder = " + (i) + " WHERE pkey = " + this.thePaths.getPictureInfo(i, "pkey") + ";");
							this.thePaths.setPictureInfo(i, "index", i);
						}
					}
				}
			}
			this.fillEditPicPane(oldDex);
	    	this.thePaths.orderArray("pictures");
	        this.$.fileList.refresh();
	        if (sql.length > 500) {
	        	this.needSave = true;
				this.$.unsaved.setShowing(true);
			}
			else {
				this.doDataToSave(sql);
			};
		};
	},
	fillEditPicPane: function(x) {
		this.$.itemIndex.setContent(x)//this.thePaths.getPictureInfo(x, "index"));
		 
	    if (parseInt(this.thePaths.getPictureInfo(x, "captionlocation")) == 0) {
	    	this.$.capLocPicker.setValue("Bottom");
	    }
	    else {
	    	this.$.capLocPicker.setValue("Top");
	    };
	    
	    	    
	    
	    this.$.picRotation.setValue(this.thePaths.getPictureInfo(x,"rotate"))   
	    
	   	var cColor = this.thePaths.getPictureInfo(x, "captioncolor")
	   	cColor = VerifyHexColor(cColor);
	    this.$.colorPreview.setStyle("background:" + cColor + ";width:100px;height:50px;border-radius:10px;margin-right: 10px;border:1px solid black;");
	    this.$.colorSelector.setCurrentColor(cColor)
	    this.$.colorSelector.setValue(cColor)

	    this.$.picFontSize.setValue (this.thePaths.getPictureInfo(x, "fontsize"));
	    
	    if (x + 1 < this.thePaths.getPictureCount()) {
	    	var y = x + 1;
	    } 
	    else{
	    	var y = 0
	    };
	    var sPath = this.thePaths.getPictureInfo(x,"path");

	    this.$.fileName.setContent(sPath.substr(sPath.lastIndexOf("/") + 1));

	    var obj = {
	    	value: this.thePaths.getPictureInfo(x,"transition"),
	        speed: this.thePaths.getPictureInfo(x,"tspeed"),
	        firstSrc: sPath,
	        secondSrc: this.thePaths.getPictureInfo(y,"path")
	    };
	    this.log(obj)
	    this.$.transPicker.setSettings(obj);

 		var panObj = {}
		// this.$.picPanSetting.setValue(this.thePaths.getSetting(this.currentFile, "picpansetting"));
		panObj.value = parseInt(this.thePaths.getPictureInfo(x, "pan"));
		panObj.dir = parseInt(this.thePaths.getPictureInfo(x, "pandirection"));
		panObj.firstSrc = sPath
		panObj.secondSrc = ""
		this.$.addPanPicker.setSettings(panObj)

 		/*this.$.panPicker.setValue (this.thePaths.getPictureInfo(x, "pan"));
	    this.$.panLocation.setValue (this.thePaths.getPictureInfo(x, "pandirection"));
	    setPanPicker(this.$.panPicker, this.$.panLocation, this.$.loc1, this.$.loc2);*/


	    t = this.thePaths.getPictureInfo(x, "delay")
	    var t1 = t.substr(0,t.length - 1)
	    t = t.substr(t.length-1,1)
	    if (t == "s") {
	    	this.$.editScalePicker.setValue("seconds");
	    	this.$.editDurPicker.setMin(8);
	    }
	    else {
	    	this.$.editScalePicker.setValue("minutes");
	    	this.$.editDurPicker.setMin(1);
	    }
	    this.$.editDurPicker.setValue(parseInt(t1));
	    
	    t = this.thePaths.getPictureInfo(x, "stretch")
	    this.$.editCaption.setValue(this.thePaths.getPictureInfo(x, "caption"));
	    if (t == "1") {
			this.$.stretchMode.setChecked(true);
		}
		else {
			this.$.stretchMode.setChecked(false);
		};
		this.log("@@@=====================>>>>>>>>>" + this.$[this.lastItems[this.currentItem].name].textDrawn)
		if (this.$[this.lastItems[this.currentItem].name].textDrawn == false) {
			this.drawCapPreview(x);
		}
	    
	},
	reDrawCaption: function(iS, iE) {
		var x = iS.name
		x = x.replace("canvas", "")
		if (parseInt(x) == this.currentItem) {
			x = "item" + x
			this.$[x].textDrawn = false
			this.drawCapPreview(this.$[x].iIndex)
		}
	},
	drawCapPreview: function(x) {
		var s = this.thePaths.getPictureInfo(x, "caption");
		var cName = this.lastItems[this.currentItem].components[0].name;
		this.log(s)
		this.log(cName)
		if (s.length > 0) {
			var cappos =  this.thePaths.getPictureInfo(x, "captionlocation");//this.picCapList[this.activeIndex];
			var sIze = this.thePaths.getPictureInfo(x, "fontsize");
			var w = window.innerWidth;
			var ratio = w - 500;
			ratio = ratio / w;
			sIze = sIze * ratio;
			this.$[cName].setTextFont(sIze + "pt Prelude");
			this.$[cName].setTextColor(this.thePaths.getPictureInfo(x, "captioncolor"));
			var textDims = this.$[cName].getStringHeight(s,Number(sIze) + 5);
			var x = 0;
			if (parseInt(cappos) == 0) {
				x = 375 - textDims.height;
				if (x <= 10) {
					do {
						sIze = sIze - 2;
						this.$[cName].setTextFont(sIze + "pt Prelude");
						textDims = this.$[cName].getStringHeight(s,Number(sIze) + 5);
						x = 375 - textDims.height;
					}
					while (x < 10 || sIze <= 5)
				};
			}
			else {
				x = 5 + Number(sIze);
				if (x + textDims.height >= 375) {
					do {
						sIze = sIze - 2
						this.$[cName].setTextFont(sIze + "pt Prelude");
						textDims = this.$[cName].getStringHeight(s,Number(sIze) + 5);
						x = 5 + Number(sIze);
					}
					while (x + textDims.height > 375 || sIze <= 5)
				};
			};
			this.log(s + ", " + x + ", " + sIze)
			this.$[cName].drawText( s, 10, x, Number(sIze) + 5);
		}
		else {
			this.$[cName].drawText( s, 0, 0, 1);
		}
		this.$[this.lastItems[this.currentItem].name].textDrawn = true
	},
	
	saveItemSettings: function(iS, iE) {
		if (parseInt(this.actualIndex) > -1) {
			var j = this.thePaths.getPictureInfo(this.actualIndex, "path");
			var inDex = parseInt(this.$.itemIndex.getContent());
			var sql = []
			var sDelay = ""
			var	sStretch = ""
			var	sTrans = ""
			var	sCapCol = ""
			var	sLoc = ""
			var	sCap = ""
			var	sOrder = ""
			var	sCapSty = "";
			var oldDex = this.thePaths.getPictureInfo(this.actualIndex, "index");
			if (parseInt(inDex) != parseInt(oldDex)) {
				sql.push("UPDATE picPathsTable SET picorder = " + inDex + " WHERE pkey = " + this.thePaths.getPictureInfo(this.actualIndex, "pkey") + ";");
				this.thePaths.setPictureInfo(this.actualIndex, "index", inDex);
			};

			var c = this.$.editCaption.getValue();
			if (c != this.thePaths.getPictureInfo(this.actualIndex, "caption")) {
				sql.push("UPDATE picPathsTable SET piccaption = '" + c + "' WHERE pkey = " + this.thePaths.getPictureInfo(this.actualIndex, "pkey") + ";");
				this.thePaths.setPictureInfo(this.actualIndex, "caption",c);
				this.$[this.lastItems[this.currentItem].name].textDrawn = false;
			};
			
			var b = "";
			if (this.$.capLocPicker.getValue() == "Bottom") {
				b = "0";
			}
			else {
				b = "1";
			};
			
			if (b != this.thePaths.getPictureInfo(this.actualIndex, "captionlocation")) {
				this.thePaths.setPictureInfo(this.actualIndex, "captionlocation",b);
				this.$[this.lastItems[this.currentItem].name].textDrawn = false;
				//this.setColor("", this.$.colorSelected.getValue());
				sql.push("UPDATE picPathsTable SET piccaploc = '" + b + "' WHERE pkey = " + this.thePaths.getPictureInfo(this.actualIndex, "pkey") + ";");
			};
			
			var panObj = this.$.addPanPicker.getSettings();
			c = "pan:" + panObj.value.toString() + "{";
			c = c + "dir:" + panObj.dir.toString() + "{";

			var newSiz = this.$.picFontSize.getValue();
			var prevSiz = this.thePaths.getPictureInfo(this.actualIndex, "fontsize");
			c = c + "siz:" + newSiz.toString() + "{";
			if (parseInt(prevSiz) != parseInt(newSiz)) {
				this.$[this.lastItems[this.currentItem].name].textDrawn = false;
			}

			var newRot = this.$.picRotation.getValue();
			var prevRot = this.thePaths.getPictureInfo(this.actualIndex, "rotate");
			c = c + "rot:" + newRot.toString() + "{";
			if (parseInt(prevRot) != parseInt(newRot)) {
				this.$[this.lastItems[this.currentItem].name].textDrawn = false;
				this.$[this.lastItems[this.currentItem].components[0].name].setPicRotate(parseInt(newRot));
			}
			
			
			var obj = this.$.transPicker.getSettings();
			c = c + "tsp:" + obj.speed.toString() + "{";

			var cFlags = this.thePaths.getPictureInfo(this.actualIndex, "flags");
			if (c != cFlags) {
				sql.push("UPDATE picPathsTable SET captionstyle = '" + c + "' WHERE pkey = " + this.thePaths.getPictureInfo(this.actualIndex, "pkey") + ";");
				this.thePaths.setPictureInfo(this.actualIndex, "tspeed",  obj.speed);
				this.thePaths.setPictureInfo(this.actualIndex, "rotate", newRot);	
				this.thePaths.setPictureInfo(this.actualIndex, "fontsize",newSiz);
				this.thePaths.setPictureInfo(this.actualIndex, "pandirection",panObj.dir);
				this.thePaths.setPictureInfo(this.actualIndex, "pan",panObj.value);
			}
			//enyo.log(sCapSty)
			
			b = this.$.colorSelector.getValue();
			if (b.length < 4) {b = "#000000"};
			if (b != this.thePaths.getPictureInfo(this.actualIndex, "captioncolor")) {
				sql.push("UPDATE picPathsTable SET captioncolor = '" + b + "' WHERE pkey = " + this.thePaths.getPictureInfo(this.actualIndex, "pkey") + ";");
				this.thePaths.setPictureInfo(this.actualIndex, "captioncolor",b);
				this.$[this.lastItems[this.currentItem].name].textDrawn = false
			};

			if (iS && iS.name == "colorSelector") {
				b = VerifyHexColor(b);
			    this.$.colorPreview.setStyle("background:" + b + ";width:100px;height:50px;border-radius:10px;margin-right: 10px;border:1px solid black;");
			    this.$.colorSelector.setCurrentColor(b)
			    this.$.colorSelector.setValue(b)
			}

			//enyo.log("1")
			b = obj.value
			if (b != this.thePaths.getPictureInfo(this.actualIndex, "transition")) {
				sql.push("UPDATE picPathsTable SET transition = '" + b + "' WHERE pkey = " + this.thePaths.getPictureInfo(this.actualIndex, "pkey") + ";");
				this.thePaths.setPictureInfo(this.actualIndex, "transition",b);
			};
			
			//enyo.log("2")
			b = this.$.stretchMode.getChecked();
			if (b == true) {
				b = "1";
			}
			else {
				b = "0";
			};
			if (b != this.thePaths.getPictureInfo(this.actualIndex, "stretch")) {
				sql.push("UPDATE picPathsTable SET stretch = '" + b + "' WHERE pkey = " + this.thePaths.getPictureInfo(this.actualIndex, "pkey") + ";");
				this.thePaths.setPictureInfo(this.actualIndex, "stretch",b);
				this.$[this.lastItems[this.currentItem].name].textDrawn = false;
				this.$[this.lastItems[this.currentItem].components[0].name].setStretch(this.$.stretchMode.getChecked());
			};
			//enyo.log("3")		
			b = this.$.editDurPicker.getValue();
			c = this.$.editScalePicker.getValue();
			if (c == "minutes") {
				this.$.editDurPicker.setMin(1);
			}
			else {
				this.$.editDurPicker.setMin(8);
			}
			c = c.substr(0,1);
			if (c == "s" && Number(b) < 5) {b = "5";};
			b = b + c;
			if (b != this.thePaths.getPictureInfo(this.actualIndex, "delay")) {
				sql.push("UPDATE picPathsTable SET delay = '" + b + "' WHERE pkey = " + this.thePaths.getPictureInfo(this.actualIndex, "pkey") + ";");
				this.thePaths.setPictureInfo(this.actualIndex, "delay",b);
			};
			//enyo.log("4")
			var s = ""
			var i = 0
			var sqlIndex = []
			if (inDex != oldDex) {
				if (oldDex < inDex) {
					for (i = inDex; i > oldDex; i--) {
						if (this.thePaths.getPictureInfo(i, "path") != j) {
							sqlIndex.push("UPDATE picPathsTable SET picorder = " + (i - 1) + " WHERE pkey = " + this.thePaths.getPictureInfo(i, "pkey") + ";");
							this.thePaths.setPictureInfo(i, "index", i-1);
						}
					}
				}
				else {
					//this.INDEXI = inDex
				    //this.indexCallerDelete()
					var yy = false
					for (i = inDex; i <= this.thePaths.getPictureCount() - 1; i++) {
						if (this.thePaths.getPictureInfo(i, "path") != j && yy == false) {
							sqlIndex.push("UPDATE picPathsTable SET picorder = " + (i + 1) + " WHERE pkey = " + this.thePaths.getPictureInfo(i, "pkey") + ";");
							this.thePaths.setPictureInfo(i, "index", i + 1);
						}
						else {
							yy = true
							if (this.thePaths.getPictureInfo(i, "path") != j) {
								sqlIndex.push("UPDATE picPathsTable SET picorder = " + (i) + " WHERE pkey = " + this.thePaths.getPictureInfo(i, "pkey") + ";");
								this.thePaths.setPictureInfo(i, "index", i);
							}
						}
					}
				}
			}
			//enyo.log("5")
			//setPanPicker(this.$.panPicker, this.$.panLocation, this.$.loc1, this.$.loc2);
			//enyo.log(enyo.json.stringify(this.db))
			
			
			this.thePaths.orderArray("pictures");
			
			/*
			for (i = 0;i <= this.thePaths.getPictureCount() - 1; i++) {
					if (this.thePaths.getPictureInfo(i, "path") == j) {
						this.selectedRow = i;
						break;
					}
				
			};
			if (this.beSilent == 0) {
				this.$.fileList.refresh();
				if (this.thePaths.getPictureCount() > 5 && this.thePaths.getPictureCount() < 500) {
					//this.$.fileList.scrollToIdx(this.selectedRow)
					this.scrollTo(this.selectedRow)
				};
			};*/
			
			if (sqlIndex.length > 500) {
				this.needSave = true;
				this.$.unsaved.setShowing(true);
			}
			else {
				sql = sql.concat(sqlIndex);
			}
			if (this.$[this.lastItems[this.currentItem].name].textDrawn == false) {
				this.$[this.lastItems[this.currentItem].components[0].name].drawPicture();
				this.drawCapPreview(this.actualIndex);
			};
			i = sql.length
			this.doDataToSave(sql);
			return i;
			//if (sOrder.length == 0) {
				//this.$.progress.stopAni();
				//this.$.progress.close();
			//}
		};
	},
	reIndex: function() {
		var sqlIndex = []
		enyo.scrim.show();
		for (i = 0; i <= this.thePaths.getPictureCount() - 1; i++) {
			sqlIndex.push("UPDATE picPathsTable SET picorder = " + this.thePaths.getPictureInfo(i, "index") + " WHERE pkey = " + this.thePaths.getPictureInfo(i, "pkey") + ";"); //\"" + this.thePaths.getPictureInfo(i, "path") + "\" AND filename = \"" + this.currentFile + "\";");
		};
		enyo.scrim.hide();
		this.log(sqlIndex.length)
		this.doDataToSave(sqlIndex);
	},
	lastSrollSpot: 0,
	scrollTo:function(inIndex){
		//if (whichSrc == 0) {
			var scr=this.$.imageList.$.scroller;
		/*}
		else if (whichSrc == 1){
			var scr=this.$.audFileList.$.scroller;
		}
		else if (whichSrc == 2){
			var scr=this.$.exhibitionFiles.$.scroller;
		}*/
		inIndex = inIndex - 2;
		if (inIndex < 0) {inIndex = 0;};
		var scrollSpot=0;
		for (var h in scr.heights) {
			if (h) {
				scrollSpot=scr.heights[h] * inIndex;
				break;
			}
		}
		/*var x = (this.lastItems.length * 75 - window.innerWidth + scr.$.scroll.getScrollPosition())
		if (x < 0) { x= 0}
		if (scrollSpot > x) {scrollSpot = x}*/
		/*scr.$.scroll.setAutoMode()
		var x = scr.$.scroll.getRealRightBoundry()
		this.log("@@@==========>>>>>>>>>>>>" + x + "," + scrollSpot)
		if (scrollSpot > -x) {scrollSpot = -x - 2}
		this.log("@@@==========>>>>>>>>>>>>" + x + "," + scrollSpot)*/
		if (this.lastItems.length < 14) {
			var limit = 14
		}
		else {
			var limit = 354
		}
		if (scrollSpot > limit) {scrollSpot = limit}
			this.log("@@@==========>>>>>>>>>>>>" + limit + "," + scrollSpot)
		//if (x - scrollSpot > ) {scrollSpot = x}
		/*if (-x + window.innerWidth - 200 > scrollSpot) {
			scr.$.scroll.setScrollPosition(-scrollSpot);
			scr.start();
		}*/
		//this.log(x + "," + scr.$.scroll.getRightBoundary())
		scr.$.scroll.setScrollPosition(-scrollSpot);
		scr.start();
		/*if (x > scr.$.scroll.getRightBoundary() - 2) {
			x = x - (wndWidth * 0.90)
			scr.$.scroll.setScrollPosition(x);
			scr.start();
		}*/
		//this.log("@@@==========>>>>>>>>>>>>" + x + "," + scrollSpot)
		/*if (this.lastItems.length < 14) {
			var limit = 290
		}
		else {
			var limit = 700
		}
		if (scrollSpot < limit) {*/
			//scr.$.scroll.setScrollPosition(-scrollSpot);
			//scr.adjustTop(10)
			//scr.start();
		//}
		//this.$.fileList.refresh();
		
	  },
	  deletePicItem: function(inSender, inIndex) {
		var sql = []
		inIndex = this.lastItems[inIndex].iIndex
		sql.push("DELETE FROM picPathsTable WHERE pkey = " + this.thePaths.getPictureInfo(inIndex, "pkey") + ";");
		var s = "";
		if (inIndex  != this.thePaths.getPictureCount() - 1 ){
			for (var i = inIndex +1; i < this.thePaths.getPictureCount(); i++) {
				this.thePaths.setPictureInfo(i, "index", i - 1);
				sql.push("UPDATE picPathsTable SET picorder = " + (i - 1) + " WHERE pkey = " + this.thePaths.getPictureInfo(i, "pkey") + ";");
			};
		};
		this.thePaths.deletePictureItem(inIndex);
		//this.$.itemIndex.setMax(this.$.thePaths.getPictureCount()-1);
		
		this.$.picHeaderContent.setContent("Edit Pictures: " + this.thePaths.getPictureCount() + " pictures");
		if (inIndex == this.actualIndex) {this.actualIndex--};
		if (this.actualIndex < 0) {this.actualIndex = 0};
		this.loadItemsView();
		this.doDataToSave(sql);
		/*//if (this.$.thePaths.getPictureCount() > 100) {
		//this.$.progress.openAtCenter();
		//this.$.progress.startAni();
		//this.$.progress.setMessage("Re-Indexing...");
		if (this.reindexing == -1) {
			this.reindexing = this.INDEXI
			enyo.nextTick(this,this.indexCallerDelete)
			
		}
		else {
			if (this.INDEXI > this.reindexing) { this.INDEXI = this.reindexing}
			
		}*/
	},
});

enyo.kind({
	name: "IndexPicker", 
	kind:"Toaster",
	className:"editListItem", 
	flyInFrom: "left",
	style: "width:400px;height:400px;",
	//flex:1,
	published: {
		currentIndex: 0
	},
	events: {
		onIndexSelected: ""
	},
	components: [
		{kind: "VFlexBox", flex:1, components:[
			{kind: "Input", name: "selectedVal", hint: "Enter an index number...", alwaysLooksFocused: true,autoKeyModifier: "num-single"},
			{kind: "HFlexBox", components:[
				{kind: "Button", caption: "1", onclick: "insertNumber", className: "indexPopupButtons", style: "margin-right:18px;"},
				{kind: "Button", caption: "2", onclick: "insertNumber", className: "indexPopupButtons", style: "margin-right:18px;"},
				{kind: "Button", caption: "3", onclick: "insertNumber", className: "indexPopupButtons"}
			]},
			{kind: "HFlexBox", components:[
				{kind: "Button", caption: "4", onclick: "insertNumber", className: "indexPopupButtons", style: "margin-right:18px;"},
				{kind: "Button", caption: "5", onclick: "insertNumber", className: "indexPopupButtons", style: "margin-right:18px;"},
				{kind: "Button", caption: "6", onclick: "insertNumber", className: "indexPopupButtons"}
			]},
			{kind: "HFlexBox", components:[
				{kind: "Button", caption: "7", onclick: "insertNumber", className: "indexPopupButtons", style: "margin-right:18px;"},
				{kind: "Button", caption: "8", onclick: "insertNumber", className: "indexPopupButtons", style: "margin-right:18px;"},
				{kind: "Button", caption: "9", onclick: "insertNumber", className: "indexPopupButtons"}
			]},
			{kind: "HFlexBox", components:[
				{kind: "Button", caption: "0", flex:1, onclick: "insertNumber", style: "font-size: 150%;font-weight:bold;"},
				//{kind: "Button", caption: "2", onclick: "insertNumber"},
				{kind: "Button", caption: "C",className: "enyo-button-negative indexPopupButtons", onclick: "clearNumbers"}
			]},
			{kind: "HFlexBox", style: "margin-top:10px;", components:[
	            {kind: "Button", caption: "Cancel", onclick: "closeMe"},
	            {kind: "Button", caption: "OK", className: "enyo-button-affirmative", flex:1, onclick: "sendValue"}
            ]}
		]}
	],
	rendered: function() {
		this.inherited(arguments)
		this.currentIndexChanged();
	},
	currentIndexChanged: function() {
		this.$.selectedVal.setValue("")//this.currentIndex)
	},
	insertNumber: function(iS, iE) {
		var s = this.$.selectedVal.getValue();
		s = s + iS.caption;
		this.$.selectedVal.setValue(s);
	},
	clearNumbers: function() {
		this.$.selectedVal.setValue("");
	},
	closeMe: function() {
		this.close();
	},
	sendValue: function() {
		this.close();
		this.doIndexSelected(this.$.selectedVal.getValue());
	},
});