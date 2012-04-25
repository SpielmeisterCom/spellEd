Ext.define('Spelled.model.Component', {
    extend: 'Ext.data.Model',

    fields: [
        'id'
    ],

    belongsTo: 'Spelled.model.Entity'
});