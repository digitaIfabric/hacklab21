const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const multer = require('multer');
const fs = require('fs');

const upload = multer();

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.use(express.static(__dirname + '/public'));

async function testGoogleTextToSpeech(audioBuffer) {
    const speech = require('@google-cloud/speech');
    const client = new speech.SpeechClient( { keyFilename: "hacklab21-493983ad2648.json"});

    const audio = {
    content: audioBuffer.toString('base64'),
    };
    const config = {
    languageCode: 'en-US',
    };
    const request = {
    audio: audio,
    config: config,
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
    return transcription;
}

app.post('/upload_sound', upload.any(), async (req, res) => {
    console.log("Getting text transcription..");
    let transcription = await testGoogleTextToSpeech(req.files[0].buffer);
    console.log("Text transcription: " + transcription);
    res.status(200).send(transcription);
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})