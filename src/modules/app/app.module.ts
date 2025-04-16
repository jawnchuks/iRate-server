import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { EmailModule } from "../email/email.module";
import { AuthModule } from "../auth/auth.module";
import { ChatModule } from "../chat/chat.module";
import { DiscoveryModule } from "../discovery/discovery.module";
import { PrismaModule } from "../prisma/prisma.module";
// Import other modules as needed

@Module({
  imports: [
    EmailModule,
    AuthModule,
    ChatModule,
    DiscoveryModule,
    PrismaModule,
    // Add other modules here
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
