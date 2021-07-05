import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";

import { User } from "./User";

@Entity("UserSecondFactorKey")
class UserSecondFactorKey {
  @PrimaryColumn()
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @Column()
  key: string;

  @CreateDateColumn()
  created_at: Date;
}

export { UserSecondFactorKey };
