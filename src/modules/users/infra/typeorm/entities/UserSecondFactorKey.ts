import { Expose } from "class-transformer";
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

  @Column()
  validated: boolean;

  @Column()
  validated_at: Date;

  @Expose({ name: "qrcode_url" })
  qrcode_url(): string {
    return `${process.env.APP_API_URL}/users/qrcode/${this.user_id}.png`;
  }
}

export { UserSecondFactorKey };
