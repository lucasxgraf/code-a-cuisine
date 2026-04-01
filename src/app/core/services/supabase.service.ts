import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  /** The initialized Supabase client instance using environment configurations. */
  protected readonly supabase: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseKey
  );

  /**
   * Provides access to the shared Supabase client instance.
   * @returns The active SupabaseClient.
   */
  get client() {
    return this.supabase;
  }
}
