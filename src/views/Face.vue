<template>
	<div class="mt-3 mb-3" v-if="results">
		<h5>{{resultKey}}</h5>
		<div class="image-box mr-3">
			<canvas id="canvasInFace" class="img"></canvas>
		</div>
		<div class="faceAnnotations">
			<div class="mt-3">
				<div v-for="(faceA, index) in results.faceAnnotations" :key="index">
					<h5 class="mb-3">{{`Face ${index}`}} | {{Math.round(faceA.detectionConfidence * 1000) / 10}} %</h5>
					<p>怒り:{{faceA.angerLikelihood}}</p>
					<b-progress :value="changeLikeHoodTextToNumber(faceA.angerLikelihood)" :precision="2" height="5px" class="mb-3"></b-progress>
					<p>嬉しさ:{{faceA.joyLikelihood}}</p>
					<b-progress :value="changeLikeHoodTextToNumber(faceA.joyLikelihood)" :precision="2" height="5px" class="mb-3"></b-progress>
					<p>悲しさ:{{faceA.sorrowLikelihood}}</p>
					<b-progress :value="changeLikeHoodTextToNumber(faceA.sorrowLikelihood)" :precision="2" height="5px" class="mb-3"></b-progress>
					<p>驚き:{{faceA.surpriseLikelihood}}</p>
					<b-progress :value="changeLikeHoodTextToNumber(faceA.surpriseLikelihood)" :precision="2" height="5px" class="mb-3"></b-progress>
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
				const canvas = document.getElementById("canvasInFace")
				let ctx = canvas.getContext('2d')

				const data = this.results.faceAnnotations

				let maxAndMinvertex = []
				data.forEach(faceA => {
					maxAndMinvertex.push(this.calculateMaxAndMinVertex(faceA.boundingPoly.vertices))
				});

				let image = new Image()
				image.src = this.uploadedImage

				image.onload = ()=>{
					// canvasにimgを描画
					canvas.width = image.width
					canvas.height = image.height
					ctx.drawImage(image, 0, 0)

					// canvasに四角形を描画
					// 起点となる左上の点は(minX,maxY)
					// widthはmaxX-minY heightはmaxY-minY

					// FIXME:ctx.fontとlineWidthの適切なロジックを考える
					ctx.strokeStyle = '#75ff4f'
					ctx.fillStyle = '#75ff4f'
					ctx.font = `${Math.round(image.height / 15)}px serif`;
					ctx.textAlign = 'center'
					ctx.lineWidth = Math.round(image.width / 80)

					// FIXME:画像サイズが大きすぎる、または画像いっぱいに顔があると枠の表示がうまくいかなくなる。
					maxAndMinvertex.forEach((data, index)=>{

						// 頭のてっぺんが画像からはみ出ていると、上手くminYを計算できない事があるのでそれを回避。
						if(data.maxY === data.minY){
							data.minY = 0
						}

						// 四角い枠をつける
						ctx.strokeRect(data.minX, data.minY, data.maxX-data.minX, data.maxY-data.minY)
						// ラベルをつける
						ctx.fillText(`Face:${index}`, (data.maxX + data.minX) / 2, data.maxY + Math.round(image.height / 20) )
					})
				}
		}
	},
	mounted() {
		this.drawImageAndBorder()
	},
}
</script>

<style scoped>

.faceAnnotations {
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
