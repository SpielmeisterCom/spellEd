Ext.define('Spelled.view.project.Load' ,{
    extend: 'Ext.Window',
    alias: 'widget.loadproject',

    title : 'Open an existing Project',
    modal : true,

	layout: 'fit',

    items: [
        {
            bodyPadding: 10,
            xtype: 'form',
            items: [
                {
                    xtype: 'combobox',
                    store: 'Projects',

                    valueField: 'name',
                    displayField:'name',
                    queryMode: 'proxy',
                    forceSelection: true,

                    typeAhead: true,
                    name: 'name',
                    fieldLabel: 'Select a Project',
                    anchor: '100%',
                    allowBlank:false
                }
            ],
            buttons: [
                {
                    text: "Open",
                    action: "loadProject",
                    formBind:true
                },
                {
                    text: "Cancel",
                    handler: function() {
                        this.up('window').close()
                    }
                }
            ]
        }
    ]
});
