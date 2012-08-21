Ext.define('Spelled.abstract.view.Navigator' ,{
    extend: 'Ext.panel.Panel',

	layout: {
		align: 'stretch',
		type: 'vbox'
	},

	initComponent: function() {
		var me = this

		Ext.applyIf( me, {
			listeners: {
				activate:  Ext.bind( me.changeTitle, me)
			}
		})

        me.callParent()
    },

	changeTitle: function() {
		var treePanel = this.down( 'treepanel' ),
			tabPanel  = this.up( 'tabpanel' )

		if( treePanel && tabPanel ) {
			tabPanel.setTitle( treePanel.title )
		}
	}
})


