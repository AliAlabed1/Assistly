import React, { use } from 'react'

const page = ({params}:{params:Promise<{ id: string }>}) => {
  const { id } = use(params);
    return (
    <div>
      review session {id}
    </div>
  )
}

export default page
