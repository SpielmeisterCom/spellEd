Ext.define('Spelled.view.entity.Create' ,{
    extend: 'Ext.Window',
    alias: 'widget.createentity',

    title : 'Add a new Entity to the Scene',
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
                    name: 'name',
                    fieldLabel: 'Name',
                    anchor: '100%',
                    allowBlank:false,
					validator: function( value ) {
						var ownerRecord = this.up( 'form').getRecord().getOwner()

						if( Spelled.EntityHelper.hasOwnerAnChildWithThisName( ownerRecord, value ) ) return "The owner has already an entity named " + value
						else if( this.isConfigEntityCompliant( value ) ) return true
						else return "Usage of invalid characters. No: '.' or '/' allowed"
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
                    fieldLabel: 'Select a Template',
					emptyText: " -- Is Optional --",
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
