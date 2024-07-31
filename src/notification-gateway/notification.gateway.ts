import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { NotificationsService } from "src/notifications/notifications.service";

@WebSocketGateway()
export class NotificationGateway {
  constructor(private readonly notificationsService: NotificationsService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("message")
  handleMessage(client: any, payload: any): string {
    return "Hello world!";
  }
}
