export default {
   methods: {
      calculateMaxAndMinVertex(points){
         const maxXObject =  _.maxBy(points, (point)=>{
            return point.x
         })
         const maxYObject = _.maxBy(points, (point)=>{
            return point.y
         })

         const minXObject = _.minBy(points, (point)=>{
            return point.x
         })

         const minYObject = _.minBy(points, (point)=>{
            return point.y
         })

         return {
            maxX : maxXObject.x,
            maxY : maxYObject.y,
            minX : minXObject.x,
            minY : minYObject.y,
         }
      }
   },
}
