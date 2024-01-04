import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth'
import React from 'react'

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  
  if(session?.user){
    return (
      <div>
        <h1 className='text-2xl'>Selamat Datang Kembali {session?.user.username}</h1>
      </div>
    )
  }

  return (
    <div>
      <h1 className='text-2xl'>Harap Login Kembali</h1>
    </div>
  )
  
}

export default AdminPage
