import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';


@Entity('role')
export class Role {

  @PrimaryGeneratedColumn({ name: 'id_role' })
  id: number;

  @Column('text', { name: 'role_name' })
  name: string;

  @Column('text', { name: 'description' })
  description: string;

  @OneToMany(() => User, user => user.rol)
  users: User[];
}
