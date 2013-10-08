Ext.define('Spelled.view.ui.about.Modules' ,{
    extend: 'Ext.form.Panel',
    alias: 'widget.spelledaboutmodules',

    title : 'Modules',

    initComponent: function() {

        Ext.applyIf( this, {
            items: [

            ]
        })

        this.callParent( arguments )
    }
})