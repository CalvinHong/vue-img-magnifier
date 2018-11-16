import Event from './Event'
import Magnifier from './Magnifier'
let lastId=0
let lastPreviewId=0
export default {
  install(Vue, options={}) {
    const opts = Object.assign({
      width: 0,
      height: 0,
      zoom: 3
    }, options)
    Vue.directive('magnifier', {
      inserted: function (el, binding, vnode) {
          el.classList.add('magnifier-thumb-wrapper')
          const $img = el.querySelector('img')
          if(!$img) {
            console.warn(`not find img`)
          }else{
            if(!$img.id) {
              $img.id = `magnifier_${lastId++}`
            }
            const isLoaded = $img.complete && $img.naturalHeight !== 0
            let $preview
            const {width:w=0,height:h=0} = Object.assign({}, opts, binding.value || {})
            vnode.context.__magifier = {}
            vnode.context.__magifier.adjustPreview = ()=>{
              const {width, height} = $img.getBoundingClientRect()
              let pW=w
              let pH=h
              if(!w && !h) {
                pW = width
                pH = height
              }
              if(w && !h) {
                pH =  height/width * pW
              }
              if(!w && h) {
                pW = width/height * pH
              }
              $preview.style.width = `${pW}px`
              $preview.style.height = `${pH}px`
            }
            const attach = ()=>{
              $preview = document.createElement('div')
              $preview.id = `magnifier_preview_${lastPreviewId++}`
              $preview.className = 'magnifier-preview'
              el.appendChild($preview)
              vnode.context.__magifier.adjustPreview()
              vnode.context.$magifier = new Magnifier(new Event(), {
                zoom: opts.zoom
              })
              vnode.context.$magifier.attach({
                thumb: `#${$img.id}`,
                largeWrapper: $preview.id
              })
              $img.removeEventListener('load', attach)
            }
            if(isLoaded) {
              attach()
            }else{
              $img.addEventListener('load', attach)
              $img.addEventListener('load', () => {
                if($preview) {
                  vnode.context.__magifier.adjustPreview()
                }
              })
            }
            window.addEventListener('resize', vnode.context.__magifier.adjustPreview)
          }
          
      },
      unbind(el, binding, vnode){
        vnode.context.$magifier && vnode.context.$magifier.destory()
        window.removeEventListener('resize', vnode.context.__magifier.adjustPreview)

      }
    })
  }
}
