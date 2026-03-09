import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedAdmin() {
  const email = 'Ian.nunez206@gmail.com'
  const password = 'Jafetvx7_'

  console.log('Creating admin user...')

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      is_admin: true
    }
  })

  if (error) {
    if (error.message.includes('already been registered')) {
      console.log('User already exists! You can log in with your credentials.')
      return
    }
    console.error('Error creating user:', error.message)
    return
  }

  console.log('Admin user created successfully!')
  console.log('Email:', email)
  console.log('You can now log in at /admin/login')
}

seedAdmin()
