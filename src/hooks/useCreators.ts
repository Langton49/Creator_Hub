import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CreatorDisplay } from "@/types/creator";

// Database types for the actual table
type DbCreator = {
  id: number;
  created_at: string;
  creator_name: string | null;
  creator_desc: string | null;
  creator_channel: string | null;
  creator_image: string | null;
};

// Convert database creator to display format
const toDisplayFormat = (creator: DbCreator): CreatorDisplay => ({
  id: creator.id,
  name: creator.creator_name || "",
  url: creator.creator_channel || "",
  description: creator.creator_desc || "",
  imageUrl: creator.creator_image || undefined,
  platform: "YouTube", // Default platform, could be enhanced later
  created_at: creator.created_at,
});

// Convert display format to database format
const toDbFormat = (
  creator: Omit<CreatorDisplay, "id" | "created_at">
): Omit<DbCreator, "id" | "created_at"> => ({
  creator_name: creator.name,
  creator_channel: creator.url,
  creator_desc: creator.description,
  creator_image: creator.imageUrl || null,
});

export const useCreators = () => {
  const [creators, setCreators] = useState<CreatorDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from("creators")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const displayCreators = (data || []).map(toDisplayFormat);
      setCreators(displayCreators);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch creators");
    } finally {
      setLoading(false);
    }
  };

  const addCreator = async (
    creatorData: Omit<CreatorDisplay, "id" | "created_at">
  ) => {
    try {
      const dbData = toDbFormat(creatorData);
      const { data, error } = await (supabase as any)
        .from("creators")
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;

      const newCreator = toDisplayFormat(data);
      setCreators((prev) => [newCreator, ...prev]);
      return newCreator;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to add creator"
      );
    }
  };

  const updateCreator = async (
    id: number,
    creatorData: Omit<CreatorDisplay, "id" | "created_at">
  ) => {
    try {
      const dbData = toDbFormat(creatorData);
      const { data, error } = await (supabase as any)
        .from("creators")
        .update(dbData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const updatedCreator = toDisplayFormat(data);
      setCreators((prev) =>
        prev.map((c) => (c.id === id ? updatedCreator : c))
      );
      return updatedCreator;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to update creator"
      );
    }
  };

  const deleteCreator = async (id: number) => {
    try {
      const { error } = await (supabase as any)
        .from("creators")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCreators((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to delete creator"
      );
    }
  };

  const getCreatorById = useCallback(
    async (id: number): Promise<CreatorDisplay | null> => {
      try {
        const { data, error } = await (supabase as any)
          .from("creators")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;

        return data ? toDisplayFormat(data) : null;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to fetch creator"
        );
      }
    },
    []
  );

  useEffect(() => {
    fetchCreators();
  }, []);

  return {
    creators,
    loading,
    error,
    addCreator,
    updateCreator,
    deleteCreator,
    getCreatorById,
    refetch: fetchCreators,
  };
};
