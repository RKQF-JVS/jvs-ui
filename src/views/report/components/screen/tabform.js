import tabFormComponent from './tabform.vue';
const tabForm={
    install: function (Vue) {
        Vue.component('tabForm', tabFormComponent)
    }
}
export default tabForm
