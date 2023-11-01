
import eventBus from "../../../utils/eventBus";
import { uniqueId } from '../../../utils'
import { mode } from "crypto-js";
let startPoint=null
let startItem=null
let endPoint={}
let activeItem=null
let curInPoint=null
export default {
    getEvents () {
        return {
            mousemove: 'onMousemove',
            mouseup: 'onMouseup',
            'node:mouseover': 'onMouseover',
            'node:mouseleave': 'onMouseleave'
        };
    },
    onMouseup (e) {
        const item=e.item
        if (item&&item.getType()==='node') {
            const group=item.getContainer()
            if (e.target.attrs.isInPoint) {
                const children=group.cfg.children
                children.map(child => {
                    if (child.attrs.isInPointOut&&child.attrs.parent===e.target.attrs.id) {
                        activeItem=child
                    }
                })
                curInPoint=e.target
            } else if (e.target.attrs.isInPointOut) {
                activeItem=e.target
                const children=group.cfg.children
                children.map(child => {
                    if (child.attrs.isInPoint&&child.attrs.id===e.target.attrs.parent) {
                        curInPoint=child
                    }
                })
            }
            if (activeItem) {
                const endX=parseInt(curInPoint.attrs.x)
                const endY=parseInt(curInPoint.attrs.y)
                endPoint={ x: endX, y: endY };
                if (this.edge) {
                    this.graph.removeItem(this.edge);
                    const model={
                        id: 'edge'+uniqueId(),
                        source: startItem,
                        target: item,
                        sourceId: startItem._cfg.id,
                        targetId: item._cfg.id,
                        start: startPoint,
                        end: endPoint,
                        shape: 'customEdge',
                        type: 'edge'
                    }
                    eventBus.$emit('addItem', model)
                }
            } else {
                if (this.edge)
                    this.graph.removeItem(this.edge);
            }
        } else {
            if (this.edge)
                this.graph.removeItem(this.edge);
        }
        this.graph.find("node", node => {
            const group=node.get('group')
            const children=group.cfg.children
            children.map(child => {
                if (child.attrs.isInPointOut) {
                    child.attr("opacity", "0")
                }
                if (child.attrs.isInPoint) {
                    child.attr("opacity", "0")
                }
                if (child.attrs.isOutPoint) {
                    child.attr("opacity", "0")
                    child.attr("fill", "#fff")
                }
            })
        })
        if (startItem) {
            this.graph.setItemState(startItem, 'hover', false);
        }

        this.graph.paint()
        startPoint=null
        startItem=null
        endPoint={}
        activeItem=null
        curInPoint=null
        this.graph.setMode('default')
    },
    onMousemove (e) {
        const item=e.item
        if (!startPoint) {
            this.graph.find("node", node => {
                const group=node.get('group')
                const children=group.cfg.children
                children.map(child => {
                    if (child.attrs.isInPointOut) {
                        child.attr("opacity", "0.3")
                    }
                    if (child.attrs.isInPoint) {
                        child.attr("opacity", "1")
                    }
                })
            })
            const startX=parseInt(e.target.attrs.x)
            const startY=parseInt(e.target.attrs.y)
            startPoint={ x: startX, y: startY };
            startItem=item
            this.edge=this.graph.addItem('edge', {
                source: item,
                target: item,
                start: startPoint,
                end: startPoint,
                shape: 'link-edge'
            });
        } else {
            const point={ x: e.x, y: e.y };
            if (this.edge) {
                // 增加边的过程中，移动时边跟着移动
                this.graph.updateItem(this.edge, {
                    //  start: startPoint,
                    target: point
                });
            }
        }
    },
    onMouseover (e) {
        const item=e.item
        if (item&&item.getType()==='node') {
            if (e.target.attrs.isInPointOut&&!this.hasTran) {
                this.hasTran=true
                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                // e.target.transform([
                //     ['t', 0, 3],
                //     ['s', 1.2, 1.2],
                // ])
            }
            this.graph.paint()
        }
    },
    onMouseleave () {
        this.graph.find("node", node => {
            const group=node.get('group')
            const children=group.cfg.children
            children.map(child => {
                if (child.attrs.isInPointOut) {
                    child.resetMatrix()
                }
            })
        })
        this.hasTran=false
        this.graph.paint()
    }
}
