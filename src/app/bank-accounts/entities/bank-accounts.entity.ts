import { User } from "src/auth/models";
import { StatusAccountBank } from "src/enums/statusAccountBank.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn({ name: 'id_bank_account' })
  id: number;

  @ManyToOne(() => User, user => user.bankAccounts)
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @Column('text', { name: 'bank_name' })
  bankName: string;

  @Column('text', { name: 'account_type' })
  accountType: string;

  @Column('text', { name: 'account_number' })
  accountNumber: string;

  @Column('text', { name: 'account_holder_name' })
  accountHolderName: string;

  @Column('text', { name: 'type_document_holder' })
  typeDocumentHolder: string;

  @Column('text', { name: 'account_holder_document' })
  accountHolderDocument: string;

  @Column('text', { name: 'status', default: StatusAccountBank.PENDING_VERIFICATION })
  status: StatusAccountBank;

  @Column('bool', { default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;
}
