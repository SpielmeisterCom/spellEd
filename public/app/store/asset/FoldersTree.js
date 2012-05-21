Ext.define('Spelled.store.asset.FoldersTree', {
    extend: 'Ext.data.TreeStore',

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
    },

    root: {
        text: "Assets",
        expanded: true
    }
});