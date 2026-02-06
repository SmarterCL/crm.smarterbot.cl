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
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          addedSubscriptionsCount: number | null
          check: boolean | null
          created_at: string
          dateCreated: string | null
          deleted: boolean | null
          email: string | null
          expirationDate: string | null
          firstName: string | null
          id: string
          lastName1: string | null
          lastName2: string | null
          password: string | null
          paymentStatus: string | null
          phone: string | null
          planType: string | null
          recoverToken: string | null
          rut: string | null
          subscriptionsCount: number | null
          totalPrice: number | null
          type: string | null
        }
        Insert: {
          addedSubscriptionsCount?: number | null
          check?: boolean | null
          created_at?: string
          dateCreated?: string | null
          deleted?: boolean | null
          email?: string | null
          expirationDate?: string | null
          firstName?: string | null
          id?: string
          lastName1?: string | null
          lastName2?: string | null
          password?: string | null
          paymentStatus?: string | null
          phone?: string | null
          planType?: string | null
          recoverToken?: string | null
          rut?: string | null
          subscriptionsCount?: number | null
          totalPrice?: number | null
          type?: string | null
        }
        Update: {
          addedSubscriptionsCount?: number | null
          check?: boolean | null
          created_at?: string
          dateCreated?: string | null
          deleted?: boolean | null
          email?: string | null
          expirationDate?: string | null
          firstName?: string | null
          id?: string
          lastName1?: string | null
          lastName2?: string | null
          password?: string | null
          paymentStatus?: string | null
          phone?: string | null
          planType?: string | null
          recoverToken?: string | null
          rut?: string | null
          subscriptionsCount?: number | null
          totalPrice?: number | null
          type?: string | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_time: string
          event_type: string
          id: string
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_time: string
          event_type?: string
          id?: string
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_time?: string
          event_type?: string
          id?: string
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      channel_members: {
        Row: {
          channel: string
          joined_at: string
          user_id: string
        }
        Insert: {
          channel: string
          joined_at?: string
          user_id: string
        }
        Update: {
          channel?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          message: string | null
          phone: string | null
          source: string | null
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          message?: string | null
          phone?: string | null
          source?: string | null
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          message?: string | null
          phone?: string | null
          source?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_summary"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "contacts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "v_tenant_overview"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      event_participants: {
        Row: {
          client_id: string | null
          created_at: string
          email: string | null
          event_id: string
          id: string
          name: string | null
          status: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          email?: string | null
          event_id: string
          id?: string
          name?: string | null
          status?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          email?: string | null
          event_id?: string
          id?: string
          name?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          id: string
          payload: Json | null
          tenant_id: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          payload?: Json | null
          tenant_id: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          payload?: Json | null
          tenant_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_summary"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "v_tenant_overview"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      external_health: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          latency_ms: number | null
          metadata: Json | null
          service: string
          status: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          service: string
          status: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          service?: string
          status?: string
        }
        Relationships: []
      }
      mcp_invocations: {
        Row: {
          args: string | null
          created_at: string
          duration_ms: number
          id: string
          result: string | null
          success: boolean
          tool: string
          user_id: string
        }
        Insert: {
          args?: string | null
          created_at?: string
          duration_ms: number
          id?: string
          result?: string | null
          success?: boolean
          tool: string
          user_id: string
        }
        Update: {
          args?: string | null
          created_at?: string
          duration_ms?: number
          id?: string
          result?: string | null
          success?: boolean
          tool?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          channel: string
          content: string
          created_at: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          channel: string
          content: string
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          channel?: string
          content?: string
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: []
      }
      paymentData: {
        Row: {
          accountId: string | null
          created_at: string
          dateCreated: string | null
          id: string
          paymentData: Json | null
        }
        Insert: {
          accountId?: string | null
          created_at?: string
          dateCreated?: string | null
          id?: string
          paymentData?: Json | null
        }
        Update: {
          accountId?: string | null
          created_at?: string
          dateCreated?: string | null
          id?: string
          paymentData?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "paymentData_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          business_name: string | null
          created_at: string
          email: string | null
          id: string
          phone: string | null
          rut: string | null
          updated_at: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          email?: string | null
          id: string
          phone?: string | null
          rut?: string | null
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          rut?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      runtime_alerts: {
        Row: {
          alert_type: string
          created_at: string
          details: Json | null
          execution_id: string
          id: string
          message: string
          sent_at: string | null
          severity: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          details?: Json | null
          execution_id: string
          id?: string
          message: string
          sent_at?: string | null
          severity: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          details?: Json | null
          execution_id?: string
          id?: string
          message?: string
          sent_at?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "runtime_alerts_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "runtime_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      runtime_executions: {
        Row: {
          alerts_fired: number | null
          completed_at: string | null
          error_message: string | null
          id: string
          links_broken: number | null
          links_checked: number | null
          metadata: Json | null
          scout_id: string
          started_at: string
          status: string
          urls_new: number | null
          urls_removed: number | null
        }
        Insert: {
          alerts_fired?: number | null
          completed_at?: string | null
          error_message?: string | null
          id?: string
          links_broken?: number | null
          links_checked?: number | null
          metadata?: Json | null
          scout_id: string
          started_at?: string
          status?: string
          urls_new?: number | null
          urls_removed?: number | null
        }
        Update: {
          alerts_fired?: number | null
          completed_at?: string | null
          error_message?: string | null
          id?: string
          links_broken?: number | null
          links_checked?: number | null
          metadata?: Json | null
          scout_id?: string
          started_at?: string
          status?: string
          urls_new?: number | null
          urls_removed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "runtime_executions_scout_id_fkey"
            columns: ["scout_id"]
            isOneToOne: false
            referencedRelation: "runtime_scouts"
            referencedColumns: ["id"]
          },
        ]
      }
      runtime_link_validations: {
        Row: {
          checked_at: string
          error_message: string | null
          execution_id: string
          id: string
          is_broken: boolean | null
          redirect_target: string | null
          response_time_ms: number | null
          status_code: number | null
          url: string
        }
        Insert: {
          checked_at?: string
          error_message?: string | null
          execution_id: string
          id?: string
          is_broken?: boolean | null
          redirect_target?: string | null
          response_time_ms?: number | null
          status_code?: number | null
          url: string
        }
        Update: {
          checked_at?: string
          error_message?: string | null
          execution_id?: string
          id?: string
          is_broken?: boolean | null
          redirect_target?: string | null
          response_time_ms?: number | null
          status_code?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "runtime_link_validations_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "runtime_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      runtime_scouts: {
        Row: {
          created_at: string
          critical_urls: string[]
          domain: string
          enabled: boolean | null
          expected_keywords: string[] | null
          frequency: string
          id: string
          name: string
          sensitive_keywords: string[] | null
          tenant_rut: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          critical_urls: string[]
          domain: string
          enabled?: boolean | null
          expected_keywords?: string[] | null
          frequency?: string
          id?: string
          name: string
          sensitive_keywords?: string[] | null
          tenant_rut?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          critical_urls?: string[]
          domain?: string
          enabled?: boolean | null
          expected_keywords?: string[] | null
          frequency?: string
          id?: string
          name?: string
          sensitive_keywords?: string[] | null
          tenant_rut?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      runtime_semantic_deltas: {
        Row: {
          detected_at: string
          execution_id: string
          field_changed: string
          id: string
          impact_level: string | null
          new_value: string | null
          previous_value: string | null
          url: string
        }
        Insert: {
          detected_at?: string
          execution_id: string
          field_changed: string
          id?: string
          impact_level?: string | null
          new_value?: string | null
          previous_value?: string | null
          url: string
        }
        Update: {
          detected_at?: string
          execution_id?: string
          field_changed?: string
          id?: string
          impact_level?: string | null
          new_value?: string | null
          previous_value?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "runtime_semantic_deltas_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "runtime_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      runtime_url_deltas: {
        Row: {
          delta_type: string
          detected_at: string
          execution_id: string
          id: string
          is_new: boolean | null
          status_code: number | null
          url: string
        }
        Insert: {
          delta_type: string
          detected_at?: string
          execution_id: string
          id?: string
          is_new?: boolean | null
          status_code?: number | null
          url: string
        }
        Update: {
          delta_type?: string
          detected_at?: string
          execution_id?: string
          id?: string
          is_new?: boolean | null
          status_code?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "runtime_url_deltas_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "runtime_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          discountText: string | null
          id: string
          offerPrice: number | null
          price: number | null
        }
        Insert: {
          discountText?: string | null
          id: string
          offerPrice?: number | null
          price?: number | null
        }
        Update: {
          discountText?: string | null
          id?: string
          offerPrice?: number | null
          price?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          accountId: string | null
          created_at: string
          deleted: boolean | null
          id: string
          name: string | null
          rut: string | null
        }
        Insert: {
          accountId?: string | null
          created_at?: string
          deleted?: boolean | null
          id?: string
          name?: string | null
          rut?: string | null
        }
        Update: {
          accountId?: string | null
          created_at?: string
          deleted?: boolean | null
          id?: string
          name?: string | null
          rut?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_domains: {
        Row: {
          created_at: string
          domain: string
          domain_type: string
          id: string
          is_active: boolean
          subdomain: string | null
          tenant_id: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          domain: string
          domain_type?: string
          id?: string
          is_active?: boolean
          subdomain?: string | null
          tenant_id: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          domain?: string
          domain_type?: string
          id?: string
          is_active?: boolean
          subdomain?: string | null
          tenant_id?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "tenant_domains_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_summary"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "tenant_domains_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_domains_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "v_tenant_overview"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      tenant_integrations: {
        Row: {
          created_at: string
          external_id: string | null
          external_ref: Json | null
          id: string
          integration_type: string
          is_active: boolean
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          external_id?: string | null
          external_ref?: Json | null
          id?: string
          integration_type: string
          is_active?: boolean
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          external_id?: string | null
          external_ref?: Json | null
          id?: string
          integration_type?: string
          is_active?: boolean
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_integrations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_summary"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "tenant_integrations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_integrations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "v_tenant_overview"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      tenant_products: {
        Row: {
          created_at: string
          id: string
          plan: string | null
          product_code: string
          status: string
          tenant_id: string
          trial_expires_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan?: string | null
          product_code: string
          status?: string
          tenant_id: string
          trial_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          plan?: string | null
          product_code?: string
          status?: string
          tenant_id?: string
          trial_expires_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_summary"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "tenant_products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "v_tenant_overview"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      tenants: {
        Row: {
          botpress_workspace_id: string | null
          business_name: string
          chatwoot_inbox_id: number | null
          clerk_user_id: string
          contact_email: string | null
          created_at: string | null
          id: string
          metabase_card_id: number | null
          n8n_project_id: string | null
          notes: Json | null
          odoo_company_id: number | null
          plan: string | null
          primary_domain: string | null
          rut: string
          services_enabled: Json | null
          status: string
          trial_expires_at: string | null
          updated_at: string | null
        }
        Insert: {
          botpress_workspace_id?: string | null
          business_name: string
          chatwoot_inbox_id?: number | null
          clerk_user_id: string
          contact_email?: string | null
          created_at?: string | null
          id?: string
          metabase_card_id?: number | null
          n8n_project_id?: string | null
          notes?: Json | null
          odoo_company_id?: number | null
          plan?: string | null
          primary_domain?: string | null
          rut: string
          services_enabled?: Json | null
          status?: string
          trial_expires_at?: string | null
          updated_at?: string | null
        }
        Update: {
          botpress_workspace_id?: string | null
          business_name?: string
          chatwoot_inbox_id?: number | null
          clerk_user_id?: string
          contact_email?: string | null
          created_at?: string | null
          id?: string
          metabase_card_id?: number | null
          n8n_project_id?: string | null
          notes?: Json | null
          odoo_company_id?: number | null
          plan?: string | null
          primary_domain?: string | null
          rut?: string
          services_enabled?: Json | null
          status?: string
          trial_expires_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trials: {
        Row: {
          expires_at: string
          id: string
          metadata: Json | null
          product_code: string
          started_at: string
          status: string
          tenant_id: string
        }
        Insert: {
          expires_at: string
          id?: string
          metadata?: Json | null
          product_code: string
          started_at?: string
          status?: string
          tenant_id: string
        }
        Update: {
          expires_at?: string
          id?: string
          metadata?: Json | null
          product_code?: string
          started_at?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trials_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_summary"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "trials_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trials_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "v_tenant_overview"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      user_activity: {
        Row: {
          action: string
          channel: string | null
          created_at: string | null
          data: Json | null
          id: string
          tenant_id: string
          ugid: string
        }
        Insert: {
          action: string
          channel?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          tenant_id: string
          ugid: string
        }
        Update: {
          action?: string
          channel?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          tenant_id?: string
          ugid?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_summary"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "user_activity_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "v_tenant_overview"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "user_activity_ugid_fkey"
            columns: ["ugid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["ugid"]
          },
        ]
      }
      user_auth: {
        Row: {
          attempts: number | null
          code: string
          code_hash: string | null
          created_at: string | null
          expires_at: string
          id: string
          max_attempts: number | null
          phone: string
          tenant_id: string
          ugid: string | null
          validated_at: string | null
        }
        Insert: {
          attempts?: number | null
          code: string
          code_hash?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          max_attempts?: number | null
          phone: string
          tenant_id: string
          ugid?: string | null
          validated_at?: string | null
        }
        Update: {
          attempts?: number | null
          code?: string
          code_hash?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          max_attempts?: number | null
          phone?: string
          tenant_id?: string
          ugid?: string | null
          validated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_auth_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_summary"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "user_auth_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_auth_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "v_tenant_overview"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "user_auth_ugid_fkey"
            columns: ["ugid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["ugid"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          expires_at: string
          id: string
          ip_address: string | null
          last_activity_at: string | null
          refresh_token: string | null
          revoked_at: string | null
          tenant_id: string
          token: string
          ugid: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          expires_at: string
          id?: string
          ip_address?: string | null
          last_activity_at?: string | null
          refresh_token?: string | null
          revoked_at?: string | null
          tenant_id: string
          token: string
          ugid: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          last_activity_at?: string | null
          refresh_token?: string | null
          revoked_at?: string | null
          tenant_id?: string
          token?: string
          ugid?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_summary"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "user_sessions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_sessions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "v_tenant_overview"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "user_sessions_ugid_fkey"
            columns: ["ugid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["ugid"]
          },
        ]
      }
      user_vectors: {
        Row: {
          created_at: string | null
          embedding_history: string | null
          embedding_preferences: string | null
          embedding_profile: string | null
          history_updated_at: string | null
          preferences_updated_at: string | null
          profile_updated_at: string | null
          ugid: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          embedding_history?: string | null
          embedding_preferences?: string | null
          embedding_profile?: string | null
          history_updated_at?: string | null
          preferences_updated_at?: string | null
          profile_updated_at?: string | null
          ugid: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          embedding_history?: string | null
          embedding_preferences?: string | null
          embedding_profile?: string | null
          history_updated_at?: string | null
          preferences_updated_at?: string | null
          profile_updated_at?: string | null
          ugid?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_vectors_ugid_fkey"
            columns: ["ugid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["ugid"]
          },
        ]
      }
      users: {
        Row: {
          chatwoot_contact_id: number | null
          clerk_user_id: string | null
          created_at: string | null
          email: string | null
          last_seen_at: string | null
          metadata: Json | null
          name: string | null
          odoo_contact_id: number | null
          phone: string
          preferences: Json | null
          status: string | null
          tenant_id: string
          ugid: string
          updated_at: string | null
          verified: boolean | null
          verified_at: string | null
        }
        Insert: {
          chatwoot_contact_id?: number | null
          clerk_user_id?: string | null
          created_at?: string | null
          email?: string | null
          last_seen_at?: string | null
          metadata?: Json | null
          name?: string | null
          odoo_contact_id?: number | null
          phone: string
          preferences?: Json | null
          status?: string | null
          tenant_id: string
          ugid: string
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
        }
        Update: {
          chatwoot_contact_id?: number | null
          clerk_user_id?: string | null
          created_at?: string | null
          email?: string | null
          last_seen_at?: string | null
          metadata?: Json | null
          name?: string | null
          odoo_contact_id?: number | null
          phone?: string
          preferences?: Json | null
          status?: string | null
          tenant_id?: string
          ugid?: string
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "dashboard_summary"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "v_tenant_overview"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      vault_secrets: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          key: string
          tenant_id: string
          value: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          key: string
          tenant_id: string
          value: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          key?: string
          tenant_id?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      dashboard_summary: {
        Row: {
          business_name: string | null
          created_at: string | null
          last_contact_at: string | null
          last_event_at: string | null
          rut: string | null
          services_enabled: Json | null
          tenant_id: string | null
          total_contacts: number | null
          total_events: number | null
          updated_at: string | null
        }
        Insert: {
          business_name?: string | null
          created_at?: string | null
          last_contact_at?: never
          last_event_at?: never
          rut?: string | null
          services_enabled?: Json | null
          tenant_id?: string | null
          total_contacts?: never
          total_events?: never
          updated_at?: string | null
        }
        Update: {
          business_name?: string | null
          created_at?: string | null
          last_contact_at?: never
          last_event_at?: never
          rut?: string | null
          services_enabled?: Json | null
          tenant_id?: string | null
          total_contacts?: never
          total_events?: never
          updated_at?: string | null
        }
        Relationships: []
      }
      v_tenant_overview: {
        Row: {
          business_name: string | null
          contact_email: string | null
          created_at: string | null
          domains: Json | null
          has_automation: boolean | null
          has_chat: boolean | null
          has_erp: boolean | null
          integrations: Json | null
          primary_domain: string | null
          rut: string | null
          services_enabled: Json | null
          subdomains: Json | null
          tenant_id: string | null
          tenant_plan: string | null
          tenant_status: string | null
          tenant_trial_expires_at: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      activate_default_products_for_tenant: {
        Args: { p_tenant_id: string; p_trial_expires_at: string }
        Returns: undefined
      }
      cleanup_expired_auth_codes: { Args: never; Returns: number }
      create_tenant_minimal:
        | {
            Args: {
              p_business_name: string
              p_contact_email: string
              p_rut: string
            }
            Returns: string
          }
        | {
            Args: {
              p_business_name: string
              p_clerk_user_id?: string
              p_contact_email: string
              p_rut: string
            }
            Returns: string
          }
      generate_ugid: {
        Args: { p_phone: string; p_tenant_id: string }
        Returns: string
      }
      get_vault_secret:
        | { Args: { p_key: string; p_tenant_id: string }; Returns: string }
        | { Args: { secret_name: string }; Returns: string }
      get_vault_secrets: {
        Args: { secret_names: string[] }
        Returns: {
          decrypted_secret: string
          name: string
        }[]
      }
      tenant_kpis: { Args: { tid: string }; Returns: Json }
      validate_auth_code: {
        Args: { p_code: string; p_phone: string; p_tenant_id: string }
        Returns: {
          message: string
          success: boolean
          ugid: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
