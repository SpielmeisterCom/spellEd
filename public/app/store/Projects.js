Ext.define('Spelled.store.Projects', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.Project',

    proxy: {
        type: 'direct',
        directFn: Spelled.ProjectActions.getAll
    }
});
