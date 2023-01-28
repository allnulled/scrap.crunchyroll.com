(() => {
    const cards = $$(".erc-browse-collection .browse-card");
    const resultados = [];
    for (let iCard = 0; iCard < cards.length; iCard++) {
        const ele_card = cards[iCard];
        const ele_1 = ele_card.querySelector("h4");
        const ele_link = ele_1.querySelector("a");
        const title = ele_link.textContent.trim();
        const link = ele_link.href;
        const image = ele_card.querySelector("figure picture img").src;
        resultados.push({ title, link, image });
    }
    console.log(JSON.stringify(resultados, null, 2))
})();