"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchGroup,
  fetchGroupRole,
  fetchMemberCount,
  fetchMembers,
  joinGroup,
  leaveGroup,
  type GroupMember,
} from "@/core/vk/api/groups";
import { fetchGroupWall } from "@/core/vk/api/posts";
import type { GroupRole, VkGroupRow, VkWallPost } from "@/core/vk/vk-types";

export interface VkGroup {
  group: VkGroupRow | null;
  role: GroupRole | null;
  members: number;
  memberList: readonly GroupMember[];
  posts: readonly VkWallPost[];
  loading: boolean;
  busy: boolean;
  error: string | null;
  join: () => Promise<void>;
  leave: () => Promise<void>;
  reload: () => Promise<void>;
}

export function useVkGroup(groupId: string, viewerId: string): VkGroup {
  const [group, setGroup] = useState<VkGroupRow | null>(null);
  const [role, setRole] = useState<GroupRole | null>(null);
  const [members, setMembers] = useState(0);
  const [memberList, setMemberList] = useState<readonly GroupMember[]>([]);
  const [posts, setPosts] = useState<readonly VkWallPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const [row, myRole, count] = await Promise.all([
      fetchGroup(groupId),
      fetchGroupRole(groupId),
      fetchMemberCount(groupId),
    ]);
    setGroup(row);
    setRole(myRole);
    setMembers(count);
    setPosts(await fetchGroupWall(groupId, viewerId, myRole));
    // Список участников нужен только управляющим — рядовым он не показывается.
    setMemberList(
      myRole === "owner" || myRole === "admin"
        ? await fetchMembers(groupId)
        : [],
    );
    setLoading(false);
  }, [groupId, viewerId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const act = useCallback(
    async (action: Promise<string | null>) => {
      setBusy(true);
      const message = await action;
      setError(message);
      if (!message) await reload();
      setBusy(false);
    },
    [reload],
  );

  return {
    group,
    role,
    members,
    memberList,
    posts,
    loading,
    busy,
    error,
    join: () => act(joinGroup(groupId, viewerId)),
    leave: () => act(leaveGroup(groupId, viewerId)),
    reload,
  };
}
