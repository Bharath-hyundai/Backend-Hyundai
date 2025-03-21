import { getLeads } from '@/actions/leads'
import React from 'react'

const Test = async() => {
  const data = await getLeads()
  console.log(data)
  return (
    <div>Test</div>
  )
}

export default Test