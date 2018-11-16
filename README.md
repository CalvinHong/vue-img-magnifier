# vue-img-magnifier 图片放大镜
支持Vue2.0+, 支持Nuxt.js

![](demo.gif)

### 安装
```
npm install --save vue-img-magnifier
```
or
```
yarn add vue-img-magnifier
```

配置js
```
import Magnifier from 'vue-img-magnifier'
Vue.use(Magnifier, [options])
```
配置css
```
@import '~vue-img-magnifier/style.css'
```
or
```
import 'vue-img-magnifier/style.css'
```

使用非常简单，在img容器写上指令 `v-magnifier`, 然后给img绑定data-large-img-url大图地址即可
```jsx
<template>
    <div>
        <div class="magnifier-thumb-wrapper" v-magnifier="options">
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
          options: {
              // magnifier options
          }
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

### options相关配置项

| 属性名 | 默认值 | 说明 |
|--------|--------|------|
|   width     |     0   |   预览框的宽度，不设置高度，自动按照小图的比例计算高度   |
|    height    |    0    |  预览框的高度，不设置宽度，自动按照小图的比例计算宽度    |
|   zoom     |   3    |  缩放比例   |