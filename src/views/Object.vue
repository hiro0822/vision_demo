<template>
	<div class="mt-3 mb-3" v-if="results">
		<h5>{{resultKey}}</h5>
		<div class="image-box mr-3">
			<canvas id="canvasInObject" class="img"></canvas>
		</div>
		<div class="localizedObjectAnnotations">
			<div class="mt-3">
				<div v-for="(objectA, index) in results.localizedObjectAnnotations" :key="index">
					<h5>{{objectA.name}} | {{Math.round(objectA.score * 1000) / 10}}%</h5>
					<b-progress :value="objectA.score * 100" :precision="2" height="5px" class="mb-3"></b-progress>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import Mixin from '@/mixins/mixin'

export default {
	name: 'FaceAnnotation',
	props: ['results', 'uploadedImage', 'resultKey'],
	mixins: [ Mixin ],
	data(){
		return {

		}
	},
	methods: {
		drawImageAndBorder(){
			if (!this.results || !this.uploadedImage) return
			// drawImageAndBorder自体ををmixinにして外に出したかったが、getElementByIdが上手くいかなかった。
			const canvas = document.getElementById("canvasInObject")
			let ctx = canvas.getContext('2d')

			const data = this.results.localizedObjectAnnotations

			let image = new Image()
			image.src = this.uploadedImage

			image.onload = ()=>{
				// canvasにimgを描画
				canvas.width = image.width
				canvas.height = image.height
				ctx.drawImage(image, 0, 0,image.width, image.height)

				ctx.strokeStyle = '#75ff4f'
				ctx.fillStyle = '#75ff4f'
				ctx.font = `${Math.round(image.height / 15)}px serif`;
				ctx.textAlign = 'center'
				ctx.lineWidth = Math.round(image.width / 80)

				// cf. https://stackoverflow.com/questions/53765913/object-localization-google-vision-api
				for(let i = 0; i < data.length; i++){
					let vertex = []
					ctx.beginPath();
					vertex.push(data[i].boundingPoly.normalizedVertices[0])
					const startingPos = data[i].boundingPoly.normalizedVertices[0];

					// オブジェクトのてっぺんが画像からはみ出ていると、上手くminYを計算できない事があるのでそれを回避。
					if(!startingPos.x) startingPos.x = 0
					if(!startingPos.y) startingPos.y = 0

					ctx.moveTo(startingPos.x * canvas.width, startingPos.y * canvas.height);
					for(let j = 1; j < data[i].boundingPoly.normalizedVertices.length; j++){
						vertex.push(data[i].boundingPoly.normalizedVertices[j]);
						let pos = data[i].boundingPoly.normalizedVertices[j];
						if(!pos.x) pos.x = 0
						if(!pos.y) pos.y = 0
						ctx.lineTo(pos.x * canvas.width, pos.y * canvas.height);
					}
					ctx.lineTo(startingPos.x * canvas.width, startingPos.y * canvas.height);
					ctx.stroke();
				}
			}
		}
	},
	mounted(){
		this.drawImageAndBorder()
	},
}
</script>
<style scoped>

.localizedObjectAnnotations {
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
