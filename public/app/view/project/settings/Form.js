Ext.define('Spelled.view.project.settings.Form' ,{
	extend: 'Ext.form.Panel',
	alias: 'widget.projectsettingsform',

	setValues: function( values ) {
		this.getForm().setValues( values )
	}
})