Ext.define('Spelled.model.Component', {
    extend: 'Ext.data.Model',

    fields: [
        'id',
        'configuration'
    ],

    belongsTo: 'Spelled.model.Entity'
});