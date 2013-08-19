Ext.define('Spelled.view.entity.Create' ,{
    extend: 'Ext.Window',
    alias: 'widget.createentity',

    title : 'Add Entity to Scene',
    modal : true,
	layout: 'fit',

	width: 500,

    items: [
        {
            bodyPadding: 10,
            xtype: 'form',
            items: [
                {
                    xtype: 'spelledtextfield',
					vtype: 'alphanum',
                    name: 'name',
                    fieldLabel: 'Name',
                    anchor: '100%',
                    allowBlank:false,
					validator: function( value ) {
						var ownerRecord = this.up( 'form' ).getRecord().getOwner()
						return this.isEntityNameValid( ownerRecord, value )
					}
                },
				{
					xtype: 'combobox',
					name: 'scene',
					queryMode: 'local',
					displayField: 'sceneId',

					listeners: {
						beforequery: function(qe){
							qe.query = new RegExp(qe.query, 'i')
							qe.forceAll = true
						}
					},

					matchFieldWidth : false,
					fieldLabel: 'Scene',
					emptyText: " -- Select a scene --",
					store: 'config.Scenes',
					anchor: '100%'
				},
				{
					xtype: 'hiddenfield',
					name: 'owner'
				},
				{
                    xtype: 'combobox',
					matchFieldWidth : false,
                    store: 'template.Entities',

					listeners: {
						beforequery: function(qe){
							qe.query = new RegExp(qe.query, 'i')
							qe.forceAll = true
						}
					},

                    valueField: 'id',
                    displayField:'templateId',
                    queryMode: 'local',
                    forceSelection: true,

                    typeAhead: true,
                    name: 'templateId',
                    fieldLabel: 'Entity Template',
					emptyText: "none",
                    anchor: '100%',
					allowBlank: true
                }
            ],
            buttons: [
                {
                    text: "Create",
                    action: "createEntity",
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
