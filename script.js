const video = document.getElementById('video')
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models/tiny_face_detector_model-weights_manifest.json'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models/face_landmark_68_model-weights_manifest.json'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models/face_recognition_model-weights_manifest.json'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models/face_expression_model-weights_manifest.json')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => {
      video.srcObject = stream
      video.onloadedmetadata = function(e) {
     };
      return stream
    },
    err => console.error(err)
  )
}

// document.addEventListener('DOMContentLoaded', async () => {
//   var node = await Ipfs.create()
//   const results = await node.add('=^.^= meow meow')
//   if(!results) console.log('Error Setting data to ipfs')
//   else console.log(results)
//   const cid = results.path
  
//   console.log('CID created via ipfs.add:', cid)
//   const data = await node.cat(cid)
//   console.log('Data read back via ipfs.cat:', data)
// })

video.addEventListener('play',async  () => {
  var node = await Ipfs.create()
  const results = await node.add('=^.^= meow meow')
  if(!results) console.log('Error Setting data to ipfs')
  else console.log(results)
  const cid = results.path
  console.log('CID created via ipfs.add:', cid)
  const data = await node.cat(cid)
  console.log('Data read back via ipfs.cat:', data)
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  var capturedFrameArray=[]
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    // console.log(detections)
    // console.log(canvas);
    // if number of faces == 1 
    // for 3 seconds capture the face
    
    if(capturedFrameArray.length < 30){
      capturedFrameArray.push(canvas.toDataURL())
      if(node){
      window.ipfs = node
        const data = await node.add(canvas.toDataURL('image/jpeg'),0.1)
      // sign the data
      // call the mutation
      window.data = data
      console.log(data.pat)
      }
      
    }
    
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    // console.log(resizedDetections)
    // console.log(detections)
  }, 100)
})
