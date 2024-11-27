const dns = require('dns');
const { url } = require('inspector');
const { resolve } = require('path');

let urls = [];

function validateUrl(url) {
    return new Promise((resolve, reject) => {
        try {
            const urlObj = new URL(url);
            if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                throw new Error('invalid url');
            }
            
            const hostname = urlObj.hostname;
            dns.lookup(hostname, (err, address) => {
                if (err) reject(new Error('invalid url'));
                else resolve(true);
            });
        } catch {
            reject(new Error('invalid url'));
        }
    });
}

async function getShortUrl(url){
    try {
        const isValidUrl = await validateUrl(url);
        if (isValidUrl){
            const short_url = urls.length + 1;
            urls.push({
                "original_url":url,
                "short_url": short_url
            });
            return short_url;
        }
    } catch(err) {
        console.log("invalid url",err);
        throw err;
    }
}

function getOriginUrl(short_url){
    const matched_url =  urls.find(url => url['short_url'] === parseInt(short_url));
    if (!matched_url) return;
    return matched_url['original_url'];
}

module.exports = {
    getShortUrl:getShortUrl,
    getOriginUrl:getOriginUrl
}