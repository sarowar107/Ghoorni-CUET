export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      answers: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          question_id: string
          updated_at: string
          upvotes: number
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          question_id: string
          updated_at?: string
          upvotes?: number
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          question_id?: string
          updated_at?: string
          upvotes?: number
        }
        Relationships: [
          {
            foreignKeyName: "answers_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          }
        ]
      }
      batches: {
        Row: {
          created_at: string
          id: string
          year: string
        }
        Insert: {
          created_at?: string
          id?: string
          year: string
        }
        Update: {
          created_at?: string
          id?: string
          year?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          batch_id: string | null
          created_at: string
          department_id: string | null
          description: string | null
          event_date: string
          event_type: string
          id: string
          is_public: boolean
          title: string
          updated_at: string
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          event_date: string
          event_type: string
          id?: string
          is_public?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          is_public?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          }
        ]
      }
      files: {
        Row: {
          batch_id: string | null
          created_at: string
          department_id: string | null
          file_path: string
          file_size: number
          file_type: string
          id: string
          is_public: boolean
          name: string
          updated_at: string
          uploader_id: string
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          department_id?: string | null
          file_path: string
          file_size: number
          file_type: string
          id?: string
          is_public?: boolean
          name: string
          updated_at?: string
          uploader_id: string
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          department_id?: string | null
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          is_public?: boolean
          name?: string
          updated_at?: string
          uploader_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notices: {
        Row: {
          attachments: string[] | null
          author_id: string
          batch_id: string | null
          category: string
          content: string
          created_at: string
          department_id: string | null
          event_date: string | null
          expires_at: string
          id: string
          is_active: boolean
          is_public: boolean
          priority: string
          title: string
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          author_id: string
          batch_id?: string | null
          category: string
          content: string
          created_at?: string
          department_id?: string | null
          event_date?: string | null
          expires_at: string
          id?: string
          is_active?: boolean
          is_public?: boolean
          priority?: string
          title: string
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          author_id?: string
          batch_id?: string | null
          category?: string
          content?: string
          created_at?: string
          department_id?: string | null
          event_date?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean
          is_public?: boolean
          priority?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notices_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notices_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notices_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          batch_id: string | null
          created_at: string
          department_id: string | null
          id: string
          is_active: boolean
          is_verified: boolean
          name: string
          profile_picture: string | null
          role: string
          updated_at: string
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          department_id?: string | null
          id: string
          is_active?: boolean
          is_verified?: boolean
          name: string
          profile_picture?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          department_id?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          name?: string
          profile_picture?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          author_id: string
          batch_id: string | null
          category: string
          content: string
          created_at: string
          department_id: string | null
          id: string
          image_url: string | null
          title: string
          updated_at: string
          upvotes: number
        }
        Insert: {
          author_id: string
          batch_id?: string | null
          category: string
          content: string
          created_at?: string
          department_id?: string | null
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string
          upvotes?: number
        }
        Update: {
          author_id?: string
          batch_id?: string | null
          category?: string
          content?: string
          created_at?: string
          department_id?: string | null
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string
          upvotes?: number
        }
        Relationships: [
          {
            foreignKeyName: "questions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}