import { User } from "src/auth/models";
import { StatusTx } from "src/enums/StatusTx.enum";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tx_client')
export class TxClient {

  @PrimaryGeneratedColumn({ name: 'id_tx_client' })
  id: number;

  // ================== foreign key =========================
  @ManyToOne(() => User, user => user.txsClient)
  @JoinColumn({ name: 'user_id' })
  user: User;
  // ========================================================

  @Column('text', { name: 'blockchain_network' })
  blockchainNetwork: string;

  @Column('text', { name: 'wallet_address_source' })
  walletAddressSource: string;

  @Column('text', { name: 'wallet_address_destination' })
  walletAddressDestination: string;

  @Column('text', { name: 'transaction_hash', nullable: true })
  transactionHash: string | null;

  @Column('numeric', { name: 'transaction_amount' })
  transactionAmount: number;

  @Column('text', { name: 'currency' })
  currency: string; // USDT o USDC

  @Column('numeric', { name: 'fee', default: 0 })
  fee: number | null;

  @Column('text', { name: 'status', default: StatusTx.PENDING })
  status: StatusTx;

  @Column('timestamp', { name: 'created_at' })
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at' })
  updatedAt: Date;

  @Column('timestamp', { name: 'limit_time_deposit', nullable: true })
  limitTimeDeposit: Date | null;

  @BeforeInsert()
  setDefaultDates() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeInsert()
  setLimitTimeDeposit() {
    // tiene como tiempo maximo 7 minutos desde la creacion de la transaccion
    const limitTime = new Date();
    limitTime.setMinutes(limitTime.getMinutes() + 7);
    this.limitTimeDeposit = limitTime;
  }

  @BeforeUpdate()
  setDefaultUpdateAt() {
    this.updatedAt = new Date();
  }
}
