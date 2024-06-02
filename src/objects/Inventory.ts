import { Container, Sprite, Assets, Texture, Graphics } from 'pixi.js';
import { centerObjects } from '../utils/general';
import Keyboard from '../Keyboard';
import { Weapon } from './Weapon';
import { Pistol } from './Weapons/Pistol';
import { Player } from './Player';

export class Inventory extends Container {

  private keyboard = Keyboard.getInstance();
  private slots: Sprite[] = [];
  private weapons: (Weapon | null)[] = [null, null, null, null];
  private weaponHealths: Graphics[] = [];
  private fullSlot: Sprite | null = null;
  private selected = 0;

  private pistolUi: Sprite | null = null;
  private machinegunUi: Sprite | null = null;
  private lasergunUi: Sprite | null = null;
  private shootgunUi: Sprite | null = null;
  private player = null as Player | null;

  constructor(player: Player) {
    super();
    this.player = player;

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

    if (pistolUi && machinegunUi && lasergunUi && shootgunUi) {
      this.pistolUi = new Sprite(pistolUi);
      this.pistolUi.width = 48;
      this.pistolUi.height = 48;
      this.pistolUi.anchor.set(0.5, 0.5);
      this.pistolUi.visible = false;
      this.machinegunUi = new Sprite(machinegunUi);
      this.machinegunUi.width = 48;
      this.machinegunUi.height = 48;
      this.machinegunUi.anchor.set(0.5, 0.5);
      this.machinegunUi.visible = false;
      this.lasergunUi = new Sprite(lasergunUi);
      this.lasergunUi.width = 48;
      this.lasergunUi.height = 48;
      this.lasergunUi.anchor.set(0.5, 0.5);
      this.lasergunUi.visible = false;
      this.shootgunUi = new Sprite(shootgunUi);
      this.shootgunUi.width = 48;
      this.shootgunUi.height = 48;
      this.shootgunUi.anchor.set(0.5, 0.5);
      this.shootgunUi.visible = false;
      this.addChild(this.pistolUi, this.machinegunUi, this.lasergunUi, this.shootgunUi);
    }

    this.pickup(new Pistol())
    this.render(window.innerWidth);
  }

  private onMouseWheel(e: WheelEvent) {
    if (e.deltaY > 0) {
      this.selected = (this.selected + 1) % this.slots.length;
    } else {
      this.selected = (this.selected - 1 + this.slots.length) % this.slots.length;
    }
    this.updateFullSlotPosition();
    this.updatePlayerWeapon();
  }

  updatePlayerWeapon() {
    if (this.weapons[this.selected]) {
      this.player?.changeWeapon(this.weapons[this.selected]);
    } else {
      this.player?.changeWeapon(null);
    }
  }

  resize(width: number) {
    this.render(width);
  }

  update(delta: number) {

    const selectedWeapon = this.weapons[this.selected]
    if (selectedWeapon && selectedWeapon.getAmmo() <= 0) {
      this.weapons[this.selected] = null
      this.selected--
      this.updateFullSlotPosition()
      this.updatePlayerWeapon()
    }

    this.render(window.innerWidth);
  }

  render(width: number) {
    if (this.slots.length === 0 || !this.fullSlot) return;

    const offset = 64; // Offset between slots
    const startX = width / 2 - (this.slots.length - 1) * offset / 2;

    if (this.pistolUi) {
      this.pistolUi.visible = false;
    }
    if (this.machinegunUi) {
      this.machinegunUi.visible = false;
    }
    if (this.lasergunUi) {
      this.lasergunUi.visible = false;
    }
    if (this.shootgunUi) {
      this.shootgunUi.visible = false;
    }

    this.slots.forEach((slot, index) => {
      centerObjects(slot);
      slot.x = startX + index * offset;
      slot.y = window.innerHeight - 40;

      const tempWeapon = this.weapons[index]
      if (tempWeapon) {
        switch (tempWeapon.getWeaponName()) {
          case 'Pistol':
            this.pistolUi?.position.set(slot.x, slot.y);
            if (this.pistolUi) {
              this.pistolUi.visible = true;
            }
            break;
          case 'Machinegun':
            this.machinegunUi?.position.set(slot.x, slot.y);
            if (this.machinegunUi) {
              this.machinegunUi.visible = true;
            }
            break;
          case 'Lasergun':
            this.lasergunUi?.position.set(slot.x, slot.y);
            if (this.lasergunUi) {
              this.lasergunUi.visible = true;
            }
            break;
          case 'Shootgun':
            this.shootgunUi?.position.set(slot.x, slot.y);
            if (this.shootgunUi) {
              this.shootgunUi.visible = true;
            }
            break;
        }
      }
    });

    this.weaponHealths.forEach((health, index) => {
      health.visible = false;
      if (this.weapons[index]) {
        const weapon = this.weapons[index];
        health.clear();
        health.rect(0, 0, 44 * weapon.getAmmo() / 100, 4)
          .fill(0x00FF00);
        health.position.set(this.slots[index].x - 32 + 10, this.slots[index].y + 16);
        health.visible = true;
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

  public pickup(weapon: Weapon) {
    if(this.hasWeapon(weapon)){
      this.weapons.find(w => w && w.getWeaponName() === weapon.getWeaponName())?.heal();
      this.render(window.innerWidth)
      return
    }

    for (let i = 0; i < this.weapons.length; i++) {
      if(!this.weapons[i]){
        this.weapons[i] = weapon;
        this.render(window.innerWidth);
        return;
      }
    }
  }

  private hasWeapon(weapon: Weapon) {
    return this.weapons.some(w => w && w.getWeaponName() === weapon.getWeaponName());
  }
}