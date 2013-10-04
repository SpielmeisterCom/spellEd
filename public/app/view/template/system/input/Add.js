Ext.define('Spelled.view.template.system.input.Add' ,{
    extend: 'Ext.window.Window',
    alias: 'widget.addinputtotemplate',

    title: "Add component map as system input",
    modal: true,
    closable: true,

    layout: 'fit',
    width : 550,
    height: 450,

    items: [
        {
            xtype: "form",
            bodyPadding: 10,

			layout: {
				align: 'stretch',
				type: 'vbox'
			},

            defaults: {
                anchor: '100%',
                allowBlank: false
            },

            items: [
                {
                    xtype: 'spelledtextfield',
                    name: "name",
                    fieldLabel: 'Local alias',
					vtype: 'alphanum',
					validator: function( value ) {
						if( value == "config" ) return "Usage of a reserved name"
						if( this.isJavaScriptCompliant( value ) ) return true
						return "Usage of invalid characters"
					}
                },
                {
					flex:1,
                    xtype: 'groupedtree',
                    title: 'Choose component map',
                    rootVisible: false,
					listeners: {
						checkchange: function( node, checked ) {
							var root = node.getOwnerTree().getRootNode()

							root.cascadeBy(
								function( child ){
									if( child != node ) {
										child.set( 'checked', false )
									}
								}
							)
						}
					}
                }

            ],
            buttons: [
                {
                    formBind: true,
                    text: 'Add',
                    action: 'addInput'
                }
            ]
        }
    ]

});
