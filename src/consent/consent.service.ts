import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Consent } from '@root/consent/entities/consent.entity';
import { Repository } from 'typeorm';
import { UserService } from '@user/user.service';
import { User } from '@user/entities/user.entity';
import { CreateConsentDto } from '@root/consent/dto/create-consent.dto';

@Injectable()
export class ConsentService {
  constructor(
    @InjectRepository(Consent)
    private readonly consentRepository: Repository<Consent>,
    private readonly userService: UserService,
  ) {}

  async createConsent(user: User, createConsentDto: CreateConsentDto) {
    const newConsent = await this.consentRepository.create({
      ...createConsentDto,
      user,
    });

    await this.consentRepository.save(newConsent);
    return newConsent;
  }

  async updateConsentByUser(user: User, createConsentDto: CreateConsentDto) {
    const userInfo = await this.userService.getUserById(user.id);
    return await this.consentRepository.update(
      { id: userInfo.consent.id },
      createConsentDto,
    );
  }
}
