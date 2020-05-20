import jediLogo from "../jedi.svg";
import MathJediLogo from "../MathJediLogo";
import React, {useCallback} from "react";
import Button, {ButtonLink} from "../common/Button";
import {useCurrentActiveSession, useLastSessionId, useStartNewSession, useStudentIsRegistered} from "../App.actions";
import Vertical from "../common/Vertical";
import {useHistory} from "react-router-dom";

export default function OpeningScreen() {
    const isRegistered = useStudentIsRegistered();
    const startNewSession = useStartNewSession();
    const currentActiveSession = useCurrentActiveSession();
    const lastSessionId = useLastSessionId();
    const history = useHistory();
    const handleClick = useCallback(() => {
        if (currentActiveSession !== null) {
            // eslint-disable-next-line no-restricted-globals
            if (confirm('This will delete current active session and start a new one ')) {
                startNewSession();
            }
        } else {
            startNewSession();
        }
    }, [currentActiveSession, startNewSession]);
    const activeSessionId = currentActiveSession?.id;
    const handleContinue = useCallback(() => {
        history.push(`/session/${activeSessionId}`);
    }, [activeSessionId, history]);

    return <Vertical horizontalAlign={'center'} verticalAlign={'center'} heightFull>
        <Vertical horizontalAlign={'center'} gap={10}>
            <img src={jediLogo} alt="" width={200} height={200}/>
            <MathJediLogo/>
            <div style={{fontSize: 25, marginTop: 0}}>May the force be with you</div>

            <Vertical>
                {!isRegistered &&
                <ButtonLink to={`/register`}>Register</ButtonLink>
                }
                {isRegistered &&
                <ButtonLink to={`/register`}>Settings</ButtonLink>
                }
                {currentActiveSession !== null &&
                <Button onClick={handleContinue}>Continue</Button>
                }
                {lastSessionId !== null &&
                <Button onClick={() => history.push(`/session/${lastSessionId}`)}>Last Score</Button>
                }
                {isRegistered &&
                <Button onClick={handleClick}>New</Button>
                }
            </Vertical>
        </Vertical>

    </Vertical>
}
