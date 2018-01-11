!function(){"use strict";let e=document.createElement("template");e.innerHTML='<style>\n  :host{\n    pointer-events: none;\n    display: flex;\n    position: fixed;\n    justify-content: flex-end;\n    top: 0;\n    left: 0;\n    z-index: 990;\n    transform: translateZ(100px); /* safari hack */\n    width: 100vw;\n    height: 66px;\n  }\n  /*Firefox bug: responsive-menu > [slot="items"]*/\n  nav [slot="items"],\n  ::slotted([slot="items"]){\n    pointer-events: auto;\n    padding: var(--size-xl, 20px) var(--size-s, 10px) var(--size-m, 10px);\n    margin: 0 var(--size-xs);\n    text-decoration: none;\n    text-transform: uppercase;\n    overflow: hidden;\n    position: relative;\n    font-size: var(--size-l);\n    font-family: var(--font-montserrat);\n    font-weight: var(--font-montserrat-bold);\n  }\n  nav{\n    display: flex;\n    position: absolute;\n    z-index: 10;\n    height: 66px;\n    top: -66px;\n    right: 0;\n    opacity: 0;\n    transition-property: opacity, top;\n    transition-duration: .35s;\n  }\n  :host([extended]) nav{\n    top: 0;\n    opacity: 1;\n  }\n  #menuIcon {\n    position: absolute;\n    top: 0;\n    right: 0;\n    z-index: 100;\n    pointer-events: all;\n    cursor: pointer;\n    width: 60px;\n    height: 60px;\n    transform: translate3d(4px, 0, 0);\n  }\n  #menuIcon path, :host([extended][overlayvisible]) #menuIcon path{\n    fill: none;\n    stroke-width: 40px;\n    stroke: var(--responsive-menu-menu-icon, rgb(33,37,41));\n    stroke-dashoffset: 0;\n    opacity: 1;\n    transition: opacity .5s .2s ease, stroke-dashoffset .5s .2s ease, stroke .3s ease;\n  }\n  :host([extended]) #menuIcon path {\n    transition: stroke-dashoffset 0.5s cubic-bezier(0.25, -0.25, 0.75, 1.25), stroke-dasharray 0.5s cubic-bezier(0.25, -0.25, 0.75, 1.25), stroke .3s ease;\n    stroke-dashoffset: 240px;\n    opacity: 0;\n  }\n  #menuIcon path#top,\n  #menuIcon path#bottom {\n    stroke-dasharray: 270px 950px;\n  }\n  #menuIcon path#middle {\n    stroke-dasharray: 270px 270px;\n  }\n  :host([overlayVisible]) #menuIcon path#top,\n  :host([overlayVisible]) #menuIcon path#bottom {\n    stroke-dashoffset: -666px;\n  }\n  :host([overlayVisible]) #menuIcon path#middle {\n    stroke-dashoffset: -270px;\n  }\n  :host([overlayVisible]) #menuIcon path{\n    stroke: var(--responsive-menu-close-icon, rgb(255,255,255));\n  }\n  :host([overlayVisible]){\n    height: 100%;\n  }\n  :host([overlayVisible]) nav{\n    flex-direction: column;\n    height: 100%;\n    width: 30%;\n    min-width: 300px;\n    color: rgb(255,255,255);\n    opacity: 0;\n    padding-top: var(--size-xl);\n  }\n  :host(.is-active) nav{\n    opacity: 1;\n    top: 0;\n  }\n  /*Firefox bug: responsive-menu > [slot="items"]*/\n  :host([overlayVisible]) nav [slot="items"],\n  :host([overlayVisible]) ::slotted([slot="items"]){\n    font-size: var(--size-xl);\n  }\n  #info{\n    display: flex;\n    justify-content: center;\n    flex-direction: column;\n    pointer-events: none;\n    position: absolute;\n    z-index: 10;\n    opacity: 0;\n    bottom: -50px;\n    left: 0;\n    transition: bottom .3s ease, opacity .3s ease;\n    width: 70%;\n    height: 100%;\n    max-width: calc(100% - 300px);\n    background: rgb(255,255,255);\n  }\n  :host([overlayVisible]) #info{\n    opacity: 0;\n    bottom: -50px;\n    pointer-events: all;\n    transition: bottom .3s ease, opacity .3s ease;\n  }\n  :host(.is-active) #info{\n    opacity: 1;\n    bottom: 0px;\n    transition: bottom .3s ease, opacity .3s ease;\n  }\n  @media(max-width: 700px){\n    :host([overlayVisible]) #info{\n      display: none;\n    }\n  }\n  #background{\n    z-index: 1;\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background-color: transparent;\n    transition: background-color .3s ease;\n  }\n  #background.is-active{\n    background-color: var(--blue);\n  }\n  footer{\n    display: none;\n    pointer-events: all;\n  }\n  :host([overlayVisible]) footer{\n    display: block;\n    position: absolute;\n    right: 0;\n    bottom: -50px;\n    z-index: 10;\n    height: 50px;\n    width: 30%;\n    min-width: 300px;\n    opacity: 0;\n    transition: bottom .3s ease, opacity .3s ease;\n  }\n  :host(.is-active) footer{\n    bottom: 0;\n    opacity: 1;\n  }\n  </style>\n  <svg id="menuIcon" viewBox="0 0 800 500">\n    <path d="M270,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200" id="top"></path>\n    <path d="M270,320 L540,320" id="middle"></path>\n    <path d="M270,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190" id="bottom" transform="translate(480, 320) scale(1, -1) translate(-480, -318) "></path>\n  </svg>\n  <div id="info">\n    <slot name="info"></slot>\n    <slot name="infoBackground"></slot>\n  </div>\n  <nav>\n    <slot name="items"></slot>\n    <slot name="navBackground"></slot>\n  </nav>\n  <footer>\n    <slot name="footer"></slot>\n  </footer>\n  <div id="background">\n    <slot name="background"></slot>\n  </div>\n  ';window.customElements.define("responsive-menu",class extends HTMLElement{constructor(){super(),this._thresholdY=150,this._collpaseSize=700,this._animateOverlayBg=!0,this._hideOverlayDelay=300;let t=this.attachShadow({mode:"open"});"undefined"!=typeof ShadyCSS&&(ShadyCSS.prepareTemplate(e,"responsive-menu"),ShadyCSS.styleElement(this)),t.appendChild(document.importNode(e.content,!0))}static get observedAttributes(){return["thresholdY","collpaseSize","hideOverlayDelay","animateOverlayBg"]}attributeChangedCallback(e,t,n){this[e]=n}connectedCallback(){this.toggleExtended();let e;document.addEventListener("scroll",this.throttle(function(){this.toggleExtended(),clearTimeout(e),e=setTimeout(()=>{this.toggleExtended()},300)}.bind(this),20)),window.addEventListener("resize",this.throttle(function(){this.toggleExtended()}.bind(this),20)),this.shadowRoot.querySelector("#menuIcon").addEventListener("click",this.toggleOverlay.bind(this))}throttle(e,t){let n=!1;return function(){n||(e.call(),n=!0,setTimeout(function(){n=!1},t))}}toggleExtended(){return window.pageYOffset>this._thresholdY?this.removeAttribute("extended"):document.documentElement.clientWidth<this.collpaseSize?this.removeAttribute("extended"):void this.setAttribute("extended","")}set thresholdY(e){this._thresholdY!==e&&(this._thresholdY=e)}get thresholdY(){return this._thresholdY}set collpaseSize(e){this._collpaseSize!==e&&(this._collpaseSize=e)}get collpaseSize(){return this._collpaseSize}set hideOverlayDelay(e){this._hideOverlayDelay!==e&&(this._hideOverlayDelay=e)}get hideOverlayDelay(){return this._hideOverlayDelay}set animateOverlayBg(e){this._animateOverlayBg!==e&&(this._animateOverlayBg=e)}get animateOverlayBg(){return this._animateOverlayBg}toggleOverlay(){if(!this.hasAttribute("overlayVisible"))return this.dispatchEvent(new CustomEvent("toggleOverlay",{detail:{visible:!0}})),document.body.style.overflow="hidden",!0===this._animateOverlayBg&&this.shadowRoot.querySelector("#background").classList.add("is-active"),this.classList.add("is-active"),this.setAttribute("overlayVisible","");this.dispatchEvent(new CustomEvent("toggleOverlay",{detail:{visible:!1}})),!0===this._animateOverlayBg&&this.shadowRoot.querySelector("#background").classList.remove("is-active"),this.classList.remove("is-active"),setTimeout(()=>{this.removeAttribute("overlayVisible"),document.body.style.overflow="auto"},this.hideOverlayDelay)}})}();
//# sourceMappingURL=/responsiveMenu.js.map
