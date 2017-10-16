import MoveTo from 'moveto'
import scrollMonitor from 'scrollmonitor'

const CN__INVERSE = 'header--inverse'
const CN_NAV_ITEM__ACTIVE = 'header_nav__item--active'
const CN_LOGO__ACTIVE = 'header_logo--active'

const SELECTOR_LOGO = '._header_logo'
const SELECTOR_MOVE_TO = '._move_to'

const NAV = document.querySelector('.nav_dropdown')
const NAV_TOGGLE = document.querySelector('._toggle_menu')
const BODY = document.querySelector('body')

const SCROLL = { top: 1, bottom: -1 }

class Header {
  _bindEvents () {
    if (NAV_TOGGLE) {
      NAV_TOGGLE.addEventListener('click',
        function (e) {
          e.preventDefault()
          this.classList.toggle('active')
          NAV.classList.toggle('nav_dropdown--open')
          BODY.classList.toggle('menu_opened')
        }, false)
    }

    this.moveTo = new MoveTo()

    this.el.querySelectorAll(SELECTOR_MOVE_TO).forEach(this._bindLink)
  }

  _bindLink = (node) => {
    this.moveTo.registerTrigger(node)

    const href = node.getAttribute('href')
    const section = href ? href.substr(1) : null
    let target = section ? document.getElementById(section) : null

    if (target && node.classList.contains('_header_link')) {
      const watcher = scrollMonitor.create(target, SCROLL)
      const onStateChange = () => {
        if (watcher.isAboveViewport && watcher.isInViewport) {
          node.parentNode.classList.add(CN_NAV_ITEM__ACTIVE)
          NAV_TOGGLE.classList.remove('active')
          NAV.classList.remove('nav_dropdown--open')
          BODY.classList.remove('menu_opened')
        } else {
          node.parentNode.classList.remove(CN_NAV_ITEM__ACTIVE)
        }
      }

      watcher.stateChange(onStateChange)

      setTimeout(onStateChange)
    } else if (href === '#') {
    }
  }

  _initLeadSection () {
    const leadSection = document.getElementById('lead')

    if (!leadSection) {
      return
    }

    const watcher = scrollMonitor.create(leadSection, SCROLL)

    const onStateChange = () => {
      const el = this.el

      if (watcher.isAboveViewport && watcher.isInViewport) {
        this.nodeLogo.classList.add(CN_LOGO__ACTIVE)
        el.classList.remove(CN__INVERSE)
      } else {
        this.nodeLogo.classList.remove(CN_LOGO__ACTIVE)
        el.classList.add(CN__INVERSE)
      }
    }

    watcher.stateChange(onStateChange)

    setTimeout(onStateChange)
  }

  constructor ({ el }) {
    this.el = el
    this.nodeLogo = el.querySelector(SELECTOR_LOGO)

    this._bindEvents()
  }
}

export default Header
