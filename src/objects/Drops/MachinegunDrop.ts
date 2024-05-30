import { Machinegun } from '../Weapons/Machinegun';
import { WeaponDrop } from './WeaponDrop';

export class MachinegunDrop extends WeaponDrop {
  constructor() {
    const machinegun = new Machinegun();
    super(machinegun, '/assets/images/machinegun_drop.png');
  }
}