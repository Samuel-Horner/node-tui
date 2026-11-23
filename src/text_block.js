import { Block } from "./block.js";
import { wrap } from "./lib/wrap.js";

/** 
 * @param {string} str 
 * @param {Number} str 
*/
function centerString(str, width, { pad_char = ' ', pad_end = true } = {}) {
    if (str.length >= width) {
        if (str.length === width) {
            return str;
        }

        throw new Error(`string '${str}' longer than width ${width}`);
    }


    const pad_width = Math.floor((width + str.length) / 2);
    let res = str.padStart(pad_width, pad_char);
    if (pad_end) res = res.padEnd(width, pad_char);
    return res;
}

/**
 * @param {string[]} text 
 * @param {Number} width 
 */
function wrapText(text, width) {
    return text.map(line => wrap(line, width).split('\n')).flat()
}

export class TextBlock extends Block {
    text;

    align;
    vertical_align;

    // Scrolling Text
    start_x;
    start_y;

    padding;

    wrap;

    constructor(text, {
        grow = 1,
        align = 'start',
        vertical_align = 'start',
        wrap = false,
        start_x = 0,
        start_y = 0,
        padding_left = 0,
        padding_right = 0,
        padding_top = 0,
        padding_bottom = 0,
    } = {}) {
        super([], { grow: grow });
        this.text = text.split('\n');

        if (align !== 'start' && align !== 'end' && align !== 'center') throw new Error(`invalid align '${align}'`);
        this.align = align;
        if (vertical_align !== 'start' && vertical_align !== 'end' && vertical_align !== 'center') throw new Error(`invalid vertical align '${align}'`);
        this.vertical_align = vertical_align;

        this.start_x = start_x;
        this.start_y = start_y;

        this.padding = {
            left: padding_left,
            right: padding_right,
            top: padding_top,
            bottom: padding_bottom,
        };

        this.wrap = wrap;
    }

    draw(width, height) {
        if (width !== 0) width -= this.padding.left + this.padding.right;
        if (height !== 0) height -= this.padding.top + this.padding.bottom;

        if (width < 0 || height < 0) return [];

        // Scroll text
        let text = this.text.slice(this.start_y).map(line => line.slice(this.start_x));

        if (width === 0) {
            width = Math.max(...this.text.map(line => line.length));
        }

        // Wrap text
        text = this.wrap ? wrapText(text, width) : text.map(line => line.slice(0, width));

        if (height === 0) {
            height = text.length;
        }

        text = text.slice(0, height);

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

        // Apply padding
        if (this.padding.top !== 0) {
            text = Array(this.padding.top).fill(' '.repeat(width)).concat(text);
        }
        if (this.padding.bottom !== 0) {
            text = text.concat(Array(this.padding.top).fill(' '.repeat(width)));
        }
        if (this.padding.left !== 0 || this.padding.right !== 0) {
            text = text.map(line => ' '.repeat(this.padding.left) + line + ' '.repeat(this.padding.right));
        }

        return text;
    }
}
