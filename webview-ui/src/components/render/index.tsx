import {h, defineComponent, resolveComponent } from "vue";
export default defineComponent({
    props: {
      conf: {
        type: Object,
        required: true
      }
    },
    render() {
        const tag = resolveComponent(this.conf.__config__.tag)
        return h(tag)
    }
})