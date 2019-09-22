<template>
  <div class='container'>
		<h1>Vision API デモ</h1>
		<b-alert show variant="danger" v-if="errObj">{{errorMessage}}</b-alert>
    <b-form-file style="width: 50%"
      v-if="!this.result"
      v-model="file"
      :state="Boolean(file)"
      placeholder="Choose a file or drop it here"
      drop-placeholder="Drop file here"
      @change="onFileChange"
    ></b-form-file>
		<div class="mt-3">
			<img class="img" v-if="uploadedImage" :src="uploadedImage" />
		</div>
		<div class="mt-3">
			<b-button variant="primary" @click="analyze" v-if="uploadedImage && !result">分析</b-button>
		</div>
		<div class="mt-3">
			<b-spinner variant="primary" type="grow" label="Spinning" v-if="loading"></b-spinner>
			<b-button-group v-else-if="!loading && result">
				<b-button variant="success" v-if="this.result.faceAnnotations.length > 0" @click="moveTo('/face')">Face</b-button>
				<b-button variant="success" v-if="this.result.labelAnnotations.length > 0" @click="moveTo('/label')">Label</b-button>
				<b-button variant="success" v-if="this.result.localizedObjectAnnotations.length > 0" @click="moveTo('/object')">Object</b-button>
			</b-button-group>
		</div>
		<router-view :result="result" :uploadedImage="uploadedImage"></router-view>
    <b-form-file
      v-if="this.result"
      style="width: 50%"
      :state="Boolean(file)"
      placeholder="New File"
      drop-placeholder="Drop file here"
      @change="onFileChange"
    ></b-form-file>
  </div>


</template>

<script>

// Your GCP API_KEY
// const API_KEY = "AIzaSyBeRcrCNuhyf-hUe-ii4SGXRkMRHzC8WOI"
// const baseURL = "api"
import axios from 'axios'
import _ from 'lodash'

export default {
	name: 'Vision',
	data () {
		return {
      //  fileはbootstrap-vueのv-model用
      file: null,
			uploadedImage: null,
			result: null,
			loading: false,
			isFaceExists: false,
			isLabelExists: false,
			isObjectExists: false,
			errObj: '',
			request: {
			"requests":[
				{
					"image":{
					"content": null
					},
					"features":[
					{
						"type":"FACE_DETECTION",
						"maxResults": 50
					},
					{
						"type": "LABEL_DETECTION",
						"maxResults": 50
					},
					{
						"maxResults": 50,
						"type": "OBJECT_LOCALIZATION"
					},
					]
				}
			]
			}
    }
  },
  computed:{
    errorMessage(){
      return this.errObj
    }
  },
  methods:{
		onFileChange(e){
			this.result = null
      this.uploadedImage = null

			let files = e.target.files || e.dataTransfer.files;
			this.createImage(files[0]);
		},
		createImage(file){
			const reader = new FileReader()
			reader.onload = (e) => {
				this.uploadedImage = e.target.result
			}
			reader.readAsDataURL(file);
		},
		analyze(){
			this.loading = true
      this.errObj = ""
			const img = _.cloneDeep(this.uploadedImage)

			// base64の最初のdata:以下を削除
			const startIndex = img.indexOf(",")
			this.request.requests[0].image.content = img.slice(startIndex + 1)

			const test = {img: img.slice(startIndex + 1)}
			axios.post('/api/vision', test).then(response => {
				this.loading = false
				console.log(response.data[0])
				this.result = response.data[0]
				// 自動的に遷移させる
				if(this.result.faceAnnotations.length > 0){
					this.moveTo('/face')
				}else if (this.result.labelAnnotations.length > 0){
					this.moveTo('/label')
				}else if(this.result.localizedObjectAnnotations.length > 0){
					this.moveTo('/object')
				}else{
					this.errObj = new Error("エラーが発生しました")
				}
			}).catch(error => {
        this.errObj = error
			})

			// axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`, this.request).then(response => {
			// 	this.loading = false
			// 	this.result = response.data.responses[0]

			// 	// 自動的に遷移させる
			// 	if(this.result.faceAnnotations){
			// 		this.moveTo('/face')
			// 	}else if (this.result.labelAnnotations){
			// 		this.moveTo('/label')
			// 	}else if(this.result.localizedObjectAnnotations){
			// 		this.moveTo('/object')
			// 	}else{
			// 		this.errObj = new Error("エラーが発生しました")
			// 	}

			// }).catch(error => {
      //   this.errObj = error
			// 	console.log(error);
			// })
		},
		moveTo(to){
			if (this.$route.path === to) return
			this.$router.push(to)
		}
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.img {
  max-width: 300px;
  max-height: 300px;

}
</style>
