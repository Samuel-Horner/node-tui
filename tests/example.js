import {Page, Block, TextBlock} from '../index.js';

const page = new Page([
    new TextBlock('Title Bar', { grow: 0, align: 'center' }),
    new TextBlock('Content\nline 1\nline 2\netc.', { align: 'center' }),
    new TextBlock('Status Bar', { grow: 0, align: 'center' }),
]);

page.onResize = async () => {
    await page.draw();
}

page.onInput = async key => {
    switch (key) {
        case 'q':
            page.exit();
            break;
    }
}

await page.loop();
