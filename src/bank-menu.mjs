const { settings, characterStorage, patch } = mod.getContext(import.meta);

export class BankMenu {
    constructor() {
        if (this.constructor) // We don't like instances :)
            return this.constructor;
    }

    static attach(node) {
        node.menu = tippy(node, {
            content: '',
            placement: 'right-start',
            trigger: 'manual',
            allowHTML: true,
            interactive: true,
            animation: false,
            arrow: false,
            sticky: true,
            onHide(instance) {
                if (instance.shouldHide === true) {
                    instance.shouldHide = false;
                    return true;
                } else {
                    return false
                }
            },
            onClickOutside(instance) {
                instance.shouldHide = true;
            }
        });
        node.addEventListener('contextmenu', (event) => {
            event.preventDefault();

            node.menu.setProps({
                interactive: true,
                getReferenceClientRect: () => ({
                    width: 0,
                    height: 0,
                    top: event.clientY,
                    bottom: event.clientY,
                    left: event.clientX,
                    right: event.clientX,
                }),
            });

            node.menu.setContent(createElement('div', {
                children: [
                    createElement('div', {text: node.item.name}),
                    createElement('div', {text: node.item.modifiedDescription})
                ]
            }));
            node.menu.show();
        });
    }

    static detatch(node) {
        if (node.menu !== undefined) {
            node.menu.destroy();
            node.menu = undefined;
        }
    }
}

