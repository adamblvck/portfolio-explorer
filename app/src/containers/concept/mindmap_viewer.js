import React, { Component } from 'react';
import _ from 'lodash'

// charting components
import ReactEcharts from 'echarts-for-react'; 

export default class MindmapViewer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    index_next_depth(data, idx, depth){

        for(var i=idx; i<data.length; i++){
            var line = data[i];
            var current_depth = (line.substr(0,line.indexOf(' '))).length; // "depth"
            var current_name = line.substr(line.indexOf(' ')+1); // "tocirah sneab"

            // if the current level "recedes", we note down the changes
            if (current_depth < depth){
                return i;
            }
        }
        return data.length;
    }

    add_to_node(parent_node, depth, data){

        var previous_node = {}

        for (var i=0; i<data.length; i++){
            var line = data[i];
            var current_depth = (line.substr(0,line.indexOf(' '))).length; // "72"
            var current_name = line.substr(line.indexOf(' ')+1); // "tocirah sneab"

            // when on depth level, add to parent node
            if (current_depth == depth){
                // create node structure
                var node = {name:current_name, children:[]};

                // add node to parent
                previous_node = node;
                parent_node.children.push(node);

                continue;
            }

            // when on depth level < depth
            // stop this cycle and return parent_node
            if (current_depth < depth){
                break;
            }

            // when on depth level +1
            if (current_depth == depth+1){
                // determine index of next occurence of current depth in array
                var i_next = this.index_next_depth(data, i, depth+1);

                // Add children to previous node, one layer deeper
                this.add_to_node(previous_node, depth+1, data.slice(i, i_next));

                // skip i_next items
                i = (i_next-1);
            }
        }

        return parent_node;
    }

    data_to_json(data) {
        // Algoritm Description
        /*

        Input:
        # Core Idea
        >> Sub idea
        >> Ethereum
        ... Very Fast
        ... Very Strong
        ... Reliable
        >> Crypto
        >> Bitcoin
        ... Two Elements
        ... fifteen people

        Output:
        object = { name:"", children:[object], value:variable}
        */

        // split up the string-mindmap at newlines
        var split_strings = data.split(/[\r\n]+/);

        // depth count (dash count) and name of the root node
        var first_line = split_strings[0];
        var dashes = first_line.substr(0,first_line.indexOf(' ')); // "--- "
        var name = first_line.substr(first_line.indexOf(' ')+1); // "name line"

        // check if first character is a dash, to start a mindmap
        if (dashes != "-"){
            console.log("Mindmap didn't begin with a dash `-`")
            return {name: "empty", children:[]};
        }

        // create mindmap root
        var root = {name: name, children:[]};

        // now add siblings to the root
        this.add_to_node(root, 2, split_strings.splice(1));

        return root;
    }

    // mindmap configuration for echarts
    echarts_mindmap_options(mindmap_data){
        return {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            toolbox: {
                show: true,
                feature: {
                    // dataView: {readOnly: false},
                    // magicType: {type: ['line', 'bar']},
                    restore: {
                        title: "Restore"
                    },
                    saveAsImage: {
                        title: "Save img"
                    }
                }
            },
            series: [
                {
                    type: 'tree',
    
                    data: [mindmap_data],
    
                    top: '5%',
                    left: '20%',
                    bottom: '1%',
                    right: '20%',
    
                    symbolSize: 10,

                    roam: 'move',
    
                    label: {
                        normal: {
                            position: 'top',
                            verticalAlign: 'middle',
                            align: 'middle',
                            offset: [0, -4],
                            fontSize: 12,
                            fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial"',
                            rich: {
                                width: 10
                            }
                        }
                    },
    
                    leaves: {
                        label: {
                            normal: {
                                position: 'right',
                                verticalAlign: 'middle',
                                align: 'left',
                                offset: [0, 0]
                            }
                        }
                    },
    
                    initialTreeDepth: 1,
                    expandAndCollapse: true,
                    animationDuration: 250,
                    animationDurationUpdate: 250
                }
            ]
        }
    }

    render_mindmap(data){
        var json_data = this.data_to_json(data)
        
        return <ReactEcharts
            option={this.echarts_mindmap_options(json_data)}
            notMerge={true}
            lazyUpdate={true}
            theme={"theme_name"} />
            // onChartReady={this.onChartReadyCallback}
            // onEvents={EventsDict} />
    }

    render() {
        var {mindmapData} = this.props;
        
        return (
            <div className="mindmap-container">
            {mindmapData && this.render_mindmap(mindmapData)}
            </div>
        )
    }

}