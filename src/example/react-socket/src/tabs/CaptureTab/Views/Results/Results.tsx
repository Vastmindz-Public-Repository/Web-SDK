import { Button } from '@fluentui/react-northstar'
import { getSchema, Schema } from 'helpers/capture'
import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { get } from 'lodash'
import { RPPGData } from 'helpers/rppg'
import './Results.scss'

export interface ResultData {
  rppgData: RPPGData
  isAllDataCalculated: boolean
}

export const Results = () => {
  const history = useHistory()
  const location = useLocation()

  const [data, setData] = useState<ResultData>()
  const [schema, setSchema] = useState<Schema[]>()

  useEffect(() => {
    const data = location.state as ResultData
    if (!data) {
      history.push('/capture')
      return
    }

    setSchema(getSchema())
    setData(data)
  }, [history, location.state])

  const onBackClickButtonHandler = () => {
    history.push('/capture')
  }

  return (
    <div className="results-container">
      <div className="msg-block">
        <p className="title">Scan complete</p>
        <p className="description">
          We do not claim to diagnose, mitigate, prevent or treat any disease,
          any disorders, symptoms or abnormal physical state.
        </p>
      </div>

      {data && schema && (
        <div className="results">

          {schema.map(item => (
            <div className="item" key={item.key}>
              <div className="title">
                <div className="icon">
                  <img src={require(`assets/images/${item.iconResult}`).default} alt="icon-result" />
                </div>
                <div className="name">
                  {item.name}
                </div>
              </div>

              {get(data.rppgData, item.key, 0) ? (
                <div className="value">
                  {get(data.rppgData, item.key, 0)}
                  <span className="sign">{item.sign}</span>
                </div>
              ) : (
                <div className="no-value">
                  <img src={require('assets/images/note-icon.svg').default} alt="icon-note" />
                </div>
              )}
            </div>
          ))}
          {!data.isAllDataCalculated && (
            <div className="notification">
              <img src={require('assets/images/note-icon.svg').default} alt="icon-note" />
              One or more vitals were unable to be calculated due to bad lighting conditions, please try again later
            </div>
          )}
        </div>
      )}

      <Button primary onClick={onBackClickButtonHandler} content="Take another test" />

    </div>

  )
}
