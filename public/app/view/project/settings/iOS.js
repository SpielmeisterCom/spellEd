Ext.define('Spelled.view.project.settings.iOS' ,{
    extend: 'Ext.form.Panel',
    alias: 'widget.projectiossettings',

    title : 'iOS',

    initComponent: function() {

        Ext.applyIf( this, {
                items: [

                ]
            }
        )

        this.callParent( arguments )
    },

    handleEditClick: function( view, rowIndex, colIndex, item, e, record ) {
        this.fireEvent( 'showContextMenu', record, e )
    },

    addHandler: function() {
        this.fireEvent( 'showAddLanguage', this )
    }
})