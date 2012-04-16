Ext.define('Spelled.model.Component', {
    extend: 'Ext.data.Model',

    fields: [
        'name',
        'entity_id'
    ],

    belongsTo: "Spelled.model.Entity"
});