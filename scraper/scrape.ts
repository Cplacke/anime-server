import { DOMParser, Element } from "jsr:@b-fuze/deno-dom";

/**
 * TYPE DECLARATIONS
 */
export interface Panel {
    src: string;
    alt: string;
    chapter: number;
}

export const scrapChapter = async (chapterNumber: number): Promise<Panel[]> => {
    console.info('Scrapping panels for chapter #', chapterNumber);
    const response = await fetch(`https://ww9.readbluelock.com/comic/blue-lock-chapter-${chapterNumber}/`);
    const pageBody = await response.text();

    const doc = new DOMParser().parseFromString(pageBody, "text/html");

    const comicPages = doc.querySelectorAll("p img");
    const panels: Panel[] = [ ...comicPages ].map((img, i) => {
        return {
            src: img.getAttribute('src') as string,
            alt: img.getAttribute('alt') as string,
            chapter: chapterNumber
        } 
    });

    const missingPanels = panels.filter((p) => (!p.src));
    if (missingPanels.length) {
        const response2 = await fetch(`https://w11.blue-lock-manga.com/manga/blue-lock-chapter-${chapterNumber}/`);
        const pageBody2 = await response2.text();
    
        const doc = new DOMParser().parseFromString(pageBody2, "text/html");
        missingPanels.forEach((missingPanel) => {
            console.info('missing panel for: ', missingPanel.alt);
            const img = doc.querySelector(`img[alt="${missingPanel.alt}"]`);
            if (img && img.hasAttribute('src')) {
                panels.forEach((p) => {
                    if (p.alt === missingPanel.alt) {
                        p.src = img.getAttribute('src') || "";
                        console.info('missing panel for ', missingPanel.alt, 'ACQUIRED - ', p.src);
                    }
                })
            }
        })
    }

    return panels;
}

export const writePanelsToPanelFile = (panels: Panel[]) => {
    const missingCovers = [
        { "alt": "Blue Lock Cover, 32", "chapter": 277, "src": "https://comicvine.gamespot.com/a/uploads/scale_small/11145/111450787/9569804-6159321635-71hso.jpg" },
        { "alt": "Blue Lock Cover, 31", "chapter": 268, "src": "https://comicvine.gamespot.com/a/uploads/scale_small/11145/111450787/9520319-0262376939-71nju.jpg" },
        { "alt": "Blue Lock Cover, 30", "chapter": 258, "src": "https://comicvine.gamespot.com/a/uploads/scale_small/11158/111588877/9499552-0007670446-71zCF.jpg" },
        { "alt": "Blue Lock Cover, 29", "chapter": 229, "src": "https://comicvine.gamespot.com/a/uploads/scale_small/11145/111450787/9364117-9763695451-710Pn.jpg" },
        { "alt": "Blue Lock Cover, 28", "chapter": 240, "src": "https://comicvine.gamespot.com/a/uploads/scale_small/11158/111588877/9301320-8901420463-81L6A.jpg" },
        { "alt": "Blue Lock Cover, 27", "chapter": 231, "src": "https://comicvine.gamespot.com/a/uploads/scale_small/11161/111610434/9198673-1085917807-97840.jpg" },
        { "alt": "Blue Lock Cover, 26", "chapter": 222, "src": "https://comicvine.gamespot.com/a/uploads/scale_small/11175/111753351/9091882-20230910_094330.jpg" }
    ]
    
    /** SPLICE IN MISSING COVER ART */
    missingCovers.forEach((cover) => {
        const indexChapterStart = panels.findIndex((p) => (p.chapter === cover.chapter));
        panels.splice(indexChapterStart, 0, cover);
    });

    Deno.writeTextFileSync(
        `./data/panels.ts`, 
        `
            const panelData = ${JSON.stringify(panels)};
            const chapterMap = [
                1,   5,  14,  23,  32,  41,  50,  59,
                68,  77,  86,  95, 104, 113, 122, 132,
                141, 150, 159, 168, 177, 186, 195, 204,
                213, 222, 231, 240, 229, 258, 268, 277
            ]
        `
    );
}
