<template>
  <div class="itempannel">
    <Item />
  </div>
</template>

<script>
import Item from "./item";
import eventBus from "../../../utils/eventBus";
export default {
  components: { Item },
  data() {
    return {
      page: null,
      command:null
    };
  },
  created() {
    this.bindEvent();
  },
  methods: {
    bindEvent() {
      eventBus.$on("afterAddPage", page => {
        this.page = page;
      });
    },
  }
};
</script>

<style scoped>
.itempannel {
  height: 100%;
  position: absolute;
  left: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 200px;
  border-right: 1px solid #e6e9ed;
  overflow: hidden;
}
.itempannel ul {
  padding: 0px;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  padding-top: 20px;
  margin: 0;
  box-sizing: border-box;
}
.itempannel li {
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  width: 160px;
  height: 30px;
  line-height: 30px;
  padding-left: 8px;
  border: 1px solid rgba(0, 0, 0, 0);
  list-style-type: none;
}
.itempannel li:hover {
  background: white;
  border: 1px solid #ced4d9;
  cursor: move;
}

.itempannel .pannel-type-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}
</style>