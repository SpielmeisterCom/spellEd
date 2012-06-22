Ext.define('Spelled.store.template.FoldersTree', {
    extend: 'Spelled.store.TemplatesTree',


    root: {
        text: 'Templates',
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
