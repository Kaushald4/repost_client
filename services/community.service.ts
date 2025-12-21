// Community Service - Handles all community-related operations
import { Community } from "@/types";
import { mockCommunities } from "@/data/mock-data";

export class CommunityService {
  private static communities = mockCommunities;

  static async getCommunities(): Promise<Community[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...this.communities];
  }

  static async getCommunityById(id: string): Promise<Community | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.communities.find((c) => c.id === id) || null;
  }

  static async getCommunityByName(name: string): Promise<Community | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.communities.find((c) => c.name === name) || null;
  }

  static async joinCommunity(communityId: string): Promise<Community> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const community = this.communities.find((c) => c.id === communityId);
    if (!community) throw new Error("Community not found");

    community.isJoined = true;
    community.memberCount++;
    return community;
  }

  static async leaveCommunity(communityId: string): Promise<Community> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const community = this.communities.find((c) => c.id === communityId);
    if (!community) throw new Error("Community not found");

    community.isJoined = false;
    community.memberCount--;
    return community;
  }

  static async getJoinedCommunities(): Promise<Community[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.communities.filter((c) => c.isJoined);
  }

  static async searchCommunities(query: string): Promise<Community[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const lowerQuery = query.toLowerCase();
    return this.communities.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.displayName.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery)
    );
  }

  static async createCommunity(data: Partial<Community>): Promise<Community> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newCommunity: Community = {
      id: Date.now().toString(),
      name: data.name!,
      displayName: data.displayName || data.name!,
      description: data.description || "",
      memberCount: 1,
      rules: [],
      moderators: [],
      createdAt: new Date(),
      healthScore: 100,
      isJoined: true,
      ...data,
    } as Community;

    this.communities.push(newCommunity);
    return newCommunity;
  }
}
