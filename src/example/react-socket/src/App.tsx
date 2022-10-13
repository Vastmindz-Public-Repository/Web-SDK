// https://fluentsite.z22.web.core.windows.net/quick-start
import { Loader } from '@fluentui/react-northstar'
import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import { useTeamsFx } from '@microsoft/teamsfx-react'
import { TeamsFxContext } from './Context'
import { TeamsTheme } from '@fluentui/react-teams/lib/cjs/themes'
import { Provider } from '@fluentui/react-teams'
import {
  Capture,
  NotSupported,
  BadConditions,
  Results,
} from 'tabs/CaptureTab/Views'
import './App.scss'

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const { loading, theme, themeString, teamsfx } = useTeamsFx()
  return (
    <TeamsFxContext.Provider value={{theme, themeString, teamsfx}}>
      <Provider themeName={TeamsTheme.Dark} lang="en-US">
        <BrowserRouter>
          <Route exact path="/">
            <Redirect to="/capture" />
          </Route>
          {loading ? (
            <Loader style={{ margin: 100 }} />
          ) : (
            <>
              <Route path="/capture" render={({ match: { url } }) => (
                <>
                  <Route exact path={`${url}/`} component={Capture} />
                  <Route exact path={`${url}/not-supported`} component={NotSupported} />
                  <Route exact path={`${url}/bad-conditions`} component={BadConditions} />
                  <Route exact path={`${url}/results`} component={Results} />
                </>
              )} />
            </>
          )}
        </BrowserRouter>
      </Provider>
    </TeamsFxContext.Provider>
  )
}
