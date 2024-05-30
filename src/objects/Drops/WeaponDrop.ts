import { Weapon } from '../Weapon';
import { Drop } from './Drop';

export class WeaponDrop extends Drop {
  constructor(item: Weapon, spritePath: string) {
    super(item, spritePath);
  }
  public give(): Weapon {
    if (!this.item) return new Weapon(1, '');
    this.given = true;
    return this.item as Weapon;
  }
}