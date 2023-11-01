
import Util from '@antv/g6/es/util'
import eventBus from "../../../utils/eventBus";
export default {
    getDefaultCfg () {
        return {
            multiple: true,
            keyCode: 16
        };
    },
    getEvents () {
        return {
            'node:click': 'onClick',
            'node:dblclick': 'onDBClick',
            'canvas:click': 'onCanvasClick',
            'canvas:mouseover': 'onCanvasMouseover',
            keyup: 'onKeyUp',
            keydown: 'onKeyDown'
        };
    },
    onClick (e) {
        const self=this;
        const item=e.item;
        const graph=self.graph;
        eventBus.$emit('nodeClick', {graph: graph, e: e})
    },
    onDBClick (e) {
        const self=this;
        const item=e.item; 
        const graph=self.graph;
        const autoPaint=graph.get('autoPaint');
        graph.setAutoPaint(false);
        const selectedEdges=graph.findAllByState('edge', 'selected');
        selectedEdges.forEach(edge => {
            graph.setItemState(edge, 'selected', false);
        });
        if (!self.keydown||!self.multiple) {
            const selected=graph.findAllByState('node', 'selected');
            selected.forEach(node => {
                if (node!==item) {
                    graph.setItemState(node, 'selected', false);
                }
            });
        }
        if (['start', 'end'].indexOf(item._cfg.model.nodeType)==-1) {
            if (item.hasState('selected')) {
                if (self.shouldUpdate.call(self, e)) {
                    graph.setItemState(item, 'selected', true);
                }
                eventBus.$emit('nodeselectchange', { target: item, select: true, selectType: 'click' });
            } else {
                if (self.shouldUpdate.call(self, e)) {
                    graph.setItemState(item, 'selected', true);
                }
                eventBus.$emit('nodeselectchange', { target: item, select: true, selectType: 'click' });
            }
        }
        graph.setAutoPaint(autoPaint);
        graph.paint();
        eventBus.$emit('nodeClick', false)
    },
    onCanvasClick () {
        const graph=this.graph;
        const autoPaint=graph.get('autoPaint');
        graph.setAutoPaint(false);
        const selected=graph.findAllByState('node', 'selected');
        selected.forEach(node => {
            graph.setItemState(node, 'selected', false);
            eventBus.$emit('nodeselectchange', { target: node, select: false });
        });

        const selectedEdges=graph.findAllByState('edge', 'selected');
        selectedEdges.forEach(edge => {
            graph.setItemState(edge, 'selected', false);
            eventBus.$emit('nodeselectchange', { target: edge, select: false });
        })

        graph.paint();
        graph.setAutoPaint(autoPaint);
    },
    onCanvasMouseover () {
        const graph=this.graph;
        graph.paint();
    },
    onKeyDown (e) {
        const code=e.keyCode||e.which;
        if (code===this.keyCode) {
            this.keydown=true;
        } else {
            this.keydown=false;
        }
    },
    onKeyUp () {
        this.keydown=false;
    }
};
