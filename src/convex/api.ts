import { FunctionReference, anyApi } from "convex/server";
import { GenericId as Id } from "convex/values";

export const api: PublicApiType = anyApi as unknown as PublicApiType;
export const internal: InternalApiType = anyApi as unknown as InternalApiType;

export type PublicApiType = {
  mutations: {
    users: {
      current: FunctionReference<"query", "public", Record<string, never>, any>;
    };
    workspaces: {
      createWorkspace: FunctionReference<
        "mutation",
        "public",
        { name: string; type: "personal" | "public" },
        any
      >;
      deleteWorkspace: FunctionReference<
        "mutation",
        "public",
        { workspaceId: Id<"workspaces"> },
        any
      >;
    };
  };
  queries: {
    notifications: {
      getUserNotifications: FunctionReference<
        "query",
        "public",
        Record<string, never>,
        any
      >;
    };
    users: {
      getMyUser: FunctionReference<
        "query",
        "public",
        Record<string, never>,
        any
      >;
    };
    workspaces: {
      getUserWorkspaces: FunctionReference<
        "query",
        "public",
        Record<string, never>,
        any
      >;
      getWorkspaceFolders: FunctionReference<
        "query",
        "public",
        { workspaceId: Id<"workspaces"> },
        any
      >;
      getAllUserVideosByWorkspace: FunctionReference<
        "query",
        "public",
        { workspaceId: Id<"workspaces"> },
        any
      >;
    };
  };
};
export type InternalApiType = {};
