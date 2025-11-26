const Card: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <div className="rounded-lg shadow-lg p-4 cursor-pointer flex flex-col justify-between items-center gap-2 hover:shadow-2xl transition-shadow duration-150 border-gray-100">
      {props.children}
    </div>
  )
}

export default Card
