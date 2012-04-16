Ext.define('Spelled.model.Entity', {
    extend: 'Ext.data.Model',

    fields: [
        'name',
        'zone_id'
    ],

    belongsTo: "Spelled.model.Zone",
    hasMany: {
        model: 'Spelled.model.Component',
        name :  "components"
    }
});