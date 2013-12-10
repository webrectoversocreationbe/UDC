window.DB = {
    syncURL: "http://www.devba.be/android/sync.php",
    initialize: function(callback) {
        var self = this;
        this.db = window.openDatabase("syncdb", "1.0", "SyncDB", 20000000);
        this.db.transaction(
            function(tx) {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='Users'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
                            log('La table User existe');
                        } else {
                            log('La table User n\'existe pas');
                            self.createTable(callback);
                        }
                    });
            }
        )
    },
    createTable: function(callback) {
        this.db.transaction(
            function(tx) {
				var sql = 
				"CREATE TABLE IF NOT EXISTS Users (" +
				"Num INTEGER PRIMARY KEY AUTOINCREMENT, " +
				"User VARCHAR(50), " +
				"Psw varchar(50))"
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
                log('La table User à été créé');
                callback();
            }
        );
    },
    txErrorHandler: function(tx) {
        alert(tx.message);
    }
};
function log(msg) {
    $('#log').val($('#log').val() + msg + '\n');
}
