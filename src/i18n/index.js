import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import en from './en'

Vue.use(VueI18n)

export const messages = {
  'en': {
    '_lang': 'English',
    ...en,
    ...enLocale
  }
}

export default new VueI18n({
  locale: 'en',
  messages
})
