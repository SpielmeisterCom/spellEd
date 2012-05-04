Ext.define('Spelled.model.blueprint.Entity', {
    extend: 'Ext.data.Model',

    fields: [
        'id',
        "type",
        "namespace",
        "name",
        'components'
    ],

    getFullName: function() {
        return this.get('namespace') +"/"+ this.get('name')
    }
});