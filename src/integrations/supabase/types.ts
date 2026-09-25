export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      event_members: {
        Row: {
          created_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_members_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          contact_name: string | null
          couple_names: string | null
          created_at: string
          estimated_guests: number | null
          event_dates: Json
          id: string
          locations: Json
          owner_id: string | null
          rsvp_deadline: string | null
          slug: string
          status: Database["public"]["Enums"]["event_status"]
          template_id: string
          title: string
          updated_at: string
        }
        Insert: {
          contact_name?: string | null
          couple_names?: string | null
          created_at?: string
          estimated_guests?: number | null
          event_dates?: Json
          id?: string
          locations?: Json
          owner_id?: string | null
          rsvp_deadline?: string | null
          slug: string
          status?: Database["public"]["Enums"]["event_status"]
          template_id?: string
          title: string
          updated_at?: string
        }
        Update: {
          contact_name?: string | null
          couple_names?: string | null
          created_at?: string
          estimated_guests?: number | null
          event_dates?: Json
          id?: string
          locations?: Json
          owner_id?: string | null
          rsvp_deadline?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["event_status"]
          template_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          access_token: string
          created_at: string
          dietary_requirements: string | null
          event_id: string
          first_name: string
          id: string
          invitation_sent: boolean
          is_attending: boolean | null
          phone: string | null
          rsvp_status: Database["public"]["Enums"]["rsvp_status"]
          updated_at: string
        }
        Insert: {
          access_token?: string
          created_at?: string
          dietary_requirements?: string | null
          event_id: string
          first_name: string
          id?: string
          invitation_sent?: boolean
          is_attending?: boolean | null
          phone?: string | null
          rsvp_status?: Database["public"]["Enums"]["rsvp_status"]
          updated_at?: string
        }
        Update: {
          access_token?: string
          created_at?: string
          dietary_requirements?: string | null
          event_id?: string
          first_name?: string
          id?: string
          invitation_sent?: boolean
          is_attending?: boolean | null
          phone?: string | null
          rsvp_status?: Database["public"]["Enums"]["rsvp_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_guests: {
        Row: {
          created_at: string
          dietary_requirements: string | null
          full_name: string
          id: string
          is_attending: boolean | null
          parent_guest_id: string
        }
        Insert: {
          created_at?: string
          dietary_requirements?: string | null
          full_name: string
          id?: string
          is_attending?: boolean | null
          parent_guest_id: string
        }
        Update: {
          created_at?: string
          dietary_requirements?: string | null
          full_name?: string
          id?: string
          is_attending?: boolean | null
          parent_guest_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_guests_parent_guest_id_fkey"
            columns: ["parent_guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_event: { Args: { _event_id: string }; Returns: boolean }
      get_invitation: { Args: { _slug: string; _token: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      submit_household_rsvp: {
        Args: {
          _dietary: string
          _primary_attending: boolean
          _slug: string
          _sub_guests: Json
          _token: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "couple"
      event_status: "lead" | "onboarding" | "active" | "closed"
      rsvp_status: "pending" | "confirmed" | "declined"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "couple"],
      event_status: ["lead", "onboarding", "active", "closed"],
      rsvp_status: ["pending", "confirmed", "declined"],
    },
  },
} as const
