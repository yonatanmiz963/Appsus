import { eventBus } from "../../../services/event-bus-service.js"
import { noteService } from "../../notes/services/notes.service.js"
import NoteImg from "../../notes/cmps/note-img.cmp.js"
import NoteTodos from "../../notes/cmps/note-todos.cmp.js"
import NoteTxt from "../../notes/cmps/note-txt.cmp.js"
import NoteVideo from "../../notes/cmps/note-video.cmp.js"
import NoteAudio from "../../notes/cmps/note-audio.cmp.js"

export default {
    template: `
    <section class="mail-compose flex center">
        <div class="mail-compose-container">
        <div class="compose-header flex align-items">New Message</div>
        <div class="compose-cotainer flex column">
                    <input v-model="mailToSend.mailAdress" class="compose-to" type="text" placeholder="To:"/>
                    <input v-model="mailToSend.from" class="compose-cc" type="text" placeholder="From:"/>
                    <input v-model="mailToSend.subject" class="compose-subject" type="text" placeholder="Subject:"/>
                    <div class="compose-content-container">
                        <textarea v-if="!note" v-model="mailToSend.content" class="compose-content" type="text" placeholder="Content:"></textarea>
                        <component class="note-content-compose flex align-items center" v-if="note" :is="note.type" :note="note"></component>
                    </div>
                    <div class="compose-options-constainer">
                        <a @click.prevent="send" class="send-mail-btn"><i class="fas fa-share"></i></a>
                    </div>
                </div>
                
        </div>
    </section>
    `,
    data() {
        return {
            mailToSend: {
                from: null,
                mailAdress: null,
                subject: '',
                content: null,
                note: null
            },
            note: null
        }
    },
    methods: {
        send() {
            const regex = /\S+@\S+\.\S+/
            if (!regex.test(this.mailToSend.mailAdress)) {
                const msg = {
                    txt: `not a valid mail`,
                    type: 'error'
                }
                eventBus.$emit('show-msg', msg)
                return
            }

            if (!this.mailToSend.from){
                const msg = {
                    txt: `from field cannot be empty`,
                    type: 'error'
                }
                eventBus.$emit('show-msg', msg)
                return
            }
            this.mailToSend.note = this.note
            this.$emit('send', { ...this.mailToSend })
        },
        getNote() {
            const noteId = this.$route.params.note
            console.log('noteId:', noteId)
            noteService.getNoteById(noteId)
                .then(note => {
                    this.note = note
                    console.log('this.note:', this.note)
                })
        }
    },
    components: {
        NoteImg,
        NoteTodos,
        NoteTxt,
        NoteVideo,
        NoteAudio
    },
    watch: {
        '$route.params.note'(id) {
            this.getNote()
        }
    },
    created() {
        this.getNote()

    },
}