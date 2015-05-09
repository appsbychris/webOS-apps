enyo.kind({
    kind:"Pane",
    name:"SingleView",
    flex: 1,
    published: {
    	chores: "",
    	timeBy: "",
    	myDb: "",
    	scaleArray: ["years","months","weeks","days", "hours", "minutes"],
    	touchPad: 0,
    	inCustomView: false
    },
    events: {
    	onEditButton: "",
    	onCheckButton: "",
        onReorder: "",
        onTagChange: "",
        onDelete: ""
    },
    components:[
        //{layoutKind: "VFlexLayout", flex:2,components:[
            {kind: "ChoreList", name: "choreList0",onDelete: "doDelete", onInCustom: "setCustom", onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"}
       // ]}
    ],
    rendered: function() {
        this.inherited(arguments);
    },
    setCustom: function(iS,iE) {
        this.inCustomView = iE
        
    },
    tagsChanged: function(iS, iE) {
        var o = {
            sender: iS.name,
            values: iE
        };
        this.doTagChange(o);
    },
    toggleTagBar: function(b) {
        if (b == true) {
            this.$.choreList0.showTagLine()
        }
        else {
            this.$.choreList0.hideTagLine()
        };
    },
    setTags: function(o) {
        this.$.choreList0.setTags(o.singleView);
    },
    feedItem: function(index,sName,sDone,sLast,sPic, sNotes,sFlags, sTags) {
        if (index < 1) {
            this.$["choreList" + index.toString()].$.chores.feedItem(sName,sDone,sLast,sPic,sNotes,sFlags, sTags);
        };
    },
    feedCustomView: function(o) {
        this.$.choreList0.changeDisplay("", o)
    },
    clearList: function() {
        this.$.choreList0.clearItems();
    },
    updateList: function(punt) {
        this.$.choreList0.setTimeBy(this.timeBy);
        
        this.$.choreList0.setTouchPad(this.touchPad);

        if (this.touchPad == 0) {
            this.log("TOUCHPAD," + this.touchPad)
            this.$.choreList0.setAccelerated(false)
        }

        this.log("set LIST VARS")
        this.refreshList(punt);
    },
    updateTagList: function(t) {
        this.$.choreList0.setAllTags(t);
    },
    sortList: function(val) {
        
        switch (val) {
            case 3: {
                this.$.choreList0.$.chores.sortBy("abc");
                break;
            };
            case 1: {
                this.$.choreList0.$.chores.sortBy("danger");
                break;
            };
            case 4: {
                this.$.choreList0.$.chores.sortBy("recent");
                break;
            };
            case 2: {
                this.$.choreList0.$.chores.sortBy("index");
                break;
            };
            case 5: {
                this.$.choreList0.$.chores.sortBy("often");
                break;
            };
            case 0: {
                this.$.choreList0.$.chores.sortBy("today");
                break;
            };
        };
    },
    refreshList: function(punt) {
        this.$.choreList0.refreshList(punt, this.inCustomView);
    }
});

enyo.kind({
    kind:"Pane",
    name:"DoubleView",
    flex: 1,
    published: {
        chores: "",
        timeBy: "",
        myDb: "",
        scaleArray: ["years","months","weeks","days", "hours", "minutes"],
        touchPad: 0,
        inCustomView: {choreList0: false,
                       choreList1: false
        }
    },
    events: {
        onEditButton: "",
        onCheckButton: "",
        onReorder: "",
        onTagChange: "",
        onDelete: ""
    },
    components:[
        {layoutKind: "HFlexLayout", flex:1,components:[
            {kind: "ChoreList", name: "choreList0",onDelete: "doDelete",onInCustom: "setCustom", section: -1, onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"},
            {kind: "ChoreList", name: "choreList1",onDelete: "doDelete",onInCustom: "setCustom", section: 1,onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"}
        ]}
    ],
    rendered: function() {
        this.inherited(arguments);
    },
    setCustom: function(iS,iE) {
        this.inCustomView[iS.name] = iE
        
    },
    toggleTagBar: function(b) {
        if (b == true) {
            this.$.choreList0.showTagLine()
            this.$.choreList1.showTagLine()
        }
        else {
            this.$.choreList0.hideTagLine()
            this.$.choreList1.hideTagLine()
        };
    },
    updateTagList: function(t) {
        this.log(t)
        this.$.choreList0.setAllTags(t);
        this.$.choreList1.setAllTags(t);
    },
    tagsChanged: function(iS, iE) {
        var o = {
            sender: iS.name,
            values: iE
        };
        this.doTagChange(o);
    },
    setTags: function(o) {
        this.$.choreList0.setTags(o.singleView);
        this.$.choreList1.setTags(o.doubleView);
    },
    feedItem: function(index,sName,sDone,sLast,sPic, sNotes,sFlags, sTags) {
        if (index < 2) {
            this.$["choreList" + index.toString()].$.chores.feedItem(sName,sDone,sLast,sPic,sNotes,sFlags, sTags);
        };
    },
    clearList: function() {
        this.$.choreList0.clearItems();
        this.$.choreList1.clearItems();
    },
    updateList: function(punt) {
        this.$.choreList0.setTimeBy(this.timeBy);
        this.$.choreList0.setTouchPad(this.touchPad);
        this.$.choreList0.setViewMode(1);

        this.$.choreList1.setTimeBy(this.timeBy);
        this.$.choreList1.setTouchPad(this.touchPad);
        this.$.choreList1.setViewMode(1);

        this.log("set LIST VARS")
        this.refreshList(punt);
    },
    refreshList: function(punt) {
        this.$.choreList0.refreshList(punt, this.inCustomView.choreList0);
        this.$.choreList1.refreshList(punt, this.inCustomView.choreList1);
    }
});

enyo.kind({
    kind:"Pane",
    name:"TriView",
    flex: 1,
    published: {
        chores: "",
        timeBy: "",
        myDb: "",
        scaleArray: ["years","months","weeks","days", "hours", "minutes"],
        touchPad: 0,
        inCustomView: {choreList0: false,
                       choreList1: false,
                       choreList2: false
        }
    },
    events: {
        onEditButton: "",
        onCheckButton: "",
        onReorder: "",
        onTagChange: "",
        onDelete: ""
    },
    components:[
        {layoutKind: "HFlexLayout", flex:1,components:[
            {kind: "ChoreList", name: "choreList0",onDelete: "doDelete",onInCustom: "setCustom", section: -1, onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"},
            {kind: "ChoreList", name: "choreList1",onDelete: "doDelete",onInCustom: "setCustom", section: 2, onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"},
            {kind: "ChoreList", name: "choreList2",onDelete: "doDelete",onInCustom: "setCustom", section: 1, onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"}
        ]}
    ],
    rendered: function() {
        this.inherited(arguments);
    },
    setCustom: function(iS,iE) {
        this.inCustomView[iS.name] = iE
        
    },
    toggleTagBar: function(b) {
        if (b == true) {
            this.$.choreList0.showTagLine()
            this.$.choreList1.showTagLine()
            this.$.choreList2.showTagLine()
        }
        else {
            this.$.choreList0.hideTagLine()
            this.$.choreList1.hideTagLine()
            this.$.choreList2.hideTagLine()
        };
    },
    updateTagList: function(t) {
        this.$.choreList0.setAllTags(t);
        this.$.choreList1.setAllTags(t);
        this.$.choreList2.setAllTags(t);
    },
    tagsChanged: function(iS, iE) {
        var o = {
            sender: iS.name,
            values: iE
        };
        this.doTagChange(o);
    },
    setTags: function(o) {
        this.$.choreList0.setTags(o.singleView);
        this.$.choreList1.setTags(o.doubleView);
        this.$.choreList2.setTags(o.triView);
    },
    feedItem: function(index,sName,sDone,sLast,sPic, sNotes,sFlags, sTags) {
        if (index < 3) {
            this.$["choreList" + index.toString()].$.chores.feedItem(sName,sDone,sLast,sPic,sNotes,sFlags, sTags);
        };
    },
    clearList: function() {
        this.$.choreList0.clearItems();
        this.$.choreList1.clearItems();
        this.$.choreList2.clearItems();
    },
    updateList: function(punt) {
        this.$.choreList0.setTimeBy(this.timeBy);
        this.$.choreList0.setViewMode(2);

        this.$.choreList1.setTimeBy(this.timeBy);
        this.$.choreList1.setViewMode(2);

        this.$.choreList2.setTimeBy(this.timeBy);
        this.$.choreList2.setViewMode(2);

        this.log("set LIST VARS")
        this.refreshList(punt);
    },
    refreshList: function(punt) {
        this.$.choreList0.refreshList(punt, this.inCustomView.choreList0);
        this.$.choreList1.refreshList(punt, this.inCustomView.choreList1);
        this.$.choreList2.refreshList(punt, this.inCustomView.choreList2);
    }
});

enyo.kind({
    kind:"Pane",
    name:"QuadView",
    flex: 1,
    published: {
        timeBy: "",
        myDb: "",
        scaleArray: ["years","months","weeks","days", "hours", "minutes"],
        touchPad: 0,
        inCustomView: {choreList0: false,
                       choreList1: false,
                       choreList2: false,
                       choreList3: false
        }
    },
    events: {
        onEditButton: "",
        onCheckButton: "",
        onReorder: "",
        onTagChange: "",
        onDelete: ""
    },
    components:[
        
        {layoutKind: "HFlexLayout", flex:1,components:[
            {layoutKind: "VFlexLayout", flex:1,components:[
                {kind: "ChoreList",onDelete: "doDelete", name: "choreList0",onInCustom: "setCustom", section: 3, onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"},
                {kind: "ChoreList",onDelete: "doDelete", name: "choreList1",onInCustom: "setCustom", section: 4, onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"},
            ]},
            {layoutKind: "VFlexLayout", flex:1,components:[
                {kind: "ChoreList",onDelete: "doDelete", name: "choreList2",onInCustom: "setCustom", section: 5, onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"},
                {kind: "ChoreList",onDelete: "doDelete", name: "choreList3",onInCustom: "setCustom", section: 6, onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"}
            ]}
        ]}
    ],
    rendered: function() {
        this.inherited(arguments);
    },
    setCustom: function(iS,iE) {
        this.inCustomView[iS.name] = iE
        
    },
    toggleTagBar: function(b) {
        if (b == true) {
            this.$.choreList0.showTagLine()
            this.$.choreList1.showTagLine()
            this.$.choreList2.showTagLine()
            this.$.choreList3.showTagLine()
        }
        else {
            this.$.choreList0.hideTagLine()
            this.$.choreList1.hideTagLine()
            this.$.choreList2.hideTagLine()
            this.$.choreList3.hideTagLine()
        };
    },
    updateTagList: function(t) {
        this.$.choreList0.setAllTags(t);
        this.$.choreList1.setAllTags(t);
        this.$.choreList2.setAllTags(t);
        this.$.choreList3.setAllTags(t);
    },
    tagsChanged: function(iS, iE) {
        var o = {
            sender: iS.name,
            values: iE
        };
        this.doTagChange(o);
    },
    setTags: function(o) {
        this.$.choreList0.setTags(o.singleView);
        this.$.choreList1.setTags(o.doubleView);
        this.$.choreList2.setTags(o.triView);
        this.$.choreList3.setTags(o.quadView);
    },
    feedItem: function(index,sName,sDone,sLast,sPic, sNotes,sFlags, sTags) {
        if (index < 4) {
            this.$["choreList" + index.toString()].$.chores.feedItem(sName,sDone,sLast,sPic,sNotes,sFlags, sTags);
        };
    },
    clearList: function() {
        this.$.choreList0.clearItems();
        this.$.choreList1.clearItems();
        this.$.choreList2.clearItems();
        this.$.choreList3.clearItems();
    },
    updateList: function(punt) {
        this.$.choreList0.setTimeBy(this.timeBy);
        this.$.choreList0.setViewMode(1);

        this.$.choreList1.setTimeBy(this.timeBy);
        this.$.choreList1.setViewMode(1);

        this.$.choreList2.setTimeBy(this.timeBy);
        this.$.choreList2.setViewMode(1);

        this.$.choreList3.setTimeBy(this.timeBy);
        this.$.choreList3.setViewMode(1);

        this.log("set LIST VARS")
        this.refreshList(punt);
    },
    refreshList: function(punt) {
        this.$.choreList0.refreshList(punt, this.inCustomView.choreList0);
        this.$.choreList1.refreshList(punt, this.inCustomView.choreList1);
        this.$.choreList2.refreshList(punt, this.inCustomView.choreList2);
        this.$.choreList3.refreshList(punt, this.inCustomView.choreList3);
    }
});

enyo.kind({
    kind:"Pane",
    name:"SixView",
    flex: 1,
    published: {
        timeBy: "",
        myDb: "",
        scaleArray: ["years","months","weeks","days", "hours", "minutes"],
        touchPad: 0,
        inCustomView: {choreList0: false,
                       choreList1: false,
                       choreList2: false,
                       choreList3: false,
                       choreList4: false,
                       choreList5: false
        }
    },
    events: {
        onEditButton: "",
        onCheckButton: "",
        onReorder: "",
        onTagChange: "",
        onDelete: ""
    },
    components:[
        
        {layoutKind: "HFlexLayout", flex:1,components:[
            {layoutKind: "VFlexLayout", flex:1,components:[
                {kind: "ChoreList", name: "choreList0",onDelete: "doDelete",onInCustom: "setCustom", section: 3, onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"},
                {kind: "ChoreList", name: "choreList1",onDelete: "doDelete",onInCustom: "setCustom", section: 4, onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"},
            ]},
            {layoutKind: "VFlexLayout", flex:1,components:[
                {kind: "ChoreList", name: "choreList2",onDelete: "doDelete",onInCustom: "setCustom", section: 7, onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"},
                {kind: "ChoreList", name: "choreList3",onDelete: "doDelete",onInCustom: "setCustom", section: 8, onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"}
            ]},
            {layoutKind: "VFlexLayout", flex:1,components:[
                {kind: "ChoreList", name: "choreList4",onDelete: "doDelete",onInCustom: "setCustom", section: 5, onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"},
                {kind: "ChoreList", name: "choreList5",onDelete: "doDelete",onInCustom: "setCustom", section: 6, onEditButton: "doEditButton", onCheckButton: "doCheckButton", onReorder: "doReorder", onTagChange: "tagsChanged"}
            ]}
        ]}
    ],
    rendered: function() {
        this.inherited(arguments);
    },
    setCustom: function(iS,iE) {
        this.inCustomView[iS.name] = iE
        
    },
    toggleTagBar: function(b) {
        if (b == true) {
            this.$.choreList0.showTagLine()
            this.$.choreList1.showTagLine()
            this.$.choreList2.showTagLine()
            this.$.choreList3.showTagLine()
            this.$.choreList4.showTagLine()
            this.$.choreList5.showTagLine()
        }
        else {
            this.$.choreList0.hideTagLine()
            this.$.choreList1.hideTagLine()
            this.$.choreList2.hideTagLine()
            this.$.choreList3.hideTagLine()
            this.$.choreList4.hideTagLine()
            this.$.choreList5.hideTagLine()
        };
    },
    tagsChanged: function(iS, iE) {
        var o = {
            sender: iS.name,
            values: iE
        };
        this.doTagChange(o);
    },
    updateTagList: function(t) {
        this.$.choreList0.setAllTags(t);
        this.$.choreList1.setAllTags(t);
        this.$.choreList2.setAllTags(t);
        this.$.choreList3.setAllTags(t);
        this.$.choreList4.setAllTags(t);
        this.$.choreList5.setAllTags(t);
    },
    setTags: function(o) {
        this.$.choreList0.setTags(o.singleView);
        this.$.choreList1.setTags(o.doubleView);
        this.$.choreList2.setTags(o.triView);
        this.$.choreList3.setTags(o.quadView);
        this.$.choreList4.setTags(o.fiveView);
        this.$.choreList5.setTags(o.sixView);
    },
    feedItem: function(index,sName,sDone,sLast,sPic, sNotes,sFlags, sTags) {
        if (index < 6) {
            this.$["choreList" + index.toString()].$.chores.feedItem(sName,sDone,sLast,sPic,sNotes,sFlags, sTags);
        };
    },
    clearList: function() {
        this.$.choreList0.clearItems();
        this.$.choreList1.clearItems();
        this.$.choreList2.clearItems();
        this.$.choreList3.clearItems();
        this.$.choreList4.clearItems();
        this.$.choreList5.clearItems();
    },
    updateList: function(punt) {
        this.$.choreList0.setTimeBy(this.timeBy);
        this.$.choreList0.setViewMode(2);

        this.$.choreList1.setTimeBy(this.timeBy);
        this.$.choreList1.setViewMode(2);

        this.$.choreList2.setTimeBy(this.timeBy);
        this.$.choreList2.setViewMode(2);

        this.$.choreList3.setTimeBy(this.timeBy);
        this.$.choreList3.setViewMode(2);

        this.$.choreList4.setTimeBy(this.timeBy);
        this.$.choreList4.setViewMode(2);

        this.$.choreList5.setTimeBy(this.timeBy);
        this.$.choreList5.setViewMode(2);

        this.refreshList(punt);
    },
    refreshList: function(punt) {
        this.$.choreList0.refreshList(punt, this.inCustomView.choreList0);
        this.$.choreList1.refreshList(punt, this.inCustomView.choreList1);
        this.$.choreList2.refreshList(punt, this.inCustomView.choreList2);
        this.$.choreList3.refreshList(punt, this.inCustomView.choreList3);
        this.$.choreList4.refreshList(punt, this.inCustomView.choreList4);
        this.$.choreList5.refreshList(punt, this.inCustomView.choreList5);
    }
});