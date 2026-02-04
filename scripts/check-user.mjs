import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjfcmmzjlguiititkmyh.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZmNtbXpqbGd1aWl0aXRrbXloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc5OTczNSwiZXhwIjoyMDc3Mzc1NzM1fQ.euZnn-7AVUMwuVX1ayA9Vpl1sYfkrKbuh4NZIrgRmwg'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

const targetEmail = 'demo@smarterbot.cl'
const targetPassword = 'Demo2026@'

async function checkAndCreateUser() {
    console.log(`\n🔍 Verificando si existe el usuario: ${targetEmail}\n`)

    // Listar usuarios para buscar el email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
        console.error('❌ Error al listar usuarios:', listError.message)
        return
    }

    const existingUser = users.find(user => user.email === targetEmail)

    if (existingUser) {
        console.log('✅ El usuario ya existe:')
        console.log(`   • ID: ${existingUser.id}`)
        console.log(`   • Email: ${existingUser.email}`)
        console.log(`   • Email confirmado: ${existingUser.email_confirmed_at ? 'Sí' : 'No'}`)
        console.log(`   • Creado: ${existingUser.created_at}`)
        console.log(`   • Último login: ${existingUser.last_sign_in_at || 'Nunca'}`)

        // Actualizar contraseña del usuario existente
        console.log(`\n📝 Actualizando contraseña para el usuario existente...`)
        const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: targetPassword, email_confirm: true }
        )

        if (updateError) {
            console.error('❌ Error al actualizar usuario:', updateError.message)
        } else {
            console.log('✅ Contraseña actualizada correctamente')
        }

    } else {
        console.log('⚠️ El usuario no existe. Creando...')

        // Crear el usuario con el admin API
        const { data, error } = await supabase.auth.admin.createUser({
            email: targetEmail,
            password: targetPassword,
            email_confirm: true // Confirmar el email automáticamente
        })

        if (error) {
            console.error('❌ Error al crear usuario:', error.message)
            return
        }

        console.log('✅ Usuario creado exitosamente:')
        console.log(`   • ID: ${data.user.id}`)
        console.log(`   • Email: ${data.user.email}`)
        console.log(`   • Email confirmado: ${data.user.email_confirmed_at ? 'Sí' : 'No'}`)
    }

    console.log('\n📋 Resumen de credenciales:')
    console.log(`   • Email: ${targetEmail}`)
    console.log(`   • Contraseña: ${targetPassword}`)
    console.log('\n')
}

checkAndCreateUser()
