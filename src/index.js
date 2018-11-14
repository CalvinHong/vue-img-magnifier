import Event from './Event'
import Magnifier from './Magnifier'
let lastId=0
let lastPreviewId=0
export default {
  install(Vue, options={}) {
    const opts = Object.assign({
      previewZoom: 2
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
            const attach = ()=>{
              const {width, height} = $img.getBoundingClientRect()
              const $preview = document.createElement('div')
              $preview.id = `magnifier_preview_${lastPreviewId++}`
              $preview.className = 'magnifier-preview'
              $preview.style.width = `${width * opts.previewZoom}px`
              $preview.style.height = `${height * opts.previewZoom}px`
  
              el.appendChild($preview)
              vnode.context.$magifier = new Magnifier(new Event())
              vnode.context.$magifier.attach({
                thumb: `#${$img.id}`,
                largeWrapper: $preview.id,
                large: binding.value
              })
              $img.removeEventListener('load', attach)
            }
            if(isLoaded) {
              attach()
            }else{
              $img.addEventListener('load', attach)
            }
          }
          
      }
    })
  }
}
