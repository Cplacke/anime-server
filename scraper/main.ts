import { scrapChapter, writePanelsToPanelFile, Panel } from '../scraper/scrape.ts'

const LAST_CHAPTER: number = 289;
const ALL_PANELS: Panel[] = [];

let i = 1;
while(i <= LAST_CHAPTER) {
    const panels = await scrapChapter(i);
    ALL_PANELS.push(...panels);
    // move cursor to next chapter
    i++;
}

const remainingMissingPanels = ALL_PANELS.filter((p) => (!p.src)).map((p) => (p.alt)) 
console.info(remainingMissingPanels);
writePanelsToPanelFile(ALL_PANELS);