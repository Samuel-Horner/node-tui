import { Block } from "./block.js";

/** 
 * @param {string} str 
 * @param {Number} str 
*/
function centerString(str, width, { pad_char = ' ', pad_end = true } = {}) {
    if (str.length >= width) {
        throw new Error(`string '${str}' longer than width ${width}`);
    }

    const pad_width = Math.floor((width + str.length) / 2);
    let res = str.padStart(pad_width, pad_char);
    if (pad_end) res = res.padEnd(width, pad_char);
    return res;
}

export class TextBlock extends Block {
    text;

    align;
    vertical_align;

    wrap;

    constructor(text, {
        grow = 1,
        align = 'start',
        vertical_align = 'start',
        wrap = false,
    } = {}) {
        super([], { grow: grow });
        this.text = text.split('\n');

        this.align = align;
        this.vertical_align = vertical_align;

        if (wrap) throw new Error('unimplemented');
        this.wrap = wrap;
    }

    draw(width, height) {
        if (width < 0 || height < 0) return [];

        if (width === 0) {
            width = Math.max(...this.text.map(line => line.length));
        }

        // Prepare text (wrap etc)
        let text = this.wrap ? undefined : this.text.map(line => line.slice(0, width));

        if (height === 0) {
            height = text.length;
        }

        text = text.map(line => {
            switch (this.align) {
                case 'start':
                    return line.padEnd(width, ' ');
                case 'end':
                    return line.padStart(width, ' ');
                case 'center':
                    return centerString(line, width);
            }
        });

        switch (this.vertical_align) {
            case 'start':
                text = text.concat(Array(height - text.length).fill(' '.repeat(width)));
                break;
            case 'end':
                text = Array(height - text.length).fill(' '.repeat(width)).concat(text);
                break;
            case 'center':
                if (text.length >= height) text = text.slice(0, height);
                const pad_height = (height - text.length) / 2;
                text = Array(Math.floor(pad_height)).fill('-'.repeat(width)).concat(
                    text,
                    Array(Math.ceil(pad_height)).fill('#'.repeat(width))
                );
                break;
        }

        return text;
    }
}
