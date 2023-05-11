import { FC } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface loadingProps {
  
}

const loading: FC<loadingProps> = ({}) => {
  return <div className='w-full flex flex-col gap-5'>
    <Skeleton className='mg-b' height={60} width={500}></Skeleton>
    <Skeleton  height={20} width={150}></Skeleton>
    <Skeleton  height={50} width={400}></Skeleton>
  </div>
}

export default loading