import { BaseEntity } from '../../common/base.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';
import { Exclude } from 'class-transformer';
import { Provider } from '../../common/enums/provider.enum';
import { Role } from '@common/enums/role.enum';
import { Consent } from '@root/consent/entities/consent.entity';
import { Profile } from '@root/profile/entities/profile.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  @Exclude()
  public password?: string;

  @Column()
  public profileImg?: string;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  public provider: Provider;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.USER],
  })
  @Exclude()
  public roles: Role[];

  @OneToOne(() => Consent, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public consent: Consent;

  @OneToOne(() => Profile, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public profile: Profile;

  @BeforeInsert()
  async beforeSaveFunction() {
    try {
      if (this.provider !== Provider.LOCAL) {
        return;
      } else {
        const saltValue = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, saltValue);

        this.profileImg = gravatar.url(this.email, {
          s: '200',
          r: 'pg',
          d: 'mm',
          protocol: 'https',
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
