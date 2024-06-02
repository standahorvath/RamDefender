import { Lasergun } from '../Weapons/Lasergun';
import { WeaponDrop } from './WeaponDrop';

export class LaserGunDrop extends WeaponDrop {
  constructor() {
    const laserGun = new Lasergun();
    super(laserGun, '/assets/images/lasergun_drop.png');
  }
}