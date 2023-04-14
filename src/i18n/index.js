import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import enLocale from 'element-ui/lib/locale/lang/en'

Vue.use(VueI18n)

export const messages = {
  'en': {
    '_lang': 'English',
    ...enLocale
  }
}

export default new VueI18n({
  locale: Cookies.get('language') || 'en',
  messages
})
