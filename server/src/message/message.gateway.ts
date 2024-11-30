import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway({ cors: true })
export class MessageGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const recentMessages = await this.messageService.getRecentMessages(userId);

    client.join(userId);
    client.emit('new_message', recentMessages);
  }

  @SubscribeMessage('admin')
  async handleAdminChat(@ConnectedSocket() client: Socket): Promise<void> {
    const recentMessages = await this.messageService.getInBox();

    client.join('admin');
    client.emit('new_message', recentMessages);
  }

  // Gửi tin nhắn đến một phòng userId
  @SubscribeMessage('send_message')
  async handleSendMessageToUser(
    @MessageBody()
    {
      userId,
      content,
      isAdmin,
    }: {
      userId: string;
      content: string;
      isAdmin: boolean;
    },
  ): Promise<void> {
    const newMessage = await this.messageService.addMessage(
      userId,
      content,
      isAdmin,
    );

    this.server.to(userId).emit('new_message', [newMessage]);
    this.server.to('admin').emit('new_message', newMessage);
  }
}
