const html = Deno.readTextFileSync('./reader.html');

Deno.serve((req) => {
    return new Response(html,
        { 
            status: 200, 
            headers: {
                'Content-Type': 'text/html'
            }
        }
    );
})