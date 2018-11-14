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
            // const {preview, img} = binding.value
            // if(!preview || !img) {
            //   console.warn(`preview、img参数必传`)
            // }else{
            //   const $preview = vnode.context.$refs[preview]
            //   if(!$preview) {
            //     console.warn(`preview node not found!`)
            //   }else{
            //     $preview.classList.add('magnifier-preview')
            //     if(!$preview.id) {
            //       $preview.id = `magnifier_preview_${lastPreviewId++}`
            //     }
            //     vnode.context.$magifier = new Magnifier(new Event())
            //     vnode.context.$magifier.attach({
            //       thumb: `#${$img.id}`,
            //       largeWrapper: $preview.id,
            //       large: img
            //     })
            //   }
            // }
          }
          
      }
    })
  }
}
