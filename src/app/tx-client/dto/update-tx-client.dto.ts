import { PartialType } from '@nestjs/swagger';
import { CreateTxClientDto } from './create-tx-client.dto';

export class UpdateTxClientDto extends PartialType(CreateTxClientDto) {
}
