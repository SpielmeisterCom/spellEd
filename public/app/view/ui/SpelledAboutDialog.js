Ext.define('Spelled.view.ui.SpelledAboutDialog' ,{
    extend: 'Ext.Window',
    title : 'SpellEd',

    alias: 'widget.spelledabout',

	autoShow: true,
    modal : true,
    closable: true,

	initComponent: function() {

		Ext.applyIf(
			this,{
				items: [
					{
						xtype: 'image',
						src: 'http://spelljs.com/wp-content/themes/spelljs/images/logo-spell-js.png'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Version',
						value: Spelled.Configuration.version,
						readOnly: true
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Build number',
						value: Spelled.Configuration.buildNumber,
						readOnly: true
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Build timestamp',
						value: Spelled.Configuration.buildTimeStamp,
						readOnly: true
					}
				]
			}
		)

		this.callParent( arguments )
	}
});