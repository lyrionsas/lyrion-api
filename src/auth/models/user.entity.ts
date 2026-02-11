import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './rol.entity';
import { ROLES_CONSTANTS } from '../constants/userConstants';
import { TxClient } from 'src/app/tx-client/entities/tx-client.entity';
import { BankAccount } from 'src/app/bank-accounts/entities/bank-accounts.entity';
import { RequestPayments } from 'src/app/request-payments/entities/request-payments.entity';
// import { ApiKey } from './api-key.entity';

@Entity('user')
export class User {

  @PrimaryGeneratedColumn({ name: 'id_user' })
  id: number;

  // ================== foreign key =========================
  @ManyToOne(() => Role, rol => rol.users)
  @JoinColumn({ name: 'role_id' })
  rol?: Role;

  @OneToMany(() => TxClient, txClient => txClient.user)
  txsClient: TxClient[];

  @OneToMany(() => BankAccount, bankAccount => bankAccount.userId)
  bankAccounts: BankAccount[];

  @OneToMany(() => RequestPayments, requestPayments => requestPayments.userId)
  requestPayments: RequestPayments[];
  // ========================================================

  @Column('text', { name: 'first_name' })
  firstname: string;

  @Column('text', { name: 'last_name' })
  lastname: string;

  @Column('text', { unique: true, name: 'email' })
  email: string;

  @Column('text', { name: 'password', select: false }) // select: false para que no se muestre en las consultas.
  password?: string;

  @Column('text', { name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column('text', { name: 'phone' })
  phone: string;

  @Column('bool', { default: true, name: 'is_active' })
  isActive?: boolean;

  @Column('bool', { default: false, name: 'is_admin' })
  isAdmin?: boolean;

  @Column('text', { name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'create_at' })
  createAt?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'update_at' })
  updateAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'delete_at' })
  deleteAt?: Date;

  @BeforeInsert()
  setDefaultRol() {
    this.rol = new Role();
    this.rol.id = ROLES_CONSTANTS.user.id; // rol usuario.
  }

  @BeforeInsert()
  setDefaultData() {
    this.firstname = this.firstname.toLowerCase().trim();
    this.lastname = this.lastname.toLowerCase().trim();
    this.email = this.email.toLowerCase().trim();
    this.createAt = new Date();
  }

  @BeforeUpdate()
  setDefaultUpdateAt() {
    this.updateAt = new Date();
  }
}
