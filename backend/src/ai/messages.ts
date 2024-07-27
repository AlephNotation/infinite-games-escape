import type { CoreMessage } from "ai";
import redis from "../../utils/redisClient";

export async function storeChatMessage(
  userId: string,
  messages: CoreMessage[]
) {
  const hash = await Bun.hash(userId).toString();
  const chat = await redis.get(hash);

  if (chat) {
    const chatMessages = JSON.parse(chat);
    for (const message of messages) {
      chatMessages.push(message);
    }
    redis.set(hash, JSON.stringify(chatMessages));
  }

  redis.set(hash, JSON.stringify(messages));
}

export async function getChatMessages(
  userId: string
): Promise<CoreMessage[] | undefined> {
  const hash = await Bun.hash(userId).toString();

  const chat = await redis.get(hash);

  if (chat) {
    return JSON.parse(chat) as CoreMessage[];
  }

  return undefined;
}
