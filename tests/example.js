import {Page, Block, TextBlock} from '../index.js';

const lorem_ipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent hendrerit et nisi id bibendum. Sed sit amet sapien posuere, vestibulum orci ut, viverra nunc. Donec tincidunt malesuada massa sed convallis. Aliquam eget cursus quam, quis commodo libero. Phasellus consectetur maximus nisl, et semper massa euismod non. Morbi tincidunt quam elit, vitae eleifend ex blandit vel. Nam nec massa vitae sapien pharetra condimentum. Suspendisse potenti. Proin lobortis dapibus lorem, vitae posuere lectus efficitur ut. Praesent euismod mi sit amet dolor lacinia, eget consequat turpis consequat.\nMorbi ac purus porta felis interdum rhoncus. Donec ut tortor varius, lobortis purus interdum, tincidunt risus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent vulputate euismod elit nec egestas. Donec lectus lacus, faucibus quis venenatis a, aliquet sit amet lacus. Cras ac nulla nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ornare ante vitae rutrum iaculis. Nam nisi lectus, venenatis vel odio vel, volutpat maximus massa. Donec in elit eget tortor vehicula sollicitudin. Morbi iaculis sed enim sed egestas. Nam congue gravida magna ut volutpat. Aenean lobortis ipsum eget augue ornare consequat in a felis. Morbi pharetra nibh sed maximus tempor. Sed maximus bibendum nunc, sit amet cursus lacus ornare a. Vestibulum ipsum lacus, condimentum in finibus condimentum, rhoncus eget purus.\nMorbi tristique ante est, in dapibus quam pretium ac. Aliquam sollicitudin lacus suscipit augue fringilla gravida. Maecenas iaculis tempor sollicitudin. Maecenas ut est lectus. Proin faucibus nulla ut cursus aliquet. Morbi cursus mattis risus, at auctor felis tincidunt eget. Morbi tristique ac arcu ut euismod. Ut vitae magna imperdiet, semper enim nec, malesuada felis. Maecenas ut bibendum ex, a consectetur velit. Aliquam commodo sagittis nibh at maximus. Fusce elementum risus ut hendrerit vehicula. Proin quis purus ut enim porttitor tincidunt. Vestibulum congue ipsum enim, non rutrum felis ullamcorper condimentum. Fusce posuere, leo at accumsan posuere, magna libero eleifend risus, vel lacinia elit purus feugiat purus. Vivamus at sapien mollis, tincidunt velit vel, elementum lorem.\nMorbi a semper eros. Nulla hendrerit lobortis risus, nec consequat tortor fermentum sit amet. Mauris scelerisque malesuada ipsum eu vestibulum. Aliquam arcu lectus, facilisis nec urna a, gravida pulvinar dui. In aliquet dolor eu mauris mattis, eu scelerisque turpis aliquet. Aliquam feugiat lacinia justo. Nunc eu justo ornare, blandit est id, rhoncus lorem. Praesent eleifend ligula in mauris fringilla sagittis. Aliquam ante purus, lobortis id mollis quis, pretium ut eros. Fusce facilisis fringilla mi, auctor gravida libero.\nEtiam varius ex sem, in aliquam ligula sollicitudin id. Mauris magna tellus, molestie eget sollicitudin et, finibus ac mi. Aenean facilisis malesuada aliquet. Morbi non augue elementum, bibendum risus a, fermentum ligula. Aliquam et tellus porttitor, consequat lorem eu, condimentum arcu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vulputate diam sed odio aliquam, at sollicitudin orci vulputate.';

const page = new Page([
    new TextBlock('Title Bar', { grow: 0, align: 'center', padding_bottom: 1, padding_top: 1 }),
    new TextBlock('Content\nline 1\nline 2\netc.', { align: 'center', grow: 0 }),
    new TextBlock(lorem_ipsum, { align: 'center', padding_left: 4, padding_right: 4, wrap: true}),
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
