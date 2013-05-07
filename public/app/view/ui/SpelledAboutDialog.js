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
                bodyPadding: '5 5 0',
                width: 300,
                height: 195,
                html:
                    '<img src="resources/images/logo-spell-js.png"/><br/>' +
                    '<strong>SpellJS version ' + Spelled.Configuration.version + '</strong> ' +
                    '&nbsp;&nbsp;&nbsp;Build ' + Spelled.Configuration.buildNumber + '<br/>' +
                    'built on ' + Spelled.Configuration.buildTimeStamp + '<br/><br/>' +
                    '&copy; 2011-2013 Spielmeister GmbH, Germany<br/><br/>' +
                    'Parts of this product use open source software.<br/>Please consult the licence details for more details.'
            }
		)

		this.callParent( arguments )
	}
});