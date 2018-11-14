# vue-magnifier 图片放大镜
支持Vue2.0+, 支持Nuxt.js

- 安装
```
npm install --save vue-magnifier
```
or
```
yarn add vue-magnifier
```

配置js
```
import Magnifier from 'vue-magnifier'
Vue.use(Magnifier)
```
配置css
```
@import '~vue-magnifier/style.css'
```
or
```
import 'vue-magnifier/style.css'
```

使用非常简单，在img容器写上指令 `v-magnifier`, 然后给img绑定data-large-img-url大图地址即可
```jsx
<template>
    <div>
        <div class="magnifier-thumb-wrapper" v-magnifier>
            <img :src="img" class="img" :data-large-img-url="img"/>
        </div>
        <div @click="changeImg">change img</div>
    </div>
</template>
<script>
export default {
    data(){
        return {
          imgs: [
             "http://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Starry_Night_Over_the_Rhone.jpg/1200px-Starry_Night_Over_the_Rhone.jpg",
             "https://lowvelder.co.za/wp-content/uploads/sites/44/2017/12/desert-2340326_960_7_15745.jpg"
          ],
          active: 0,
        }
    },
    computed:{
      img(){
       return this.imgs[this.active] 
      } 
    },
    methods: {
      changeImg(){
        this.active = this.active? 0:1
      }
    }
}
</script>

```