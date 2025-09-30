window.maskImage = async function(sourceUrl, maskUrl, width = 375, height = 523) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const sourceImg = new Image();
    sourceImg.crossOrigin = 'Anonymous';
    await new Promise(resolve => {
        sourceImg.onload = resolve;
        sourceImg.src = sourceUrl;
    });

    const maskImg = new Image();
    maskImg.crossOrigin = 'Anonymous';
    await new Promise(resolve => {
        maskImg.onload = resolve;
        maskImg.src = maskUrl;
    });

    ctx.drawImage(maskImg, 0, 0, width, height);
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(sourceImg, 0, 0, width, height);

    return canvas.toDataURL('image/png');
}
