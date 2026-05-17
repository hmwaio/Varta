import { v4 as uuidv4 } from "uuid";
// import { producer } from "../../lib/kafka.lib.js";
import { prisma } from "../../lib/prisma.lib.js";
import { chatQueue } from "../../lib/queue.lib.js";
import { redis } from "../../lib/redis.lib.js";
import type { SendMessageType } from "../../types/message.type.js";
import { resolveUserId } from "../../utils/resolveUser.js";
import {
  createDirectConversation,
  getMessageRequestKey,
  MESSAGE_REQUEST_LIMIT,
} from "../conversations/createDirectConversation.service.js";

export const sendMessage = async (data: SendMessageType) => {
  const {
    senderId,
    targetId,
    content,
    type = "TEXT",
    file_name,
    mime_type,
    file_size,
  } = data;
  let { conversationId } = data;

  if (!content?.trim()) {
    throw new Error("Message content is required.");
  }
  const isMedia =
    type === "IMAGE" || type === "VIDEO" || type === "AUDIO" || type === "FILE";
  if (isMedia && !file_name) {
    throw new Error("file_name is required for media messages.");
  }

  /* Resolve / Create Conversation */
  if (!conversationId) {
    if (!targetId) throw new Error("targetId or conversationId required.");

    const resolvedTargetId = await resolveUserId(targetId);

    /* Check blocked */
    const blocked = await prisma.connection.findFirst({
      where: {
        OR: [
          {
            sender_id: senderId,
            receiver_id: resolvedTargetId,
            status: "BLOCKED",
          },
          {
            sender_id: resolvedTargetId,
            receiver_id: senderId,
            status: "BLOCKED",
          },
        ],
      },
    });
    if (blocked) {
      if (blocked.sender_id === senderId) {
        throw new Error("Unblock this user before messaging.");
      }
      throw new Error("You have been blocked by this user.");
    }

    const conversation = await createDirectConversation({
      userId: senderId,
      targetId: resolvedTargetId,
    });
    conversationId = conversation.conversation_id;
  }

  /* Membership Validation */
  const isMember = await prisma.conversationMember.findUnique({
    where: {
      conversation_id_user_id: {
        conversation_id: conversationId,
        user_id: senderId,
      },
    },
  });
  if (!isMember) throw new Error("You are not a member of this conversation.");

  const conversation = await prisma.conversation.findUnique({
    where: { conversation_id: conversationId },
    include: { participants: true },
  });
  if (!conversation) throw new Error("Conversation not found.");

  /* Check message request limit */
  if (conversation.is_request) {
    const otherId = conversation.participants.find(
      (p: { user_id: string }) => p.user_id !== senderId,
    )?.user_id;

    if (otherId) {
      const key = getMessageRequestKey(senderId, otherId);
      const count = await redis.get(key);
      const senderCount = count ? parseInt(count) : 0;

      if (senderCount >= MESSAGE_REQUEST_LIMIT) {
        throw new Error("Send a connection request to continue messaging.");
      }

      await redis.incr(key);
      await redis.expire(key, 60 * 60 * 24 * 30);
    }
  }

  /* Sender Info */
  const sender = await prisma.user.findUnique({
    where: { user_id: senderId },
    include: { profile: true },
  });

  /* Build Message */
  const message = {
    message_id: uuidv4(),
    conversation_id: conversationId,
    sender_id: senderId,
    sender_name: sender?.name ?? "Unknown",
    sender_picture: sender?.profile?.profile_picture ?? null,
    content,
    type,
    file_name: file_name ?? null,
    mime_type: mime_type ?? null,
    file_size: file_size ?? null,
    status: "sent",
    created_at: new Date().toISOString(),
  };

  /* Redis Buffer */
  // await redis.lPush(`chat:buffer:${conversationId}`, JSON.stringify(message));

  if (!conversationId) {
    throw new Error("Conversation ID is required.");
  }

  /* Kafka Publish */
  // await producer.send({
  //   topic: "chat.messages",
  //   messages: [
  //     {
  //       key: conversationId,
  //       value: JSON.stringify(message),
  //     },
  //   ],
  // });

  await chatQueue.add("persist-message", message, {
    removeOnComplete: 1000,
    removeOnFail: 5000,
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });

  return message;
};
