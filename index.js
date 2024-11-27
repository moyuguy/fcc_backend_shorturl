require('dotenv').config();
const express = require('express');
const cors = require('cors');
const service = require('./service');
const app = express();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({extended:false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req,res) => {
  try{
    const { url } = req.body;
    const short_url = await service.getShortUrl(url);
    return res.json({
      "original_url":url,
      "short_url":short_url 
    });
  } catch (err){
    res.json({ error:'invalid url'})
  }
});

app.get('/api/shorturl/:short_url',(req,res) => {
  const short_url = req.params.short_url;
  const original_url = service.getOriginUrl(short_url);
  if (!original_url) {
    return res.status(404).json({ error: "Short URL not found" });
  }
  res.redirect(original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
