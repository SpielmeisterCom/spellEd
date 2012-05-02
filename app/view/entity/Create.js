Ext.define('Spelled.view.entity.Create' ,{
    extend: 'Ext.Window',
    alias: 'widget.createentity',

    title : 'Add a new Entity to the Zone',
    modal : true,

    items: [
        {
            bodyPadding: 10,
            xtype: 'form',
            items: [
                {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: 'Name',
                    anchor: '100%'
                },
                {
                    xtype: 'combobox',
                    name: 'entityBlueprint',
                    fieldLabel: 'Blueprint',
                    anchor: '100%'
                }
            ]
        }
    ],

    bbar: [
        {
            text: "Create",
            action: "createEntity",
            tooltip: {
                text:'Create a new Entity',
                title:'Create'
            }
        },
        {
            text: "Cancel",
            handler: function() {
                this.up('window').close()
            }
        }
    ]
});