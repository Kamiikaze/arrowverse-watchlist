/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'

// Utilities

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  lang: {
    locale: {
      locale: 'de',
      fallback: 'en'
    },
  },
  components: {
    ...components,
    ...labsComponents,
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
        },
      },
    },
  },
})
