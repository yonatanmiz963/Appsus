
import { noteService } from '../services/notes.service.js'
import NotePreview from './note-preview.cmp.js'
import AddNote from './notes-add.cmp.js'
import { eventBus } from '../../../services/event-bus-service.js'


export default {
    template: `
    <section v-if="notes" class="notes-list flex column align-items common-width">
        <add-note @addNote="addNote" />
        <h1 class="container-title" v-if="pinnedTitle"> Pinned Notes </h1>
                <div class="animation-container pinned-container common-width">
                    <note-preview class="animation-container-item" @pin="pinNote" @saveNote="saveNote" @remove="removeNote" v-for="(note, idx) in pinnedToShow" :note="note" :key="idx" />
                </div>
   
        <h1 class="container-title" v-if="listTitle"> Other Notes </h1>
        <div class="animation-container notes-container common-width">
               <note-preview class="animation-container-item" @pin="pinNote" @saveNote="saveNote" @remove="removeNote" v-for="(note, idx) in notesToShow" :note="note" :key="idx" />
        </div>
    </section>
    `,
    data() {
        return {
            notes: null,
            filter: null
        }
    },
    methods: {
        getNotes() {
            noteService.query()
                .then(notes => {
                    this.notes = notes;
                });
        },
        addNote(newNote) {
            noteService.addNote(newNote)
                .then(ans => {
                    this.getNotes();
                    const msg = {
                        txt: `Note added successfully`,
                        type: 'success'
                    }
                    eventBus.$emit('show-msg', msg)
                })
                .catch(err => {
                    const msg = {
                        txt: 'Note was not added, please try again',
                        type: 'error'
                    }
                    eventBus.$emit('show-msg', msg);
                });
        },
        removeNote(noteId) {
            noteService.removeNote(noteId)
            .then(ans => {
                this.getNotes();
                const msg = {
                    txt: `Removed note successfully`,
                    type: 'success'
                }
                eventBus.$emit('show-msg', msg)
            })
            .catch(err => {
                const msg = {
                    txt: 'Note was not added, please try again',
                    type: 'error'
                }
                eventBus.$emit('show-msg', msg);
            });
        },
        updateNote(newTxt, note) {
            noteService.updateNote(newTxt, note)
                .then(this.getNotes)
        },
        saveNote(note) {
            noteService.saveNote(note)
                .then(this.getNotes)
        },
        setFilter(filterBy) {
            this.filter = filterBy;
        },
        pinNote(note) {
            note.isPinned = !note.isPinned;
            this.saveNote(note);
        }
    },
    computed: {
        notesToShow() {
            var filteredNotes = this.notes;
            filteredNotes =  filteredNotes.filter(note => !note.isPinned);
            if (!this.filter) return filteredNotes;
            if (this.filter.noteType !== 'All') {
                filteredNotes = this.notes.filter(note => {
                    return note.type === this.filter.noteType;
                });
            }

            if (this.filter.noteName) {
                filteredNotes = filteredNotes.filter(note => {
                    if (note.type === 'NoteTxt') return note.info.txt.toLowerCase().includes(this.filter.noteName);
                    if (note.type === 'NoteTodos') {
                        return note.info.todos.some(todo => {
                            return todo.txt.toLowerCase().includes(this.filter.noteName);
                        });
                    }
                })
            }

            return filteredNotes;
        },
        pinnedToShow() {
            let filteredPinned = this.notes.filter(note => {
                return note.isPinned;
            })
            if (!this.filter) return filteredPinned;
            if (this.filter.noteType !== 'All') {
                filteredPinned = this.notes.filter(note => {
                    return note.type === this.filter.noteType;
                });
            }

            if (this.filter.noteName) {
                filteredPinned = filteredPinned.filter(note => {
                    if (note.type === 'NoteTxt') return note.info.txt.toLowerCase().includes(this.filter.noteName);
                    if (note.type === 'NoteTodos') {
                        return note.info.todos.some(todo => {
                            return todo.txt.toLowerCase().includes(this.filter.noteName);
                        });
                    }
                })
            }

            return filteredPinned;
        },
        pinnedTitle() {
            if (this.pinnedToShow.length !== 0) return true

        },
        listTitle() {
            if (this.notesToShow.length !== 0) return true
        }
    },
    created() {
        this.getNotes()
        eventBus.$on('update', this.updateNote)
        eventBus.$on('filter', this.setFilter)
        eventBus.$on('save', this.saveNote)
    },
    destroyed() {
        eventBus.$off('update', this.updateNote)
        eventBus.$off('filter', this.setFilter)
        eventBus.$off('save', this.saveNote)
    },
    components: {
        NotePreview,
        AddNote
    }
}
