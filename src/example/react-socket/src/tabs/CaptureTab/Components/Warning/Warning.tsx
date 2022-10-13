import './Warning.scss'

type Props = {
  size: string
}

export const Warning: React.FC<Props> = ({
  children,
  size,
}) => {
  return (
    <div className={`warning-container ${size}`}>
      <img
        className="warning-image"
        src={require('assets/images/warning.svg').default}
        alt="Warning"
      />
      <p className="warning-message">
        {children}
      </p>
    </div>
  )
}
