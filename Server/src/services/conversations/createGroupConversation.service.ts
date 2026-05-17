import { prisma } from "../../lib/prisma.lib.js";
import { resolveUserId } from "../../utils/resolveUser.js";

type GroupConversationType = {
  userId: string;
  memberIds: string[];
  name: string;
};

export const createGroupConversation = async (data: GroupConversationType) => {
  const { userId, memberIds, name } = data;

  if (!name || name.trim() === "") throw new Error("Group name is required.");
  if (memberIds.length < 2)
    throw new Error("Group needs at least 2 other members.");

  // Resolve all usernames to user_ids
  const resolvedMemberIds = await Promise.all(
    memberIds.map((id) => resolveUserId(id)),
  );
  // Combine creator + members, remove duplicates
  const allMembers = [...new Set([userId, ...resolvedMemberIds])];

  /* Create conversation add both members */
  const conversation = await prisma.conversation.create({
    data: {
      type: "GROUP",
      name: name.trim(),
      created_by: userId,
      participants: {
        create: allMembers.map((id) => ({ user_id: id })),
      },
    },
    include: { participants: true },
  });
  return conversation;
};
