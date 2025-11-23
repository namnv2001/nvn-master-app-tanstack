const Card: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">{props.children}</div>
  )
}

export default Card
