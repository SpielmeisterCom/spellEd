Ext.define('Spelled.view.project.settings.Web' ,{
    extend: 'Ext.form.Panel',
    alias: 'widget.projectwebsettings',

    title : 'Web',

    initComponent: function() {

        Ext.applyIf( this, {
                items: [
					{
						boxLabel: 'Generate HTML5 build',
						xtype: 'checkbox',
						inputValue: true,
						name: 'html5'
					},
					{
						boxLabel: 'Generate Flash build',
						xtype: 'checkbox',
						inputValue: true,
						name: 'flash'
					}
                ]
            }
        )

        this.callParent( arguments )
    }
})