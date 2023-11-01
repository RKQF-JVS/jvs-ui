import draggablesComponent from './draggables.vue';

const draggables={
    install: function (Vue) {
        Vue.component('draggables', draggablesComponent)
    }
}
export default draggables