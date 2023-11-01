import eventBus from "../../../utils/eventBus";
export default {
    getEvents() {
        return {
            'node:mouseover': 'onMouseover',
            'node:mouseleave': 'onMouseleave',
            "node:mousedown": "onMousedown"
        };
    },
    onMouseover(e) {
        const self = this;
        const item = e.item;
        const graph = self.graph;
        const group = item.getContainer()

        const autoPaint = graph.get('autoPaint');
        graph.setAutoPaint(false);
        if (e.target.attrs.isOutPointOut || e.target.attrs.isOutPoint) {
            group.find(g => {
                if (g.attrs.isInPoint || g.attrs.isOutPoint) {
                    g.attr("fill", "#fff")
                }
                if (g.attrs.isOutPoint) {
                    if (g.attrs.id === e.target.attrs.parent) {
                        group.find(gr => {
                            if (gr.attrs.id === g.attrs.id) {
                                gr.attr('fill', "#1890ff")
                                gr.attr('opacity',1)
                            }
                        })
                    }
                    if (g.attrs.id === e.target.attrs.id) {
                        g.attr("fill", "#1890ff")
                        g.attr('opacity',1)
                    }

                }
            });
            e.target.attr("cursor", "crosshair");
            this.graph.paint();
        }
        if (item.hasState('selected')) {
            // 移入选中
            if (self.shouldUpdate.call(self, e)) {
                if(['start', 'end'].indexOf(item._cfg.model.nodeType) == -1) {
                    graph.setItemState(item, 'selected', true);
                }
            }
            return
        } else {
            if (self.shouldUpdate.call(self, e)) {
                graph.setItemState(item, 'hover', true);
                if(['start', 'end'].indexOf(item._cfg.model.nodeType) == -1) {
                    graph.setItemState(item, 'selected', true);
                    eventBus.$emit('nodeselectchange', { target: item, select: true, selectType: 'hover' });
                }
            }   
        }
        graph.setAutoPaint(autoPaint);
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
            if(!item.hasState('selected'))
            graph.setItemState(item, 'hover', false);
        }
        graph.paint();
    },
    onMousedown(e) {
        if(e.target.attrs.isOutPoint ||e.target.attrs.isOutPointOut){
            this.graph.setMode('addEdge')
        }else{
            // 左键移动节点
            if(e.originalEvent.button == 0) {
                this.graph.setMode('moveNode')
            }else{
                // 右键执行 contextmenuClick
                if(e.originalEvent.button == 2) {
                    eventBus.$emit('contextmenuClick',e)
                }
            }
        }
    },

};
