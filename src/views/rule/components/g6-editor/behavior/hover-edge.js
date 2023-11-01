
import Util from '@antv/g6/es/util'
import eventBus from "../../../utils/eventBus";
export default {
    getEvents() {
        return {
            'edge:mouseover': 'onMouseover',
            'edge:mouseleave': 'onMouseleave',
            "edge:click": "onClick",
        };
    },
    onMouseover(e) {
        const self = this;
        const item = e.item;
        const graph = self.graph;
        if (item.hasState('selected')) {
            return
        } else {
            if (self.shouldUpdate.call(self, e)) {
                graph.setItemState(item, 'hover', true);
            }
        }
        graph.paint();
    },
    onMouseleave(e) {
        const self = this;
        const item = e.item;
        const graph = self.graph;
        const group = item.getContainer()
        group.find(g => {
            if (g.attrs.isInPoint || g.attrs.isOutPoint) {
                g.attr("fill", "#fff")
            }
        });
        if (self.shouldUpdate.call(self, e)) {
            if (!item.hasState('selected'))
                graph.setItemState(item, 'hover', false);
        }
        graph.paint();
    },
    onClick(e) {
        const self = this;
        const item = e.item;
        const graph = self.graph;
        const autoPaint = graph.get('autoPaint');
        graph.setAutoPaint(false);
        const selectedNodes = graph.findAllByState('node', 'selected');
        for(let i in selectedNodes) {
            graph.setItemState(selectedNodes[i], 'selected', false);
        }
        // selectedNodes.foreach(node => {
        //     graph.setItemState(node, 'selected', false);
        // });
        if (!self.keydown || !self.multiple) {
            const selected = graph.findAllByState('edge', 'selected');
            for(let i in selected) {
                if (selected[i] !== item) {
                    graph.setItemState(selected[i], 'selected', false);
                }
            }
            // selected.foreach(selected, edge => {
            //     if (edge !== item) {
            //         graph.setItemState(edge, 'selected', false);
            //     }
            // });
        }
        if (item.hasState('selected')) {
            if (self.shouldUpdate.call(self, e)) {
                graph.setItemState(item, 'selected', false);
            }
            eventBus.$emit('nodeselectchange', { target: item, select: false });
        } else {
            if (self.shouldUpdate.call(self, e)) {
                graph.setItemState(item, 'selected', true);
            }
            eventBus.$emit('nodeselectchange', { target: item, select: true, selectType: 'click' });
        }
        graph.setAutoPaint(autoPaint);
        graph.paint();
    },

};
