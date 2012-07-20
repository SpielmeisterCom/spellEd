Ext.define('Spelled.model.template.ComponentAttribute', {
    extend: 'Ext.data.Model',

    fields: [
        "type",
        "name",
        "default"
    ],

    idgen: 'uuid',

    associations: [{
        model:"Spelled.model.template.Component",
        type:"belongsTo",
		getterName: 'getComponent',
		setterName: 'setComponent'
    }],

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'template.component.Attributes' ).add( this )
    }
});
