import { Block } from "./block.js";

export class Page extends Block {
    writer;
    reader;

    width;
    height;

    __inputQueue = Promise.resolve();
    __resizeQueue = Promise.resolve();

    onInput = (_key) => { };
    onResize = (_width, _height) => { };

    __resolveLoop = () => { };
    __rejectLoop = () => { };

    constructor(children = [], {
        writer = process.stdout,
        reader = process.stdin,
    } = {}) {
        super(children);

        if (!writer.isTTY) throw new Error('write is not a tty');
        if (!reader.isTTY) throw new Error('read is not a tty');

        this.writer = writer;
        this.reader = reader;

        this.width = this.writer.columns;
        this.height = this.writer.rows;
    }

    __resizeHandler = () => {
        this.width = this.writer.columns;
        this.height = this.writer.rows;
        // Queue resize events
        this.__resizeQueue = this.__resizeQueue.then(() => this.onResize(this.width, this.height)).catch(this.__rejectLoop);
    }

    __inputHandler = key => {
        key = key.toString();

        switch (key) {
            case '\x03':
                this.exit();
                break;
            default:
                // Queue inputs
                this.__inputQueue = this.__inputQueue.then(() => this.onInput(key)).catch(this.__rejectLoop);
                break;
        }
    }

    async __write(data) {
        return new Promise((resolve, reject) =>
            this.writer.write(data, (err) => {
                if (err) reject(err);
                else resolve();
            })
        );
    }

    async draw() {
        const contents = super.draw(this.width, this.height);
        await this.__write('\x1b[2J\x1b[H' + contents.join('\n'));
    }

    async loop() {
        this.reader.setRawMode(true);
        this.reader.resume();
        this.reader.on('data', this.__inputHandler);
        this.writer.on('resize', this.__resizeHandler);

        // Switch buffer and disable cursor
        await this.__write('\x1b[?1049h\x1b[?25l');

        // First draw
        await this.draw();

        const err = await new Promise((resolve, reject) => {
            this.__resolveLoop = resolve;
            this.__rejectLoop = reject;
        }).catch(e => e).then(() => null);

        // Restore buffer and enable cursor
        await this.__write('\x1b[?1049l\x1b[?25h');

        this.writer.removeListener('resize', this.__resizeHandler);
        this.reader.removeListener('data', this.__inputHandler);
        this.reader.pause();
        this.reader.setRawMode(false);

        if (err) throw err;
    }

    exit() {
        this.__resolveLoop();
    }
}
