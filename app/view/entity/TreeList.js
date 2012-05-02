Ext.define('Spelled.view.entity.TreeList' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.entiteslist',
    animate: false,
    animCollapse: false,

    rootVisible: false,

    title: "Default Entities",
    store: "EntitiesTree",

    tbar: [
        {
            text: "Create",
            action: "showCreateEntity",
            tooltip: {
                text:'Create a new Entity',
                title:'Create'
            }
        }
    ],

    columns: [
        {
            xtype: 'treecolumn', //this is so we know which column will show the tree
            text: 'Name',
            sortable: false,
            menuDisabled: true,
            flex: 2,
            dataIndex: 'text'
        },
        {
            xtype: 'actioncolumn',
            menuDisabled: true,
            sortable: false,
            flex: 1,
            items: [{
                icon: '/images/icons/add.png',
                tooltip: 'New',
                iconCls: 'act-create'
            },{
                icon: '/images/icons/delete.png',
                tooltip: 'Delete',
                iconCls: 'act-delete'
            }]
//            ,defaultRenderer: function( a,b, item ) {
//
//                if( item.isLeaf() ) {
//                    this.items[1] = undefined
//                } else {
//                    this.items[0] = undefined
//                }
//console.log( this )
//            },
//            renderer: function( a,b, item ) {
//
//                if( item.isLeaf() ) {
//                    this.items.splice( 0, 1 )
//                    console.log( item.id + "is leaf" )
//                } else {
//                    //this.items.slice( 0, 1 )
//                }
//
//                console.log( this )
//                console.log( arguments )
//            }
        }
    ]
});