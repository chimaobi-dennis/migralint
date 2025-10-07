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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          accepted_admission: string | null
          added_documents: string | null
          admitted_programs: string | null
          application_period_from: string | null
          application_period_to: string | null
          country: string | null
          country_id: number | null
          created_at: string | null
          degree: string | null
          eduLevel: string | null
          email_notification: number | null
          end_date: string | null
          id: number
          max_program: number | null
          officer: number | null
          payment_id: string | null
          profile_id: number | null
          progress: number | null
          recommended: string | null
          rejected_admission: string | null
          rejected_programs: string | null
          selected_programs: string | null
          stage: number | null
          start_date: string | null
          status: string | null
          study_destination: string | null
          study_destination_id: number | null
          study_period: string | null
          studyField: string | null
          timezone: string | null
          track: string | null
          trx: string | null
          type: string | null
          university: string | null
          updated_at: string | null
          user_id: number | null
          visa_appointment_details: string | null
          visa_decision: string | null
          visa_documents: string | null
        }
        Insert: {
          accepted_admission?: string | null
          added_documents?: string | null
          admitted_programs?: string | null
          application_period_from?: string | null
          application_period_to?: string | null
          country?: string | null
          country_id?: number | null
          created_at?: string | null
          degree?: string | null
          eduLevel?: string | null
          email_notification?: number | null
          end_date?: string | null
          id: number
          max_program?: number | null
          officer?: number | null
          payment_id?: string | null
          profile_id?: number | null
          progress?: number | null
          recommended?: string | null
          rejected_admission?: string | null
          rejected_programs?: string | null
          selected_programs?: string | null
          stage?: number | null
          start_date?: string | null
          status?: string | null
          study_destination?: string | null
          study_destination_id?: number | null
          study_period?: string | null
          studyField?: string | null
          timezone?: string | null
          track?: string | null
          trx?: string | null
          type?: string | null
          university?: string | null
          updated_at?: string | null
          user_id?: number | null
          visa_appointment_details?: string | null
          visa_decision?: string | null
          visa_documents?: string | null
        }
        Update: {
          accepted_admission?: string | null
          added_documents?: string | null
          admitted_programs?: string | null
          application_period_from?: string | null
          application_period_to?: string | null
          country?: string | null
          country_id?: number | null
          created_at?: string | null
          degree?: string | null
          eduLevel?: string | null
          email_notification?: number | null
          end_date?: string | null
          id?: number
          max_program?: number | null
          officer?: number | null
          payment_id?: string | null
          profile_id?: number | null
          progress?: number | null
          recommended?: string | null
          rejected_admission?: string | null
          rejected_programs?: string | null
          selected_programs?: string | null
          stage?: number | null
          start_date?: string | null
          status?: string | null
          study_destination?: string | null
          study_destination_id?: number | null
          study_period?: string | null
          studyField?: string | null
          timezone?: string | null
          track?: string | null
          trx?: string | null
          type?: string | null
          university?: string | null
          updated_at?: string | null
          user_id?: number | null
          visa_appointment_details?: string | null
          visa_decision?: string | null
          visa_documents?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "student_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          code: string | null
          continent: string | null
          country_code: string | null
          created_at: string | null
          currency: string | null
          id: number
          name: string | null
          phone_code: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          continent?: string | null
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          id: number
          name?: string | null
          phone_code?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          continent?: string | null
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          id?: number
          name?: string | null
          phone_code?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          app_link: string | null
          app_portal: string | null
          app_steps: string | null
          campus_about: string | null
          career: string | null
          city: string | null
          country: string | null
          country_id: number | null
          course_code: string | null
          course_name: string | null
          created_at: string | null
          created_by: string | null
          credit: string | null
          currency: string | null
          degree: string | null
          degree_requirement: string | null
          document_requirements: string | null
          duration: string | null
          end_date: string | null
          field_of_study: string | null
          first_tuition: number | null
          id: number
          identifier: string | null
          image: string | null
          img1: string | null
          img2: string | null
          job_opp: string | null
          keywords: Json | null
          language: string | null
          last_searched_at: string | null
          late_app: string | null
          late_end_date: string | null
          level: string | null
          popularity: string | null
          program_about: string | null
          program_end_date: string | null
          program_link: string | null
          program_start_date: string | null
          rating: string | null
          requirements_id: Json | null
          scholarships: string | null
          specific_requirements: Json | null
          start_date: string | null
          status: string | null
          student_life: string | null
          study_pace: string | null
          timezone: string | null
          total_tuition: number | null
          uni_logo: string | null
          uni_ranking: number | null
          university_id: number | null
          university_name: string | null
          updated_at: string | null
          views: string | null
        }
        Insert: {
          app_link?: string | null
          app_portal?: string | null
          app_steps?: string | null
          campus_about?: string | null
          career?: string | null
          city?: string | null
          country?: string | null
          country_id?: number | null
          course_code?: string | null
          course_name?: string | null
          created_at?: string | null
          created_by?: string | null
          credit?: string | null
          currency?: string | null
          degree?: string | null
          degree_requirement?: string | null
          document_requirements?: string | null
          duration?: string | null
          end_date?: string | null
          field_of_study?: string | null
          first_tuition?: number | null
          id: number
          identifier?: string | null
          image?: string | null
          img1?: string | null
          img2?: string | null
          job_opp?: string | null
          keywords?: Json | null
          language?: string | null
          last_searched_at?: string | null
          late_app?: string | null
          late_end_date?: string | null
          level?: string | null
          popularity?: string | null
          program_about?: string | null
          program_end_date?: string | null
          program_link?: string | null
          program_start_date?: string | null
          rating?: string | null
          requirements_id?: Json | null
          scholarships?: string | null
          specific_requirements?: Json | null
          start_date?: string | null
          status?: string | null
          student_life?: string | null
          study_pace?: string | null
          timezone?: string | null
          total_tuition?: number | null
          uni_logo?: string | null
          uni_ranking?: number | null
          university_id?: number | null
          university_name?: string | null
          updated_at?: string | null
          views?: string | null
        }
        Update: {
          app_link?: string | null
          app_portal?: string | null
          app_steps?: string | null
          campus_about?: string | null
          career?: string | null
          city?: string | null
          country?: string | null
          country_id?: number | null
          course_code?: string | null
          course_name?: string | null
          created_at?: string | null
          created_by?: string | null
          credit?: string | null
          currency?: string | null
          degree?: string | null
          degree_requirement?: string | null
          document_requirements?: string | null
          duration?: string | null
          end_date?: string | null
          field_of_study?: string | null
          first_tuition?: number | null
          id?: number
          identifier?: string | null
          image?: string | null
          img1?: string | null
          img2?: string | null
          job_opp?: string | null
          keywords?: Json | null
          language?: string | null
          last_searched_at?: string | null
          late_app?: string | null
          late_end_date?: string | null
          level?: string | null
          popularity?: string | null
          program_about?: string | null
          program_end_date?: string | null
          program_link?: string | null
          program_start_date?: string | null
          rating?: string | null
          requirements_id?: Json | null
          scholarships?: string | null
          specific_requirements?: Json | null
          start_date?: string | null
          status?: string | null
          student_life?: string | null
          study_pace?: string | null
          timezone?: string | null
          total_tuition?: number | null
          uni_logo?: string | null
          uni_ranking?: number | null
          university_id?: number | null
          university_name?: string | null
          updated_at?: string | null
          views?: string | null
        }
        Relationships: []
      }
      student_profile: {
        Row: {
          application_ids: Json | null
          area_of_study: string | null
          created_at: string | null
          degree: string | null
          desired_fields: Json | null
          fee_preference: string | null
          field_of_study: string | null
          has_language_test: number | null
          id: number
          interest_keywords: Json | null
          language: string | null
          language_test_score: number | null
          language_test_type: string | null
          language_test_year: number | null
          origin_country: string | null
          recommended_percentage: Json | null
          recommended_programs: Json | null
          study_envs: Json | null
          university_country: string | null
          updated_at: string | null
          user_id: number | null
          work_experience: string | null
        }
        Insert: {
          application_ids?: Json | null
          area_of_study?: string | null
          created_at?: string | null
          degree?: string | null
          desired_fields?: Json | null
          fee_preference?: string | null
          field_of_study?: string | null
          has_language_test?: number | null
          id: number
          interest_keywords?: Json | null
          language?: string | null
          language_test_score?: number | null
          language_test_type?: string | null
          language_test_year?: number | null
          origin_country?: string | null
          recommended_percentage?: Json | null
          recommended_programs?: Json | null
          study_envs?: Json | null
          university_country?: string | null
          updated_at?: string | null
          user_id?: number | null
          work_experience?: string | null
        }
        Update: {
          application_ids?: Json | null
          area_of_study?: string | null
          created_at?: string | null
          degree?: string | null
          desired_fields?: Json | null
          fee_preference?: string | null
          field_of_study?: string | null
          has_language_test?: number | null
          id?: number
          interest_keywords?: Json | null
          language?: string | null
          language_test_score?: number | null
          language_test_type?: string | null
          language_test_year?: number | null
          origin_country?: string | null
          recommended_percentage?: Json | null
          recommended_programs?: Json | null
          study_envs?: Json | null
          university_country?: string | null
          updated_at?: string | null
          user_id?: number | null
          work_experience?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      study_destinations: {
        Row: {
          admission_result_date: string | null
          application_cost: number | null
          application_period_from: string | null
          application_period_to: string | null
          application_portal: string | null
          application_steps: Json | null
          application_type: string | null
          country_id: number | null
          created_at: string | null
          currency: string | null
          id: number
          images: string | null
          intakes: Json | null
          max_program: number | null
          name: string | null
          status: number | null
          study_period: string | null
          timezone: string | null
          updated_at: string | null
          visa_steps: Json | null
          why_study_here: Json | null
        }
        Insert: {
          admission_result_date?: string | null
          application_cost?: number | null
          application_period_from?: string | null
          application_period_to?: string | null
          application_portal?: string | null
          application_steps?: Json | null
          application_type?: string | null
          country_id?: number | null
          created_at?: string | null
          currency?: string | null
          id: number
          images?: string | null
          intakes?: Json | null
          max_program?: number | null
          name?: string | null
          status?: number | null
          study_period?: string | null
          timezone?: string | null
          updated_at?: string | null
          visa_steps?: Json | null
          why_study_here?: Json | null
        }
        Update: {
          admission_result_date?: string | null
          application_cost?: number | null
          application_period_from?: string | null
          application_period_to?: string | null
          application_portal?: string | null
          application_steps?: Json | null
          application_type?: string | null
          country_id?: number | null
          created_at?: string | null
          currency?: string | null
          id?: number
          images?: string | null
          intakes?: Json | null
          max_program?: number | null
          name?: string | null
          status?: number | null
          study_period?: string | null
          timezone?: string | null
          updated_at?: string | null
          visa_steps?: Json | null
          why_study_here?: Json | null
        }
        Relationships: []
      }
      template_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      template_tags: {
        Row: {
          created_at: string
          id: string
          tag: string
          template_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tag: string
          template_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tag?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_tags_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      template_usage: {
        Row: {
          action: string
          created_at: string
          id: string
          metadata: Json | null
          template_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          metadata?: Json | null
          template_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          template_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_usage_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      template_versions: {
        Row: {
          changes_summary: string | null
          content: Json
          created_at: string
          created_by: string
          id: string
          structure: Json
          styling: Json
          template_id: string
          version_number: number
        }
        Insert: {
          changes_summary?: string | null
          content?: Json
          created_at?: string
          created_by: string
          id?: string
          structure?: Json
          styling?: Json
          template_id: string
          version_number: number
        }
        Update: {
          changes_summary?: string | null
          content?: Json
          created_at?: string
          created_by?: string
          id?: string
          structure?: Json
          styling?: Json
          template_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "template_versions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          content: Json
          created_at: string
          description: string | null
          id: string
          is_premium: boolean
          is_public: boolean
          metadata: Json
          name: string
          structure: Json
          styling: Json
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_premium?: boolean
          is_public?: boolean
          metadata?: Json
          name: string
          structure?: Json
          styling?: Json
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_premium?: boolean
          is_public?: boolean
          metadata?: Json
          name?: string
          structure?: Json
          styling?: Json
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      universities: {
        Row: {
          country: string | null
          country_code: string | null
          created_at: string
          id: number
          name: string | null
          state: string | null
          website: string | null
        }
        Insert: {
          country?: string | null
          country_code?: string | null
          created_at?: string
          id?: number
          name?: string | null
          state?: string | null
          website?: string | null
        }
        Update: {
          country?: string | null
          country_code?: string | null
          created_at?: string
          id?: number
          name?: string | null
          state?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user: {
        Row: {
          about: string | null
          address: string | null
          adminAccess: string | null
          city: string | null
          country_id: string | null
          created_at: string | null
          credit_plan: string | null
          credits: number | null
          credits_updated_at: string | null
          current_team_id: string | null
          document_subscription: number | null
          education: Json | null
          email: string | null
          email_verified_at: string | null
          forum: number | null
          id: number
          isAdmin: number | null
          linkedin: string | null
          lname: string | null
          name: string | null
          password: string | null
          phone: string | null
          phone_code: string | null
          pm_last_four: string | null
          pm_type: string | null
          portfolio_link: string | null
          profile_photo_path: string | null
          program_cart: string | null
          remember_token: string | null
          role: string | null
          status: number | null
          stripe_id: string | null
          subscription_quantity: string | null
          total_credits_purchased: string | null
          total_credits_used: string | null
          trial_ends_at: string | null
          two_factor_confirmed_at: string | null
          two_factor_recovery_codes: string | null
          two_factor_secret: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          about?: string | null
          address?: string | null
          adminAccess?: string | null
          city?: string | null
          country_id?: string | null
          created_at?: string | null
          credit_plan?: string | null
          credits?: number | null
          credits_updated_at?: string | null
          current_team_id?: string | null
          document_subscription?: number | null
          education?: Json | null
          email?: string | null
          email_verified_at?: string | null
          forum?: number | null
          id: number
          isAdmin?: number | null
          linkedin?: string | null
          lname?: string | null
          name?: string | null
          password?: string | null
          phone?: string | null
          phone_code?: string | null
          pm_last_four?: string | null
          pm_type?: string | null
          portfolio_link?: string | null
          profile_photo_path?: string | null
          program_cart?: string | null
          remember_token?: string | null
          role?: string | null
          status?: number | null
          stripe_id?: string | null
          subscription_quantity?: string | null
          total_credits_purchased?: string | null
          total_credits_used?: string | null
          trial_ends_at?: string | null
          two_factor_confirmed_at?: string | null
          two_factor_recovery_codes?: string | null
          two_factor_secret?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          about?: string | null
          address?: string | null
          adminAccess?: string | null
          city?: string | null
          country_id?: string | null
          created_at?: string | null
          credit_plan?: string | null
          credits?: number | null
          credits_updated_at?: string | null
          current_team_id?: string | null
          document_subscription?: number | null
          education?: Json | null
          email?: string | null
          email_verified_at?: string | null
          forum?: number | null
          id?: number
          isAdmin?: number | null
          linkedin?: string | null
          lname?: string | null
          name?: string | null
          password?: string | null
          phone?: string | null
          phone_code?: string | null
          pm_last_four?: string | null
          pm_type?: string | null
          portfolio_link?: string | null
          profile_photo_path?: string | null
          program_cart?: string | null
          remember_token?: string | null
          role?: string | null
          status?: number | null
          stripe_id?: string | null
          subscription_quantity?: string | null
          total_credits_purchased?: string | null
          total_credits_used?: string | null
          trial_ends_at?: string | null
          two_factor_confirmed_at?: string | null
          two_factor_recovery_codes?: string | null
          two_factor_secret?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      create_student_profile: {
        Args: {
          p_area_of_study: string
          p_degree: string
          p_desired_fields: string
          p_fee_preference: string
          p_field_of_study: string
          p_has_language_test: number
          p_interest_keywords: string
          p_language: string
          p_language_test_score: number
          p_language_test_type: string
          p_language_test_year: number
          p_origin_country: string
          p_study_envs: string
          p_university_country: string
          p_user_id: string
          p_work_experience: string
        }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
