
const decoder = new TextDecoder("utf-8");

const templateData = Deno.readFileSync("./reader/_template.html");
const scriptSrcData = Deno.readFileSync("./reader/reader-script.js");
const panelData = Deno.readFileSync("./data/panels.ts");

const template = decoder.decode(templateData);
const readerScriptSource = decoder.decode(scriptSrcData);
const panels = decoder.decode(panelData);

const html = template.replace(
    '${READER_SCRIPT_SRC}', `
        ${panels}
        ${readerScriptSource}
    `
);

Deno.writeTextFileSync('./reader.html', html);