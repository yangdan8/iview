import Vue from 'vue';
import Spin from './spin.vue';

import { transferIndex, transferIncrease } from '../../utils/transfer-queue';

function handleGetIndex() {
    transferIncrease();
    return transferIndex;
}

let tIndex = handleGetIndex();

Spin.newInstance = properties => {
    const _props = properties || {};

    const Instance = new Vue({
        data: Object.assign({}, _props, {

        }),
        render (h) {
            let vnode = '';
            if (this.render) {
                vnode = h(Spin, {
                    props: {
                        fix: true,
                        fullscreen: true
                    }
                }, [this.render(h)]);
            } else {
                vnode = h(Spin, {
                    props: {
                        size: 'large',
                        fix: true,
                        fullscreen: true
                    }
                });
            }
            return h('div', {
                'class': 'ivu-spin-fullscreen ivu-spin-fullscreen-wrapper',
                'style': {
                    'z-index': 2010 + tIndex
                }
            }, [vnode]);
        }
    });

    const component = Instance.$mount();
    const spin = Instance.$children[0];
    let piParentNode;

    return {
        show (props) {
            piParentNode = props && props.piParentNode || document.body;
            piParentNode.appendChild(component.$el);

            spin.visible = true;
            tIndex = handleGetIndex();
        },
        remove (cb) {
            spin.visible = false;
            setTimeout(function() {
                spin.$parent.$destroy();
                if (piParentNode && piParentNode.getElementsByClassName('ivu-spin-fullscreen')[0] !== undefined) {
                    piParentNode.removeChild(piParentNode.getElementsByClassName('ivu-spin-fullscreen')[0]);
                }
                cb();
            }, 500);
        },
        component: spin
    };
};

export default Spin;
