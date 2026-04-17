export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          telegram_user_id: number;
          telegram_username: string | null;
          display_name: string | null;
          level: number;
          total_xp: number;
          rank_key: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          telegram_user_id: number;
          telegram_username?: string | null;
          display_name?: string | null;
          level?: number;
          total_xp?: number;
          rank_key?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          profile_id: string;
          goal_type: string;
          target_value: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          goal_type: string;
          target_value?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["goals"]["Insert"]>;
        Relationships: [];
      };
      user_paths: {
        Row: {
          id: string;
          profile_id: string;
          path_key: string;
          is_active: boolean;
          selected_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          path_key: string;
          is_active?: boolean;
          selected_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_paths"]["Insert"]>;
        Relationships: [];
      };
      daily_quests: {
        Row: {
          id: string;
          profile_id: string;
          quest_date: string;
          title: string;
          domain: string;
          quest_type: string;
          xp_reward: number;
          status: string;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          quest_date?: string;
          title: string;
          domain: string;
          quest_type: string;
          xp_reward?: number;
          status?: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["daily_quests"]["Insert"]>;
        Relationships: [];
      };
      quest_completions: {
        Row: {
          id: string;
          quest_id: string;
          profile_id: string;
          completed_at: string;
          quality_score: number | null;
          xp_awarded: number;
          note: string | null;
        };
        Insert: {
          id?: string;
          quest_id: string;
          profile_id: string;
          completed_at?: string;
          quality_score?: number | null;
          xp_awarded?: number;
          note?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["quest_completions"]["Insert"]>;
        Relationships: [];
      };
      weekly_checkins: {
        Row: {
          id: string;
          profile_id: string;
          week_start_date: string;
          weight_kg: number | null;
          energy_score: number | null;
          sleep_score: number | null;
          stress_score: number | null;
          adherence_score: number | null;
          reflection: string | null;
          summary: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          week_start_date: string;
          weight_kg?: number | null;
          energy_score?: number | null;
          sleep_score?: number | null;
          stress_score?: number | null;
          adherence_score?: number | null;
          reflection?: string | null;
          summary?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["weekly_checkins"]["Insert"]>;
        Relationships: [];
      };
      water_logs: {
        Row: {
          id: string;
          profile_id: string;
          client_event_id: string;
          amount_ml: number;
          logged_at: string;
          logged_date: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          client_event_id: string;
          amount_ml: number;
          logged_at?: string;
          logged_date?: string;
          note?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["water_logs"]["Insert"]>;
        Relationships: [];
      };
      workout_logs: {
        Row: {
          id: string;
          profile_id: string;
          client_event_id: string;
          workout_type: string;
          workout_name: string | null;
          duration_min: number | null;
          rpe: number | null;
          logged_at: string;
          logged_date: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          client_event_id: string;
          workout_type: string;
          workout_name?: string | null;
          duration_min?: number | null;
          rpe?: number | null;
          logged_at?: string;
          logged_date?: string;
          note?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["workout_logs"]["Insert"]>;
        Relationships: [];
      };
      sleep_logs: {
        Row: {
          id: string;
          profile_id: string;
          client_event_id: string;
          sleep_duration_min: number;
          sleep_quality: number | null;
          morning_energy: number | null;
          logged_at: string;
          logged_date: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          client_event_id: string;
          sleep_duration_min: number;
          sleep_quality?: number | null;
          morning_energy?: number | null;
          logged_at?: string;
          logged_date?: string;
          note?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sleep_logs"]["Insert"]>;
        Relationships: [];
      };
      meal_logs: {
        Row: {
          id: string;
          profile_id: string;
          client_event_id: string;
          meal_type: string;
          meal_name: string | null;
          calories: number | null;
          protein_g: number | null;
          logged_at: string;
          logged_date: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          client_event_id: string;
          meal_type: string;
          meal_name?: string | null;
          calories?: number | null;
          protein_g?: number | null;
          logged_at?: string;
          logged_date?: string;
          note?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["meal_logs"]["Insert"]>;
        Relationships: [];
      };
      xp_events: {
        Row: {
          id: string;
          profile_id: string;
          source_type: string;
          source_id: string | null;
          amount: number;
          reason: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          source_type: string;
          source_id?: string | null;
          amount: number;
          reason: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["xp_events"]["Insert"]>;
        Relationships: [];
      };
      streaks: {
        Row: {
          id: string;
          profile_id: string;
          streak_type: string;
          current_count: number;
          best_count: number;
          last_activity_date: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          streak_type: string;
          current_count?: number;
          best_count?: number;
          last_activity_date?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["streaks"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
