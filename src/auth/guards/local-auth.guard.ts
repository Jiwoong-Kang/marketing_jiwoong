import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Provider } from '../../common/enums/provider.enum';

@Injectable()
export class LocalAuthGuard extends AuthGuard(Provider.LOCAL) {}
