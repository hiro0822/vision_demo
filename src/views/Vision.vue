<template>
  <div class='container'>
		<h1>Vision API デモ</h1>
		<b-alert show variant="danger" v-if="errObj">{{errorMessage}}</b-alert>
    <b-form-file style="width: 50%"
      v-if="!this.results"
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
			<b-button variant="primary" @click="analyze" v-if="uploadedImage && !results">分析</b-button>
		</div>
		<div class="mt-3">
			<b-spinner variant="primary" type="grow" label="Spinning" v-if="loading"></b-spinner>
		</div>
		<b-card no-body v-if="!loading && results">
			<b-tabs  pills card no-fade>
				<b-tab v-for="( resultKey, index ) in resultKeys" v-bind:key="index" :title="resultKey">
					<b-card-text>
						<div v-bind:is="resultKey" :results="results" :uploadedImage="uploadedImage" :resultKey="resultKey"><div>
					</b-card-text>
				</b-tab>
			</b-tabs>
		</b-card>
    <b-form-file
      v-if="this.results"
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
import axios from 'axios'
import _ from 'lodash'
import FaceAnnotations from './Face'
import LabelAnnotations from './Label'
import LocalizedObjectAnnotations from './Object'
import SafeSearchAnnotation from './Safe'
import TextAnnotations from './Text'
import WebDetection from './Web'
import LogoAnnotations from './Logo'
import FullTextVue from './FullText.vue'

export default {
	name: 'Vision',
	components: {
		"faceAnnotations": FaceAnnotations,
		"labelAnnotations": LabelAnnotations,
		"localizedObjectAnnotations": LocalizedObjectAnnotations,
		"safeSearchAnnotation": SafeSearchAnnotation,
		"textAnnotations": TextAnnotations,
		"webDetection": WebDetection,
		"logoAnnotations": LogoAnnotations,
	},
	data () {
		return {
      //  fileはbootstrap-vueのv-model用
      file: null,
			uploadedImage: null,
			results: null,
			loading: false,
			resultKeys: [],
			errObj: '',
    }
  },
  computed:{
    errorMessage(){
      return this.errObj
		},
  },
  methods:{
		onFileChange(e){
			this.results = null
			this.uploadedImage = null
			this.resultKeys = []
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
			const request = {img: img.slice(startIndex + 1)}
			axios.post('/api/vision', request).then(response => {
				this.loading = false
				const results = response.data[0]
				const resultKeys = []
				if("fullTextAnnotation" in results) {
					delete results["fullTextAnnotation"]
				}
				Object.keys(results).forEach(function (key) {
					if(results[key] == null || results[key].length == 0 ) {
						delete results[key]
					}
				})
				Object.keys(results).forEach(function (key) {
					resultKeys.push(key)
				});
				this.results = results;
				this.resultKeys = resultKeys;
			}).catch(error => {
        this.errObj = error
			})
		},
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
