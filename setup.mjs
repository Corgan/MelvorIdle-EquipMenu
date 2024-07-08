export async function setup({ loadModule, loadScript, onModsLoaded, onCharacterLoaded, onInterfaceReady, patch }) {
  const { EquipMenu } = await loadModule('src/equip-menu.mjs');
  //const { BankMenu } = await loadModule('src/bank-menu.mjs');

  /*
  var observer = new MutationObserver(function(mutations) {
    for (let mutation of mutations) {
      if (mutation.type === 'childList') {
        for (let node of mutation.addedNodes) {
          if(node.tagName && node.tagName === "BANK-ITEM-ICON") {
            BankMenu.attach(node);
          }
        }
        for (let node of mutation.removedNodes) {
          if(node.tagName && node.tagName === "BANK-ITEM-ICON") {
            BankMenu.detach(node);
          }
        }
      }
    }
  });
  observer.observe(document, {childList: true, subtree: true});
  */
  /*
  
  tippy(item, {
    placement: 'right-start',
    trigger: 'manual',
    interactive: true,
    arrow: false,
    allowHTML: true,
    sticky: true,
    onHide(instance) {
        if(instance.shouldHide === true) {
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
  bankTips[id] = instance;
  item.addEventListener('contextmenu', showMenu.bind(item, id, instance));
  */

  onInterfaceReady(() => {
    EquipMenu.attach();
  });
}