const { settings, characterStorage, patch } = mod.getContext(import.meta);

export class EquipMenu {
    constructor() {
        if(this.constructor) // We don't like instances :)
            return this.constructor;
    }

    static attach() {
        const generateTooltip = function(item, isPassive=false) {
            let itemStat = "";
            if (item.description != undefined)
                itemStat += '<br><span class="text-info">' + item.description + "</span>";
            if (item.specialAttacks.length > 0) {
                item.specialAttacks.forEach((attack)=>{
                    itemStat += `<h5 class="font-size-sm font-w700 text-danger mb-0"><img class="skill-icon-xxs mr-1" src="${CDNDIR()}assets/media/main/special_attack.svg"><small>${attack.name} (${formatPercent(attack.defaultChance)})</small></h5><h5 class="font-size-sm font-w400 text-warning mb-0"><small>${attack.description}</small></h5>`;
                });
            }
            if (!isPassive) {
                const equipStats = item.equipmentStats;
                if(equipStats) {
                    equipStats.forEach((stat)=>{
                        itemStat += '<br>';
                        if (stat.value > 0) {
                            itemStat += Equipment.getEquipStatDescription(stat.key, stat.value);
                        } else {
                            itemStat += `<span class="text-danger">${Equipment.getEquipStatDescription(stat.key, stat.value)}</span>`;
                        }
                    });
                }
            }
        
            if (item instanceof FoodItem)
                itemStat += "<br><img class='skill-icon-xs ml-2' src='" + CDNDIR() + "assets/media/skills/hitpoints/hitpoints.svg'><span class='text-success'>+" + game.combat.player.getFoodHealing(item) + "</span>";
        
            return '<div class="text-center"><span class="text-warning">' + item.name + "</span><small class='text-success'>" + itemStat + "</small></div>";
        }

        const showFood = function(event) {
            if(game.isGolbinRaid) return;
            event.preventDefault();
        
            instance.setProps({
                getReferenceClientRect: () => ({
                    width: 0,
                    height: 0,
                    top: event.clientY,
                    bottom: event.clientY,
                    left: event.clientX,
                    right: event.clientX,
                }),
            });
        
            let food = [...game.bank.items.values()].filter(bankSlot => bankSlot.item instanceof FoodItem).sort((a,b) => (game.combat.player.getFoodHealing(b.item) * b.quantity) - (game.combat.player.getFoodHealing(a.item) * a.quantity));
        
            let content = document.createElement('div');
            content.className = 'content-side';
            content.style.setProperty('padding-top', '.25rem', 'important');
            content.style.setProperty('max-height', '600px');
            content.style.setProperty('overflow-y', 'scroll');
            let ul = document.createElement('div');
            ul.className = 'nav-main text-center';
            ul.style.width = '270px';
            content.appendChild(ul);
            let li = document.createElement('li');
            li.className = 'nav-main-heading';
            $(li).text('Food')
            li.style.setProperty('padding-top', '0', 'important');
            ul.appendChild(li);
            food.forEach(bankSlot => {
                let li = document.createElement('li');
                li.className = 'nav-main-item';
                li.addEventListener('click', function (instance, item, qty, event) {
                    if(game.combat.player.food?.currentSlot?.item != item)
                    game.combat.player.unequipFood();
                    game.combat.player.equipFood(item, qty);
                    instance.hide();
                }.bind(li, instance, bankSlot.item, bankSlot.quantity));
                let mainLink = document.createElement('div');
                mainLink.className = 'nav-main-link pointer-enabled';
                mainLink.style.setProperty('font-size', '.6rem', 'important');
                mainLink.style.setProperty('min-height', '1.5rem', 'important');
                mainLink.style.setProperty('padding-top', '.10rem', 'important');
                mainLink.style.setProperty('padding-bottom', '.10rem', 'important');
                tippy(mainLink, {
                    content: createItemInformationTooltip(bankSlot.item, true),
                    allowHTML: true,
                    placement: "right",
                    interactive: false,
                    animation: false,
                });
        
                let img = document.createElement('img');
                img.className = 'nav-img';
                img.src = bankSlot.item.media;
                let span = document.createElement('span');
                span.className = 'nav-main-link-name';
                $(span).html(bankSlot.item.name);
                mainLink.appendChild(img);
                mainLink.appendChild(span);
                let small = document.createElement('small');
                small.className = 'text-warning';
                $(small).text(formatNumber(bankSlot.quantity))
                mainLink.appendChild(small);
                li.appendChild(mainLink);
                ul.appendChild(li);
            });
            instance.setContent(content);
        
            instance.show();
        }
        
        const showEquipment = function(slot, instance, event) {
            if(game.isGolbinRaid) return;
            event.preventDefault();
        
            instance.setProps({
                getReferenceClientRect: () => ({
                    width: 0,
                    height: 0,
                    top: event.clientY,
                    bottom: event.clientY,
                    left: event.clientX,
                    right: event.clientX,
                }),
            });
        
            const possibleEquipment = [...game.bank.items.values()].filter(bankSlot => bankSlot.item.validSlots?.includes(slot));
        
            let content = document.createElement('div');
            content.className = 'content-side';
            content.style.setProperty('padding-top', '.25rem', 'important');
            content.style.setProperty('max-height', '600px');
            content.style.setProperty('overflow-y', 'scroll');
            let ul = document.createElement('div');
            ul.className = 'nav-main text-center';
            ul.style.width = '270px';
            content.appendChild(ul);
            let li = document.createElement('li');
            li.className = 'nav-main-heading';
            $(li).text(slot.emptyName)
            li.style.setProperty('padding-top', '0', 'important');
            ul.appendChild(li);
            possibleEquipment.forEach(bankSlot => {
                let li = document.createElement('li');
                li.className = 'nav-main-item';
                li.addEventListener('click', function (instance, item, qty, slot, event) {
                    game.combat.player.equipItem(item, game.combat.player.selectedEquipmentSet, slot, qty);
                    instance.hide();
                }.bind(li, instance, bankSlot.item, (bankSlot.item.validSlots.filter(sl => sl.allowQuantity).length > 0 ? bankSlot.quantity : 1), slot));
                let mainLink = document.createElement('div');
                mainLink.className = 'nav-main-link pointer-enabled';
                mainLink.style.setProperty('font-size', '.6rem', 'important');
                mainLink.style.setProperty('min-height', '1.5rem', 'important');
                mainLink.style.setProperty('padding-top', '.10rem', 'important');
                mainLink.style.setProperty('padding-bottom', '.10rem', 'important');
                tippy(mainLink, {
                    content: createItemInformationTooltip(bankSlot.item, slot.id === 'melvorD:Passive'),
                    allowHTML: true,
                    placement: "right",
                    interactive: false,
                    animation: false,
                });
        
                let img = document.createElement('img');
                img.className = 'nav-img';
                img.src = bankSlot.item.media;
                let span = document.createElement('span');
                span.className = 'nav-main-link-name';
                $(span).html(bankSlot.item.name);
                mainLink.appendChild(img);
                mainLink.appendChild(span);
                let small = document.createElement('small');
                small.className = 'text-warning';
                $(small).text(formatNumber(bankSlot.quantity))
                if(bankSlot.item.validSlots.filter(sl => sl.allowQuantity).length > 0)
                    mainLink.appendChild(small);
                li.appendChild(mainLink);
                ul.appendChild(li);
            });
            instance.setContent(content);
        
            instance.show();
        }

        combatMenus.equipment.forEach(grid => {
            grid.icons.forEach((icon, slot) => {
                let instance = tippy(icon, {
                    placement: 'right-start',
                    trigger: 'manual',
                    interactive: true,
                    arrow: false,
                    allowHTML: true,
                    offset: [0, 0],
                });

                icon.addEventListener('contextmenu', showEquipment.bind(icon, slot, instance));
            });
        });
        const foodSlot = document.getElementById('combat-food-select');
        
        let instance = tippy(foodSlot, {
            placement: 'right-start',
            trigger: 'manual',
            interactive: true,
            arrow: false,
            allowHTML: true,
            offset: [0, 0],
        });
        foodSlot.addEventListener('contextmenu', showFood.bind(instance));
        
        console.log('Melvor Equipment Menu Loaded');
    }
}

