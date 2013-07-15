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
    }
})