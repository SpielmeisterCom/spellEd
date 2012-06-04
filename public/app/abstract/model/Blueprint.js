Ext.define('Spelled.abstract.model.Blueprint', {
    extend: 'Ext.data.Model',

    requires: ['Spelled.abstract.writer.JsonWriter'],

    getFullName: function() {
        var namespace = this.get('namespace')
        return ( namespace.length > 0 ) ? namespace +"."+ this.get('name') : this.get('name')
    }
});