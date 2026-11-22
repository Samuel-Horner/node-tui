export class Block {
    grow;
    dir;
    children;

    constructor(children = [], {
        grow = 1,
        dir = 'col'
    } = {}) {
        this.children = children;
        this.grow = grow;
        this.dir = dir;
    }

    __totalWeight() {
        return this.children.reduce((a, x) => a + x.grow, 0);
    }

    draw(width, height) {
        let child_content = [];
        this.children.forEach((child, i) => {
            if (child.grow !== 0) return;

            switch (this.dir) {
                case 'col':
                    child_content[i] = child.draw(width, 0);
                    height -= child_content[i].length;
                    break;
                case 'row':
                    child_content[i] = child.draw(0, height);
                    width -= child_content[i].length;
                    break;
            }
        });

        const total_weight = this.__totalWeight();
        this.children.forEach((child, i) => {
            switch (this.dir) {
                case 'col':
                    child_content[i] = child.draw(width, Math.round(height * (child.grow / total_weight)));
                    break;
                case 'row':
                    child_content[i] = child.draw(Math.round(width * (child.grow / total_weight)), height);
                    break;
            }
        });

        let content = [];
        switch (this.dir) {
            case 'col':
                content = child_content.flat(1);
                break;
            case 'row':
                child_content.forEach((line, i) => {
                    if (content[i]) content[i] += line;
                    else content[i] = line;
                });
                break;
        }

        return content;
    }
}
