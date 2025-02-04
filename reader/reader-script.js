/**
 * This file needs to be injected into the template file for data and navigation functions
 * of manga reader into `_template.html`
 */

let activeChapter = Number(localStorage.getItem('activeChapter')) || 1;

const displayChapter = (number) => {
    activeChapter = number;
    localStorage.setItem('activeChapter', activeChapter)
    const panels = panelData
        .filter((p) => (p.chapter === number))
        .map((p) => (`
            <img id="${p.alt}" src="${p.src}" alt="${p.alt}" onclick="scrollOnward(this.width)"/>
        `))

    const reader = document.querySelector('.reader');
    reader.innerHTML = panels.join('\n')

    document.querySelector('#title').innerHTML = 'BLUE LOCK - Chapter '+activeChapter;
    document.querySelector('#chapter-input').value = activeChapter;
}

const nextChapter = () => {
    displayChapter(activeChapter + 1);
}
const prevChapter = () => {
    displayChapter(activeChapter - 1);
}
const scrollOnward = (left) => {
    const reader = document.querySelector('.reader');
    const offset = 40 + 3; // margin and border
    reader.scrollLeft = reader.scrollLeft - (left + offset);
}

const renderBookSelection = () => {
    const titleImages = []
    chapterMap.map((titleChapter) => {
        const panel = panelData.find((p) => (p.chapter === titleChapter))
        const img = `<img id="${panel.alt}" src="${panel.src}" alt="${panel.alt}" onclick="displayChapter(${titleChapter})"/>`
        titleImages.push(img);
    })
    const bookSelector = document.querySelector('.book-selection');
    bookSelector.innerHTML = titleImages.join('\n')
}

window.onload = () => {
    displayChapter(activeChapter);
    renderBookSelection();
}
