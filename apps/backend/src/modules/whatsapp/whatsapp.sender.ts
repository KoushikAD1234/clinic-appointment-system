import { Injectable } from '@nestjs/common';
// import axios from 'axios';

@Injectable()
export class WhatsappSender {
  async sendMessage(to: string, message: string) {
    console.log(`Sending message to ${to}: ${message}`);

    // Later plug the twillio thing.
  }
}
