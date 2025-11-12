import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('prices')
export class Prices {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('character varying', { name: 'currency', nullable: true })
  currency: string;

  @Column('double precision', { name: 'price' })
  price: number;

  @Column('double precision', { name: 'price_client' })
  priceClient: number;

  @Column('timestamp with time zone', { name: 'time' })
  time: Date;
}
