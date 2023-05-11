import Button from "@/components/Button";
import { db } from "@/lib/db";
import React from "react";

export default async function Home() {

  //await db.set('hello', 'hello')

  return (
    <main className='w-full h-screen grid place-content-center'>
      <Button variant='ghost'>Hello</Button>
    </main>
  )
}
