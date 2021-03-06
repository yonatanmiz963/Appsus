import { mailServices } from '../services/email.service.js'
import { eventBus } from '../../../services/event-bus-service.js'
import composeBtn from '../cmps/email-compose.cmp.js'
import emailList from '../cmps/email-list.cmp.js'
import choosenOption from '../cmps/choosen-option.cmp.js'
import mailCompose from '../cmps/mail-compose.cmp.js'
import emailStatus from '../cmps/email-status.cmp.js'

export default {
    template: `
    <section class="mail-page flex column center align-items">
        <div class="mail-main-container flex center common-width">
            <div class="mail-options-container flex column align-items">
                <div class="options-container-app flex column align-items center">
                    <compose-btn @compose="compose"/>
                    <email-status :mailsRead="readPrecenteage"/>
                </div>
                <div class="choosen-option-container flex column">
                    <choosen-option :chooseName="'Inbox'" @click.native="filterAll" :class="isActive('inbox')"/>
                    <choosen-option :chooseName="'Favorites'" @click.native="getFavorite" :class="isActive('favorites')" />
                    <choosen-option :chooseName="'Sent Mails'" @click.native="sentMails" :class="isActive('sentMails')" />
                </div>
            </div>
            <div class="mail-massage-container">
                <email-list :mails="mails" @deleteMail = "deleteMail" @changeStatus="calculateReadenMails"/>
                <mail-compose v-if="isAddingMail" @send="sendMail"/>
            </div>
        </div>
    </section>
    `,
    data() {
        return {
            isAddingMail: false,
            mails: null,
            choosenOption: 'inbox',
            sentedMails: null,
            readenMails: null,
            lengthMail: null,
            readPrecenteage: 0
        }
    },
    components: {
        composeBtn,
        emailList,
        choosenOption,
        mailCompose,
        emailStatus,
        
    },
    methods: {
        compose() {
            this.isAddingMail = true
        },

        loadMails() {
            mailServices.query()
                .then(mails => {
                    this.mails = mails
                })
        },

        deleteMail(mail) {
            mailServices.deleteMail(mail)
                .then((mails) => {
                    this.mails = mails
                    const msg = {
                        txt: `The email was deleted`,
                        type: 'success'
                    }
                    eventBus.$emit('show-msg', msg)
                })
        },
        filterAll() {
            this.choosenOption = 'inbox'
            mailServices.query()
                .then(mails => this.mails = mails)
            this.isAddingMail = false
            this.$router.push('/mail').catch(() => { })
        },
        getFavorite() {
            this.choosenOption = 'favorites'
            mailServices.filterByFavorites()
                .then(mails => this.mails = mails)
            this.isAddingMail = false
            this.$router.push('/mail').catch(() => { })
        },
        isActive(name) {
            return { 'active-option': this.choosenOption === name }
        },
        sentMails() {
            this.choosenOption = 'sentMails'
            mailServices.filterBySented()
                .then(mails => this.mails = mails)
            this.isAddingMail = false
            this.$router.push('/mail').catch(() => { })
        },
        filteredMails() {
            eventBus.$on('filtered', (filteredMails) => {
                this.mails = filteredMails
            })
        },
        sendMail(mail) {
            mailServices.createMail(mail)
                .then(() => {
                    this.loadMails()
                    this.calculateReadenMails()
                    const msg = {
                        txt: `The email was sending succesfuly`,
                        type: 'success'
                    }
                    eventBus.$emit('show-msg', msg)
                })
                .catch(()=>{
                    const msg = {
                        txt: `Errorr! The email wasn't sending succesfuly`,
                        type: 'error'
                    }
                    eventBus.$emit('show-msg', msg)
                })
            this.isAddingMail = false
        },
        calculateReadenMails() {
            var mailsToCalc = mailServices.getReadenMails()
            mailsToCalc.mailsLength
                .then(mailsLength => this.lengthMail = mailsLength)
            mailsToCalc.readenMails
                .then(mailsReaden => {
                    this.readenMails = mailsReaden
                    if (mailsReaden) this.readPrecenteage = ((this.readenMails / this.lengthMail) * 100).toFixed(1)
                })
        },
        checkIfNote() {
            const noteId = this.$route.params.note;
            if (noteId) this.compose()
            else {
                this.close()
                this.$router.push('/mail').catch(() => { })
            }
        },
        close() {
            this.isAddingMail = false;
        }

    },
    watch: {
        '$route.params.note'() {
            this.checkIfNote()
        }
      
    },
    created() {
        this.loadMails()
        this.calculateReadenMails()
        this.filteredMails()
        this.checkIfNote()
    },
}