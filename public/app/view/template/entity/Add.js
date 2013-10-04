Ext.define('Spelled.view.template.entity.Add' ,{
    extend: 'Ext.Window',
    alias: 'widget.addentitytotemplate',

    title : 'Add a new Template-Entity to the Template',
    modal : true,
	layout: 'fit',
	width: 300,

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
						var ownerRecord = this.up( 'form' ).getRecord().getEntity()
						return this.isEntityNameValid( ownerRecord, value )
					}
                },
				{
					xtype: 'hiddenfield',
					name: 'owner'
				},
				{
                    xtype: 'combobox',
                    store: 'template.Entities',
					matchFieldWidth : false,

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
                    action: "addEntityToTemplate",
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
