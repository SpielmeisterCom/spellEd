Ext.define('Spelled.view.template.component.attribute.Object', {
    extend: 'Ext.form.field.TextArea',
    alias : 'widget.spelledobjectfield',

	mixins: [ 'Spelled.base.grid.Property' ],

	transformRawValue: function( value ){
		return Ext.encode( value )
	},

	validator: function( value ) {
		if( Ext.decode( value, true ) === null )
			return "This is not a valid JSON format."
		else
			return true
	},

	valueToRaw: function(value){
		return Ext.decode( value, true ) || {}
	},

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	}
});
