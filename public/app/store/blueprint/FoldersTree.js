Ext.define('Spelled.store.blueprint.FoldersTree', {
    extend: 'Spelled.store.BlueprintsTree',


    root: {
        text: 'Blueprints',
        expanded: true
    },

    listeners: {
      load: function() {
          this.filter(
              Ext.create('Ext.util.Filter', {
                  filterFn: function( item ) {
                      return item.data.cls === 'folder';
                  }
              })
          )
      }
    }
});