import Vue from 'vue'

import Modal from './Modal.vue'
import Dialog from './Dialog.vue'
import ModalsContainer from './ModalsContainer.vue'

const defaultComponentName = 'modal'

const Plugin = {
  modal() {
    return {
      _event: new Vue({ modal: {} }),

      _setDynamicContainer (dynamicContainer) {
        Plugin.dynamicContainer = dynamicContainer
      },

      show (modal, paramsOrProps, params) {
        if (typeof modal === 'string') {
          this._event.$emit('toggle', modal, true, paramsOrProps)
        } else {
          if (Plugin.dynamicContainer === null) {
            console.warn('[vue-js-modal] In order to render dynamic modals, a <modals-container> component must be present on the page')
          } else {
            Plugin.dynamicContainer.add(modal, paramsOrProps, params)
          }
        }
      },

      hide (name, params) {
        this._event.$emit('toggle', name, false, params)
      },

      toggle (name, params) {
        this._event.$emit('toggle', name, undefined, params)
      }
    }
  },

  install (_Vue, options = {}) {
    this.dynamicContainer = null
    this.componentName = options.componentName || defaultComponentName

    _Vue.mixin({
      created() {
        const options = this.$options

        if (options.modal) {
          this.$modal = typeof options.modal === 'function'
            ? options.modal()
            : options.modal
        } else if (options.parent && options.parent.$modal) {
          this.$modal = options.parent.$modal
        } else {
          this.$modal = Plugin.modal()
        }
      }
    })
    /**
     * Sets custom component name (if provided)
     */
    _Vue.component(this.componentName, Modal)
    /**
     * Registration of <Dialog/> component
     */
    if (options.dialog) {
      _Vue.component('v-dialog', Dialog)
    }
    /**
     * Registration of <ModalsContainer/> component
     */
    if (options.dynamic) {
      _Vue.component('modals-container', ModalsContainer)
    }
  }
}

export default Plugin
