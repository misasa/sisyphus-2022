var sqlite = {};
sqlite.Db = function(dbName, createSqlList) {
    this.dbName = dbName;

    this.open = function() {
      this.db = Titanium.Database.open(this.dbName);
    };

    this.close = function() {
      this.db.close();
    };

    this.open();
    for(var i = 0; i < createSqlList.length; i++) {
        this.db.execute(createSqlList[i]);
    }
    this.close();
};

sqlite.sisyphus = new sqlite.Db('sisyphus',
    [
        'create table if not exists histories (global_id text, name text, physical_form_name text, box_type_name text, thumbnail_path text, loaded_at integer)'
    ]
);

export { sqlite };