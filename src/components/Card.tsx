const Card: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-4 cursor-pointer flex flex-col justify-between items-center gap-2 hover:shadow-lg">
      {props.children}
    </div>
  )
}

export default Card
