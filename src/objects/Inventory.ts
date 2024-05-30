import { Container, Sprite, Assets, Texture, Graphics } from 'pixi.js';
import { centerObjects } from '../utils/general';
import Keyboard from '../Keyboard';
import { Weapon } from './Weapon';
import { Pistol } from './Weapons/Pistol';

export class Inventory extends Container {

  private keyboard = Keyboard.getInstance();
  private slots: Sprite[] = [];
  private weapons: Weapon[] = [];
  private weaponHealths: Graphics[] = [];
  private fullSlot: Sprite | null = null;
  private selected = 0;

  private pistolUi: Sprite | null = null;
  private machinegunUi: Sprite | null = null;
  private lasergunUi: Sprite | null = null;
  private shootgunUi: Sprite | null = null;

  constructor() {
    super();

    // Keyboard action event listeners
    this.keyboard.onAction(({ action, buttonState }) => {
      if (buttonState === 'pressed') this.onActionPress(action);
      else if (buttonState === 'released') this.onActionRelease(action);
    });

    // On mouse wheel rotate
    window.addEventListener('wheel', this.onMouseWheel.bind(this));

    this.loadTextures();
  }

  private async loadTextures() {
    const emptyTexture = await Assets.load('/assets/images/empty_slot.png');
    const fullTexture = await Assets.load('/assets/images/full_slot.png');
    const pistolUi = await Assets.load('/assets/images/cannon_drop.png');
    const machinegunUi = await Assets.load('/assets/images/machinegun_drop.png');
    const lasergunUi = await Assets.load('/assets/images/lasergun_drop.png');
    const shootgunUi = await Assets.load('/assets/images/shotgun_drop.png');

    for (let i = 0; i < 4; i++) {
      const slot = new Sprite(emptyTexture);
      slot.anchor.set(0.5, 0.5);
      slot.width = 64;
      slot.height = 64;
      this.slots.push(slot);
      this.addChild(slot);

      const weaponHealth = new Graphics();
      weaponHealth.rect(slot.x, slot.y + 32, 64, 5)
        .fill(0x00FF00)
      this.weaponHealths.push(weaponHealth);
      this.addChild(weaponHealth);
    }

    this.fullSlot = new Sprite(fullTexture);
    this.fullSlot.anchor.set(0.5, 0.5);
    this.fullSlot.width = 64;
    this.fullSlot.height = 64;
    this.addChild(this.fullSlot);

    if(pistolUi && machinegunUi && lasergunUi && shootgunUi){
      this.pistolUi = new Sprite(pistolUi);
      this.pistolUi.width = 48;
      this.pistolUi.height = 48;
      this.pistolUi.anchor.set(0.5, 0.5);
      this.machinegunUi = new Sprite(machinegunUi);
      this.machinegunUi.width = 48;
      this.machinegunUi.height = 48;
      this.machinegunUi.anchor.set(0.5, 0.5);
      this.lasergunUi = new Sprite(lasergunUi);
      this.lasergunUi.width = 48;
      this.lasergunUi.height = 48;
      this.lasergunUi.anchor.set(0.5, 0.5);
      this.shootgunUi = new Sprite(shootgunUi);
      this.shootgunUi.width = 48;
      this.shootgunUi.height = 48;
      this.shootgunUi.anchor.set(0.5, 0.5);
      this.addChild(this.pistolUi);
      this.addChild(this.machinegunUi);
      this.addChild(this.lasergunUi);
      this.addChild(this.shootgunUi);
    }

    this.weapons.push(new Pistol());
    this.render(window.innerWidth);
  }

  private onMouseWheel(e: WheelEvent) {
    if (e.deltaY > 0) {
      this.selected = (this.selected + 1) % this.slots.length;
    } else {
      this.selected = (this.selected - 1 + this.slots.length) % this.slots.length;
    }
    this.updateFullSlotPosition();
  }

  resize(width: number) {
    this.render(width);
  }

  update(delta: number) {
    this.render(window.innerWidth);
  }

  render(width: number) {
    if (this.slots.length === 0 || !this.fullSlot) return;

    const offset = 64; // Offset between slots
    const startX = width / 2 - (this.slots.length - 1) * offset / 2;

    this.slots.forEach((slot, index) => {
      centerObjects(slot);
      slot.x = startX + index * offset;
      slot.y = window.innerHeight - 40;

      if (this.weapons[index]) {
        const weapon = this.weapons[index];
        switch(weapon.getWeaponName()){
          case 'Pistol':
            this.pistolUi?.position.set(slot.x, slot.y);
            break;
          case 'Machinegun':
            this.machinegunUi?.position.set(slot.x, slot.y);
            break;
          case 'Lasergun':
            this.lasergunUi?.position.set(slot.x, slot.y);
            break;
          case 'Shootgun':
            this.shootgunUi?.position.set(slot.x, slot.y);
            break;
        }
      }
    });

    this.weaponHealths.forEach((health, index) => {
      if(this.weapons[index]){
        const weapon = this.weapons[index];
        health.clear();
        health.rect(0, 0, 44 * weapon.getAmmo() / 100, 4)
          .fill(0x00FF00);
        health.position.set(this.slots[index].x - 32 + 10, this.slots[index].y + 16);
      }
    }
    );

    this.updateFullSlotPosition();
  }

  private updateFullSlotPosition() {
    if (!this.fullSlot || this.slots.length === 0) return;
    const selectedSlot = this.slots[this.selected];
    this.fullSlot.position.set(selectedSlot.x, selectedSlot.y);
  }

  // Handle key press actions
  private onActionPress(action: keyof typeof Keyboard.actions) {
    switch (action) {
      case 'KeyE':
        this.selected = (this.selected + 1) % this.slots.length;
        this.updateFullSlotPosition();
        break;
    }
  }

  // Handle key release actions
  private onActionRelease(action: keyof typeof Keyboard.actions) {
    // Currently no action on release
  }

  public pickup(weapon: Weapon){
    if(this.weapons.length < 4 && !this.hasWeapon(weapon)){
      this.weapons.push(weapon);
      this.render(window.innerWidth);
    } else {
      // heal weapon
      this.weapons.find(w => w.getWeaponName() === weapon.getWeaponName())?.heal();
    }
  }

  private hasWeapon(weapon: Weapon){
    return this.weapons.some(w => w.getWeaponName() === weapon.getWeaponName());
  }
}