import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yhtdfmsyrnvyqkxslmzq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlodGRmbXN5cm52eXFreHNsbXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDM3NjIsImV4cCI6MjA2MzUxOTc2Mn0.-oL1i6_uItLmn5PHoB6IRk7HkVOthb-tYv8HdeM0dWM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);