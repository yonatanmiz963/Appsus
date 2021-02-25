import { eventBus } from "../services/event-bus-service.js"

export default {
    template: `
        <section v-if="msg" class="user-msg" :class="show">
            <h4>{{msg.txt}}</h4>
            <button @click="msg=null">X</button>
        </section>
    `,
    data() {
        return {
            msg: null
        }
    },
    methods: {
        setMsg(msg) {
            console.log('set msg');
            this.msg = msg
            setTimeout(() => {
                this.msg = null
            }, 5000);
        }
    },
    computed: {
        show() {
            return {
                 show: this.msg ? true : false,
                 error: this.msg.type === 'error',
                 success: this.msg.type === 'success'

            }
        } 
    },
    created() {
        eventBus.$on('show-msg', this.setMsg)
        console.log('created');
    },
    destroyed(){
        eventBus.$off('show-msg', this.setMsg)
        console.log('destroyed');
    }
}