<template>
	<div class="mt-3 mb-3" v-if="results">
		<h5>{{resultKey}}</h5>
		<!-- 画像部分もcomponentで外出ししたい -->
		<div class="image-box mr-3">
		<!-- <img class="img" v-if="uploadedImage" :src="uploadedImage" /> -->
			<canvas id="canvasInText" class="img"></canvas>
		</div>
		<div class="textAnnotations">
			<div class="mt-3">
				<div v-for="(labelA, index) in this.results[resultKey]" :key="index">
					<h5>{{labelA.description}} </h5>
					<b-progress :value="labelA.score * 100" :precision="2" height="5px" class="mb-3"></b-progress>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'TextAnnotations',
	props: ['results', 'uploadedImage', 'resultKey'],
	methods: {
		drawImageAndBorder(){
			if (!this.results || !this.uploadedImage) return
			// drawImageAndBorder自体ををmixinにして外に出したかったが、getElementByIdが上手くいかなかった。
			const canvas = document.getElementById("canvasInText")
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

.textAnnotations {
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
