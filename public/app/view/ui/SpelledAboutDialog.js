Ext.define('Spelled.view.ui.SpelledAboutDialog' ,{
    extend: 'Ext.Window',
    title : 'SpellEd',

    alias: 'widget.spelledabout',

	layout: 'fit',

	autoShow: true,
    modal : true,
    closable: true,

	initComponent: function() {

		Ext.applyIf(
			this,{
				items: [
					{

					}
				]
			}
		)

		this.callParent( arguments )
	}
});