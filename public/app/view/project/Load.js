Ext.define('Spelled.view.project.Load' ,{
    extend: 'Ext.Window',
    alias: 'widget.loadproject',

    title : 'Load an existing Project',
    modal : true,

    items: [
        {
            bodyPadding: 10,
            xtype: 'form',
            items: [
                {
                    xtype: 'combobox',
                    store: 'Projects',

                    valueField: 'id',
                    displayField:'name',
                    queryMode: 'proxy',
                    forceSelection: true,

                    typeAhead: true,
                    name: 'id',
                    fieldLabel: 'Select a Project',
                    anchor: '100%',
                    allowBlank:false
                }
            ],
            buttons: [
                {
                    text: "Load",
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