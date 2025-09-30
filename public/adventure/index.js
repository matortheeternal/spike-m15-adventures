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
    const url = await maskImage(`assets/m15/${path}`, `assets/m15/${maskPath}`);
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
    cardName: "Garenbrig Carver",
    manaCost: "3G",
    backgrounds: [],
    artUrl: "/assets/eld-156-garenbrig-carver.jpg",
    superType: "Creature",
    subType: "Human Warrior",
    rarity: "Common",
    adventureName: "Shield's Might",
    adventureCost: "1G",
    adventureSuperType: "Instant",
    adventureSubType: "Adventure",
    adventureText: "Target creature gets +2/+2 until end of turn. " +
        "<i>(Then exile this card. You may cast " +
        "the creature later from exile.)</i>",
    flavorText: "Countless knights of Garenbrig owe their " +
        "lives to his peerless craftsmanship.",
    rulesText: "",
    power: "3",
    toughness: "2",
    showPT: true,
    showStamp: false,
    cardNumber: "156 / 269",
    setCode: "ELD",
    language: "EN",
    artist: "Lucas Graciano",
    copyright: "© 2019 Wizards of the Coast"
};

window.initCardData = function() {
    return {
        ...initialCardData,
        generateSymbols(str, useTall = false) {
            return window.generateSymbols(str, useTall);
        },
        async updateBackgrounds() {
            const { color, c } = getColorIdentity(this.manaCost, this.superType);
            const adventure = getColorIdentity(this.adventureCost, this.superType);
            this.backgrounds = [
                background(`cards/normal/${color}card.jpg`, -10),
                background(`adventure/base/left/bright/${adventure.c}page.png`, -5),
                background(`adventure/base/left/bright/shadow.png`, -4),
                background(`adventure/base/right/bright/${c}page.png`, -5),
                background(`adventure/base/right/bright/shadow.png`, -4)
            ];
            if (isLegendary(this.superType)) {
                this.backgrounds.push(background(`legend/${c}crown.png`, -8));
                this.backgrounds[0] = await maskedBackground(
                    `cards/normal/${color}card.jpg`,
                    `masks/crown_mask.png`,
                    -10
                );
            }
            this.ptStyle = {
                backgroundImage: `url("/assets/m15/pts/${color}pt.png")`
            };
            this.bindingStyle = {
                backgroundImage: `url("/assets/m15/adventure/binding/${c}block.jpg")`
            };
        },
        formatText(text) {
            return window.formatText(text, this);
        },
        updateStamp() {
            this.showStamp = this.rarity.toLowerCase().includes('rare');
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
