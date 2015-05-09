enyo.kind({
	name: "dataControl",
	kind: "Component",
	published: {
		db: "",
		dbname: "",
		dbver: "1.0",
		dbdes: "",
		dbSiz: 64000,
		dbcols: "",
		dbtable: "",
		loaded: false
	},
	events: {
		onDataCompleted: "",
		onDataCompletedCustom: "",
		onLoaded: "",
		onAddCompleted: "",
		onDatabaseChange: "",
		onFinishSaveAs: "",
		onDataStarted: "",
		onDataFinish: ""
	},
	components: [],
	loadDatabase: function(sName, sVer, sDes, sSiz, sTable, T1, T2){
		this.db = undefined
		this.dbname = sName;
		this.dbver = sVer;
		this.dbdes = sDes;
		this.dbSiz = Number(sSiz);
		this.dbtable = sTable;
		//try {
			this.db = openDatabase(this.dbname, this.dbver, this.dbdes, this.dbsiz);
			this.log(this.db)
			for (j in this.db) {
				this.log("DB:" + j)
			}
			window.setTimeout(enyo.bind(this,function() {
				this.db.transaction( 
			        enyo.bind(this,(function (transaction) { 
			        	this.log("0")
			        	transaction.executeSql(this.dbtable, [], [], []); 
			        	transaction.executeSql(T1, [], [], []); 
			        	transaction.executeSql(T2, [], [], []); 
			        	this.log("1")
			        	this.loaded = true
			        	this.doLoaded();
			        	this.log("2")
			        })));	
			}), 100);
			
		/*}
		catch (e){
			this.log(enyo.json.stringify(e))
		}*/

	},
	getData: function(sql) {
		this.db.transaction( 
		        enyo.bind(this,(function (transaction) {
		        	
			          transaction.executeSql(sql, [], enyo.bind(this,this.dataResults), []); 
		        	
		        }))
		    );
	},
	dataResults: function(t,r){
		//enyo.log(enyo.json.stringify(t));
		this.doDataCompleted(r);
	},


	bulkData: [],
	finalLoop: 0,
	countLoop: 0,
	getDataBulk: function(sql) {
		this.bulkData = []
		this.finalLoop = sql.length
		this.countLoop = 0
		
		this.db.transaction( 
		        enyo.bind(this,(function (transaction) {
		        	for (var i = 0; i < sql.length; i++) {
		        		transaction.executeSql(sql[i], [], enyo.bind(this,this.dataResultsBulk), enyo.bind(this,this.errorFun)); 
		        	};
			          
		        	
		        }))
		    );
	},
	errorFun: function(t, r) {
		this.log(enyo.json.stringify(r))
	},
	dataResultsBulk: function(t,r){
		//enyo.log(enyo.json.stringify(t));
		this.bulkData.push(r)
		this.countLoop++
		if (this.countLoop >= this.finalLoop) {
			this.doDataCompleted(this.bulkData);
		}
		this.log(this.bulkData.length)
	},
	bulkDataCustom: [],
	finalLoopCustom: 0,
	countLoopCustom: 0,
	getDataBulkCustom: function(sql) {
		this.bulkDataCustom = []
		this.finalLoopCustom = sql.length
		this.countLoopCustom = 0
		this.db.transaction( 
		        enyo.bind(this,(function (transaction) {
		        	for (var i = 0; i < sql.length; i++) {
		        		transaction.executeSql(sql[i], [], enyo.bind(this,this.dataResultsBulkCustom), []); 
		        	};
			          
		        	
		        }))
		    );
	},
	dataResultsBulkCustom: function(t,r){
		//enyo.log(enyo.json.stringify(t));
		this.bulkDataCustom.push(r)
		this.countLoopCustom++
		if (this.countLoopCustom >= this.finalLoopCustom) {
			this.doDataCompletedCustom(this.bulkDataCustom);
		}
		this.log(this.bulkDataCustom.length + "," + this.countLoopCustom + "," + this.finalLoopCustom)
	},

	addRecord: function(sql) {
		this.db.transaction( 
		        enyo.bind(this,(function (transaction) {
		        	
			          transaction.executeSql(sql, [], [], []); 
		        	  this.doAddCompleted();
		        }))
		    );
		this.doDatabaseChange();
	},
	deleteRecord: function(sql) {
		this.db.transaction( 
		        enyo.bind(this,(function (transaction) {
		        	
			          transaction.executeSql(sql, [], [], []); 
		        	  //this.doAddCompleted()
		        }))
		    );
		this.doDatabaseChange();
	},
	updateRecord: function(sql) {
		this.db.transaction( 
		        enyo.bind(this,(function (transaction) {
		        	
			          transaction.executeSql(sql, [], [], []); 
		        	  //this.doAddCompleted()
		        }))
		    );
		this.doDatabaseChange();
	},
	updateRecordBulk: function(sql) {
		this.db.transaction( 
		        enyo.bind(this,(function (transaction) {
		        	for (var i = 0;i < sql.length;i++) {
			            transaction.executeSql(sql[i], [], [], []);
		        	};

		            //this.doAddCompleted()
		        }))
		    );
		this.doDatabaseChange();
	},
	updateRecordBulkNoEvent: function(sql, running) {
		

		this.db.transaction( 
		        enyo.bind(this,(function (transaction) {

		        	for (var i = 0;i < sql.length;i++) {
		        		if (running != 1) {this.doDataStarted();};	
			            if (i < sql.length - 1) {
			            	transaction.executeSql(sql[i], [], [], []);
			            }
			            else {
			            	transaction.executeSql(sql[i], [], enyo.bind(this,function(t,r) {
			            		this.doDataFinish();
			            	}), []);	
			            }
		        	};
		        	return true;
		            //this.doAddCompleted()
		        }))
		    );
		
	},
	updateRecordSaveAs: function(sql) {
		this.doDataStarted();
		this.db.transaction( 
		        enyo.bind(this,(function (transaction) {

		        	for (var i = 0;i < sql.length;i++) {
		        		if (i < sql.length - 1) {
			            	transaction.executeSql(sql[i], [], [], []);
			            }
			            else {
			            	transaction.executeSql(sql[i], [], enyo.bind(this,function(t,r) {
			            		this.doFinishSaveAs();
					        	this.doDataFinish();
			            	}), []);	
			            }
		        	};
		        }))
		    );
	},
	updateFullData: function(sql) {
		this.db.transaction( 
		        enyo.bind(this,(function (transaction) {
		        	for (var i = 0;i < sql.length;i++) {
			            transaction.executeSql(sql[i], [], [], []);
		        	};
		        	this.doLoaded();
		        }))
		    );
	}
})