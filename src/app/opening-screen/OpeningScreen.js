import jediLogo from "../jedi.svg";
import MathJediLogo from "../MathJediLogo";
import React from "react";
import Button, {ButtonLink} from "../common/Button";
import {useStudentIsRegistered} from "../App.actions";
import Vertical from "../common/Vertical";

export default function OpeningScreen() {
    const isRegistered = useStudentIsRegistered();
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
                <Button>Start New</Button>
                }
            </div>
        </Vertical>

    </Vertical>
}
