const express = require('express')
const router = express.Router()
const vision = require('@google-cloud/vision');
require('dotenv').config();


router.post('/api/vision', async (req, res) => {
  const client = await new vision.ImageAnnotatorClient();
  const request = {
    image: { content: req.body.img},
    features: [
      {
        "type": "FACE_DETECTION",
        "maxResults": 10
      },
      {
        "type": "LABEL_DETECTION",
        "maxResults": 10
      },
      {
        "type": "OBJECT_LOCALIZATION",
        "maxResults": 10
      },
      {
        "type": "LANDMARK_DETECTION",
        "maxResults": 10
      },
      {
        "type": "LOGO_DETECTION",
        "maxResults": 10
      },
      {
        "type": "TEXT_DETECTION",
        "maxResults": 10
      },
      {
        "type": "WEB_DETECTION",
        "maxResults": 10
      },
      {
        "type": "SAFE_SEARCH_DETECTION",
        "maxResults": 10
      },
    ]
  };
  await client
    .annotateImage(request)
      .then(response => {
        // doThingsWith(response);
        res.json(response)
      })
      .catch(err => {
        res.json(err)
      });
})

module.exports = router
