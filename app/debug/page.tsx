// 'use client'

// import { useEffect } from 'react'
// import { createClientSupabaseClient } from '@/lib/supabase'

// export default function DebugPage() {
//   useEffect(() => {
//     const checkConnection = async () => {
//       const supabase = createClientSupabaseClient()

//       const { data, error } = await supabase
//         .from('posts') // replace with real table like 'users'
//         .select('*')
//         .limit(1)

//       if (error) {
//         console.error('❌ Supabase connection failed:', error.message)
//       } else {
//         console.log('✅ Supabase connected. Sample row:', data)
//       }
//     }

//     checkConnection()
//   }, [])

//   return (
//     <div className="p-6 text-center">
//       <h1 className="text-xl font-bold">🔧 Debug Page</h1>
//       <p>Check the console to verify Supabase DB connection.</p>
//     </div>
//   )
// }



'use client';
import { useEffect } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase';

export default function DebugPage() {
  useEffect(() => {
    const insertPost = async () => {
      const supabase = createClientSupabaseClient();

      const { data, error } = await supabase.from('posts').insert([
        {
          title: 'Hello from hiii',
          content: 'Inserted via Supabase client!',
          space_id: 'a420a72f-82a6-47fd-a2ee-ea22b6b7d599', // ⚠️ Must match an actual UUID from 'spaces'
          user_id: 'd67aa946-2f9c-4fb6-a60b-52a696ddc21a',   // ⚠️ Must match an actual user
          type: 'text',
        },
      ]);

      if (error) console.error('❌ Insert error:', error.message);
      else console.log('✅ Inserted:', data);
    };

    insertPost();
  }, []);

  return <div>Check console for insert result.</div>;
}
