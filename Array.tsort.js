//  Array.tsort.js 1.0d1
//      Copyright (c) 2009 Jonathan 'Wolf' Rentzsch: <http://rentzsch.com>
//      Some rights reserved: <http://opensource.org/licenses/mit-license.php>
//      
//  Topological sort for javascript.
//
//  Compatibility: IE 6-8, Firefox 3-3.5, Safari 3-4, Chrome 3.

jQuery.pkg('Array.tsort-1.0d1.pkg.js', {
    require: 'http://cloud.github.com/downloads/rentzsch/JRSet.js/JRSet-1.0d1.pkg.js',
    init: function(){
        function JRTSortNode(name){
            this._name = name;
            this._parents = new JRSet();
            this._children = new JRSet();
        }
        JRTSortNode.prototype.addDependancy = function(node) {
            if (node._parents.contains(this)) {
                throw new Error('tsort: circular dependancy between "'+this._name+'" and "'+node._name+'"');
            }
            this._parents.add(node);
            node._children.add(this);
        }
        
        
        function JRTSortNodeCollection(){
            this._storage = {};
        }
        JRTSortNodeCollection.prototype.nodeWithName = function(name){
            var result = this._storage[name];
            if (!result) {
                result = new JRTSortNode(name);
                this._storage[name] = result;
            }
            return result;
        }
        JRTSortNodeCollection.prototype._rootNodes = function(){
            var nodeName, node, result = [];
            for (nodeName in this._storage) {
                node = this._storage[nodeName];
                if (node._parents.length() === 0) {
                    result.push(node);
                }
            }
            return result;
        }
        JRTSortNodeCollection.prototype.sortedNodeNames = function(){
            var result = [];
            
            function collectNodeNamesBreadthFirst(nodes, nodeNames){
                var nodeIndex, node, children;
                for (nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
                    node = nodes[nodeIndex];
                    nodeNames.push(node._name);
                }
                for (nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
                    node = nodes[nodeIndex];
                    collectNodeNamesBreadthFirst(node._children.toArray(), nodeNames);
                }
            };
            
            collectNodeNamesBreadthFirst(this._rootNodes(), result);
            
            return JRSet.unique(result);
        }
        
        Array.tsort = function Array_tsort(nodeNamePairs) {
            var nodeNamePairIndex,
                nodeNamePair,
                beforeNodeName,
                afterNodeName,
                beforeNode,
                afterNode,
                nodes = new JRTSortNodeCollection();
                
            for (nodeNamePairIndex in nodeNamePairs){
                nodeNamePair = nodeNamePairs[nodeNamePairIndex];
                
                beforeNodeName = nodeNamePair[0];
                afterNodeName = nodeNamePair[1];
                
                beforeNode = nodes.nodeWithName(beforeNodeName);
                afterNode = nodes.nodeWithName(afterNodeName);
                
                afterNode.addDependancy(beforeNode);
            }
            return nodes.sortedNodeNames();
        }
    }
});