import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Notification {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  type: string;

  @Field(() => Int, { nullable: true })
  jobsId?: number;

  @Field(() => Int, { nullable: true })
  chatRoomId?: number;

  @Field(() => Int)
  senderId: number;

  @Field(() => Int)
  receiverId: number;

  @Field()
  createdAt: Date;
}
