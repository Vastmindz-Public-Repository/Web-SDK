import React from 'react'
import { getSchema } from 'helpers/capture'
import { RPPGData } from 'helpers/rppg'
import { get } from 'lodash'
import './Info.scss'

type Props = {
 rppgData: RPPGData
}

export const Info: React.FC<Props> = ({rppgData}) => {
  const schema = getSchema()

  return (
    <div className="info-container">
      <div className="info">
        <div className="data">
          {schema?.map(item => (
            <div
              className="item"
              key={item.key}
            >
              <div className="value">
                {get(rppgData, item.key, 0) ? (
                  <div className="ring-calculated">
                    <img
                      className="item-img"
                      src={require('assets/images/result-mark.svg').default}
                      alt="calculated"
                    />
                  </div>
                ) : (
                  <div className="ring-calculating">
                    <img
                      className="item-img"
                      src={require(`assets/images/${item.icon}`).default}
                      alt="calculating"/>
                    <span></span>
                  </div>
                )}
              </div>
              <div className="name">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
