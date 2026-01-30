import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
