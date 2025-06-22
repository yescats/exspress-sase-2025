import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Index("fk_user_id_idx", ["addedBy"], {})
@Entity("spot", { schema: "sase_final_db" })
export class Spot {
  @PrimaryGeneratedColumn({ type: "int", name: "spot_id", unsigned: true })
  spotId: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "location", length: 255 })
  location: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("int", { name: "added_by", nullable: true, unsigned: true })
  addedBy: number | null;

  @Column("varchar", { name: "image", nullable: true, length: 255 })
  image: string | null;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.spots, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "added_by", referencedColumnName: "userId" }])
  addedBy2: User;

  @OneToMany(() => User, (user) => user.spot)
  users: User[];
}
