Ext.define('Spelled.view.ui.about.License' ,{
    extend: 'Ext.grid.property.Grid',
    alias: 'widget.spelledaboutlicense',

    title : 'Your License',

    listeners: {
        'beforeedit': {
            fn: function(){
                return false;
            }
        }
    },

    initComponent: function() {
        var me = this

        Spelled.app.platform.getLicenseInformation('', function(licenseData) {
            console.log(licenseData)

        })

        this.callParent( arguments )
    }
})