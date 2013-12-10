window.dao =  {

    syncURL: "http://www.devba.be/android/syncArticles.php",

    initialize: function(callback) {
        var self = this;
        this.db = window.openDatabase("syncdemodb", "1.0", "Sync Demo DB", 200000);

        // Testing if the table exists is not needed and is here for logging purpose only. We can invoke createTable
        // no matter what. The 'IF NOT EXISTS' clause will make sure the CREATE statement is issued only if the table
        // does not already exist.
        this.db.transaction(
            function(tx) {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='Articles'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
                            log('Using existing articles table in local SQLite database');
                        }
                        else
                        {
                            log('articles table does not exist in local SQLite database');
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
				"CREATE TABLE IF NOT EXISTS Articles (" +
				"Num INTEGER PRIMARY KEY AUTOINCREMENT, " +
				"Id VARCHAR(50), " +
				"Description varchar(200), " +
				"Prix REAL, " +
				"bDel INTEGER, " +
				"LastModif VARCHAR(50))";
					
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
                log('Table articles successfully CREATED in local SQLite database');
                callback();
            }
        );
    },

    dropTable: function(callback) {
        this.db.transaction(
            function(tx) {
                tx.executeSql('DROP TABLE IF EXISTS Articles');
            },
            this.txErrorHandler,
            function() {
                log('Table articles successfully DROPPED in local SQLite database');
                callback();
            }
        );
    },

    findAll: function(callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM Articles";
                log('Local SQLite database: "SELECT * FROM Articles"');
                tx.executeSql(sql, this.txErrorHandler,
                    function(tx, results) {
                        var len = results.rows.length,
                            articles = [],
                            i = 0;
                        for (; i < len; i = i + 1) {
                            articles[i] = results.rows.item(i);
                        }
                        log(len + ' rows found');
                        callback(articles);
                    }
                );
            }
        );
    },

    getLastSync: function(callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT MAX(LastModif) as lastSync FROM Articles";
                tx.executeSql(sql, this.txErrorHandler,
                    function(tx, results) {
                        var lastSync = results.rows.item(0).lastSync;
                        log('Last local timestamp is ' + lastSync);
                        callback(lastSync);
                    }
                );
            }
        );
    },

    sync: function(callback) {
        var self = this;
        log('Starting synchronization...');
        this.getLastSync(function(lastSync){
            self.getChanges(self.syncURL, lastSync,
                function (changes) {
                    if (changes.length > 0) {
                        self.applyChanges(changes, callback);
                    } else {
                        log('Nothing to synchronize');
                        callback();
                    }
                }
            );
        });

    },

    getChanges: function(syncURL, modifiedSince, callback) {

        $.ajax({
            url: syncURL,
            data: {modifiedSince: modifiedSince},
            dataType:"json",
            success:function (data) {
                log("The server returned " + data.length + " changes that occurred after " + modifiedSince);
                callback(data);
            },
            error: function(request, model, response) {
                alert(request.responseText + " " +model + " " + response);
            }
        });

    },

    applyChanges: function(articles, callback) {
        this.db.transaction(
            function(tx) {
                var l = articles.length;
                var sql =
                    "INSERT OR REPLACE INTO Articles (Num, Id, Description, Prix, bDel, LastModif) " +
                    "VALUES (?, ?, ?, ?, ?, ?)";
                log('Inserting or Updating in local database:');
                var e;
                for (var i = 0; i < l; i++) {
                    e = articles[i];
                    log(e.Num + ' ' + e.Id + ' ' + e.Description + ' ' + e.Prix + ' ' + e.bDel + ' ' + e.LastModif);
                    var params = [e.Num, e.Id, e.Description, e.Prix, e.bDel, e.LastModif];
                    tx.executeSql(sql, params);
                }
                log('Synchronization complete (' + l + ' items synchronized)');
            },
            this.txErrorHandler,
            function(tx) {
                callback();
            }
        );
    },

    txErrorHandler: function(tx) {
        alert(tx.message);
    }
};

function renderList(articles) {
    log('Rendering list using local SQLite data...');
	var select = $('#Produits');
	if(select.prop) {
	  var options = select.prop('options');
	}
	else {
	  var options = select.attr('options');
	}
	$('option', select).remove();
    dao.findAll(function(articles) {
        $('#Produits').empty();
        var l = articles.length;
        for (var i = 0; i < l; i++) {
            var article = articles[i];
			if (article.bDel==0) {
				options[options.length] = new Option(article.Id + ' - ' + article.Description + ' - ' + article.Prix.toString() + ' €', article.Num);
			}
        }
    });
}

function log(msg) {
    $('#log').val($('#log').val() + msg + '\n');
}
