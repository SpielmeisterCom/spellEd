Ext.define('Spelled.base.view.Navigator' ,{
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
		var tabPanel  = this.up( 'tabpanel' )

		if( tabPanel ) {
			tabPanel.setTitle( tabPanel.defaultTitle + " > " + this.title )
		}
	}
})


