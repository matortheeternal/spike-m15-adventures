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

window.isLegendary = function(superType) {
    return superType.toLowerCase().includes('legendary');
}

function getLegendName(card) {
    if (!isLegendary(card.superType))
        return card.cardName;
    const match = card.cardName.match(/^(.+),|(.+) the/);
    return match ? match[1] || match[2] : card.cardName;
}

window.generateSymbols = function(str) {
    return str.toLowerCase().split('').map(sym => {
        if ('qtxyz'.includes(sym))
            return `<img class="other" src="/assets/mana-fonts/small/other/mana_${sym}.png"/>`
        if ('0123456789'.includes(sym))
            return `<img src="/assets/mana-fonts/small/number/${sym}.png"/>`;
        if ('wubrgc'.includes(sym))
            return `<img src="/assets/mana-fonts/small/color/mana_${sym}.png"/>`;
        return sym;
    }).join('');
}

const symbolExpr = /([1-9WUBRGwubrgTXYZ]+)(,)/g;

window.formatText = function(text, card) {
    if (text.length === 0) return text;
    return text.replaceAll(symbolExpr, (match, p1, p2) => {
        return generateSymbols(p1) + p2;
    }).replaceAll(/@/g, () => {
        return getLegendName(card);
    }).replaceAll(/(CARDNAME|~)/g, () => {
        return card.cardName;
    });
}

function elementOverflows(el) {
    return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
}

Alpine.directive('fit-text', (el, { expression }, { effect, evaluateLater }) => {
    const adjustFontSize = () => {
        el.style.fontSize = '';
        let fontSize = parseFloat(getComputedStyle(el).fontSize) || 16;
        const minFontSize = 10;
        const step = 0.5;

        while (elementOverflows(el) && fontSize > minFontSize) {
            fontSize -= step;
            el.style.fontSize = `${fontSize}px`;
        }
    };

    effect(() => {
        evaluateLater(expression || 'true')(() => {
            Alpine.nextTick(adjustFontSize);
        });
    });
});
