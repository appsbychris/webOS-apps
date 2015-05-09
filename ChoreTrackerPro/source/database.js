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
		dbtable: ""
	},
	events: {
		onDataCompleted: "",
		onLoaded: "",
		onAddCompleted: "",
		onDatabaseChange: ""
	},
	components: [],
	loadDatabase: function(sName, sVer, sDes, sSiz, sTable){
		this.dbname = sName;
		this.dbver = sVer;
		this.dbdes = sDes;
		this.dbSiz = Number(sSiz);
		this.dbtable = sTable;
		try {
			this.db = openDatabase(this.dbname, this.dbver, this.dbdes, this.dbsiz);
			this.db.transaction( 
			        enyo.bind(this,(function (transaction) { 
			        	transaction.executeSql(this.dbtable, [], [], []); 
			        	this.doLoaded();
			        })));
		}
		catch (e){
			
		}
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
	updateRecordBulkNoEvent: function(sql) {
		this.db.transaction( 
		        enyo.bind(this,(function (transaction) {
		        	for (var i = 0;i < sql.length;i++) {
			            transaction.executeSql(sql[i], [], [], []);
		        	};
		            //this.doAddCompleted()
		        }))
		    );
		
	}
})