const colorNames = {
    g: 'green',
    w: 'white',
    r: 'red',
    b: 'black',
    u: 'blue'
};

function background(path, zIndex) {
    return { backgroundImage: `url("/assets/m15/${path}")`, zIndex };
}

async function maskedBackground(path, maskPath, zIndex) {
    const url = await maskImage(`/assets/m15/${path}`, `/assets/m15/${maskPath}`);
    return { backgroundImage: `url("${url}")`, backgroundColor: 'black', zIndex };
}

function getColorlessIdentity(superType) {
    return superType.includes('Artifact')
        ? { c: 'a', color: 'artifact' }
        : { c: 'c', color: 'colorless' };
}

function getColorIdentity(manaCost, superType) {
    const colors = new Set(manaCost.toLowerCase().split('')
        .filter(char => 'wubrg'.includes(char)));
    if (colors.size === 0)
        return getColorlessIdentity(superType);
    if (colors.size === 1) {
        const [c] = colors;
        return { c, color: colorNames[c] };
    }
    return { c: 'm', color: 'gold' };
}

const initialCardData = {
    cardName: "Shigeki, Jukai Visionary",
    manaCost: "1G",
    backgrounds: [],
    artUrl: "/assets/tdc-270-shigeki-jukai-visionary.jpg",
    superType: "Legendary Enchantment Creature",
    subType: "Snake Druid",
    rarity: "Rare",
    flavorText: "",
    rulesText: "<p>1G, T, Return @ to its owner's hand: Reveal the top four cards of your " +
        "library. You may put a land card from among them onto the battlefield tapped. " +
        "Put the rest into your graveyard.</p>" +
        "<p><i>Channel</i> — XXGG, Discard this card: Return X target nonlegendary cards from " +
        "your graveyard to your hand.</p>",
    power: "1",
    toughness: "3",
    showPT: true,
    showStamp: true,
    cardNumber: "0270",
    setCode: "TDC",
    language: "EN",
    artist: "Anna Podedworna",
    copyright: "© 2025 Wizards of the Coast"
};

window.initCardData = function() {
    return {
        ...initialCardData,
        generateSymbols(str, useTall = false) {
            return window.generateSymbols(str, useTall);
        },
        async updateBackgrounds() {
            const { color, c } = getColorIdentity(this.manaCost, this.superType);
            this.backgrounds = [
                background(`cards/normal/${color}card.jpg`, -10)
            ];
            this.ptStyle = {
                backgroundImage: `url("/assets/m15/pts/${color}pt.png")`
            };
            if (isLegendary(this.superType)) {
                this.backgrounds.push(background(`legend/${c}crown.png`, -8));
                this.backgrounds[0] = await maskedBackground(
                    `cards/normal/${color}card.jpg`,
                    `masks/crown_mask.png`,
                    -10
                );
            }
        },
        updateStamp() {
            this.showStamp = this.rarity.toLowerCase().includes('rare');
        },
        formatText(text) {
            return window.formatText(text, this);
        },
        handleArtUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            if (this.artUrl && this.artUrl.startsWith('blob:'))
                URL.revokeObjectURL(this.artUrl);
            this.artUrl = URL.createObjectURL(file);
        },
        ptUpdated() {
            this.showPT = this.toughness.length || this.power.length;
        },
        init() {
            this.updateBackgrounds();
        }
    }
}
