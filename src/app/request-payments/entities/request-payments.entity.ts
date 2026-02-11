import { TxClient } from "src/app/tx-client/entities/tx-client.entity";
import { User } from "src/auth/models";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('request_payments')
export class RequestPayments {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, user => user.requestPayments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'transaction_id', nullable: true })
  transactionId: number;

  @OneToOne(() => TxClient, txClient => txClient.requestPayment)
  @JoinColumn({ name: 'transaction_id' })
  transaction: TxClient;

  @Column({ name: 'transaction_hash', unique: true })
  hash: string;

  @Column('numeric', { name: 'amount' })
  amount: number;

  @Column({ name: 'distributions', type: 'simple-array' })
  distributions: string[];

  @Column({ name: 'currency', default: 'COP' })
  currency: string;
}
