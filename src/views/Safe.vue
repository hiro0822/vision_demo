<template>
	<div class="mt-3 mb-3" v-if="results">
		<h5>{{resultKey}}</h5>
		<!-- 画像部分もcomponentで外出ししたい -->
		<div class="image-box mr-3">
		<!-- <img class="img" v-if="uploadedImage" :src="uploadedImage" /> -->
			<canvas id="canvasInSafe" class="img"></canvas>
		</div>
		<div class="safeSearchAnnotation">
			<div class="mt-3">
				<h5>Adult:{{results[resultKey].adult}}</h5>
				<b-progress :value="changeLikeHoodTextToNumber(results[resultKey].adult)" :precision="2" height="5px" class="mb-3"></b-progress>
				<h5>Medical:{{results[resultKey].medical}}</h5>
				<b-progress :value="changeLikeHoodTextToNumber(results[resultKey].medical)" :precision="2" height="5px" class="mb-3"></b-progress>
				<h5>Racy:{{results[resultKey].racy}}</h5>
				<b-progress :value="changeLikeHoodTextToNumber(results[resultKey].racy)" :precision="2" height="5px" class="mb-3"></b-progress>
				<h5>Spoof:{{results[resultKey].spoof}}</h5>
				<b-progress :value="changeLikeHoodTextToNumber(results[resultKey].spoof)" :precision="2" height="5px" class="mb-3"></b-progress>
				<h5>Violence:{{results[resultKey].violence}}</h5>
				<b-progress :value="changeLikeHoodTextToNumber(results[resultKey].violence)" :precision="2" height="5px" class="mb-3"></b-progress>
			</div>
		</div>
	</div>
</template>

<script>

import Mixin from '@/mixins/mixin'

export default {
	name: 'SafeSearchAnnotation',
	props: ['results', 'uploadedImage', 'resultKey'],
	mixins: [ Mixin ],
	methods: {
		changeLikeHoodTextToNumber(text){
			if (text==="VERY_UNLIKELY") {
				return 0
			}else if (text==="UNLIKELY") {
				return 25
			}else if (text==="LIKELY") {
				return 50
			}
			else if (text==="VERY_LIKELY") {
				return 100
			}
		},
		drawImageAndBorder(){
			if (!this.results || !this.uploadedImage) return
			// drawImageAndBorder自体ををmixinにして外に出したかったが、getElementByIdが上手くいかなかった。
			const canvas = document.getElementById("canvasInSafe")
			let ctx = canvas.getContext('2d')

			let image = new Image()
			image.src = this.uploadedImage

			image.onload = ()=>{
				// canvasにimgを描画
				canvas.width = image.width
				canvas.height = image.height
				ctx.drawImage(image, 0, 0)
			}
		}
	},
	mounted(){
		this.drawImageAndBorder()
	},
}
</script>
<style scoped>

.safeSearchAnnotation {
	height: 300px;
	width: 50%;
	overflow: auto;
	display: inline-block;
	vertical-align: middle;
}

.image-box {
	display: inline-block;
	max-height: 300px;
	vertical-align: middle;
}

.img {
	max-width: 300px;
	max-height: 300px;
}
</style>
