Ext.define('Spelled.view.template.component.attribute.Object', {
    extend: 'Ext.form.field.TextArea',
    alias : 'widget.spelledobjectfield',

	transformRawValue: function( value ){
		return Ext.encode( value )
	},

	valueToRaw: function(value){
		return Ext.decode( value, true ) || {}
	},

	initComponent: function() {
		this.callParent()
	}
});
