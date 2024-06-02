import { Shootgun } from '../Weapons/Shootgun';
import { WeaponDrop } from './WeaponDrop';

export class ShootGunDrop extends WeaponDrop {
  constructor() {
    const shootgun = new Shootgun();
    super(shootgun, '/assets/images/shotgun_drop.png');
  }
}