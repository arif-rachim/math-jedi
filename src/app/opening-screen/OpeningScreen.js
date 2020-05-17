import jediLogo from "../jedi.svg";
import MathJediLogo from "../MathJediLogo";
import React, {useCallback} from "react";
import Button, {ButtonLink} from "../common/Button";
import {useCurrentActiveSession, useStartNewSession, useStudentIsRegistered} from "../App.actions";
import Vertical from "../common/Vertical";

export default function OpeningScreen() {
    const isRegistered = useStudentIsRegistered();
    const startNewSession = useStartNewSession();
    const currentActiveSession = useCurrentActiveSession();

    const handleClick = useCallback(() => {
        if(currentActiveSession !== null){
            // eslint-disable-next-line no-restricted-globals
            if(confirm('This will delete current active session and start a new one ')){
                startNewSession();
            }
        }else{
            startNewSession();
        }
    },[currentActiveSession, startNewSession]);

    return <Vertical horizontalAlign={'center'} verticalAlign={'center'} heightFull>
        <Vertical horizontalAlign={'center'} gap={10}>
            <img src={jediLogo} alt="" width={200} height={200}/>
            <MathJediLogo/>
            <div style={{fontSize: 25, marginTop: 0}}>May the force be with you</div>
            <div style={{display: 'flex'}}>
                {!isRegistered &&
                <ButtonLink to={`/register`}>Register</ButtonLink>
                }
                {isRegistered &&
                <ButtonLink to={`/register`}>Settings</ButtonLink>
                }
                {isRegistered &&
                <Button onClick={handleClick}>New</Button>
                }
                {currentActiveSession !== null &&
                <Button onClick={handleClick}>Continue</Button>
                }
            </div>
        </Vertical>

    </Vertical>
}
