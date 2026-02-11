import { Body, Controller, Post } from '@nestjs/common';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/models';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { RequestPaymentsService } from './request-payments.service';

@Auth()
@Controller('request-payments')
export class RequestPaymentsController {
  constructor(private readonly requestPaymentsService: RequestPaymentsService) {}

  @Post()
  createPaymentRequest(
    @Body() paymentRequestDto: CreatePaymentRequestDto,
    @GetUser() user: User
  ) {
    return this.requestPaymentsService.createPaymentRequest(paymentRequestDto, user);
  }
}
