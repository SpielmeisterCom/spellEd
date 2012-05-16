Ext.define('Spelled.view.asset.Upload', {
    extend: 'Ext.Window',
    alias: 'widget.createasset',

    title : 'Add a new Asset to the Project',
    modal : true,

    closable: true,

    items: [
        {
            xtype: "form",
            bodyPadding: 10,
            items: [{
                xtype: 'filefield',
                name: 'asset',
                fieldLabel: 'Asset',
                labelWidth: 50,
                msgTarget: 'side',
                allowBlank: false,
                anchor: '100%',
                buttonText: 'Select a File...'
            }],

            buttons: [{
                text: 'Upload',
                handler: function() {
                    var form = this.up('form').getForm();
                    if(form.isValid()){
                        form.submit({
                            url: 'routing',
                            type: "remoting",
                            "actions":{
                                "AssetsActions":[
                                    {
                                        "name":"create",
                                        "len":0,
                                        "formHandler":true
                                    }
                                ]
                            },

                            waitMsg: 'Uploading your asset...',
                            success: function(fp, o) {
                                Ext.Msg.alert('Success', 'Your asset "' + o.result.file + '" has been uploaded.');
                            }
                        })
                    }
                }
            }]
        }
    ]
});
