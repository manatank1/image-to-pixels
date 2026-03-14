const Jimp = require('jimp');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { url, w, h } = req.query;
    
    if (!url) {
        return res.status(400).json({ error: 'URL necessária' });
    }
    
    try {
        const width = parseInt(w) || 50;
        const height = parseInt(h) || 50;
        
        const image = await Jimp.read(url);
        image.resize(width, height);
        
        const pixels = [];
        
        image.scan(0, 0, width, height, function(x, y, idx) {
            const r = this.bitmap.data[idx];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            const a = this.bitmap.data[idx + 3];
            
            if (a > 128) {
                pixels.push([x, y, r, g, b, a]);
            }
        });
        
        res.json(pixels);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
